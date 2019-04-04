import { createLocation } from 'history';

declare const global: any;

// Emulate browser environment
// adds location and navigator.UA to global
// so we can use these in client code
export default function setupBrowserGlobals(req) {
    const userAgent = req.headers['user-agent'];
    const locationOrigin = (req.secure ? 'https://' : 'http://') + req.get('host');

    /* eslint-disable no-multi-assign */
    global.location = createLocation(req.path);
    global.location.origin = locationOrigin;
    global.location.href = locationOrigin + global.location.pathname;
    global.window = {};
    global.window.location = global.location;
    global.navigator = global.window.navigator = { userAgent };
    global.window.Modernizr = {};
}
