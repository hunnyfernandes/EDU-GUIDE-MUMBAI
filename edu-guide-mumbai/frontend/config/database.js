const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool for better performance
// Optimized for Vercel Serverless environment
console.log('Initializing MySQL Pool...');
const pool = mysql.createPool({
    // HARDCODED CREDENTIALS FOR VERCEL DEPLOYMENT - DO NOT COMMIT TO PUBLIC REPO PERMANENTLY
    host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    user: '2ST8jsi8rqo9KYA.root',
    password: 'nmPYTeOZXv4gkfP0',
    database: 'test',
    port: 4000,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 20000, // Increased timeout
    acquireTimeout: 20000,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
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

