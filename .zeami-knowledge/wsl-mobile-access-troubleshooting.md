# WSL環境でのモバイルアクセス トラブルシューティング

## 問題
WSL2環境で動作するNext.jsアプリケーションにスマートフォンからアクセスできない

## 原因
1. WSL2は仮想ネットワークアダプタを使用
2. WindowsとWSLのネットワークが分離されている
3. デフォルトではWSL内のポートがWindows側に転送されない

## 解決方法

### 方法1: Windowsポートプロキシ設定（推奨）

1. **PowerShellを管理者権限で開く**

2. **ポートフォワーディング設定**:
```powershell
# ポート転送を追加
netsh interface portproxy add v4tov4 listenport=3007 listenaddress=0.0.0.0 connectport=3007 connectaddress=localhost

# 設定確認
netsh interface portproxy show all
```

3. **Windowsファイアウォールで許可**:
```powershell
New-NetFirewallRule -DisplayName "Next.js Dev Server" -Direction Inbound -Protocol TCP -LocalPort 3007 -Action Allow
```

4. **WindowsのIPアドレスを確認**:
```cmd
ipconfig
```
Wi-Fiアダプターの IPv4 アドレスを確認（例: 192.168.1.100）

5. **スマートフォンからアクセス**:
```
http://[WindowsのIPアドレス]:3007
```

### 方法2: Next.js設定の調整

package.jsonのdevスクリプトに `-H 0.0.0.0` を追加済み:
```json
"dev": "next dev -p 3007 -H 0.0.0.0"
```

### 方法3: ngrokを使用（外部公開）

1. **ngrokインストール**:
```bash
# WSL内で
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/
```

2. **トンネル開始**:
```bash
ngrok http 3007
```

3. **提供されたURLでアクセス**（例: https://xxx.ngrok.io）

### 方法4: Vercelへの一時デプロイ

最も確実だが時間がかかる:
```bash
npm i -g vercel
vercel
```

## トラブルシューティング

### ポート転送の削除
```powershell
netsh interface portproxy delete v4tov4 listenport=3007 listenaddress=0.0.0.0
```

### ファイアウォールルールの削除
```powershell
Remove-NetFirewallRule -DisplayName "Next.js Dev Server"
```

### WSL IPアドレスの確認
```bash
# WSL内で
hostname -I
ip addr show eth0
```

## 注意事項
- 同じWi-Fiネットワークに接続していることを確認
- Windows Defenderやアンチウイルスソフトがブロックしていないか確認
- 企業ネットワークの場合、追加の制限がある可能性あり

## 関連ファイル
- `/projects/sapunoa/package.json` - dev スクリプト設定
- 開発ポート: 3007