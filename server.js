const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const APP_DIR = path.join(__dirname, 'app');
const START_PORT = 8743;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.ico': 'image/x-icon'
};

function startServer(port) {
  const server = http.createServer((req, res) => {
    let filePath = path.join(APP_DIR, req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      startServer(port + 1); // essaie le port suivant si occupé
    }
  });

  server.listen(port, '127.0.0.1', () => {
    const url = `http://localhost:${port}`;
    console.log('Dashboard running at ' + url);
    exec(`start "" "${url}"`); // ouvre le navigateur par défaut (Windows)
  });
}

startServer(START_PORT);
