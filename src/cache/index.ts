import chalk from 'chalk';
import path from 'path';
import * as cacheStore from './store';

const cacheEnabled = process.argv.slice(2).indexOf('--no-cache') === -1;
if (!cacheEnabled) {
    console.log(chalk.yellow('WARNING: Cache has been disabled.'));
}

const {
    // Cache life (in seconds)
    // if cache is older than this, visitor will be served new content
    CACHE_LIFE = 3600,
} = __non_webpack_require__(path.join(process.cwd(), 'config/application.js'));

export const cache = {
    async get(req) {
        const noCacheRequest = req.cookies.__nocache === 'true';

        if (noCacheRequest || !cacheEnabled) return null;

        const cached = await cacheStore.get(req.url);
        const cache_age = cached && (await cacheStore.age(req.url));

        if (cache_age < CACHE_LIFE) {
            return cached;
        }

        return null;
    },

    set(req, res, html) {
        if (!cacheEnabled) return;

        // only save if status is 200 and it's not a redirect
        const isSuccessful = !res.context.statusCode || res.context.statusCode === 200;
        if (isSuccessful && res.context && res.context.action !== 'REPLACE') {
            cacheStore.set(req.url, html);
        }
    },

    remove(req) {
        if (!cacheEnabled) return;

        cacheStore.remove(req.url);
    },
};

// backward compatibility
export default function withCache(render) {
    return render;
}
