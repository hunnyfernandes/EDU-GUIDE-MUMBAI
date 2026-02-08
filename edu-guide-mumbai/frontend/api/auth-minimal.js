// Minimal auth handler for testing
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Simple test endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Minimal auth handler is working',
            body: req.body,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/auth/test', (req, res) => {
    res.json({ message: 'Auth test endpoint works' });
});

module.exports = serverless(app);
