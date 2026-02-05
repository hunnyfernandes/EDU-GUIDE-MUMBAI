const { promisePool } = require('../config/database');

module.exports = async (req, res) => {
    let dbStatus = 'unknown';
    let dbError = null;

    try {
        const connection = await promisePool.getConnection();
        await connection.ping();
        connection.release();
        dbStatus = 'connected';
    } catch (error) {
        dbStatus = 'disconnected';
        dbError = {
            message: error.message,
            code: error.code,
            errno: error.errno,
            hostname: error.hostname
        };
    }

    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: {
            status: dbStatus,
            config: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER, // It's okay to show user
                database: process.env.DB_NAME,
                ssl: process.env.DB_SSL
            },
            error: dbError
        },
        env_vars: {
            has_jwt_secret: !!process.env.JWT_SECRET,
            has_ai_key: !!process.env.GEMINI_API_KEY
        }
    });
};
