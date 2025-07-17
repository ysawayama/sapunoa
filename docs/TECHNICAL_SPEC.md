# サプノア（SUPNOA）技術仕様書

## 1. 技術スタック詳細

### フロントエンド技術

#### Next.js 14
- App Router使用
- Server Components活用
- Streaming SSR
- Middleware認証

#### TypeScript
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  }
}
```

#### Tailwind CSS設定
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: {
          50: '#f0fdf4',
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ]
}
```

### バックエンド技術

#### Prisma Schema
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  PATIENT
  DOCTOR
  ADMIN
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum TestType {
  BLOOD
  URINE
}

enum TestStatus {
  PENDING
  COMPLETED
  REVIEWED
}

enum Priority {
  HIGH
  MEDIUM
  LOW
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  role          UserRole
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  patient       Patient?
  doctor        Doctor?
  
  @@map("users")
}

model Patient {
  id                  String    @id @default(uuid())
  userId              String    @unique @map("user_id")
  medicalRecordNumber String    @unique @map("medical_record_number")
  name                String
  dateOfBirth         DateTime  @map("date_of_birth")
  gender              Gender
  phone               String?
  address             String?
  
  user                User      @relation(fields: [userId], references: [id])
  testResults         TestResult[]
  assignedDoctors     DoctorPatient[]
  
  @@map("patients")
}

model Doctor {
  id              String    @id @default(uuid())
  userId          String    @unique @map("user_id")
  licenseNumber   String    @unique @map("license_number")
  name            String
  specialization  String?
  clinicId        String    @map("clinic_id")
  
  user            User      @relation(fields: [userId], references: [id])
  clinic          Clinic    @relation(fields: [clinicId], references: [id])
  patients        DoctorPatient[]
  recommendations Recommendation[]
  comments        DoctorComment[]
  
  @@map("doctors")
}

model Clinic {
  id        String    @id @default(uuid())
  name      String
  address   String
  phone     String
  
  doctors   Doctor[]
  
  @@map("clinics")
}

model DoctorPatient {
  doctorId  String   @map("doctor_id")
  patientId String   @map("patient_id")
  assignedAt DateTime @default(now()) @map("assigned_at")
  
  doctor    Doctor   @relation(fields: [doctorId], references: [id])
  patient   Patient  @relation(fields: [patientId], references: [id])
  
  @@id([doctorId, patientId])
  @@map("doctor_patients")
}

model TestResult {
  id          String      @id @default(uuid())
  patientId   String      @map("patient_id")
  testType    TestType    @map("test_type")
  testDate    DateTime    @map("test_date")
  status      TestStatus  @default(PENDING)
  healthScore Int?        @map("health_score")
  
  patient     Patient     @relation(fields: [patientId], references: [id])
  testValues  TestValue[]
  recommendations Recommendation[]
  
  @@map("test_results")
}

model TestValue {
  id           String     @id @default(uuid())
  testResultId String     @map("test_result_id")
  parameter    String
  value        Float
  unit         String
  normalMin    Float      @map("normal_min")
  normalMax    Float      @map("normal_max")
  
  testResult   TestResult @relation(fields: [testResultId], references: [id])
  
  @@map("test_values")
}

model Supplement {
  id            String    @id @default(uuid())
  name          String
  description   String
  category      String
  ingredients   Json
  evidenceLinks Json      @map("evidence_links")
  imageUrl      String?   @map("image_url")
  
  recommendations Recommendation[]
  
  @@map("supplements")
}

model Recommendation {
  id            String    @id @default(uuid())
  testResultId  String    @map("test_result_id")
  supplementId  String    @map("supplement_id")
  doctorId      String    @map("doctor_id")
  priority      Priority
  dosage        String
  reasoning     String
  createdAt     DateTime  @default(now()) @map("created_at")
  
  testResult    TestResult @relation(fields: [testResultId], references: [id])
  supplement    Supplement @relation(fields: [supplementId], references: [id])
  doctor        Doctor     @relation(fields: [doctorId], references: [id])
  comments      DoctorComment[]
  
  @@map("recommendations")
}

model DoctorComment {
  id               String         @id @default(uuid())
  recommendationId String         @map("recommendation_id")
  doctorId         String         @map("doctor_id")
  comment          String
  createdAt        DateTime       @default(now()) @map("created_at")
  
  recommendation   Recommendation @relation(fields: [recommendationId], references: [id])
  doctor           Doctor         @relation(fields: [doctorId], references: [id])
  
  @@map("doctor_comments")
}

// フェーズ3で実装予定のモデル（コメントアウト）
// model Order {
//   id          String   @id @default(uuid())
//   patientId   String   @map("patient_id")
//   totalAmount Float    @map("total_amount")
//   status      OrderStatus
//   createdAt   DateTime @default(now()) @map("created_at")
//   
//   patient     Patient  @relation(fields: [patientId], references: [id])
//   items       OrderItem[]
//   payment     Payment?
// }
```

### API設計詳細

#### 認証フロー（NextAuth.js）
```typescript
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            patient: true,
            doctor: true
          }
        });

        if (!user || !await bcrypt.compare(credentials.password, user.passwordHash)) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.patient?.name || user.doctor?.name || "User"
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.userId;
      }
      return session;
    }
  }
};
```

### 検査結果解析エンジン

#### 栄養素判定アルゴリズム
```typescript
// src/services/analysis/nutrientAnalyzer.ts
interface NutrientStatus {
  nutrient: string;
  status: 'deficient' | 'low' | 'normal' | 'high';
  value: number;
  normalRange: { min: number; max: number };
  severity: number; // 0-100
}

export class NutrientAnalyzer {
  analyzeBloodTest(testValues: TestValue[]): NutrientStatus[] {
    const results: NutrientStatus[] = [];
    
    // ビタミンD解析
    const vitaminD = testValues.find(v => v.parameter === '25(OH)D');
    if (vitaminD) {
      results.push(this.analyzeVitaminD(vitaminD));
    }
    
    // 鉄分解析
    const iron = this.analyzeIronStatus(testValues);
    if (iron) results.push(iron);
    
    // その他の栄養素解析...
    
    return results;
  }
  
  private analyzeVitaminD(testValue: TestValue): NutrientStatus {
    const { value, normalMin, normalMax } = testValue;
    let status: NutrientStatus['status'];
    let severity: number;
    
    if (value < 20) {
      status = 'deficient';
      severity = 100 - (value / 20) * 50;
    } else if (value < normalMin) {
      status = 'low';
      severity = 50 - ((value - 20) / (normalMin - 20)) * 30;
    } else if (value <= normalMax) {
      status = 'normal';
      severity = 0;
    } else {
      status = 'high';
      severity = ((value - normalMax) / normalMax) * 50;
    }
    
    return {
      nutrient: 'ビタミンD',
      status,
      value,
      normalRange: { min: normalMin, max: normalMax },
      severity
    };
  }
  
  private analyzeIronStatus(testValues: TestValue[]): NutrientStatus | null {
    const hemoglobin = testValues.find(v => v.parameter === 'Hemoglobin');
    const ferritin = testValues.find(v => v.parameter === 'Ferritin');
    
    if (!hemoglobin || !ferritin) return null;
    
    // 複合的な鉄分状態の判定
    // ... 実装
  }
}
```

### サプリメント推奨マッピング
```typescript
// src/services/recommendation/supplementMapper.ts
interface SupplementRecommendation {
  supplementId: string;
  priority: Priority;
  dosage: string;
  reasoning: string;
}

export class SupplementMapper {
  async mapNutrientsToSupplements(
    nutrientStatuses: NutrientStatus[]
  ): Promise<SupplementRecommendation[]> {
    const recommendations: SupplementRecommendation[] = [];
    
    for (const status of nutrientStatuses) {
      if (status.status === 'deficient' || status.status === 'low') {
        const supplements = await this.findSupplementsForNutrient(status.nutrient);
        
        for (const supplement of supplements) {
          recommendations.push({
            supplementId: supplement.id,
            priority: this.calculatePriority(status.severity),
            dosage: this.calculateDosage(status, supplement),
            reasoning: this.generateReasoning(status, supplement)
          });
        }
      }
    }
    
    return this.optimizeRecommendations(recommendations);
  }
  
  private calculatePriority(severity: number): Priority {
    if (severity > 70) return 'HIGH';
    if (severity > 40) return 'MEDIUM';
    return 'LOW';
  }
}
```

## 2. パフォーマンス最適化戦略

### キャッシュ戦略
```typescript
// src/lib/cache.ts
import { Redis } from 'ioredis';

export class CacheService {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }
  
  async getTestResults(patientId: string) {
    const cacheKey = `test_results:${patientId}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    const results = await prisma.testResult.findMany({
      where: { patientId },
      include: { testValues: true }
    });
    
    await this.redis.setex(cacheKey, 3600, JSON.stringify(results));
    return results;
  }
}
```

## 3. セキュリティ実装

### 入力検証
```typescript
// src/lib/validation.ts
import Joi from 'joi';

export const testResultSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  testType: Joi.string().valid('BLOOD', 'URINE').required(),
  testDate: Joi.date().iso().required(),
  testValues: Joi.array().items(
    Joi.object({
      parameter: Joi.string().required(),
      value: Joi.number().required(),
      unit: Joi.string().required(),
      normalMin: Joi.number().required(),
      normalMax: Joi.number().required()
    })
  )
});
```

## 4. エラーハンドリング

### グローバルエラーハンドラー
```typescript
// src/lib/errorHandler.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        statusCode: error.statusCode
      }
    });
  }
  
  // ログ記録
  console.error('Unexpected error:', error);
  
  return res.status(500).json({
    error: {
      message: 'Internal server error',
      statusCode: 500
    }
  });
};
```

## 5. テスト戦略

### ユニットテスト例
```typescript
// tests/services/nutrientAnalyzer.test.ts
describe('NutrientAnalyzer', () => {
  it('should correctly identify vitamin D deficiency', () => {
    const testValue: TestValue = {
      parameter: '25(OH)D',
      value: 15,
      unit: 'ng/mL',
      normalMin: 30,
      normalMax: 100
    };
    
    const analyzer = new NutrientAnalyzer();
    const result = analyzer.analyzeVitaminD(testValue);
    
    expect(result.status).toBe('deficient');
    expect(result.severity).toBeGreaterThan(50);
  });
});
```

## 6. デプロイメント設定

### Docker設定
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3007
CMD ["node", "server.js"]
```