/* eslint-disable no-console */

import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import auth from 'http-auth';
import uuid from 'uuid/v1';
import uuidv4 from 'uuid/v4';
import { SSRConfig } from '../config.type';
import createLogger from './logger';
import removeTrailingSlash from './removeTrailingSlash';
import serveStatic from './static';

export default function createExpressApp($config: SSRConfig): express.Application {
    const config = {
        compression: true,
        logs: true,
        ...$config,
    };

    const { before, helmetConfig } = config;
    
    const app = express();

    // disable x-powered-by header
    app.disable('x-powered-by');

    // Add request ID and nonce (for inline Apollo state restore code)
    app.use((req, res, next) => {
        (req as any).id = uuid();
        res.locals.nonce = uuidv4();
        next();
    });

    if (before) before(app);

    // HTTP authentication
    if (config.auth && config.auth.username && config.auth.password) {
        // if username and password is passed
        // use auth callback
        const basicAuth = auth.basic(config.auth, (username, password, callback) => {
            // @ts-ignore
            callback(username === config.auth.username && password === config.auth.password);
        });

        app.use(auth.connect(basicAuth));
    }

    // Morgan
    if (config.logs) {
        app.use(createLogger(config.logs));
    }

    // gzip compression
    if (config.compression) {
        app.use(compression());
    }

    // some security measures
    // https://www.npmjs.com/package/helmet
    app.use(helmet(helmetConfig));

    // Support JSON body
    app.use(bodyParser.json());

    // Support URL-encoded body
    app.use(bodyParser.urlencoded({
        extended: true,
    }));

    // parse cookies
    app.use(cookieParser());

    // serve static assets 
    // and files from /public
    serveStatic(app, config);

    // redirect to url without trailing slash
    app.use(removeTrailingSlash);

    return app;
}
