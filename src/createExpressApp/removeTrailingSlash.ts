// trailing slashes aren't matched by default
export default function removeTrailingSlash(req, res, next) {
    const { url } = req;
    const hasTrailingSlash = url.substr(-1) === '/';

    if (hasTrailingSlash && url.length > 1) {
        res.redirect(301, url.slice(0, -1));
    } else {
        next();
    }
}
