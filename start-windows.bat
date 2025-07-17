@echo off
echo ========================================
echo サプノア (SUPNOA) 起動スクリプト
echo ========================================
echo.

echo [1/4] 依存関係をインストール中...
call npm install
if %errorlevel% neq 0 (
    echo エラー: npm install が失敗しました
    pause
    exit /b %errorlevel%
)

echo.
echo [2/4] Prismaクライアントを生成中...
call npm run prisma:generate
if %errorlevel% neq 0 (
    echo エラー: Prisma generate が失敗しました
    pause
    exit /b %errorlevel%
)

echo.
echo [3/4] 環境変数を確認中...
if not exist ".env" (
    echo .envファイルが見つかりません。.env.exampleからコピーします...
    copy .env.example .env
    echo .envファイルを作成しました。必要に応じて編集してください。
)

echo.
echo [4/4] 開発サーバーを起動中...
echo.
echo ========================================
echo アプリケーションが起動しました！
echo URL: http://localhost:3007
echo.
echo テストアカウント:
echo   医師: doctor@supnoa.com / doctor123
echo   患者: patient1@example.com / patient123
echo ========================================
echo.
echo Ctrl+C で終了できます
echo.

call npm run dev