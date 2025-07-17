#!/bin/bash
# WSL2環境でNext.jsを起動し、ブラウザで開くためのスクリプト

# 色付き出力のための定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# WSLのIPアドレスを取得
WSL_IP=$(hostname -I | awk '{print $1}')

echo -e "${GREEN}🚀 WSL2環境でNext.js開発サーバーを起動します${NC}"
echo -e "${YELLOW}📍 WSL IPアドレス: $WSL_IP${NC}"
echo -e "${YELLOW}🌐 アクセスURL: http://$WSL_IP:3000${NC}"
echo ""

# Windowsのブラウザで自動的に開く
echo -e "${GREEN}🌐 ブラウザを開いています...${NC}"
cmd.exe /c start http://$WSL_IP:3000 2>/dev/null &

echo ""
echo -e "${GREEN}📝 開発サーバーを起動中...${NC}"
echo "終了するには Ctrl+C を押してください"
echo ""

# 開発サーバーを起動
npm run dev:wsl