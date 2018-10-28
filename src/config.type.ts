import { IHelmetContentSecurityPolicyConfiguration } from 'helmet';

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
    renderError?: (req, error) => any,

    /**
     * error callback. useful for error trackers
     */
    onError?: ({ status: string, error: Error }) => void,

    /**
     * run code after middlewares
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
     * CSP configuration
     * https://helmetjs.github.io/docs/csp/
     */
    CSP?: IHelmetContentSecurityPolicyConfiguration,
}
