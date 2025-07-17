# サプノア再起動ガイド

## 🔄 サーバーの再起動方法

### 方法1: Windowsバッチファイルを使用（推奨）

1. **エクスプローラーでフォルダを開く**
   ```
   C:\Users\saway\Desktop\AI開発\Zeami-1\projects\sapunoa
   ```

2. **`start-windows-port3007.bat`をダブルクリック**

3. **コマンドプロンプトが開いて起動処理が始まります**

4. **以下のメッセージが表示されたら成功**
   ```
   ▲ Next.js 14.0.0
   - Local:        http://localhost:3007
   ```

### 方法2: コマンドプロンプトから手動起動

1. **新しいコマンドプロンプトを開く**
   - Windowsキー + R → `cmd` と入力 → Enter

2. **プロジェクトフォルダに移動**
   ```cmd
   cd C:\Users\saway\Desktop\AI開発\Zeami-1\projects\sapunoa
   ```

3. **環境変数を設定して起動**
   ```cmd
   set PORT=3007
   npm run dev
   ```

### 方法3: PowerShellを使用

1. **PowerShellを開く**
   - Windowsキー + X → Windows PowerShell

2. **プロジェクトフォルダに移動**
   ```powershell
   cd C:\Users\saway\Desktop\AI開発\Zeami-1\projects\sapunoa
   ```

3. **環境変数を設定して起動**
   ```powershell
   $env:PORT="3007"
   npm run dev
   ```

## ✅ 起動確認

サーバーが正常に起動したら、以下を確認：

1. **コンソールに表示されるメッセージ**
   ```
   ▲ Next.js 14.0.0
   - Local:        http://localhost:3007
   - Environments: .env
   ✓ Ready in Xs
   ```

2. **ブラウザでアクセス**
   - http://localhost:3007 - トップページ
   - http://localhost:3007/demo - デモページ
   - http://localhost:3007/dashboard - ダッシュボード

## ❌ エラーが出る場合

### "Module not found"エラー
```cmd
npm install
```

### ポートが使用中
```cmd
# 別のポートを使用
npx next dev -p 3008
```

### キャッシュクリア
```cmd
# .nextフォルダを削除
rmdir /s /q .next
npx next dev -p 3007
```

### ルーティングエラー
```
You cannot have two parallel pages that resolve to the same path.
```
これが表示される場合:
1. .nextフォルダを削除: `rmdir /s /q .next`
2. 再起動: `npx next dev -p 3007`

## 🚦 現在の状態確認

1. **ポート3007でサーバーが起動しているか**
2. **エラーメッセージが表示されていないか**
3. **ブラウザでページが表示されるか**

サーバーが起動したら、ブラウザで http://localhost:3007 にアクセスしてください。