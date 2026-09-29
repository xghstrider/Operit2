// Operit Node.js project
console.log('🚀 Welcome to the Operit Node.js project!');

// Example: create a simple HTTP server
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Operit Node.js</title>
      <style>
        body {
          font-family: system-ui, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          text-align: center;
        }
        h1 { color: #68a063; }
      </style>
    </head>
    <body>
      <h1>🟢 Node.js server is running</h1>
      <p>Congratulations! Your Operit Node.js project has started successfully.</p>
      <p>Server running at http://${hostname}:${port}</p>
    </body>
    </html>
  `);
});

server.listen(port, hostname, () => {
    console.log(`✅ Server running at http://${hostname}:${port}/`);
    console.log('💡 Tip: restart the server after editing index.js to see your changes');
});
