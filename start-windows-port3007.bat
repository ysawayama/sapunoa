@echo off
echo ========================================
echo SUPNOA Startup Script (Port 3007)
echo ========================================
echo.

echo [1/3] Setting environment variables...
set PORT=3007
set NEXTAUTH_URL=http://localhost:3007

echo.
echo [2/3] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo [3/3] Starting development server on port 3007...
echo.
echo ========================================
echo Application starting on PORT 3007!
echo URL: http://localhost:3007
echo.
echo Test accounts:
echo   Doctor: doctor@supnoa.com / doctor123
echo   Patient: patient1@example.com / patient123
echo ========================================
echo.
echo Press Ctrl+C to stop
echo.

call npx next dev -p 3007