import morgan from 'morgan';
import streamRotator from 'file-stream-rotator';
import getRemoteAddress from '../utils/getRemoteAddress';

const noop = () => { };

export default function createLogger(loggerConfig = {}) {
    const config = {
        getRemoteAddress,
        format: 'combined',
        streamOptions: {
            filename: 'logs/access-log-%DATE%.log',
            frequency: 'custom',
            verbose: false,
            date_format: 'YYYY-ww',
        },
        ...loggerConfig,
    };

    morgan.token('remote-addr', config.getRemoteAddress);

    const logAccess = morgan(config.format, {
        stream: streamRotator.getStream(config.streamOptions),
    });

    return (req, res, next) => {
        logAccess(req, res, noop);
        next();
    };
}
