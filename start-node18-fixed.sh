#!/bin/bash

echo "Starting Next.js with Node.js 18..."

# Node.js 18をダウンロード（既にない場合）
if [ ! -d "/tmp/node-v18.20.0-linux-x64" ]; then
    echo "Downloading Node.js 18.20.0..."
    wget -qO- https://nodejs.org/dist/v18.20.0/node-v18.20.0-linux-x64.tar.xz | tar xJ -C /tmp/
fi

# Node.js 18のパスを設定
export PATH=/tmp/node-v18.20.0-linux-x64/bin:$PATH

echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# npxコマンドを直接使用
echo "Starting server..."
cd /mnt/c/Users/saway/Desktop/AI開発/Zeami-1/projects/sapunoa
npx next dev -p 3007 -H 0.0.0.0