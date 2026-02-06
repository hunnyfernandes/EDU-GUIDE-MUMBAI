const app = require('../server');

// Ensure VERCEL environment variable is set
process.env.VERCEL = '1';

module.exports = app;
