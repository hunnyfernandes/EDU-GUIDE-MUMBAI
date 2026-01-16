const { processChatMessage, getAvailableProviders, getActiveProvider } = require('../services/chatbotService');

/**
 * @desc    Process chat message and get AI response
 * @route   POST /api/chatbot/message
 * @access  Public (can be made protected if needed)
 */
const sendMessage = async (req, res, next) => {
  try {
    const { message, conversation_id, conversation_history = [] } = req.body;

    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid message',
      });
    }

    // Limit message length
    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Message is too long. Please keep it under 1000 characters.',
      });
    }

    // Validate conversation history format
    let validHistory = [];
    if (Array.isArray(conversation_history)) {
      validHistory = conversation_history
        .slice(-10) // Limit to last 10 messages
        .filter(msg => msg.role && msg.content)
        .map(msg => ({
          role: msg.role === 'user' || msg.role === 'assistant' ? msg.role : 'user',
          content: String(msg.content).substring(0, 500), // Limit content length
        }));
    }

    // Get user ID if authenticated (optional)
    const userId = req.user ? req.user.user_id : null;

    // Process the chat message with conversation history
    const result = await processChatMessage(message.trim(), userId, validHistory, false);

    res.json({
      success: result.success,
      data: {
        message: result.message,
        suggestedPages: result.suggestedPages || [],
        suggestions: result.suggestions || [],
        conversation_id: conversation_id || null,
        provider: result.provider || null,
      },
    });
  } catch (error) {
    console.error('Chatbot controller error:', error);
    next(error);
  }
};

/**
 * @desc    Get chat history (if stored in database)
 * @route   GET /api/chatbot/history
 * @access  Protected (requires authentication)
 */
const getChatHistory = async (req, res, next) => {
  try {
    // This is optional - if you want to store chat history in database
    // For now, we'll return empty array as chat is stored in localStorage on frontend
    res.json({
      success: true,
      data: [],
      message: 'Chat history is stored locally in your browser',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get available AI providers and status
 * @route   GET /api/chatbot/providers
 * @access  Public
 */
const getProviders = async (req, res, next) => {
  try {
    const providers = getAvailableProviders();
    const activeProvider = getActiveProvider();

    res.json({
      success: true,
      data: {
        providers,
        active: activeProvider,
        available: providers.length > 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getProviders,
};
