# サプノア開発引継ぎガイド

## 📋 現在の状態（2025年7月11日）

### ✅ 完了事項
1. **プロジェクト基本設定**
   - Next.js 14プロジェクトとして初期化完了
   - TypeScript、ESLint、Prettier設定済み
   - Tailwind CSS導入済み
   - ポート3007での動作確認済み

2. **主要機能実装**
   - ✅ ランディングページ（日本語化済み）
   - ✅ ログイン画面（日本語化済み、テスト自動入力機能付き）
   - ✅ デモページ（患者・医師ビュー切り替え可能）
   - ✅ ダッシュボード（モックデータで動作）
   - ✅ 患者向けレイアウト

3. **認証システム**
   - NextAuth.js実装済み
   - デモアカウント対応
   - ログインスキップ機能（デモ用）

4. **修正済みの問題**
   - ポート3000→3007への変更
   - ルーティングコンフリクト解決
   - 不足パッケージのインストール（@heroicons/react、react-circular-progressbar）
   - AuthContextインポートエラー修正

### 🔴 未実装・課題
1. **データベース接続**
   - PostgreSQLは未設定（デモはモックデータで動作）
   - Prismaスキーマは定義済みだが未マイグレート

2. **API実装**
   - 実際のAPIエンドポイントは未実装
   - 現在は全てモックデータ

3. **残りのページ**
   - 検査結果詳細ページ
   - サプリメント一覧・詳細ページ
   - 医師向け管理画面

## 🚀 次回再開時の手順

### 1. プロジェクトフォルダに移動
```powershell
cd C:\Users\saway\Desktop\AI開発\Zeami-1\projects\sapunoa
```

### 2. 開発サーバー起動（3つの方法）

#### 方法A: バッチファイル使用（推奨）
エクスプローラーで以下のファイルをダブルクリック：
- `start-windows-port3007.bat`

#### 方法B: PowerShell使用
```powershell
npx --no -- next dev -p 3007
```

#### 方法C: npm経由
```powershell
npm run dev -- -p 3007
```

### 3. ブラウザでアクセス
- http://localhost:3007 - トップページ
- http://localhost:3007/login - ログイン画面
- http://localhost:3007/demo - デモページ
- http://localhost:3007/dashboard - ダッシュボード

## 📌 テストアカウント

### 患者アカウント
- メール: patient1@example.com
- パスワード: patient123

### 医師アカウント
- メール: doctor@supnoa.com
- パスワード: doctor123

## 🔧 トラブルシューティング

### ポート3007が使用中の場合
```powershell
# 使用中のプロセスを確認
netstat -ano | findstr :3007

# プロセスを停止（PIDは上記コマンドで確認）
taskkill /PID [PID番号] /F

# 別のポートを使用
npx --no -- next dev -p 3008
```

### キャッシュクリア
```powershell
# .nextフォルダを削除
Remove-Item -Recurse -Force .next
```

### パッケージの再インストール
```powershell
npm install
```

## 📝 次の開発タスク（優先順位順）

1. **データベース設定**
   - PostgreSQLのセットアップ
   - Prismaマイグレーション実行
   - シードデータ投入

2. **API実装**
   - 患者データ取得API
   - 検査結果取得API
   - サプリメント推奨API

3. **残りのページ実装**
   - 検査結果詳細（/test-results/[id]）
   - サプリメント一覧（/supplements）
   - 医師向け管理画面（/doctor/*）

4. **機能強化**
   - 実データとの連携
   - グラフ・チャートの実装
   - PDFエクスポート機能

## 💡 開発のコツ

1. **サーバー起動時の注意**
   - 必ずプロジェクトフォルダ内から起動する
   - `npx next dev`ではなく`npx --no -- next dev`を使用

2. **エラーが出たら**
   - まずブラウザの開発者ツール（F12）でエラー確認
   - .nextフォルダを削除して再起動

3. **コード変更時**
   - Hot Reloadが効かない場合はブラウザを手動リロード
   - 大きな変更後はサーバー再起動推奨

---

頑張ってください！質問があればClaude Codeに聞いてください。