@echo off
echo ポート3007を使用しているプロセスを確認中...
echo.
netstat -ano | findstr :3007
echo.
echo 上記のPIDのプロセスを停止するには、以下のコマンドを実行してください：
echo taskkill /PID [PID番号] /F
echo.
echo 例: taskkill /PID 12345 /F
echo.
pause