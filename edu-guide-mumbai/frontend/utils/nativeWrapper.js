const serialize = (name, val, options = {}) => {
    let str = `${name}=${encodeURIComponent(val)}`;
    if (options.httpOnly) str += '; HttpOnly';
    if (options.secure) str += '; Secure';
    if (options.path) str += `; Path=${options.path}`;
    else str += '; Path=/';
    if (options.sameSite) str += `; SameSite=${options.sameSite}`;
    if (options.maxAge) str += `; Max-Age=${Math.floor(options.maxAge / 1000)}`;
    if (options.expires) str += `; Expires=${options.expires.toUTCString()}`;
    return str;
};

const nativeWrapper = (handler) => async (req, res) => {
    // 1. Monkey-patch res
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };

    res.json = (data) => {
        if (!res.headersSent) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        }
        return res;
    };

    res.send = (data) => {
        if (!res.headersSent) {
            res.end(data);
        }
        return res;
    };

    res.cookie = (name, value, options) => {
        const serialized = serialize(name, value, options);
        let existing = res.getHeader('Set-Cookie');
        if (!existing) {
            existing = [];
        } else if (!Array.isArray(existing)) {
            existing = [existing];
        }
        existing.push(serialized);
        res.setHeader('Set-Cookie', existing);
        return res;
    };

    res.clearCookie = (name, options = {}) => {
        const opts = { ...options, expires: new Date(1), path: '/' };
        return res.cookie(name, '', opts);
    };

    // 2. Mock next()
    const next = (err) => {
        if (err) {
            console.error('Error in handler:', err);
            const status = err.status || 500;
            const message = err.message || 'Internal Server Error';
            if (!res.headersSent) {
                res.status(status).json({
                    success: false,
                    message,
                    ...(process.env.NODE_ENV === 'development' && { stack: err.stack, code: err.code })
                });
            }
        }
    };

    // 3. Run handler
    try {
        await handler(req, res, next);
    } catch (error) {
        next(error);
    }
};

module.exports = nativeWrapper;
