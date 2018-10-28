import chalk from 'chalk';
import * as cache from './store';

const withCache = (render, config) => {
    const { cache_life, cache_short_life } = config;

    // Cache life (in seconds)
    // if cache is older than this, visitor will be served new content immediately
    const CACHE_LIFE = cache_life || 3600;

    // Cache half life (in seconds)
    // if cache is older than this, visitor will be served cached content 
    // and new content will start rendering in background
    // next visitor will see new content
    const CACHE_SHORT_LIFE = cache_short_life || 300; // 5 minutes

    // do not wrap if --no-cache is passed
    const cacheEnabled = process.argv.slice(2).indexOf('--no-cache') === -1;
    if (!cacheEnabled) {
        console.log(chalk.yellow('WARNING: Cache has been disabled.'));
        return render;
    }

    // return cache-enabled render function
    // which only renders page if there's no cache or cache is old
    return async function renderWithCache(routes, req) {
        const noCacheRequest = req.cookies.__nocache === 'true';

        if (noCacheRequest) {
            // skip cache for this request
            return render(routes, req);
        }

        const cached = await cache.get(req.url);
        const cache_age = cached && await cache.age(req.url);

        // short life expired
        if (cached && cache_age < CACHE_LIFE) {
            if (cache_age > CACHE_SHORT_LIFE) {
                // Re-render this page asyncrhonously
                render(routes, req);
            }

            // but return cached result for this request
            return { html: cached };
        }

        // cache expired or doesn't exist
        // wait for the new render
        return render(routes, req)
            .catch(error => {
                // remove from cache, so it's re-rendered on next request
                // avoids error pages from being served from cache
                cache.remove(req.url);
                throw error;
            });
    };
};

export default withCache;
