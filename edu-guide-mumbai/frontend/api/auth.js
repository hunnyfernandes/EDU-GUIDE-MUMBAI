const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow all origins in serverless to avoid CORS issues
        callback(null, true);
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Import only auth routes
const authRoutes = require('../routes/authRoutes');

// Mount auth routes at /api/auth to match the incoming request path
app.use('/api/auth', authRoutes);

// Health check
app.get('/test', (req, res) => {
    res.json({ message: 'Auth API is working', timestamp: new Date().toISOString() });
});

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
