# WSL2でのNext.jsアクセス設定ガイド

## 問題の診断結果

WSL2環境でNext.jsサーバーを起動してもブラウザからアクセスできない問題は、Next.jsがデフォルトで`localhost`（127.0.0.1）のみにバインドするため発生します。

### 確認された事項

1. **ネットワーク構成**
   - WSL2 IPアドレス: `172.24.104.241`（動的に変わる可能性あり）
   - WindowsホストIP: `10.255.255.254`
   - デフォルトのNext.jsバインド: `localhost:3000`のみ

2. **問題の原因**
   - Next.jsがデフォルトで`localhost`のみをリッスンする
   - WSL2とWindowsホストは異なるネットワーク上にある
   - WindowsからWSL2の`localhost`には直接アクセスできない

## 解決方法

### 1. WSL専用の開発サーバー起動（推奨）

```bash
npm run dev:wsl
```

このコマンドは`next dev -H 0.0.0.0`を実行し、全てのネットワークインターフェースでリッスンします。

### 2. 環境変数を使用した起動

```bash
HOST=0.0.0.0 npm run dev
```

### 3. ブラウザでのアクセス方法

#### WSLのIPアドレスを確認
```bash
hostname -I | awk '{print $1}'
```

#### ブラウザでアクセス
```
http://[WSL_IP]:3000
```
例: `http://172.24.104.241:3000`

### 4. 自動化スクリプト（オプション）

以下のスクリプトを作成すると、WSLのIPアドレスを自動で開きます：

```bash
#!/bin/bash
# scripts/dev-wsl.sh

# WSLのIPアドレスを取得
WSL_IP=$(hostname -I | awk '{print $1}')

echo "Starting Next.js on WSL..."
echo "Access URL: http://$WSL_IP:3000"

# Windowsのブラウザで自動的に開く（オプション）
# cmd.exe /c start http://$WSL_IP:3000 &

# 開発サーバーを起動
npm run dev:wsl
```

## セキュリティ上の注意事項

`0.0.0.0`でバインドすると、ネットワーク上の他のデバイスからもアクセス可能になります。開発環境でのみ使用し、本番環境では適切なファイアウォール設定を行ってください。

## トラブルシューティング

### ポートが既に使用されている場合
```bash
# 使用中のポートを確認
ss -tln | grep 3000

# プロセスを終了
pkill -f "next dev"
```

### WSLのIPアドレスが変わった場合
WSL2のIPアドレスは再起動時に変更される可能性があります。その都度`hostname -I`で確認してください。

### Windows Defenderファイアウォール
初回アクセス時にWindows Defenderのファイアウォール警告が表示される場合があります。開発環境では「アクセスを許可」を選択してください。

## 参考情報

- [Next.js CLI Documentation](https://nextjs.org/docs/api-reference/cli)
- [WSL2 Networking](https://docs.microsoft.com/en-us/windows/wsl/networking)