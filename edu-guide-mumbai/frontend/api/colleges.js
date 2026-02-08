const nativeWrapper = require('../utils/nativeWrapper');
const collegeController = require('../controllers/collegeController');
const { promisePool } = require('../config/database');
const { optionalAuth } = require('../middleware/auth');

module.exports = async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }

    // Parse path: /api/colleges/:path*
    let pathSegments = req.query.path || [];
    if (typeof pathSegments === 'string') {
        pathSegments = pathSegments.split('/');
    }

    // Route logic

    try {
        if (req.method === 'GET') {
            if (pathSegments.length === 0) {
                await nativeWrapper(collegeController.getColleges)(req, res);
            } else {
                const route = pathSegments[0];
                if (route === 'featured') {
                    await nativeWrapper(collegeController.getFeaturedColleges)(req, res);
                } else if (route === 'streams') {
                    // /api/colleges/streams/all
                    if (pathSegments[1] === 'all') {
                        await nativeWrapper(async (req, res) => {
                            const [streams] = await promisePool.query('SELECT stream_id, stream_name, stream_code, description FROM streams ORDER BY stream_id');
                            res.json({ data: streams });
                        })(req, res);
                    } else {
                        res.statusCode = 404;
                        res.end(JSON.stringify({ message: 'Stream route not found' }));
                    }
                } else if (route === 'search' && pathSegments[1] === 'autocomplete') {
                    await nativeWrapper(collegeController.autocompleteSearch)(req, res);
                } else {
                    // ID
                    req.params = { id: route };
                    await nativeWrapper(collegeController.getCollegeById)(req, res);
                }
            }
        } else if (req.method === 'POST') {
            if (pathSegments[0] === 'compare') {
                // Use optionalAuth middleware
                await nativeWrapper(async (req, res, next) => {
                    await optionalAuth(req, res, async () => {
                        await collegeController.compareColleges(req, res, next);
                    });
                })(req, res);
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: 'POST route not found' }));
            }
        } else {
            res.statusCode = 405;
            res.end(JSON.stringify({ message: 'Method not allowed' }));
        }
    } catch (error) {
        console.error('Unhandled College Error:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message }));
    }
};
