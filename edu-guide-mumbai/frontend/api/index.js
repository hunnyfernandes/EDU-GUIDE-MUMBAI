const serverless = require('serverless-http');
const express = require('express');

const app = express();

// Log every request
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: "ok", 
        source: "api/index.js",
        path: req.path,
        baseUrl: req.baseUrl,
        originalUrl: req.originalUrl
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: "ok", 
        source: "api/index.js",
        path: req.path,
        note: "Matched /health without /api prefix"
    });
});

// Catch-all to see what's happening
app.use((req, res) => {
    console.log(`404: ${req.url}`);
    res.status(404).json({
        error: "Not Found",
        path: req.path,
        method: req.method,
        originalUrl: req.originalUrl
    });
});

module.exports = serverless(app);
