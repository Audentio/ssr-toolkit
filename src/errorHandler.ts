import escapeRegExp from 'lodash/escapeRegExp';
import chalk from 'chalk';
import * as Sentry from '@sentry/node';
import { SSRConfig } from './config.type';

export default function createErrorHandler(config: SSRConfig) {
    const { renderError, onError, compactErrors = true } = config;

    const pwdPattern = new RegExp(escapeRegExp(process.cwd()), 'g');
    const truncateStackTrace = stack => {
        if (compactErrors) {
            const truncated = stack.replace(pwdPattern, ''); // dont show full path
            return truncated.split('at Layer.handle')[0]; // get rid of express lines
        }

        return stack;
    };

    return function errorHandler(error, req, res, next) {
        // avoid showing full path
        // and hide irrelevant lines
        const errorStack = truncateStackTrace(error.stack);

        Sentry.captureException(error);

        console.error('\n' + chalk.bold.red(req.id));
        console.error(errorStack);

        let errorPage = `An error occured.<br>Request ID: ${req.id}`;
        if (renderError) {
            // fancy custom error page
            errorPage = renderError(req, error);
        }

        const status = error instanceof URIError ? 400 : 500;

        if (onError) {
            onError({
                status,
                error,
            });
        }

        res.status(status).send(errorPage);
    };
}
