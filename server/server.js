/**
 * Life Translator - Standalone Production HTTP Server
 * 
 * Can be run independently via `node server/server.js` or via `npm start`.
 * Automatically serves the backend API and static frontend build (if present).
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApiMiddleware } from './apiRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Auto-load .env file if present in project root
try {
  const envPath = path.resolve(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (key && !process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch {
  // Graceful fallback
}

const PORT = parseInt(process.env.PORT || '3001', 10);
const apiHandler = createApiMiddleware();

const server = http.createServer((req, res) => {
  // 1. Check if this is an API route
  if (req.url && req.url.startsWith('/api/')) {
    return apiHandler(req, res);
  }

  // 2. Serve static frontend assets from dist/ if built
  if (fs.existsSync(distDir)) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let filePath = path.join(distDir, parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname);

    // Fallback to index.html for client-side SPA routing
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.txt': 'text/plain',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
      return;
    } catch {
      // Fall through to 404
    }
  }

  // Default response
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`<h1>Life Translator API Server</h1><p>Running on port ${PORT}. API endpoints active at /api/health and /api/explain.</p>`);
});

server.listen(PORT, () => {
  console.log(`[Life Translator] Production server listening at http://localhost:${PORT}`);
});
