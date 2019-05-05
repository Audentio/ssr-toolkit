import fs from 'fs';
import path from 'path';
import express from 'express';
import { SSRConfig } from '../config.type';

export default function serveStatic(app, config: SSRConfig) {
    const cacheAge = config.assetCacheAge || '168h'; 
    
    const source_assets = express.static(
        process.cwd() + '/src/assets',
        { maxAge: cacheAge },
    );
    const source_dist = express.static(
        process.cwd() + '/dist/client',
        { maxAge: cacheAge },
    );

    // sourcemap control
    // send 404 for sourcemap reqs unless enabled explicitly in config
    if (!config.sourcemaps) {
        app.get('/dist/*.map', (req, res) => {
            res.status(404).end();
        });
    }

    // serve static assets from /src/assets
    app.use('/assets', source_assets);

    // serve static assets from /dist
    app.use('/dist', source_dist);

    // serve favicon.ico
    app.get('/favicon.ico', (req, res) => {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end();
    });

    // serve files from public dir
    app.use((req, res, next) => {
        const filepath = path.join(process.cwd(), 'public', req.url);

        if (fs.existsSync(filepath)) {
            res.sendFile(filepath);
        } else {
            next();
        }
    });
}
