const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, getProviders } = require('../controllers/chatbotController');
const { optionalAuth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for chatbot endpoint (prevent abuse)
const chatbotLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per minute
  message: 'Too many chat requests. Please wait a moment before trying again.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Chatbot routes
router.get('/providers', getProviders); // Get available AI providers
router.post('/message', chatbotLimiter, optionalAuth, sendMessage);
router.get('/history', optionalAuth, getChatHistory); // Optional: if you want to store history in DB

module.exports = router;
