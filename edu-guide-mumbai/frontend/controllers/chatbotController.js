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

    // Validate and extract conversation history
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

    console.log(`📨 Chatbot request: "${message.substring(0, 50)}..."`);

    // Add timeout (5s - fail fast and use our inline fallback rather than letting Vercel timeout)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Chatbot timeout')), 5000)
    );

    // Process the chat message with conversation history
    const result = await Promise.race([
      processChatMessage(message.trim(), userId, validHistory, false),
      timeoutPromise
    ]);

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
    console.error('Chatbot controller error:', error.message);

    // NEVER return a 500 error for chatbot - always return a helpful fallback
    const { message: userMsg, conversation_id } = req.body || {};
    const query = (userMsg || '').toLowerCase();

    let fallbackMsg = "I can help you with college recommendations, fees, admissions, and scholarships in Mumbai. What would you like to know?";

    if (/\b(hello|hi|hey|namaste)\b/.test(query)) {
      fallbackMsg = "Hello! 👋 I'm EduBot, your college advisor for Mumbai & Maharashtra. I can help you with:\n\n• 🏫 Finding colleges by stream\n• 💰 Fees & scholarship info\n• 📋 Admission processes\n• 📊 Comparing colleges\n\nWhat would you like to know?";
    } else if (/\b(engineer|btech|cse|iit)\b/.test(query)) {
      fallbackMsg = "🏗️ **Top Engineering Colleges in Mumbai:**\n\n• **IIT Bombay** – JEE Advanced required\n• **VJTI** – Govt. college, MHT-CET\n• **DJ Sanghvi** – Known for CS & IT\n• **SPCE** – Well-regarded\n\n📌 Admission via JEE Main / MHT-CET\n💰 Govt: ₹5K-30K/yr | Private: ₹1-3L/yr";
    } else if (/\b(medical|mbbs|neet|doctor)\b/.test(query)) {
      fallbackMsg = "🏥 **Top Medical Colleges in Mumbai:**\n\n• **KEM Hospital** – Top govt. medical college\n• **Grant Medical College** – Prestigious\n• **Sion Hospital** – Well-known\n\n📌 Admission via NEET UG\n💰 Govt: ₹15K-50K/yr | Private: ₹5-20L/yr";
    } else if (/\b(commerce|bcom|ca)\b/.test(query)) {
      fallbackMsg = "📊 **Top Commerce Colleges in Mumbai:**\n\n• **Sydenham College**\n• **HR College**\n• **Jai Hind College**\n• **NM College**\n\n📌 Admission based on HSC merit\n💰 ₹10K-1L/yr";
    } else if (/\b(fee|fees|cost|scholarship)\b/.test(query)) {
      fallbackMsg = "💰 **College Fees in Mumbai:**\n\n• Government: ₹5,000 – ₹30,000/year\n• Aided: ₹10,000 – ₹60,000/year\n• Private: ₹50,000 – ₹3,00,000/year\n\n🎓 Scholarships available for SC/ST/OBC and merit-based";
    } else if (/\b(admission|apply|entrance|cutoff)\b/.test(query)) {
      fallbackMsg = "📋 **Admission Processes:**\n\n• Engineering: JEE/MHT-CET\n• Medical: NEET\n• Arts/Commerce/Science: HSC merit\n• Law: CLAT/MH-CET Law\n\n📅 MHT-CET usually in May-June, CAP rounds in July-August";
    }

    res.json({
      success: true,
      data: {
        message: fallbackMsg,
        suggestedPages: [
          { label: 'Browse All Colleges', path: '/colleges' },
          { label: 'Compare Colleges', path: '/compare' },
        ],
        suggestions: [
          'Tell me about engineering colleges',
          'What are the fees?',
          'How do admissions work?'
        ],
        conversation_id: conversation_id || null,
        provider: 'fallback',
      },
    });
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
