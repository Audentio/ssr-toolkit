/* eslint-disable import/first */

import FormData from 'form-data';
import sourcemap from 'source-map-support';
import createExpressApp from './createExpressApp';
import errorHandler from './errorHandler';
import './browserShim';
import { SSRConfig } from './config.type';

// FormData support on server
(global as any).FormData = FormData;

// sourcemap support for node
sourcemap.install();

export default function createServer(config: SSRConfig) {
    const { after, renderApp, port = 8080 } = config;

    const app = createExpressApp(config);

    app.get('*', async (req, res) => {
        const { html, context = {} } = await renderApp(req, res);
        const { status = 200, action } = context;

        if (action === 'REPLACE') {
            // Redirect
            res.redirect(status, context.url);
        } else {
            res.status(status).send(html);
        }
    });

    if (after) after(app);

    app.use(errorHandler(config));

    // Start server on port defined in config
    app.listen(port, err => {
        if (err) console.error(err);

        console.log(`Running on port ${port}`);
    });
}
