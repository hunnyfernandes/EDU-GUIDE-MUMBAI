const nativeWrapper = require('../utils/nativeWrapper');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

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

    // Parse path
    // path can be string "login" or array ["verify-email"]
    let pathSegments = req.query.path || [];
    if (typeof pathSegments === 'string') {
        pathSegments = [pathSegments];
    }

    const route = pathSegments[0]; // "login", "register", etc.

    try {
        if (req.method === 'POST') {
            if (route === 'login') {
                await nativeWrapper(authController.login)(req, res);
            } else if (route === 'register') {
                await nativeWrapper(authController.register)(req, res);
            } else if (route === 'logout') {
                await nativeWrapper(authController.logout)(req, res);
            } else if (route === 'refresh-token') {
                await nativeWrapper(authController.refreshToken)(req, res);
            } else if (route === 'forgot-password') {
                await nativeWrapper(authController.forgotPassword)(req, res);
            } else if (route === 'reset-password') {
                await nativeWrapper(authController.resetPassword)(req, res);
            } else if (route === 'resend-verification') {
                // Middleware chain manually
                await nativeWrapper(async (req, res, next) => {
                    await verifyToken(req, res, async (err) => {
                        if (err) return next(err);
                        if (res.headersSent) return;
                        await authController.resendVerificationEmail(req, res, next);
                    });
                })(req, res);
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: 'Route not found' }));
            }
        } else if (req.method === 'GET') {
            if (route === 'me') {
                await nativeWrapper(async (req, res, next) => {
                    await verifyToken(req, res, async (err) => {
                        if (err) return next(err); // Middleware error
                        if (res.headersSent) return; // Middleware responded
                        await authController.getMe(req, res, next);
                    });
                })(req, res);
            } else if (route === 'verify-email') {
                await nativeWrapper(authController.verifyEmail)(req, res);
            } else if (route === 'test') {
                res.statusCode = 200;
                res.end(JSON.stringify({ message: 'Auth API working' }));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: 'Route not found' }));
            }
        } else if (req.method === 'PUT') {
            if (route === 'profile') {
                await nativeWrapper(async (req, res, next) => {
                    await verifyToken(req, res, async (err) => {
                        if (err) return next(err);
                        if (res.headersSent) return;
                        await authController.updateProfile(req, res, next);
                    });
                })(req, res);
            } else if (route === 'change-password') {
                await nativeWrapper(async (req, res, next) => {
                    await verifyToken(req, res, async (err) => {
                        if (err) return next(err);
                        if (res.headersSent) return;
                        await authController.changePassword(req, res, next);
                    });
                })(req, res);
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: 'Route not found' }));
            }
        } else {
            res.statusCode = 405;
            res.end(JSON.stringify({ message: 'Method not allowed' }));
        }
    } catch (error) {
        console.error('Unhandled Auth Error:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message }));
    }
};
