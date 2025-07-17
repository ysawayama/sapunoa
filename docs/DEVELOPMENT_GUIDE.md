# サプノア（SUPNOA）開発ガイドライン

## コーディング規約

### TypeScript

#### 型定義
```typescript
// ✅ Good - 明示的な型定義
interface PatientData {
  id: string;
  name: string;
  testResults: TestResult[];
}

// ❌ Bad - any型の使用
const processData = (data: any) => { ... }

// ✅ Good - ユニオン型とタイプガード
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is { success: true; data: T } {
  return response.success === true;
}
```

#### 命名規則
```typescript
// インターフェース：PascalCase + 名詞
interface UserProfile { ... }

// 型エイリアス：PascalCase
type ButtonVariant = 'primary' | 'secondary';

// 関数：camelCase + 動詞
function calculateHealthScore() { ... }

// 定数：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// コンポーネント：PascalCase
const PatientDashboard: FC = () => { ... }
```

### React/Next.js

#### コンポーネント構造
```typescript
// src/components/patient/HealthScoreCard.tsx
import { FC, memo } from 'react';
import { Card } from '@/components/shared/Card';
import { useHealthScore } from '@/hooks/useHealthScore';

interface HealthScoreCardProps {
  patientId: string;
  className?: string;
}

export const HealthScoreCard: FC<HealthScoreCardProps> = memo(({ 
  patientId, 
  className 
}) => {
  const { score, isLoading, error } = useHealthScore(patientId);

  if (isLoading) return <Card.Skeleton />;
  if (error) return <Card.Error message={error.message} />;

  return (
    <Card className={className}>
      <Card.Header>
        <Card.Title>健康スコア</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="text-4xl font-bold text-primary-600">
          {score}/100
        </div>
      </Card.Body>
    </Card>
  );
});

HealthScoreCard.displayName = 'HealthScoreCard';
```

#### カスタムフック
```typescript
// src/hooks/useHealthScore.ts
import { useQuery } from '@tanstack/react-query';
import { healthScoreApi } from '@/services/api';

export function useHealthScore(patientId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['healthScore', patientId],
    queryFn: () => healthScoreApi.getScore(patientId),
    staleTime: 5 * 60 * 1000, // 5分
    cacheTime: 10 * 60 * 1000, // 10分
  });

  return {
    score: data?.score ?? 0,
    isLoading,
    error,
  };
}
```

### API設計

#### エンドポイント命名
```typescript
// RESTful API設計
GET    /api/patients              // 一覧取得
GET    /api/patients/:id          // 詳細取得
POST   /api/patients              // 新規作成
PUT    /api/patients/:id          // 更新
DELETE /api/patients/:id          // 削除

// ネストしたリソース
GET    /api/patients/:id/test-results
POST   /api/patients/:id/recommendations
```

#### APIレスポンス形式
```typescript
// 成功レスポンス
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// エラーレスポンス
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

#### エラーハンドリング
```typescript
// src/app/api/patients/[id]/route.ts
import { NextRequest } from 'next/server';
import { AppError, withErrorHandler } from '@/lib/errors';

export const GET = withErrorHandler(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const patient = await prisma.patient.findUnique({
    where: { id: params.id },
    include: { testResults: true }
  });

  if (!patient) {
    throw new AppError(404, 'Patient not found');
  }

  return NextResponse.json({
    success: true,
    data: patient
  });
});
```

### Tailwind CSS

#### コンポーネントクラス
```tsx
// ✅ Good - 明確なクラス構造
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
    Action
  </button>
</div>

// ✅ Good - 条件付きクラス
import { cn } from '@/lib/utils';

<div className={cn(
  "p-4 rounded-lg",
  isActive && "bg-primary-50 border-primary-500",
  !isActive && "bg-gray-50 border-gray-300"
)}>
```

#### レスポンシブデザイン
```tsx
// モバイルファースト設計
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <Card className="p-4 sm:p-6 lg:p-8">
    <h3 className="text-base sm:text-lg lg:text-xl">Title</h3>
  </Card>
</div>
```

## ディレクトリ構造詳細

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 認証グループ
│   │   ├── login/
│   │   └── register/
│   ├── (patient)/                # 患者向けグループ
│   │   ├── dashboard/
│   │   ├── test-results/
│   │   └── supplements/
│   ├── (doctor)/                 # 医師向けグループ
│   │   ├── patients/
│   │   └── recommendations/
│   └── api/                      # APIルート
│       ├── auth/
│       ├── patients/
│       └── analysis/
│
├── components/                   # UIコンポーネント
│   ├── patient/                  # 患者向け専用
│   ├── doctor/                   # 医師向け専用
│   └── shared/                   # 共通コンポーネント
│       ├── ui/                   # 基本UIコンポーネント
│       ├── charts/               # グラフ関連
│       └── forms/                # フォーム関連
│
├── hooks/                        # カスタムフック
│   ├── useAuth.ts
│   ├── usePatient.ts
│   └── useTestResults.ts
│
├── lib/                          # ユーティリティ
│   ├── auth.ts                   # 認証関連
│   ├── db.ts                     # データベース
│   ├── utils.ts                  # 汎用ユーティリティ
│   └── validation.ts             # バリデーション
│
├── services/                     # ビジネスロジック
│   ├── api/                      # API通信
│   ├── analysis/                 # 解析エンジン
│   └── recommendation/           # 推奨ロジック
│
├── types/                        # TypeScript型定義
│   ├── auth.ts
│   ├── patient.ts
│   ├── doctor.ts
│   └── api.ts
│
└── styles/                       # グローバルスタイル
    └── globals.css
```

## テスト戦略

### ユニットテスト
```typescript
// src/services/analysis/__tests__/nutrientAnalyzer.test.ts
import { NutrientAnalyzer } from '../nutrientAnalyzer';

describe('NutrientAnalyzer', () => {
  let analyzer: NutrientAnalyzer;

  beforeEach(() => {
    analyzer = new NutrientAnalyzer();
  });

  describe('analyzeVitaminD', () => {
    it('should detect severe deficiency', () => {
      const result = analyzer.analyzeVitaminD({
        parameter: '25(OH)D',
        value: 10,
        unit: 'ng/mL',
        normalMin: 30,
        normalMax: 100
      });

      expect(result.status).toBe('deficient');
      expect(result.severity).toBeGreaterThan(75);
    });
  });
});
```

### 統合テスト
```typescript
// src/app/api/patients/__tests__/route.test.ts
import { GET } from '../route';
import { prismaMock } from '@/tests/mocks/prisma';

describe('GET /api/patients', () => {
  it('should return patient list', async () => {
    const mockPatients = [
      { id: '1', name: 'Test Patient' }
    ];

    prismaMock.patient.findMany.mockResolvedValue(mockPatients);

    const response = await GET(new Request('http://localhost'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockPatients);
  });
});
```

### E2Eテスト
```typescript
// cypress/e2e/patient-dashboard.cy.ts
describe('Patient Dashboard', () => {
  beforeEach(() => {
    cy.login('patient@example.com', 'password');
    cy.visit('/dashboard');
  });

  it('should display health score', () => {
    cy.get('[data-testid="health-score-card"]').should('be.visible');
    cy.get('[data-testid="health-score-value"]').should('contain', '/100');
  });

  it('should navigate to test results', () => {
    cy.get('[data-testid="nav-test-results"]').click();
    cy.url().should('include', '/test-results');
    cy.get('h1').should('contain', '検査結果');
  });
});
```

## デバッグとロギング

### ロギング設定
```typescript
// src/lib/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// 使用例
logger.info('User logged in', { userId: user.id });
logger.error('Failed to process test result', { error, testId });
```

### デバッグツール
```typescript
// Next.js開発時のデバッグ
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Debug:', { data });
}

// React DevToolsプロファイラー使用
import { Profiler } from 'react';

<Profiler id="Dashboard" onRender={onRenderCallback}>
  <Dashboard />
</Profiler>
```

## パフォーマンス最適化

### 画像最適化
```tsx
import Image from 'next/image';

// ✅ Good - Next.js Image使用
<Image
  src="/images/supplement.jpg"
  alt="Supplement"
  width={300}
  height={200}
  loading="lazy"
  placeholder="blur"
  blurDataURL={blurDataUrl}
/>
```

### コード分割
```typescript
// 動的インポート
const HeavyChart = dynamic(
  () => import('@/components/charts/HeavyChart'),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false 
  }
);
```

### メモ化
```typescript
// React.memoとuseMemo
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(
    () => processComplexData(data),
    [data]
  );

  return <Chart data={processedData} />;
});
```

## セキュリティベストプラクティス

### 入力検証
```typescript
// 必ずサーバーサイドで検証
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const { error, value } = schema.validate(req.body);
if (error) {
  throw new AppError(400, error.details[0].message);
}
```

### SQL注入対策
```typescript
// ✅ Good - Prisma使用（自動的にサニタイズ）
const user = await prisma.user.findUnique({
  where: { email: userInput }
});

// ❌ Bad - 生のSQL
const query = `SELECT * FROM users WHERE email = '${userInput}'`;
```

### XSS対策
```tsx
// ✅ Good - ReactはデフォルトでXSS対策
<div>{userContent}</div>

// ⚠️ 注意 - dangerouslySetInnerHTMLは慎重に
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
```

このガイドラインに従って開発を進めることで、保守性が高く、安全で、パフォーマンスの良いアプリケーションを構築できます。