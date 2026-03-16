import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.ssr' });

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine({
  allowedHosts: ['localhost', '127.0.0.1'],
});

const PREVIEW_SECRET = process.env['PREVIEW_SECRET'] || 'preview-secret';

// Preview API - enables draft mode
app.get('/api/preview', (req, res) => {
  const secret = req.query['secret'] as string;
  const url = (req.query['url'] as string) || '/';
  const status = req.query['status'] as string;

  if (secret !== PREVIEW_SECRET) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  if (status === 'published') {
    res.clearCookie('__draft_mode');
  } else {
    res.cookie('__draft_mode', 'true', { path: '/', sameSite: 'lax' });
  }

  res.redirect(url);
});

// Exit preview API - disables draft mode
app.get('/api/exit-preview', (_req, res) => {
  res.clearCookie('__draft_mode');
  res.json({ success: true });
});

// Handle Chrome DevTools .well-known requests
app.get('/.well-known/*', (_req, res) => {
  res.status(204).end();
});

/**
 * Serve static files from /browser
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
