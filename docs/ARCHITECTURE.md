# サプノア（SUPNOA）システムアーキテクチャ設計書

## 1. システム全体構成

### アーキテクチャ概要
```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Patient Portal│  │ Doctor Portal│  │ Admin Panel  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└────────────────────────────┬────────────────────────────────┘
                            │ HTTPS
┌────────────────────────────┴────────────────────────────────┐
│                    API Layer (Next.js API Routes)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Auth Service │  │ Test Results │  │ Supplement   │    │
│  │ (NextAuth.js)│  │   Service    │  │   Service    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└────────────────────────────┬────────────────────────────────┘
                            │
┌────────────────────────────┴────────────────────────────────┐
│                    Data Layer (Prisma ORM)                   │
└────────────────────────────┬────────────────────────────────┘
                            │
┌──────────────────┬─────────┴──────────┬────────────────────┐
│   PostgreSQL     │      Redis         │   File Storage     │
│   (Primary DB)   │   (Cache/Session)  │   (Images/Docs)    │
└──────────────────┴────────────────────┴────────────────────┘
```

## 2. データベース設計

### ER図概要
```
User (1) ----< (n) Patient
User (1) ----< (n) Doctor
Doctor (n) ----< (n) Patient
Patient (1) ----< (n) TestResult
TestResult (1) ----< (n) TestValue
TestResult (1) ----< (n) Recommendation
Recommendation (n) >---- (1) Supplement
Recommendation (1) ----< (n) DoctorComment
```

### 主要テーブル設計

#### Users Table
```sql
- id (UUID, PK)
- email (String, Unique)
- password_hash (String)
- role (Enum: PATIENT, DOCTOR, ADMIN)
- created_at (DateTime)
- updated_at (DateTime)
```

#### Patients Table
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- medical_record_number (String, Unique)
- name (String)
- date_of_birth (Date)
- gender (Enum)
- phone (String)
- address (Text)
```

#### TestResults Table
```sql
- id (UUID, PK)
- patient_id (UUID, FK)
- test_type (Enum: BLOOD, URINE)
- test_date (DateTime)
- status (Enum: PENDING, COMPLETED, REVIEWED)
- health_score (Integer)
```

#### Supplements Table
```sql
- id (UUID, PK)
- name (String)
- description (Text)
- category (String)
- ingredients (JSON)
- evidence_links (JSON)
- image_url (String)
```

#### Recommendations Table
```sql
- id (UUID, PK)
- test_result_id (UUID, FK)
- supplement_id (UUID, FK)
- priority (Enum: HIGH, MEDIUM, LOW)
- dosage (String)
- reasoning (Text)
- doctor_id (UUID, FK)
```

## 3. API設計

### RESTful API エンドポイント

#### 認証関連
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/session
POST   /api/auth/refresh
```

#### 患者向けAPI
```
GET    /api/patient/profile
GET    /api/patient/test-results
GET    /api/patient/test-results/:id
GET    /api/patient/recommendations
GET    /api/patient/supplements/:id
```

#### 医師向けAPI
```
GET    /api/doctor/patients
GET    /api/doctor/patients/:id
GET    /api/doctor/patients/:id/test-results
POST   /api/doctor/recommendations
PUT    /api/doctor/recommendations/:id
POST   /api/doctor/comments
```

#### 解析エンジンAPI
```
POST   /api/analysis/process-test-result
GET    /api/analysis/nutrient-status/:patientId
```

## 4. セキュリティ設計

### 認証・認可
- NextAuth.jsによるJWTベース認証
- Role-Based Access Control (RBAC)
- セッション管理（Redis）

### データ保護
- データベース暗号化（at rest）
- HTTPS通信（in transit）
- 個人情報のハッシュ化

### APIセキュリティ
- Rate Limiting
- CORS設定
- Input Validation（joi）
- SQLインジェクション対策（Prisma）

## 5. フロントエンドアーキテクチャ

### コンポーネント階層
```
src/components/
├── patient/
│   ├── Dashboard/
│   │   ├── HealthScoreCard.tsx
│   │   ├── NutritionRadarChart.tsx
│   │   └── DeficiencyHeatmap.tsx
│   ├── TestResults/
│   │   ├── TestResultList.tsx
│   │   └── TestResultDetail.tsx
│   └── Supplements/
│       ├── SupplementCard.tsx
│       └── RecommendationList.tsx
├── doctor/
│   ├── PatientManagement/
│   ├── TestResultReview/
│   └── RecommendationEditor/
└── shared/
    ├── Layout/
    ├── Navigation/
    └── UI/
```

### 状態管理
- React Context API（グローバル状態）
- React Query（サーバー状態）
- React Hook Form（フォーム状態）

## 6. パフォーマンス最適化

### フロントエンド
- Next.js Image Optimization
- Dynamic Imports
- Memoization（React.memo, useMemo）
- Virtual Scrolling（大量データ）

### バックエンド
- Query Optimization（Prisma）
- Redis Caching
- Connection Pooling
- Lazy Loading

## 7. 拡張性考慮（フェーズ3準備）

### 決済システム統合準備
```typescript
// 将来実装用インターフェース
interface PaymentProvider {
  createCheckoutSession(items: CartItem[]): Promise<CheckoutSession>
  processPayment(sessionId: string): Promise<PaymentResult>
  handleWebhook(event: WebhookEvent): Promise<void>
}
```

### 定期購入機能準備
```typescript
// 将来実装用スキーマ
model Subscription {
  id String @id
  patient_id String
  items SubscriptionItem[]
  status SubscriptionStatus
  // ... 他のフィールド
}
```

## 8. デプロイメント戦略

### 環境構成
- Development: ローカル開発
- Staging: Vercel Preview
- Production: Vercel + AWS RDS

### CI/CD
- GitHub Actions
- 自動テスト実行
- 自動デプロイ

## 9. モニタリング・ログ

### アプリケーションモニタリング
- エラートラッキング（Sentry）
- パフォーマンスモニタリング
- ユーザー行動分析

### インフラモニタリング
- サーバーリソース監視
- データベースパフォーマンス
- APIレスポンスタイム

## 10. 開発ワークフロー

### ブランチ戦略
```
main
├── develop
│   ├── feature/patient-dashboard
│   ├── feature/doctor-portal
│   └── feature/analysis-engine
└── hotfix/critical-bug
```

### コードレビュープロセス
1. Feature Branch作成
2. Pull Request作成
3. 自動テスト実行
4. コードレビュー
5. マージ

このアーキテクチャは、フェーズ2の要件を満たしつつ、フェーズ3への拡張性を考慮した設計となっています。