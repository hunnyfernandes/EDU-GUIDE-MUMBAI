// Native Vercel handler (no Express)

module.exports = (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // In production, specify allowed origin if credentials=true, but '*' + credentials=true fails in browsers.
    // Vercel handles this automatically usually, but let's be safe for debugging.
    // Or remove credentials if not needed for this test.

    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { method, body, query } = req;

    res.status(200).json({
        success: true,
        message: 'Native Vercel handler works!',
        handler_type: 'native',
        method,
        body: body || 'No Body',
        query,
        timestamp: new Date().toISOString()
    });
};
