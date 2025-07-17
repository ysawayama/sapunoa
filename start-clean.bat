@echo off
echo Cleaning cache and starting server...
rmdir /s /q .next 2>nul
npx --no -- next dev -p 3007
pause