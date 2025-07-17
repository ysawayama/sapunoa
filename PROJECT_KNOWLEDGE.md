# サプノア（SUPNOA）プロジェクトナレッジベース

## プロジェクト概要

### ビジネスコンテキスト
サプノアは、クリニックの自由診療収入向上と患者の健康改善を両立させる革新的なWebアプリケーションです。血液検査・尿検査の結果を基に、科学的根拠に基づいたサプリメント推奨を行います。

### 開発フェーズ
- **フェーズ1**: 検査データ取得・システム反映（将来実装）
- **フェーズ2**: 患者向け検査結果確認・サプリメント推奨システム（**現在開発中**）
- **フェーズ3**: 購入フロー・決済システム（将来拡張）

## 技術的知識

### アーキテクチャパターン
```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router (Frontend)             │
├─────────────────────────────────────────────────────────────┤
│                    API Routes (Backend)                      │
├─────────────────────────────────────────────────────────────┤
│                    Prisma ORM (Data Layer)                   │
├──────────────────┬──────────────────┬──────────────────────┤
│   PostgreSQL     │      Redis       │   File Storage       │
└──────────────────┴──────────────────┴──────────────────────┘
```

### 主要技術スタック
- **フロントエンド**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **可視化**: Recharts（グラフ）, Lucide React（アイコン）
- **バックエンド**: Node.js, Express.js, TypeScript
- **データベース**: PostgreSQL（メイン）, Redis（キャッシュ・セッション）
- **ORM**: Prisma
- **認証**: NextAuth.js
- **バリデーション**: Joi

## ドメイン知識

### 検査項目と栄養素マッピング
```typescript
// 血液検査パラメータと栄養素の関係
const nutrientMapping = {
  '25(OH)D': 'ビタミンD',
  'Hemoglobin': '鉄分',
  'Ferritin': '鉄分（貯蔵鉄）',
  'CK': 'タンパク質・筋肉',
  'HbA1c': '糖質代謝',
  'AST/ALT': '肝機能'
};
```

### 栄養素不足判定基準
- **ビタミンD**: < 20 ng/mL（欠乏）, 20-30 ng/mL（不足）
- **ヘモグロビン**: 男性 < 13.5 g/dL, 女性 < 12.0 g/dL
- **フェリチン**: < 30 ng/mL（鉄欠乏の可能性）

### 法的・規制要件
1. **薬機法対応**
   - 医薬品的効能効果の標榜禁止
   - 「栄養補助」「健康維持サポート」の表現に限定

2. **個人情報保護**
   - 医療データの暗号化必須
   - アクセスログの保持
   - 同意取得プロセス

## 実装パターン

### 認証フロー
```typescript
// NextAuth.js設定パターン
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // 診察券番号またはメールでのログイン
      credentials: {
        identifier: { label: "診察券番号/メール", type: "text" },
        password: { label: "パスワード", type: "password" }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // ユーザーロール（PATIENT, DOCTOR）の付与
    }
  }
};
```

### データ可視化パターン
```tsx
// Rechartsを使用したレーダーチャート実装
<RadarChart data={nutrientData}>
  <PolarGrid />
  <PolarAngleAxis dataKey="nutrient" />
  <PolarRadiusAxis domain={[0, 100]} />
  <Radar dataKey="value" fill="#3B82F6" />
</RadarChart>
```

### エラーハンドリングパターン
```typescript
// グローバルエラーハンドラー
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}
```

## 既知の課題と解決策

### パフォーマンス最適化
- **問題**: 大量の検査データ表示時の遅延
- **解決策**: 
  - React.memoによるコンポーネントメモ化
  - 仮想スクロール実装
  - Redisキャッシュ活用

### セキュリティ考慮事項
- **問題**: 医療データの不正アクセスリスク
- **解決策**:
  - Row Level Security (RLS) の実装
  - API Rate Limiting
  - 監査ログの実装

## 開発Tips

### 環境セットアップ
```bash
# PostgreSQL起動確認
sudo service postgresql start

# Redisサーバー起動
redis-server

# 環境変数設定
cp .env.example .env.local
# DATABASE_URL, NEXTAUTH_SECRET等を設定

# データベースマイグレーション
npx prisma migrate dev
```

### よく使うコマンド
```bash
# Prismaスキーマ更新後
npx prisma generate

# 型エラーチェック
npm run type-check

# E2Eテスト実行
npm run test:e2e

# ビルド最適化確認
npm run analyze
```

## 参考リソース

### 外部ドキュメント
- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Recharts](https://recharts.org/)

### プロジェクト内ドキュメント
- [アーキテクチャ設計](./docs/ARCHITECTURE.md)
- [API仕様書](./docs/API_DOCUMENTATION.md)
- [開発ガイド](./docs/DEVELOPMENT_GUIDE.md)
- [実装計画](./docs/IMPLEMENTATION_PLAN.md)

## 更新履歴

### 2025-07-11
- プロジェクト初期設定
- Zeamiフレームワーク統合
- 基本的なドキュメント構造作成

---

**注意**: このナレッジベースは開発の進行に伴い継続的に更新されます。新しい学習事項や問題解決策は積極的に追加してください。