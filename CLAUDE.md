# サプノア（SUPNOA）プロジェクト - Zeami/Claude Code 開発ガイドライン

このファイルは、Zeamiフレームワークに基づくサプノアプロジェクト固有のAI開発ガイドラインです。

## 🔴 必須ガイドライン

### 1. 上位ガイドラインの継承
以下のガイドラインを必ず参照し、順守してください：
- [/Zeami-1/CLAUDE.md](/Zeami-1/CLAUDE.md) - Zeami全体の原則
- [/Zeami-1/projects/CLAUDE.md](/Zeami-1/projects/CLAUDE.md) - プロジェクト層の原則
- [/Zeami-1/projects/_shared/guidelines/CRITICAL_THINKING_CHECKLIST.md](/Zeami-1/projects/_shared/guidelines/CRITICAL_THINKING_CHECKLIST.md) - 批判的思考チェックリスト

### 2. Zeami知識循環の原則
- **必須行動**: フィーチャー実装、バグ修正、学習事項は必ずログに記録
- **ドキュメント優先**: コード変更前に設計意図を文書化
- **知識の継承**: エラーパターンと解決策を`.zeami-knowledge/`に保存

## 📋 プロジェクト固有の設定

### プロジェクト概要
- **プロジェクト名**: サプノア（SUPNOA）
- **目的**: 血液検査・尿検査結果に基づく最適サプリメント提案・販売Webアプリケーション
- **技術スタック**: 
  - フロントエンド: Next.js 14, TypeScript, Tailwind CSS, Recharts
  - バックエンド: Node.js, Express.js, Prisma ORM
  - データベース: PostgreSQL, Redis
  - 認証: NextAuth.js
- **開始日**: 2025年7月11日
- **フェーズ**: フェーズ2（患者向け検査結果確認・サプリメント推奨システム）

### 開発コマンド
```bash
# プロジェクトセットアップ
npm install
npx prisma migrate dev
npm run dev

# Zeami開発セッション
npm run zeami:start      # 開発セッション開始
npm run zeami:stop       # 開発セッション終了
npm run zeami:status     # ステータス確認

# 知識管理
npm run zeami:log        # 開発ログ作成
npm run zeami:learn      # 知識学習
npm run zeami:auto-learn # 自動学習
npm run zeami:sync       # 知識同期

# 開発サポート
npm run zeami:type       # タイプ診断
npm run zeami:validate   # 検証
```

## 🎯 プロジェクト固有のルール

### 1. 医療データの取り扱い
- **暗号化必須**: 患者の個人情報・検査結果は必ず暗号化
- **アクセス制御**: Role-Based Access Control (RBAC) の厳格な実装
- **監査ログ**: 医療データへのアクセスは全て記録

### 2. 薬機法・法的コンプライアンス
- **表現制限**: 医薬品的効能表現を避ける
- **エビデンスベース**: 科学的根拠のある情報のみ表示
- **免責事項**: 適切な免責事項の表示

### 3. UI/UXデザイン原則
- **信頼感重視**: 押し売り感を排除し、医療サービスとしての信頼感を演出
- **アクセシビリティ**: WCAG 2.1 AA準拠
- **レスポンシブ**: モバイルファーストデザイン

### 4. パフォーマンス要件
- **ページロード**: 3秒以内
- **API応答**: 1秒以内
- **同時接続**: 1000ユーザー対応

### 5. セキュリティ要件
- **HTTPS必須**: 全通信をSSL/TLS暗号化
- **入力検証**: Joiによる厳格なバリデーション
- **SQLインジェクション対策**: Prisma ORMの使用
- **XSS対策**: React/Next.jsのデフォルト保護機能活用

## ⚠️ 注意事項

### 1. フェーズ管理
- 現在はフェーズ2の開発に集中
- 購入・決済機能（フェーズ3）は実装しない
- 将来拡張を考慮した設計を心がける

### 2. データプライバシー
- GDPR/個人情報保護法準拠
- 最小権限の原則
- データ保持期間の管理

### 3. テスト要件
- ユニットテストカバレッジ: 80%以上
- E2Eテスト: 主要ユーザーフロー
- セキュリティテスト: 定期的な脆弱性診断

## 📝 開発ログ

### ログ保存場所
- `/docs/logs/YYYY-MM/DD-*.md` - 日次開発ログ
- `/docs/journals/` - 開発ジャーナル
- `/.zeami-knowledge/` - 自動抽出された知識

### 更新履歴
- 2025-07-11: プロジェクト初期設定、Zeami統合

## 🔗 関連リソース

### プロジェクトドキュメント
- [README.md](./README.md) - プロジェクト概要
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - システムアーキテクチャ
- [docs/TECHNICAL_SPEC.md](./docs/TECHNICAL_SPEC.md) - 技術仕様書
- [docs/IMPLEMENTATION_PLAN.md](./docs/IMPLEMENTATION_PLAN.md) - 実装計画
- [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) - API仕様書

### Zeami共有リソース
- [共有ガイドライン](_shared/guidelines/)
- [共有テンプレート](_shared/templates/)
- [共有仕様](_shared/specifications/)

---

**重要**: このCLAUDE.mdファイルは、AIがプロジェクトのコンテキストを理解し、適切な開発支援を提供するための重要な参照ドキュメントです。プロジェクトの進行に応じて定期的に更新してください。