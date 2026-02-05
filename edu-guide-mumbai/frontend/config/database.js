const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool for better performance
// Optimized for Vercel Serverless environment
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'edu_guide_mumbai',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: process.env.DB_CONNECTION_LIMIT ? parseInt(process.env.DB_CONNECTION_LIMIT) : 5, // Lower limit for serverless
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 10000, // Fail fast (10s)
    acquireTimeout: 10000, // Fail fast if pool is full (10s)
    // Enable SSL for production/cloud databases
    ssl: (process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true') ? {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    } : undefined
});

// Get promise-based connection
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        // Don't exit process in Vercel/Serverless environment
        if (!process.env.VERCEL) {
             process.exit(1);
        }
    }
};

// Export
module.exports = { pool, promisePool, testConnection };

