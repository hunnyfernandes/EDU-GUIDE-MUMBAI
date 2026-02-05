module.exports = (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: {
            node_env: process.env.NODE_ENV,
            has_db_host: !!process.env.DB_HOST,
            has_db_user: !!process.env.DB_USER,
            has_db_pass: !!process.env.DB_PASSWORD,
            vercel: process.env.VERCEL
        }
    });
};
