@echo off
echo === Environment Check ===
echo.
echo Current Directory:
cd
echo.

echo Node.js Version:
node --version 2>&1 || echo Node.js not found

echo.
echo NPM Version:
npm --version 2>&1 || echo NPM not found

echo.
echo Next.js Installation:
if exist "node_modules\next\package.json" (
    echo Next.js is installed in node_modules
    type node_modules\next\package.json | findstr "version"
) else (
    echo Next.js NOT found in node_modules
)

echo.
echo Package.json exists:
if exist "package.json" (
    echo YES
) else (
    echo NO - This is a problem!
)

echo.
echo Directory Contents:
dir /b

echo.
echo === End of Check ===
echo.
pause