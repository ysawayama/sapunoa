# Windows環境でのサプノア起動手順

## 前提条件
- Node.js 18以上がインストールされていること
- PostgreSQLがインストールされていること（またはDockerを使用）
- Git Bashまたはコマンドプロンプトが使用可能なこと

## 起動手順

### 1. プロジェクトディレクトリに移動
```bash
cd /mnt/c/Users/saway/Desktop/AI開発/Zeami-1/projects/sapunoa
```

### 2. 依存関係のインストール（初回のみ）
```bash
npm install
```

### 3. 環境変数の確認
`.env`ファイルが存在することを確認してください。存在しない場合：
```bash
cp .env.example .env
```

### 4. データベースの準備

#### オプション1: Dockerを使用（推奨）
```bash
# PostgreSQLとRedisをDockerで起動
docker-compose up -d postgres redis
```

#### オプション2: ローカルのPostgreSQLを使用
PostgreSQLが起動していることを確認し、データベースを作成：
```sql
CREATE DATABASE sapunoa;
```

### 5. データベースのマイグレーション
```bash
# Prismaクライアントの生成
npm run prisma:generate

# マイグレーション実行
npm run prisma:migrate

# シードデータ投入
npm run prisma:seed
```

### 6. 開発サーバーの起動
```bash
npm run dev
```

### 7. ブラウザでアクセス
http://localhost:3007

## トラブルシューティング

### "next: not found"エラーが出る場合
```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm install
```

### ポート3007が使用中の場合
```bash
# 別のポートで起動
PORT=3008 npm run dev
```

### PostgreSQL接続エラーの場合
1. PostgreSQLサービスが起動しているか確認
2. `.env`の`DATABASE_URL`が正しいか確認
3. ユーザー名とパスワードが正しいか確認

### Windows特有の問題

#### WSL2を使用している場合
```bash
# WSL2内でPostgreSQLを起動
sudo service postgresql start
sudo service redis-server start
```

#### PowerShellでスクリプトが実行できない場合
```powershell
# 実行ポリシーを変更
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## テストアカウント
- 医師: doctor@supnoa.com / doctor123
- 患者: patient1@example.com / patient123