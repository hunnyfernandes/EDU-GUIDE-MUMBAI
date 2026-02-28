const serverless = require('serverless-http');
const express = require('express');

// Ensure VERCEL environment variable is set to prevent app.listen() in server.js
process.env.VERCEL = '1';

let app;
let startupError = null;

try {
  // Try to load the main application
  app = require('../server');
} catch (err) {
  console.error("CRITICAL: Failed to load server.js:", err);
  startupError = err;
  
  // Create a fallback app to report the error
  app = express();
  app.use(express.json());
}

// If the main app failed to load, add a catch-all route to report the error
if (startupError) {
  app.all('*', (req, res) => {
    res.status(500).json({
      success: false,
      error: 'Server Initialization Failed',
      message: startupError.message,
      stack: process.env.NODE_ENV === 'development' ? startupError.stack : undefined,
      timestamp: new Date().toISOString()
    });
  });
}

// Export the serverless handler
module.exports = serverless(app);
