#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const MOCK_DIR = path.join(__dirname, 'mock');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.xml': 'application/xml',
};

// Recursively get all files from directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Get directory structure for HTML listing
function getDirectoryStructure(dirPath, basePath = '') {
  const files = fs.readdirSync(dirPath);
  let html = '<ul style="margin-left: 20px;">';

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    const relativePath = path.join(basePath, file).replace(/\\/g, '/');

    if (stat.isDirectory()) {
      html += `<li style="margin: 10px 0;"><strong>📁 ${file}/</strong>`;
      html += getDirectoryStructure(fullPath, relativePath);
      html += '</li>';
    } else {
      const ext = path.extname(file);
      const icon = getFileIcon(ext);
      html += `<li style="margin: 5px 0;">
        <a href="/${relativePath}" style="text-decoration: none; color: #667eea;">
          ${icon} ${file}
        </a>
      </li>`;
    }
  });

  html += '</ul>';
  return html;
}

// Get icon based on file extension
function getFileIcon(ext) {
  const icons = {
    '.html': '🌐',
    '.js': '⚙️',
    '.json': '📊',
    '.css': '🎨',
    '.txt': '📄',
    '.md': '📝',
    '.png': '🖼️',
    '.jpg': '🖼️',
    '.gif': '🎬',
    '.svg': '✏️',
    '.xml': '📋',
  };
  return icons[ext] || '📎';
}

// Generate HTML for directory listing
function generateIndexHTML(dirPath) {
  const structure = getDirectoryStructure(dirPath);

  return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mock Server - File Browser</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 1.1em;
            opacity: 0.95;
        }

        .content {
            padding: 40px;
        }

        .section {
            margin-bottom: 40px;
        }

        .section-title {
            font-size: 1.5em;
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }

        a {
            color: #667eea;
            text-decoration: none;
            transition: color 0.3s;
        }

        a:hover {
            color: #764ba2;
            text-decoration: underline;
        }

        ul {
            list-style: none;
        }

        li {
            padding: 8px 0;
        }

        .file-tree {
            background: #f5f7fa;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
        }

        code {
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }

        .info-box {
            background: #e8f4f8;
            border-left: 4px solid #667eea;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
        }

        .info-box strong {
            color: #667eea;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }

        .stat-card {
            background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
            border: 2px solid #667eea;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }

        .stat-number {
            font-size: 2em;
            font-weight: 700;
            color: #667eea;
        }

        .stat-label {
            color: #666;
            margin-top: 10px;
            font-size: 0.95em;
        }

        .footer {
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
            color: #999;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Mock Server</h1>
            <p>Browser dei tuoi file mock</p>
        </div>

        <div class="content">
            <div class="info-box">
                <strong>✨ Server in esecuzione su:</strong> <code>http://localhost:3000</code>
            </div>

            <div class="section">
                <h2 class="section-title">📁 Struttura dei file</h2>
                <div class="file-tree">
                    ${structure}
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">💡 Come usare</h2>
                <p style="line-height: 1.8; color: #555;">
                    Clicca su uno dei file qui sopra per visualizzarlo. Puoi testare i tuoi mock da React, Svelte o Angular 
                    semplicemente importando da <code>http://localhost:3000/[percorso-file]</code>
                </p>
            </div>

            <div class="section">
                <h2 class="section-title">🎯 Esempi di utilizzo</h2>
                <p style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px; font-family: 'Courier New', monospace; overflow-x: auto;">
                    // React<br>
                    fetch('http://localhost:3000/cloude/pokedex-list.json')<br>
                    <br>
                    // Svelte<br>
                    &lt;script&gt;<br>
                    &nbsp;&nbsp;import data from 'http://localhost:3000/gemini/pokemon.json'<br>
                    &lt;/script&gt;
                </p>
            </div>
        </div>

        <div class="footer">
            <p>Mock Server v1.0 | Premi Ctrl+C per fermare il server</p>
        </div>
    </div>
</body>
</html>
  `;
}

// Create server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURI(parsedUrl.pathname);

  // Remove leading slash
  if (pathname.startsWith('/')) {
    pathname = pathname.slice(1);
  }

  // Build file path
  let filePath = path.join(MOCK_DIR, pathname);

  // Security: prevent directory traversal
  if (!filePath.startsWith(MOCK_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Accesso negato');
    return;
  }

  // Check if path exists
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // If root requested, show directory listing
      if (pathname === '' || pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(generateIndexHTML(MOCK_DIR));
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File non trovato');
      return;
    }

    // If it's a directory, show listing
    if (stats.isDirectory()) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(generateIndexHTML(filePath));
      return;
    }

    // Serve file
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║         🚀 Mock Server Started                         ║
╠════════════════════════════════════════════════════════╣
║  🌐 URL: http://localhost:${PORT}
║  📁 Directory: ${MOCK_DIR}
║  ⏹️  Press Ctrl+C to stop
╚════════════════════════════════════════════════════════╝
  `);
});

// Handle errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} già in uso. Usa: PORT=3001 node server.js`);
  } else {
    console.error('❌ Errore del server:', err);
  }
  process.exit(1);
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n✋ Server fermato');
  process.exit(0);
});