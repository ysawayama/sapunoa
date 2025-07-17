# SAPUNOAデプロイメントガイド

## 推奨デプロイ構成: Vercel + Supabase

### 前提条件
- GitHubアカウント
- Vercelアカウント（無料）
- Supabaseアカウント（無料）

## デプロイ手順

### 1. GitHub リポジトリの準備

```bash
# プロジェクトルートで実行
git init
git add .
git commit -m "Initial commit"

# GitHubで新しいリポジトリを作成後
git remote add origin https://github.com/your-username/sapunoa.git
git push -u origin main
```

### 2. Supabase プロジェクトのセットアップ

1. [Supabase](https://supabase.com)にサインアップ
2. 新しいプロジェクトを作成
3. プロジェクトの設定から以下の情報を取得：
   - Database URL
   - Direct URL
   - Anon Key
   - Service Role Key

4. Supabase SQLエディタでPrismaスキーマを実行：
```bash
# ローカルでスキーマをエクスポート
npx prisma migrate dev --create-only
# 生成されたSQLファイルをSupabaseのSQLエディタで実行
```

### 3. Vercel デプロイ

1. [Vercel](https://vercel.com)にサインアップ
2. "Import Git Repository"をクリック
3. GitHubリポジトリを選択
4. 環境変数を設定：

```
DATABASE_URL=[Supabase接続文字列（pgbouncer=true付き）]
DIRECT_URL=[Supabase直接接続文字列]
NEXTAUTH_URL=https://[your-project].vercel.app
NEXTAUTH_SECRET=[openssl rand -base64 32で生成]
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Supabase Anon Key]
SUPABASE_SERVICE_ROLE_KEY=[Supabase Service Role Key]
```

5. "Deploy"をクリック

### 4. デプロイ後の設定

1. **カスタムドメイン設定**（オプション）
   - Vercelダッシュボードの"Settings" > "Domains"
   - カスタムドメインを追加

2. **本番データベースの初期化**
```bash
# Vercel CLIを使用
vercel env pull .env.production
npx prisma migrate deploy
npx prisma db seed
```

## 代替デプロイオプション: Railway

Railwayを使用する場合は、PostgreSQL、Redis、Next.jsアプリを1つのプラットフォームで管理できます。

### Railway デプロイ手順

1. [Railway](https://railway.app)にサインアップ
2. "New Project"をクリック
3. "Deploy from GitHub repo"を選択
4. 以下のサービスを追加：
   - PostgreSQL
   - Redis
   - Next.js App

5. 環境変数を設定（自動的に接続情報が設定される）

## トラブルシューティング

### ビルドエラーが発生した場合

1. **型エラー**
```bash
npm run type-check
```

2. **Prismaエラー**
```bash
npx prisma generate
```

3. **依存関係エラー**
```bash
rm -rf node_modules package-lock.json
npm install
```

### よくある問題

- **CORS エラー**: NEXTAUTH_URLが正しく設定されているか確認
- **データベース接続エラー**: DATABASE_URLにpgbouncer=trueが含まれているか確認
- **画像が表示されない**: next.config.jsのimages.domainsを更新

## パフォーマンス最適化

1. **画像最適化**
   - Next.js Imageコンポーネントを使用
   - 画像をWebP形式に変換

2. **キャッシュ設定**
   - Vercelのキャッシュヘッダーを適切に設定

3. **データベース最適化**
   - Prismaのconnection poolingを設定
   - インデックスを適切に設定

## セキュリティチェックリスト

- [ ] 環境変数が本番用に設定されている
- [ ] NEXTAUTH_SECRETが強力なランダム文字列
- [ ] HTTPSが有効化されている
- [ ] CSRFトークンが実装されている
- [ ] SQLインジェクション対策（Prisma使用）
- [ ] XSS対策（React/Next.jsデフォルト）

## モニタリング

1. **Vercel Analytics**（自動）
2. **Supabase Dashboard**でデータベース監視
3. **エラー追跡**: Sentryの導入を検討

## 継続的デプロイ

GitHubのmainブランチにプッシュすると自動的にデプロイされます。

```bash
git add .
git commit -m "Update features"
git push origin main
```

## サポート

問題が発生した場合は、以下を確認：
1. Vercelのビルドログ
2. ブラウザの開発者ツール
3. Supabaseのログ