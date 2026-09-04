#!/bin/bash
# deploy.sh —— 快速部署用
# commit message 自動用時間戳記，推到 main 分支。
# GitHub 這邊 push 到 main 後，Cloudflare Pages 會自動抓這個 repo 建置＋部署
# （Build command: npm run build，Build output directory: dist，已在 Cloudflare 那邊設定好）。
#
# 這個專案只有 main 一個分支在部署，沒有 dev 預覽環境。
#
# 用法：
#   ./deploy.sh                跑測試 → build 檢查 → commit + push
#   ./deploy.sh --skip-checks  跳過推送前的測試與 build 檢查，直接 commit + push

set -e

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SKIP_CHECKS=0

while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help)      sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    --skip-checks)  SKIP_CHECKS=1 ;;
    *) echo "不認得的參數：$1（用 ./deploy.sh --help 看用法）"; exit 1 ;;
  esac
  shift
done

CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "目前在「$CURRENT_BRANCH」分支，這個專案只部署 main。請先切回 main：git checkout main"
  exit 1
fi

# ---------- 推送前檢查 ----------
# push 到 main 會直接觸發 Cloudflare Pages 自動建置＋部署，壞掉的東西推上去就是線上壞掉。
# 這裡先在本機跑一次跟 Cloudflare 那邊一樣的流程（測試 + build），提早抓到問題，
# 而不是等 Cloudflare 建置失敗才發現。
if [ "$SKIP_CHECKS" = "0" ]; then
  echo "跑測試…"
  npm test
  echo "跑 build 檢查…"
  npm run build
  echo "檢查通過。"
  echo ""
fi

# ---------- commit、push ----------
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

read -p "⚠️  即將推送到 main（會觸發 Cloudflare Pages 正式環境部署），確定嗎？(y/N) " CONFIRM
case "$CONFIRM" in
  y|Y) ;;
  *) echo "已取消。"; exit 0 ;;
esac

git add -A

if git diff --cached --quiet; then
  echo "沒有變更可以 commit，直接嘗試推送現有的 commit…"
else
  git commit -m "Update: $TIMESTAMP"
fi

git push origin main

echo ""
echo "已推送到 main"
echo "→ Cloudflare Pages 會自動建置並部署到正式環境"
