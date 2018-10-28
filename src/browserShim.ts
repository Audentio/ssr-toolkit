// declare missing browser globals on server
if (typeof window !== 'object') {
    // @ts-ignore
    global.window = {}; global.location = {}; global.navigator = {};
}
