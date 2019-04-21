import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

const public_config = __non_webpack_require__(path.join(process.cwd(), 'config/public.js'));
const indexTemplate = fs.readFileSync(path.join(process.cwd(), 'client/index.prod.ejs'), 'utf8');

export default function generateHTML({ helmetContext, res, assets, markup, ...rest }) {
    return ejs.render(
        indexTemplate,
        {
            head: helmetContext.helmet,
            rendered: markup,
            js: assets.js,
            css: assets.css,
            nonce: res.locals.nonce,
            public_config: JSON.stringify(public_config),
            ...rest,
        },
        {}
    );
}
