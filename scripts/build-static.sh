#!/bin/bash
# GitHub Pages용 정적 빌드 (API routes 임시 제외)
set -e
cd "$(dirname "$0")/.."

# API routes 임시 이동
mv src/app/api src/app/_api_disabled 2>/dev/null || true

# Static export 활성화
sed -i.bak 's|// output: "export"|output: "export"|' next.config.ts 2>/dev/null || true

# 빌드
pnpm build

# 복원
mv src/app/_api_disabled src/app/api 2>/dev/null || true
mv next.config.ts.bak next.config.ts 2>/dev/null || true

echo "✅ Static build complete → out/"
