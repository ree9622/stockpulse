#!/usr/bin/env bash
set -euo pipefail

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# StockPulse Deploy Script
# S3: 정적 에셋 호스팅 (CSS, JS, images)
# CloudFront: CDN 배포
# API Routes + SSR: 별도 Node.js 서버 필요
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BUCKET_NAME="stockpulse-web"
REGION="ap-northeast-2"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "━━━ StockPulse Deploy ━━━"
echo "Project: $PROJECT_DIR"
echo "Bucket:  $BUCKET_NAME"
echo "Region:  $REGION"
echo ""

# ━━━ 1. 빌드 ━━━
echo "▶ Building..."
cd "$PROJECT_DIR"
pnpm build

# ━━━ 2. S3 버킷 생성 (이미 존재하면 skip) ━━━
echo "▶ Ensuring S3 bucket exists..."
if ! aws s3api head-bucket --bucket "$BUCKET_NAME" --region "$REGION" 2>/dev/null; then
  aws s3api create-bucket \
    --bucket "$BUCKET_NAME" \
    --region "$REGION" \
    --create-bucket-configuration LocationConstraint="$REGION"
  echo "  ✓ Bucket created"
else
  echo "  ✓ Bucket already exists"
fi

# 정적 웹사이트 호스팅 비활성 (CloudFront OAC 사용)
# 퍼블릭 액세스 차단
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
  2>/dev/null || true

# ━━━ 3. 정적 에셋 업로드 ━━━
echo "▶ Uploading static assets to S3..."
# Next.js 빌드 결과에서 정적 에셋만 업로드
if [ -d ".next/static" ]; then
  aws s3 sync .next/static "s3://$BUCKET_NAME/stockpulse/_next/static" \
    --region "$REGION" \
    --cache-control "public, max-age=31536000, immutable" \
    --delete
  echo "  ✓ .next/static uploaded"
fi

if [ -d "public" ]; then
  aws s3 sync public "s3://$BUCKET_NAME/stockpulse/" \
    --region "$REGION" \
    --cache-control "public, max-age=3600" \
    --delete \
    --exclude "*.ts" --exclude "*.tsx"
  echo "  ✓ public/ uploaded"
fi

# ━━━ 4. CloudFront 디스트리뷰션 ━━━
echo "▶ Checking CloudFront distribution..."
DIST_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Origins.Items[0].DomainName=='${BUCKET_NAME}.s3.${REGION}.amazonaws.com'].Id" \
  --output text 2>/dev/null || echo "")

if [ -z "$DIST_ID" ] || [ "$DIST_ID" = "None" ]; then
  echo "  Creating CloudFront distribution..."

  # OAC 생성
  OAC_ID=$(aws cloudfront create-origin-access-control \
    --origin-access-control-config \
    "Name=stockpulse-oac,Description=StockPulse OAC,SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3" \
    --query "OriginAccessControl.Id" --output text 2>/dev/null || echo "")

  DIST_CONFIG=$(cat <<EOF
{
  "CallerReference": "stockpulse-$(date +%s)",
  "Comment": "StockPulse Static Assets",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-stockpulse",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": { "Forward": "none" }
    },
    "MinTTL": 0
  },
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-stockpulse",
        "DomainName": "${BUCKET_NAME}.s3.${REGION}.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "PriceClass": "PriceClass_200"
}
EOF
)

  DIST_ID=$(aws cloudfront create-distribution \
    --distribution-config "$DIST_CONFIG" \
    --query "Distribution.Id" --output text 2>/dev/null || echo "FAILED")

  if [ "$DIST_ID" != "FAILED" ]; then
    echo "  ✓ CloudFront distribution created: $DIST_ID"

    # S3 버킷 정책 추가 (CloudFront 접근 허용)
    BUCKET_POLICY=$(cat <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::*:distribution/${DIST_ID}"
        }
      }
    }
  ]
}
POLICY
)
    aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy "$BUCKET_POLICY" 2>/dev/null || true
  else
    echo "  ⚠ CloudFront creation failed (may need manual setup)"
  fi
else
  echo "  ✓ CloudFront distribution exists: $DIST_ID"

  # 캐시 무효화
  echo "  Invalidating cache..."
  aws cloudfront create-invalidation \
    --distribution-id "$DIST_ID" \
    --paths "/stockpulse/*" \
    --query "Invalidation.Id" --output text 2>/dev/null || echo "  ⚠ Invalidation failed"
fi

# ━━━ 5. 결과 출력 ━━━
echo ""
echo "━━━ Deploy Complete ━━━"
echo "S3 Bucket: s3://$BUCKET_NAME"
if [ -n "$DIST_ID" ] && [ "$DIST_ID" != "None" ] && [ "$DIST_ID" != "FAILED" ]; then
  CF_DOMAIN=$(aws cloudfront get-distribution \
    --id "$DIST_ID" \
    --query "Distribution.DomainName" --output text 2>/dev/null || echo "unknown")
  echo "CloudFront: https://$CF_DOMAIN"
  echo "Distribution ID: $DIST_ID"
fi
echo ""
echo "⚠ Note: API routes & SSR require a Node.js server."
echo "  Run: node --import tsx src/server.ts"
echo ""
