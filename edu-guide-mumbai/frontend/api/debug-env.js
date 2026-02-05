const express = require('express');
const app = express();

app.get('*', (req, res) => {
  res.json({
    env_check: {
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER, // Be careful exposing this, but for debugging it's needed
      DB_NAME: process.env.DB_NAME,
      VERCEL: process.env.VERCEL,
      NODE_ENV: process.env.NODE_ENV
    }
  });
});

module.exports = app;
