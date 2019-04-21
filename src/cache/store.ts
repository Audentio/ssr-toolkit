import fs from 'fs-extra';
import path from 'path';
import sanitizeFilename from 'sanitize-filename';

fs.ensureDir(path.join(process.cwd(), '.ssr-cache'));

function cachefilePath(key) {
    return path.join(process.cwd(), `.ssr-cache/_${sanitizeFilename(key)}`);
}

export function set(key, value) {
    return fs.writeFile(cachefilePath(key), value, 'utf8');
}

export function get(key): Promise<string | void> {
    return new Promise(resolve => {
        fs.readFile(cachefilePath(key), 'utf8')
            .then(resolve)
            .catch(() => resolve());
    });
}

export function age(key) {
    return fs.lstat(cachefilePath(key)).then(stat => {
        const current_time = +new Date();
        const file_mtime = +new Date(stat.mtime);
        const secondsSinceLastSave = (current_time - file_mtime) / 1000;

        return secondsSinceLastSave;
    });
}

export function remove(key) {
    const file = cachefilePath(key);

    // check if file exists
    // then remove it (always resolves, even when nothing was done)
    return fs.pathExists(file).then(exists => {
        if (exists) return fs.unlink(file).then(() => true);
        return false;
    });
}
