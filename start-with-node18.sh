#!/bin/bash

echo "Starting Next.js with Node.js 18..."

# Node.js 18をダウンロード（既にない場合）
if [ ! -d "/tmp/node-v18.20.0-linux-x64" ]; then
    echo "Downloading Node.js 18.20.0..."
    wget -qO- https://nodejs.org/dist/v18.20.0/node-v18.20.0-linux-x64.tar.xz | tar xJ -C /tmp/
fi

# Node.js 18を使用してNext.jsを起動
echo "Starting server..."
PATH=/tmp/node-v18.20.0-linux-x64/bin:$PATH npm run dev