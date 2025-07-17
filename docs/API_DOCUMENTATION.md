# サプノア（SUPNOA）API仕様書

## 概要

サプノアAPIは、RESTfulな設計に基づいて構築されており、JSON形式でデータをやり取りします。

### ベースURL
```
開発環境: http://localhost:3007/api
本番環境: https://api.supnoa.com
```

### 認証方式
JWT (JSON Web Token) を使用したBearer認証

```
Authorization: Bearer <token>
```

### 共通レスポンス形式

#### 成功時
```json
{
  "success": true,
  "data": {
    // リソースデータ
  },
  "meta": {
    "timestamp": "2024-01-20T10:00:00Z"
  }
}
```

#### エラー時
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": {}
  }
}
```

## 認証API

### ログイン
```http
POST /api/auth/login
```

#### リクエスト
```json
{
  "email": "patient@example.com",
  "password": "password123"
}
```

#### レスポンス
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "patient@example.com",
      "role": "PATIENT",
      "name": "山田 太郎"
    }
  }
}
```

### ログアウト
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### トークンリフレッシュ
```http
POST /api/auth/refresh
Authorization: Bearer <token>
```

## 患者API

### 患者プロフィール取得
```http
GET /api/patient/profile
Authorization: Bearer <token>
```

#### レスポンス
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "山田 太郎",
    "medicalRecordNumber": "MRN-12345",
    "dateOfBirth": "1980-01-01",
    "gender": "MALE",
    "email": "patient@example.com",
    "phone": "090-1234-5678",
    "healthScore": 85,
    "lastTestDate": "2024-01-15T10:00:00Z"
  }
}
```

### 検査結果一覧取得
```http
GET /api/patient/test-results
Authorization: Bearer <token>
```

#### クエリパラメータ
- `page` (number): ページ番号（デフォルト: 1）
- `limit` (number): 1ページあたりの件数（デフォルト: 10）
- `testType` (string): 検査タイプ（BLOOD, URINE）
- `from` (date): 開始日
- `to` (date): 終了日

#### レスポンス
```json
{
  "success": true,
  "data": [
    {
      "id": "test-result-1",
      "testType": "BLOOD",
      "testDate": "2024-01-15T10:00:00Z",
      "status": "COMPLETED",
      "healthScore": 85,
      "summary": {
        "totalParameters": 20,
        "abnormalCount": 2,
        "criticalCount": 0
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 検査結果詳細取得
```http
GET /api/patient/test-results/:id
Authorization: Bearer <token>
```

#### レスポンス
```json
{
  "success": true,
  "data": {
    "id": "test-result-1",
    "testType": "BLOOD",
    "testDate": "2024-01-15T10:00:00Z",
    "status": "COMPLETED",
    "healthScore": 85,
    "testValues": [
      {
        "id": "value-1",
        "parameter": "Hemoglobin",
        "value": 14.5,
        "unit": "g/dL",
        "normalMin": 13.5,
        "normalMax": 17.5,
        "status": "NORMAL"
      },
      {
        "id": "value-2",
        "parameter": "25(OH)D",
        "value": 22,
        "unit": "ng/mL",
        "normalMin": 30,
        "normalMax": 100,
        "status": "LOW"
      }
    ],
    "nutrientAnalysis": {
      "deficiencies": [
        {
          "nutrient": "ビタミンD",
          "severity": "MODERATE",
          "score": 45
        }
      ]
    }
  }
}
```

### 推奨サプリメント取得
```http
GET /api/patient/recommendations
Authorization: Bearer <token>
```

#### クエリパラメータ
- `testResultId` (string): 検査結果ID（指定した検査結果に基づく推奨）

#### レスポンス
```json
{
  "success": true,
  "data": [
    {
      "id": "rec-1",
      "testResultId": "test-result-1",
      "supplement": {
        "id": "supp-1",
        "name": "ビタミンD3サプリメント",
        "description": "高品質なビタミンD3を配合",
        "category": "ビタミン",
        "imageUrl": "/images/supplements/vitamin-d3.jpg",
        "ingredients": [
          {
            "name": "ビタミンD3",
            "amount": "1000",
            "unit": "IU"
          }
        ]
      },
      "priority": "HIGH",
      "dosage": "1日1カプセル",
      "reasoning": "血液検査の結果、ビタミンD不足が認められます。",
      "doctorComment": {
        "id": "comment-1",
        "comment": "日光浴も併せて行うことをお勧めします。",
        "doctorName": "Dr. 田中",
        "createdAt": "2024-01-16T09:00:00Z"
      }
    }
  ]
}
```

### サプリメント詳細取得
```http
GET /api/patient/supplements/:id
Authorization: Bearer <token>
```

## 医師API

### 患者一覧取得
```http
GET /api/doctor/patients
Authorization: Bearer <token>
```

#### クエリパラメータ
- `search` (string): 検索キーワード（名前、診察券番号）
- `page` (number): ページ番号
- `limit` (number): 1ページあたりの件数

#### レスポンス
```json
{
  "success": true,
  "data": [
    {
      "id": "patient-1",
      "medicalRecordNumber": "MRN-12345",
      "name": "山田 太郎",
      "age": 44,
      "gender": "MALE",
      "lastVisit": "2024-01-15",
      "healthScore": 85,
      "pendingReviews": 2
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

### 患者詳細取得
```http
GET /api/doctor/patients/:id
Authorization: Bearer <token>
```

### 推奨設定作成
```http
POST /api/doctor/recommendations
Authorization: Bearer <token>
```

#### リクエスト
```json
{
  "testResultId": "test-result-1",
  "supplementId": "supp-1",
  "priority": "HIGH",
  "dosage": "1日1カプセル",
  "reasoning": "血液検査の結果に基づく推奨"
}
```

### 推奨設定更新
```http
PUT /api/doctor/recommendations/:id
Authorization: Bearer <token>
```

### 医師コメント追加
```http
POST /api/doctor/comments
Authorization: Bearer <token>
```

#### リクエスト
```json
{
  "recommendationId": "rec-1",
  "comment": "3ヶ月後に再検査を推奨します。"
}
```

## 解析エンジンAPI

### 検査結果解析
```http
POST /api/analysis/process-test-result
Authorization: Bearer <token>
```

#### リクエスト
```json
{
  "testResultId": "test-result-1"
}
```

#### レスポンス
```json
{
  "success": true,
  "data": {
    "healthScore": 85,
    "nutrientStatuses": [
      {
        "nutrient": "ビタミンD",
        "status": "LOW",
        "value": 22,
        "normalRange": {
          "min": 30,
          "max": 100
        },
        "severity": 45
      }
    ],
    "recommendations": [
      {
        "supplementId": "supp-1",
        "priority": "HIGH",
        "confidence": 0.92
      }
    ]
  }
}
```

### 栄養状態取得
```http
GET /api/analysis/nutrient-status/:patientId
Authorization: Bearer <token>
```

## エラーコード

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| AUTH_INVALID_CREDENTIALS | 401 | 認証情報が無効 |
| AUTH_TOKEN_EXPIRED | 401 | トークンの有効期限切れ |
| AUTH_UNAUTHORIZED | 403 | アクセス権限なし |
| RESOURCE_NOT_FOUND | 404 | リソースが見つからない |
| VALIDATION_ERROR | 400 | バリデーションエラー |
| INTERNAL_ERROR | 500 | 内部サーバーエラー |

## レート制限

- 認証済みユーザー: 1000リクエスト/時間
- 未認証ユーザー: 100リクエスト/時間

レート制限に達した場合、以下のヘッダーが返されます：
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 500
X-RateLimit-Reset: 1642680000
```

## Webhook（将来実装）

### 検査結果完了通知
```http
POST https://your-webhook-url.com/test-result-completed
```

#### ペイロード
```json
{
  "event": "test_result.completed",
  "data": {
    "testResultId": "test-result-1",
    "patientId": "patient-1",
    "testType": "BLOOD",
    "completedAt": "2024-01-15T10:00:00Z"
  }
}
```

## SDKサンプル

### JavaScript/TypeScript
```typescript
import { SupnoaClient } from '@supnoa/sdk';

const client = new SupnoaClient({
  apiKey: 'your-api-key',
  environment: 'production'
});

// 検査結果取得
const testResults = await client.patient.getTestResults({
  page: 1,
  limit: 10
});

// サプリメント推奨取得
const recommendations = await client.patient.getRecommendations();
```

### cURL
```bash
# ログイン
curl -X POST https://api.supnoa.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com","password":"password123"}'

# 検査結果取得
curl -X GET https://api.supnoa.com/patient/test-results \
  -H "Authorization: Bearer <token>"
```

このAPIドキュメントは、フェーズ2の実装に必要なエンドポイントを網羅しています。フェーズ3での拡張を考慮した設計となっており、将来的な機能追加にも対応可能です。