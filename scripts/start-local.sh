#!/bin/bash

# サプノア ローカル開発環境起動スクリプト

echo "🚀 サプノア開発環境を起動します..."

# 環境変数チェック
if [ ! -f .env ]; then
    echo "❌ .envファイルが見つかりません"
    echo "📝 .env.exampleから.envを作成してください"
    exit 1
fi

# PostgreSQLの起動確認
echo "🔍 PostgreSQLの状態を確認中..."
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ PostgreSQLが起動していません"
    echo "💡 PostgreSQLを起動してください"
    exit 1
fi

# Redisの起動確認
echo "🔍 Redisの状態を確認中..."
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redisが起動していません"
    echo "💡 Redisを起動してください"
    exit 1
fi

# 依存関係のインストール
echo "📦 依存関係をインストール中..."
npm install

# Prismaのセットアップ
echo "🗄️ データベースをセットアップ中..."
npm run prisma:generate
npm run prisma:migrate

# シードデータの投入
echo "🌱 シードデータを投入中..."
npm run prisma:seed

# 開発サーバーの起動
echo "✅ セットアップ完了！"
echo "🌐 開発サーバーを起動します..."
echo ""
echo "📍 アクセスURL: http://localhost:3007"
echo ""
echo "🔑 テストアカウント:"
echo "   医師: doctor@supnoa.com / doctor123"
echo "   患者: patient1@example.com / patient123"
echo ""

npm run dev