// 静的ビルドテスト
const fs = require('fs');
const path = require('path');

console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

// package.jsonの確認
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  console.log('Next.js version:', pkg.dependencies.next);
  console.log('React version:', pkg.dependencies.react);
} catch (e) {
  console.error('Error reading package.json:', e.message);
}

// src/appディレクトリの確認
const appDir = path.join('src', 'app');
if (fs.existsSync(appDir)) {
  console.log('\nApp directory contents:');
  fs.readdirSync(appDir).forEach(file => {
    console.log(' -', file);
  });
}

// 環境変数の確認
console.log('\nEnvironment:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);