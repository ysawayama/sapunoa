# Windows環境でのSapunoa起動ガイド

## 問題の概要
WSL環境でNext.jsが正しく動作しない場合があります。この場合、Windows環境で直接実行することで解決できます。

## 前提条件
- Windows用Node.jsのインストール（https://nodejs.org/）
- 推奨バージョン：Node.js 18.x または 20.x

## 起動手順

### 1. コマンドプロンプトを開く
- Windowsキー + R を押す
- 「cmd」と入力してEnter

### 2. プロジェクトディレクトリに移動
```cmd
cd C:\Users\saway\Desktop\AI開発\Zeami-1\projects\sapunoa
```

### 3. 依存関係のインストール（初回のみ）
```cmd
npm install
```

### 4. 開発サーバーの起動
```cmd
npm run dev
```

### 5. ブラウザでアクセス
- http://localhost:3007

## トラブルシューティング

### Node.jsがインストールされていない場合
1. https://nodejs.org/ から「LTS」版をダウンロード
2. インストーラーを実行
3. コマンドプロンプトを再起動

### ポート3007が使用中の場合
```cmd
netstat -ano | findstr :3007
taskkill /PID [プロセスID] /F
```

## バッチファイルの使用
以下のバッチファイルも利用可能：
- `start-windows-port3007.bat`
- `start-debug-pause.bat`

エクスプローラーでダブルクリックして実行できます。