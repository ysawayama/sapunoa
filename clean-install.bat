@echo off
echo Cleaning project...
rd /s /q node_modules 2>nul
rd /s /q .next 2>nul
del package-lock.json 2>nul

echo Installing dependencies...
call npm cache clean --force
call npm install --legacy-peer-deps

echo Starting server...
call npx --no -- next dev -p 3007

pause