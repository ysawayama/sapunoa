# サプノア（SUPNOA）起動ガイド

## 🚨 現在の問題
ローカルホストでERR_CONNECTION_REFUSEDエラーが発生しています。これは開発サーバーがまだ起動していないためです。

## 🔧 解決手順

### Windows環境での起動方法

#### 方法1: バッチファイルを使用（最も簡単）
1. エクスプローラーで以下のフォルダを開く:
   ```
   C:\Users\saway\Desktop\AI開発\Zeami-1\projects\sapunoa
   ```

2. `start-windows.bat`をダブルクリック

3. コマンドプロンプトが開き、自動的に:
   - 依存関係のインストール
   - 開発サーバーの起動
   が実行されます

4. 「アプリケーションが起動しました！」と表示されたら、ブラウザで:
   ```
   http://localhost:3007
   ```
   にアクセス

#### 方法2: コマンドラインから手動実行

1. **コマンドプロンプトまたはPowerShellを開く**

2. **プロジェクトディレクトリに移動**
   ```cmd
   cd C:\Users\saway\Desktop\AI開発\Zeami-1\projects\sapunoa
   ```

3. **依存関係をインストール**
   ```cmd
   npm install
   ```

4. **開発サーバーを起動**
   ```cmd
   npm run dev
   ```

5. **ブラウザでアクセス**
   ```
   http://localhost:3007
   ```

### データベースについて

現在のモックデータで動作するため、PostgreSQLの設定は不要です。
本格的に使用する場合は、以下のいずれかを実行：

#### オプションA: Dockerを使用
```cmd
docker-compose up -d
```

#### オプションB: ローカルPostgreSQLを使用
PostgreSQLをインストール後、以下を実行：
```cmd
npm run db:setup
```

## 📝 チェックリスト

- [ ] Node.js 18以上がインストールされている
- [ ] プロジェクトフォルダに移動した
- [ ] `npm install`を実行した
- [ ] `npm run dev`でサーバーが起動した
- [ ] ブラウザで http://localhost:3007 にアクセスできた

## 🆘 それでも動かない場合

### エラー: "next: not found"
```cmd
npm install next@14 react react-dom
```

### エラー: "Cannot find module"
```cmd
del /s /q node_modules
npm install
```

### ポート3007が使用中
```cmd
set PORT=3008
npm run dev
```

## 📧 テストアカウント

ログイン画面が表示されたら：
- **医師アカウント**: doctor@supnoa.com / doctor123
- **患者アカウント**: patient1@example.com / patient123

## 🎯 起動成功の確認

1. ブラウザに「サプノア」のログイン画面が表示される
2. テストアカウントでログインできる
3. ダッシュボードが表示される

---

**注意**: 初回起動時は依存関係のインストールに数分かかることがあります。