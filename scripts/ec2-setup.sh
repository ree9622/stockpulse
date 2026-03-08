#!/bin/bash
# StockPulse EC2 Setup Script
# Amazon Linux 2023 (x86_64, t3.micro)
# Run as ec2-user or via user-data

set -euo pipefail

echo "========================================="
echo "  StockPulse EC2 Setup"
echo "========================================="

# System update
sudo dnf update -y

# Install Node.js 22
echo "[1/7] Installing Node.js 22..."
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo dnf install -y nodejs

# Install pnpm
echo "[2/7] Installing pnpm..."
sudo npm install -g pnpm

# Install pm2
echo "[3/7] Installing pm2..."
sudo npm install -g pm2

# Install nginx
echo "[4/7] Installing nginx..."
sudo dnf install -y nginx

# Install git (usually pre-installed)
sudo dnf install -y git

# Clone repository
echo "[5/7] Cloning StockPulse..."
cd /home/ec2-user
if [ -d "stockpulse" ]; then
  cd stockpulse && git pull
else
  git clone https://github.com/ree9622/stockpulse.git
  cd stockpulse
fi

# Install dependencies
echo "[6/7] Installing dependencies..."
pnpm install

# Load secrets from AWS Secrets Manager → .env.local
echo "[7/7] Loading secrets from AWS Secrets Manager..."
SECRET_JSON=$(aws secretsmanager get-secret-value \
  --secret-id stockpulse/config \
  --region ap-northeast-2 \
  --query SecretString \
  --output text)

# Parse JSON and write .env.local
cat > .env.local << 'ENVEOF'
# Auto-generated from AWS Secrets Manager (stockpulse/config)
ENVEOF

echo "$SECRET_JSON" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for k, v in data.items():
    print(f'{k}={v}')
" >> .env.local

# Add server-specific env vars
cat >> .env.local << ENVEOF
NEXTAUTH_URL=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000/stockpulse
NODE_ENV=production
ENVEOF

echo "Generated .env.local"

# Build the project
pnpm build

# Setup pm2
pm2 start "pnpm start" --name stockpulse
pm2 save
pm2 startup systemd -u ec2-user --hp /home/ec2-user | tail -1 | sudo bash

# Configure nginx reverse proxy
echo "Configuring nginx..."
sudo tee /etc/nginx/conf.d/stockpulse.conf > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}
NGINX

# Remove default nginx config if it conflicts
sudo rm -f /etc/nginx/conf.d/default.conf 2>/dev/null || true

# Start nginx
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "========================================="
echo "  StockPulse Setup Complete!"
echo "  App: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "  PM2: pm2 status"
echo "========================================="
