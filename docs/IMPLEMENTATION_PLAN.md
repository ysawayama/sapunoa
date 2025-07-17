# サプノア（SUPNOA）実装計画書

## プロジェクトロードマップ

### フェーズ2開発スケジュール（6週間）

```
Week 1-2: 基盤構築とセットアップ
Week 3-4: コア機能実装（患者向け）
Week 5: 医師向け機能と解析エンジン
Week 6: テスト・最適化・デプロイ
```

## 週次詳細計画

### 第1週：プロジェクト基盤構築

#### Day 1-2: 環境セットアップ
- [ ] Next.js 14プロジェクト初期化
- [ ] TypeScript設定
- [ ] ESLint/Prettier設定
- [ ] Tailwind CSS設定
- [ ] 基本的なプロジェクト構造作成

```bash
# 実行コマンド
npx create-next-app@latest sapunoa --typescript --tailwind --app
cd sapunoa
npm install -D @types/node @types/react @types/react-dom
npm install -D eslint-config-prettier prettier
npm install -D @tailwindcss/forms @tailwindcss/typography
```

#### Day 3-4: データベース設計
- [ ] PostgreSQLセットアップ
- [ ] Prismaスキーマ作成
- [ ] マイグレーション実行
- [ ] シードデータ作成

```bash
npm install prisma @prisma/client
npm install -D @types/bcryptjs
npx prisma init
# schema.prismaを編集後
npx prisma migrate dev --name init
```

#### Day 5: 認証システム基盤
- [ ] NextAuth.js設定
- [ ] 認証ミドルウェア作成
- [ ] ログインページUI作成
- [ ] セッション管理設定

```bash
npm install next-auth @next-auth/prisma-adapter
npm install bcryptjs jsonwebtoken
npm install ioredis @types/ioredis
```

### 第2週：共通コンポーネントとレイアウト

#### Day 6-7: UIコンポーネントライブラリ
- [ ] 共通UIコンポーネント作成
  - Button, Card, Modal
  - Form要素（Input, Select, Textarea）
  - Alert, Badge, Spinner
- [ ] レスポンシブナビゲーション
- [ ] レイアウトコンポーネント

#### Day 8-9: グラフ・チャートコンポーネント
- [ ] Rechartsセットアップ
- [ ] レーダーチャート実装
- [ ] ヒートマップ実装
- [ ] 人体図SVGコンポーネント

```bash
npm install recharts react-hook-form
npm install lucide-react
npm install @tanstack/react-query
```

#### Day 10: API基盤とユーティリティ
- [ ] APIルート構造設計
- [ ] エラーハンドリング
- [ ] バリデーション設定
- [ ] ユーティリティ関数作成

### 第3週：患者向け機能実装（メイン）

#### Day 11-12: 患者ダッシュボード
- [ ] ダッシュボードレイアウト
- [ ] 健康スコアカード
- [ ] 最新検査結果サマリー
- [ ] 推奨サプリメント一覧

#### Day 13-14: 検査結果詳細画面
- [ ] 検査結果一覧ページ
- [ ] 検査結果詳細ビュー
- [ ] 栄養素ステータス表示
- [ ] グラフィカルな可視化実装

#### Day 15: サプリメント推奨機能
- [ ] サプリメント詳細ページ
- [ ] 推奨理由の表示
- [ ] 医師コメントセクション
- [ ] エビデンスリンク表示

### 第4週：患者向け機能完成とAPI

#### Day 16-17: API実装（患者向け）
- [ ] 認証API
- [ ] 検査結果取得API
- [ ] サプリメント情報API
- [ ] 推奨情報取得API

#### Day 18-19: データ可視化の高度化
- [ ] インタラクティブチャート
- [ ] アニメーション追加
- [ ] ツールチップ実装
- [ ] データエクスポート機能

#### Day 20: パフォーマンス最適化
- [ ] 画像最適化
- [ ] コード分割
- [ ] キャッシュ戦略実装
- [ ] ローディング状態の改善

### 第5週：医師向け機能と解析エンジン

#### Day 21-22: 医師向け管理画面
- [ ] 医師ダッシュボード
- [ ] 患者一覧・検索機能
- [ ] 患者詳細ビュー
- [ ] 検査結果レビュー画面

#### Day 23-24: 推奨設定機能
- [ ] サプリメント推奨エディター
- [ ] 医師コメント入力機能
- [ ] 推奨優先度設定
- [ ] 一括編集機能

#### Day 25: 解析エンジン実装
- [ ] 栄養素判定アルゴリズム
- [ ] サプリメントマッピング
- [ ] 自動推奨生成
- [ ] スコアリング機能

### 第6週：テスト・最適化・デプロイ

#### Day 26-27: テスト実装
- [ ] ユニットテスト作成
- [ ] 統合テスト作成
- [ ] E2Eテスト設定
- [ ] テストカバレッジ確認

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
npm install -D cypress
```

#### Day 28-29: セキュリティとパフォーマンス
- [ ] セキュリティ監査
- [ ] パフォーマンステスト
- [ ] アクセシビリティチェック
- [ ] ブラウザ互換性テスト

#### Day 30: デプロイメント
- [ ] 環境変数設定
- [ ] ビルド最適化
- [ ] Vercelデプロイ設定
- [ ] モニタリング設定

## 実装優先順位

### 必須機能（MVP）
1. ✅ 患者ログイン・認証
2. ✅ 検査結果表示（基本）
3. ✅ サプリメント推奨表示
4. ✅ 医師コメント表示
5. ✅ レスポンシブデザイン

### 高優先度機能
1. 📊 高度なデータ可視化
2. 👨‍⚕️ 医師向け推奨編集
3. 🔍 検索・フィルター機能
4. 📱 モバイル最適化

### 中優先度機能
1. 📧 通知システム
2. 📄 PDFエクスポート
3. 🌐 多言語対応
4. 📈 トレンド分析

## 開発環境構築手順

### 1. リポジトリクローンと初期設定
```bash
git clone [repository-url]
cd sapunoa
npm install
```

### 2. 環境変数設定
```env
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/sapunoa"
NEXTAUTH_URL="http://localhost:3007"
NEXTAUTH_SECRET="your-secret-key"
REDIS_URL="redis://localhost:6379"
```

### 3. データベースセットアップ
```bash
# PostgreSQLが起動していることを確認
npx prisma migrate dev
npx prisma db seed
```

### 4. 開発サーバー起動
```bash
npm run dev
# http://localhost:3007
```

## ブランチ戦略

```
main (production)
├── develop
│   ├── feature/auth-system
│   ├── feature/patient-dashboard
│   ├── feature/test-results-viz
│   ├── feature/supplement-recommendation
│   ├── feature/doctor-portal
│   └── feature/analysis-engine
└── release/v1.0.0
```

### コミットメッセージ規約
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル修正
refactor: リファクタリング
test: テスト追加・修正
chore: ビルド・補助ツール変更
```

## チェックリスト

### 開発完了基準
- [ ] 全機能が仕様通り動作
- [ ] テストカバレッジ80%以上
- [ ] パフォーマンス目標達成
- [ ] セキュリティ要件満足
- [ ] アクセシビリティ対応
- [ ] ドキュメント完備

### デプロイ前チェック
- [ ] 環境変数確認
- [ ] データベースマイグレーション
- [ ] ビルドエラーなし
- [ ] E2Eテスト合格
- [ ] SSL証明書設定
- [ ] バックアップ設定

## リスク管理

### 技術的リスク
1. **パフォーマンス問題**
   - 対策：早期からの最適化、キャッシュ戦略

2. **セキュリティ脆弱性**
   - 対策：定期的なセキュリティ監査、依存関係更新

3. **スケーラビリティ**
   - 対策：マイクロサービス化の準備、DB最適化

### プロジェクトリスク
1. **スコープクリープ**
   - 対策：要件の明確化、変更管理プロセス

2. **技術的負債**
   - 対策：継続的リファクタリング、コードレビュー

## 成功指標

### 技術指標
- ページロード時間：< 3秒
- Lighthouse Score：> 90
- テストカバレッジ：> 80%
- ビルドサイズ：< 2MB

### ビジネス指標
- ユーザー満足度：> 4.0/5.0
- システム稼働率：> 99.9%
- エラー率：< 0.1%

この実装計画に従って、サプノアフェーズ2の開発を進めていきます。