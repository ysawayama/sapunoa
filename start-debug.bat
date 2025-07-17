@echo off
echo Starting Next.js Debug Mode...
echo.
echo Setting environment variables...
set NEXT_TELEMETRY_DISABLED=1
set NODE_ENV=development
set PORT=3007

echo.
echo Clearing cache...
if exist ".next" rmdir /s /q .next

echo.
echo Starting server with verbose logging...
echo.
npx next dev -p 3007