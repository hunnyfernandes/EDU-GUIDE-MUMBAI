const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

app.get('*', async (req, res) => {
  const envCheck = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_SSL: process.env.DB_SSL,
    VERCEL: process.env.VERCEL,
    NODE_ENV: process.env.NODE_ENV
  };

  let dbStatus = 'Not tested';
  let dbError = null;

  try {
    if (process.env.DB_HOST) {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 4000,
        ssl: { rejectUnauthorized: false },
        connectTimeout: 5000 // 5 seconds timeout
      });
      
      await connection.ping();
      await connection.end();
      dbStatus = 'Connected successfully';
    } else {
      dbStatus = 'Skipped (Missing DB_HOST)';
    }
  } catch (err) {
    dbStatus = 'Connection Failed';
    dbError = {
      message: err.message,
      code: err.code,
      syscall: err.syscall,
      hostname: err.hostname
    };
  }

  res.json({
    timestamp: new Date().toISOString(),
    env_check: envCheck,
    db_test: {
      status: dbStatus,
      error: dbError
    }
  });
});

module.exports = app;
