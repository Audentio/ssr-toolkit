import { flushChunkNames } from 'react-universal-component/server';
import path from 'path';

// This is why client bundle must be built before server
// these stats are used to identify critical chunks
const clientBundleStats = __non_webpack_require__(path.join(process.cwd(), 'dist/client/client-stats.json'));

export default function getChunkAssets() {
    const chunkNames = flushChunkNames();
    const assets: { css: string[], js: string[] } = {
        css: [],
        js: [],
    };

    ['main'].concat(chunkNames).forEach(chunkName => {
        const chunkAssets = clientBundleStats.namedChunkGroups ? clientBundleStats.namedChunkGroups[chunkName].assets : clientBundleStats.assetsByChunkName[chunkName];
        const js = chunkAssets.filter(asset => /.js$/.test(asset.split('?ver')[0]));
        const css = chunkAssets.filter(asset => /.css$/.test(asset.split('?ver')[0]));

        assets.js = assets.js.concat(js);
        assets.css = assets.css.concat(css);
    });

    return assets;
}
