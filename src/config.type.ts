import { IHelmetConfiguration } from 'helmet';

export interface SSRConfig {
    /**
     * server port
     * @default 8080
     */
    port?: number,

    /**
     * Render your app
     */
    renderApp: (req, res) => Promise<{ html: string, context: any }>,

    /**
     * Render error page
     * by default a basic one is sent
     */
    renderError?: (req, res, error) => any,

    /**
     * error callback. useful for error trackers
     */
    onError?: ({ status: string, error: Error }) => void,

    /**
     * run code after middlewares
     * executed right before adding errorHandler middleware
     */
    after?: (app) => void,

    /**
     * Serve sourcemaps
     * DO NOT enable in prod environments
     */
    sourcemaps?: boolean,

    /**
     * avoid showing full path and only show app files in stack trace
     * disable if you're having issues with stacktrace
     * @default true
     */
    compactErrors?: boolean,

    /**
     * GZIP compression
     */
    compression?: boolean,

    /**
     * Static assets cache age
     * ms format: https://www.npmjs.com/package/ms
     */
    assetCacheAge?: string,

    /**
     * access logs with morgan
     * https://www.npmjs.com/package/morgan
     */
    logs?: boolean,

    /**
     * Authentication will be enabled if you have a user.htpasswd file in root dir 
     * (unless you explicitly pass auth: false)
     * 
     * You can also pass a config object as value
     * see: https://www.npmjs.com/package/http-auth#configurations
     */
    auth?: false | { [key: string]: any },

    /**
     * Run code before other middlewares
     * good for things like error tracker
     */
    before?: (app) => void,

    /** 
     * Helmet configuration
     * https://helmetjs.github.io
     */
    helmetConfig?: IHelmetConfiguration,

    /** 
     * call app.listen()
     * pass false if you need to set that up yourself (e.g. for https)
     * @default true
     */
    listen?: boolean;
}
