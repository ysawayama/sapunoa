@echo off
echo Starting Next.js Debug Mode...
echo.
echo Current Directory: %CD%
echo.

echo Checking Node.js version...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Checking npm version...
npm --version
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Checking if package.json exists...
if not exist "package.json" (
    echo ERROR: package.json not found in current directory
    echo Please make sure you're in the project directory
    pause
    exit /b 1
)

echo.
echo Installing dependencies (if needed)...
if not exist "node_modules" (
    echo node_modules not found, installing...
    npm install
)

echo.
echo Setting environment variables...
set NEXT_TELEMETRY_DISABLED=1
set NODE_ENV=development
set PORT=3007

echo.
echo Clearing cache...
if exist ".next" (
    echo Removing .next directory...
    rmdir /s /q .next
)

echo.
echo Starting server...
echo.
echo Command: npx next dev -p 3007
echo.
npx next dev -p 3007

echo.
echo If you see this message, the server has stopped.
pause