#!/bin/bash
# StockPulse EC2 Deployment Script
# Usage: ./scripts/deploy-ec2.sh

set -euo pipefail

# ─── Configuration ───
EC2_IP="3.38.241.182"
EC2_USER="ec2-user"
KEY_PATH="$HOME/.ssh/stockpulse-key.pem"
APP_DIR="/home/ec2-user/stockpulse"
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=10"

echo "🚀 Deploying StockPulse to EC2..."
echo "   Host: $EC2_USER@$EC2_IP"
echo ""

# Check SSH key
if [ ! -f "$KEY_PATH" ]; then
  echo "❌ SSH key not found: $KEY_PATH"
  exit 1
fi

# Deploy via SSH
ssh $SSH_OPTS -i "$KEY_PATH" "$EC2_USER@$EC2_IP" << 'DEPLOY'
set -euo pipefail
cd /home/ec2-user/stockpulse

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
pnpm install

echo "🔄 Refreshing secrets..."
SECRET_JSON=$(aws secretsmanager get-secret-value \
  --secret-id stockpulse/config \
  --region ap-northeast-2 \
  --query SecretString \
  --output text)

# Regenerate .env.local
cat > .env.local << 'ENVEOF'
# Auto-generated from AWS Secrets Manager (stockpulse/config)
ENVEOF

echo "$SECRET_JSON" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for k, v in data.items():
    print(f'{k}={v}')
" >> .env.local

cat >> .env.local << ENVEOF
NODE_ENV=production
ENVEOF

# NEXTAUTH_URL이 Secrets Manager에 없으면 폴백 추가
if ! grep -q "^NEXTAUTH_URL=" .env.local; then
  echo "NEXTAUTH_URL=https://stockgall.click/stockpulse" >> .env.local
fi

echo "🔨 Building..."
pnpm build

echo "♻️  Restarting pm2..."
pm2 restart stockpulse || pm2 start "pnpm start" --name stockpulse

echo "✅ Deploy complete!"
DEPLOY

echo ""
echo "✅ Deployment finished!"
echo "   🌐 http://$EC2_IP"
