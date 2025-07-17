# GitHub リポジトリ作成ガイド

## 手順

### 1. GitHubアカウントの準備
1. [GitHub.com](https://github.com)にアクセス
2. 右上の「Sign in」からログイン（アカウントがない場合は「Sign up」）

### 2. 新規リポジトリの作成

#### 方法1: GitHub Webサイトから作成
1. ログイン後、右上の「+」アイコンをクリック
2. 「New repository」を選択
3. 以下の情報を入力：
   - **Repository name**: `sapunoa`
   - **Description**: `血液検査・尿検査結果に基づく最適サプリメント提案・販売Webアプリケーション`
   - **Public/Private**: お好みで選択（Privateは無料アカウントでも利用可能）
   - **Initialize this repository with**: 何もチェックしない（既存プロジェクトがあるため）
4. 「Create repository」をクリック

### 3. ローカルプロジェクトとの連携

リポジトリ作成後、GitHubに表示されるコマンドを実行：

```bash
# プロジェクトディレクトリで実行
cd /mnt/c/Users/saway/Desktop/AI開発/Zeami-1/projects/sapunoa

# Gitを初期化（まだの場合）
git init

# ファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit - SAPUNOA medical supplement recommendation system"

# メインブランチに切り替え（最近のGitはmainがデフォルト）
git branch -M main

# GitHubリポジトリをリモートとして追加
# ※ your-usernameを実際のGitHubユーザー名に置き換え
git remote add origin https://github.com/your-username/sapunoa.git

# プッシュ（アップロード）
git push -u origin main
```

### 4. 認証について

初回プッシュ時に認証が必要です：

#### パスワード認証は廃止されました
2021年8月以降、GitHubはパスワード認証を廃止しました。以下のいずれかを使用：

#### 方法1: Personal Access Token（推奨）
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」をクリック
3. 必要な権限を選択（repoにチェック）
4. トークンをコピー（一度しか表示されません）
5. `git push`時のパスワードにこのトークンを使用

#### 方法2: GitHub CLI
```bash
# GitHub CLIをインストール
# WSLの場合
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# 認証
gh auth login
```

### 5. .gitignoreの確認

プッシュ前に、機密情報が含まれていないか確認：

```bash
# .gitignoreに以下が含まれているか確認
cat .gitignore
```

以下が含まれているべき：
```
# 環境変数
.env
.env.local
.env.production

# 依存関係
node_modules/

# ビルド出力
.next/
out/
dist/

# データベース
*.db
*.sqlite

# ログ
*.log

# OS
.DS_Store
Thumbs.db

# エディタ
.vscode/
.idea/
```

### 6. プッシュ後の確認

1. GitHubでリポジトリを開く
2. ファイルが正しくアップロードされているか確認
3. `.env`ファイルが含まれていないことを確認（重要！）

## トラブルシューティング

### よくある問題

1. **Permission denied**
   - Personal Access Tokenが正しく設定されているか確認
   - リポジトリの所有者が正しいか確認

2. **fatal: remote origin already exists**
   ```bash
   git remote remove origin
   git remote add origin https://github.com/your-username/sapunoa.git
   ```

3. **large files warning**
   - 大きなファイルがある場合は`.gitignore`に追加
   - または[Git LFS](https://git-lfs.github.com/)を使用

### セキュリティ注意事項

- ⚠️ `.env`ファイルは絶対にコミットしない
- ⚠️ APIキーやパスワードをコードに直接書かない
- ⚠️ Personal Access Tokenは安全に保管する

## 次のステップ

リポジトリ作成後：
1. Vercelでこのリポジトリを選択してデプロイ
2. 自動デプロイの設定（mainブランチへのプッシュで自動デプロイ）
3. ブランチ保護の設定（必要に応じて）