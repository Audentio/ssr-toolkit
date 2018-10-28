import { createLocation } from 'history/LocationUtils';

// Emulate browser environment
// adds location and navigator.UA to global
// so we can use these in client code
export default function setupBrowserGlobals(req) {
    const userAgent = req.headers['user-agent'];
    const locationOrigin = (req.secure ? 'https://' : 'http://') + req.get('host');
    const g:any = global;

    /* eslint-disable no-multi-assign */
    g.location = g.window.location = createLocation(req.path);
    g.location.origin = locationOrigin;
    g.location.href = locationOrigin + g.location.pathname;
    g.navigator = g.window.navigator = { userAgent };
    g.window.Modernizr = {};
}
