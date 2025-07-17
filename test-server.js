const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>サーバーテスト</title>
    </head>
    <body>
      <h1>Node.jsサーバーは正常に動作しています</h1>
      <p>URL: ${req.url}</p>
      <p>時刻: ${new Date().toLocaleString('ja-JP')}</p>
    </body>
    </html>
  `);
});

server.listen(3008, '0.0.0.0', () => {
  console.log('テストサーバーが http://localhost:3008 で起動しました');
});