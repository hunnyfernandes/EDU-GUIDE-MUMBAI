const nativeWrapper = require('../utils/nativeWrapper');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// Helper to wrap protected routes
const protectedRoute = (handler) => async (req, res, next) => {
    await verifyToken(req, res, async (err) => {
        if (err) return next(err);
        if (res.headersSent) return;
        await handler(req, res, next);
    });
};

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

    // Parse path: /api/user/:path*
    let pathSegments = req.query.path || [];
    if (typeof pathSegments === 'string') {
        pathSegments = pathSegments.split('/');
    }

    // Route logic
    const route = pathSegments[0];
    const subRoute = pathSegments[1];

    try {
        if (req.method === 'GET') {
            if (route === 'dashboard') {
                await nativeWrapper(protectedRoute(userController.getDashboard))(req, res);
            } else if (route === 'saved-colleges') {
                if (subRoute === 'check') {
                    // /saved-colleges/check/:id
                    req.params = { collegeId: pathSegments[2] };
                    await nativeWrapper(protectedRoute(userController.checkSavedCollege))(req, res);
                } else {
                    await nativeWrapper(protectedRoute(userController.getSavedColleges))(req, res);
                }
            } else if (route === 'search-history') {
                await nativeWrapper(protectedRoute(userController.getSearchHistory))(req, res);
            } else if (route === 'view-history') {
                await nativeWrapper(protectedRoute(userController.getViewHistory))(req, res);
            } else if (route === 'history') {
                await nativeWrapper(protectedRoute(userController.getCombinedHistory))(req, res);
            } else if (route === 'popular-searches') {
                // Public route
                await nativeWrapper(userController.getPopularSearches)(req, res);
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: 'User route not found' }));
            }
        } else if (req.method === 'POST') {
            if (route === 'saved-colleges') {
                await nativeWrapper(protectedRoute(userController.saveCollege))(req, res);
            } else if (route === 'search-history') {
                await nativeWrapper(protectedRoute(userController.logSearch))(req, res);
            } else if (route === 'view-history') {
                await nativeWrapper(protectedRoute(userController.logView))(req, res);
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: 'User POST route not found' }));
            }
        } else if (req.method === 'DELETE') {
            if (route === 'saved-colleges') {
                // /saved-colleges/:id
                req.params = { collegeId: subRoute };
                await nativeWrapper(protectedRoute(userController.removeSavedCollege))(req, res);
            } else if (route === 'search-history') {
                await nativeWrapper(protectedRoute(userController.clearSearchHistory))(req, res);
            } else if (route === 'view-history') {
                await nativeWrapper(protectedRoute(userController.clearViewHistory))(req, res);
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: 'User DELETE route not found' }));
            }
        } else {
            res.statusCode = 405;
            res.end(JSON.stringify({ message: 'Method not allowed' }));
        }
    } catch (error) {
        console.error('Unhandled User API Error:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message }));
    }
};
