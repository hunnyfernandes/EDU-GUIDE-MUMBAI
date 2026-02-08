const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true,
}));
app.use(express.json());

// Import only college routes
const collegeRoutes = require('../routes/collegeRoutes');

// Mount college routes at /api/colleges to match the incoming request path
app.use('/api/colleges', collegeRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

module.exports = serverless(app);
