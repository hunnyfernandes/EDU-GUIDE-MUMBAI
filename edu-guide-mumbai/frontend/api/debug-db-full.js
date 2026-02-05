const { pool } = require('../config/database');

module.exports = async (req, res) => {
    const start = Date.now();
    
    // Set a hard timeout for the serverless function response
    const timeout = setTimeout(() => {
        if (!res.headersSent) {
            res.status(504).json({
                status: 'error',
                message: 'Request timed out after 15 seconds',
                duration: `${Date.now() - start}ms`
            });
        }
    }, 15000);

    try {
        console.log(`[Debug DB] Attempting connection... (Env: ${process.env.NODE_ENV})`);
        
        // 1. Check Env Vars (Masked)
        const envCheck = {
            hasHost: !!process.env.DB_HOST,
            hostLength: process.env.DB_HOST ? process.env.DB_HOST.length : 0,
            hasUser: !!process.env.DB_USER,
            userPrefix: process.env.DB_USER ? process.env.DB_USER.split('.')[0] : 'N/A',
            hasPass: !!process.env.DB_PASSWORD
        };

        // 2. Test Connection
        const connection = await pool.getConnection();
        console.log('[Debug DB] Connection acquired');
        
        // 3. Run Query
        const [rows] = await connection.query('SELECT 1 + 1 AS result');
        const [tables] = await connection.query('SHOW TABLES');
        
        connection.release();
        clearTimeout(timeout);

        res.status(200).json({
            status: 'success',
            message: 'Database connected successfully',
            duration: `${Date.now() - start}ms`,
            result: rows[0].result,
            tableCount: tables.length,
            tables: tables.map(t => Object.values(t)[0]),
            envCheck
        });

    } catch (error) {
        clearTimeout(timeout);
        console.error('[Debug DB] Error:', error);
        
        res.status(500).json({
            status: 'error',
            message: error.message,
            code: error.code,
            duration: `${Date.now() - start}ms`,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};