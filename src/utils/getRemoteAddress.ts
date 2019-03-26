export default function getRemoteAddress(req) {
    return (
        req.headers['x-real-ip'] 
        || req.headers['x-forwarded-for']
        || req.connection.remoteAddress
    );
}
