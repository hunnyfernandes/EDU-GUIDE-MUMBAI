# Chatbot Setup Guide

This guide explains how to set up and configure the AI-powered chatbot for Edu Guide Mumbai.

## Overview

The chatbot is an AI-powered assistant that helps users find information about colleges, courses, admissions, and placements in Mumbai. It uses OpenAI's API (or similar AI services) to provide intelligent responses based on your database content.

## Features

### Core Features

- **Advanced AI-Powered Chat**: ChatGPT-like interface with intelligent responses
- **Intelligent Query Handling**: Answers questions about colleges, courses, admission processes, placements, etc.
- **Database Integration**: Searches your database for relevant information before generating responses
- **Conversation Context**: Maintains conversation history for better context-aware responses
- **Fallback Mechanism**: If information isn't found, suggests relevant website pages

### Advanced UI/UX Features

- **ChatGPT-Style Interface**: Modern, clean UI similar to ChatGPT
- **Rich Markdown Rendering**: Full markdown support with syntax highlighting for code blocks
- **Message Actions**:
  - Copy messages to clipboard
  - Edit and resend user messages
  - Regenerate assistant responses
  - Like/Dislike feedback buttons
- **Suggested Follow-up Questions**: AI-generated suggestions for next questions
- **Stop Generation**: Ability to stop AI response generation mid-stream
- **New Chat**: Start fresh conversations
- **Message History**: Persistent chat history saved in browser localStorage

### User Experience

- **Floating Widget**: Accessible from any page via a floating chat button
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Polished transitions and animations
- **Dark Mode Support**: Full dark mode compatibility
- **Keyboard Shortcuts**: Enter to send, Escape to cancel edit
- **Auto-scroll**: Automatically scrolls to latest messages
- **Typing Indicators**: Shows when AI is processing

## Setup Instructions

### 1. Install Dependencies

The OpenAI package has already been installed. If you need to reinstall:

```bash
cd backend
npm install openai
```

### 2. Configure Environment Variables

Add the following environment variables to your `backend/.env` file:

```env
# ============================================
# AI Provider Configuration (Choose one or both)
# ============================================

# OpenAI (ChatGPT) Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo  # Options: gpt-3.5-turbo, gpt-4, gpt-4-turbo

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro  # Options: gemini-pro, gemini-pro-vision

# Preferred AI Provider (if both are configured)
AI_PROVIDER=openai  # Options: 'openai' or 'gemini' (defaults to 'openai')

# Optional: Enable chat logging to database
LOG_CHAT_ENABLED=false
```

### 3. Get API Keys

#### Option A: OpenAI (ChatGPT) API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section (https://platform.openai.com/api-keys)
4. Click **"Create new secret key"**
5. Copy the key and add it to your `.env` file as `OPENAI_API_KEY`
6. **Important**: Save the key immediately as it won't be shown again

**Available Models:**

- `gpt-3.5-turbo` - Fast and cost-effective (recommended)
- `gpt-4` - More capable but slower and more expensive
- `gpt-4-turbo` - Latest GPT-4 model with improved performance

#### Option B: Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Select or create a Google Cloud project
5. Copy the API key and add it to your `.env` file as `GEMINI_API_KEY`

**Available Models:**

- `gemini-pro` - Text generation (recommended)
- `gemini-pro-vision` - Text + image understanding

**Note**:

- You can configure both API keys to have a fallback option
- The chatbot will use the provider specified in `AI_PROVIDER` (defaults to 'openai')
- If the selected provider fails, it will automatically fallback to the other provider if available
- The chatbot will still work without API keys, but it will provide fallback responses directing users to website pages instead of AI-generated answers

### 4. Database Migration (Optional)

If you want to enable chat logging for analytics, run the migration:

```bash
mysql -u root -p edu_guide_mumbai < database/migrations/003_add_chatbot_support.sql
```

Then set `LOG_CHAT_ENABLED=true` in your `.env` file.

### 5. Start the Application

Start both backend and frontend servers:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

The chatbot widget will appear as a floating button in the bottom-right corner of all pages.

## How It Works

1. **User Query**: User asks a question through the chat widget
2. **Database Search**: Backend searches database for relevant information (colleges, courses, admission info, placements)
3. **Context Extraction**: Relevant information is extracted and formatted
4. **AI Processing**: Query + context is sent to OpenAI API for intelligent response generation
5. **Response Delivery**: Formatted response with relevant links is returned to the user
6. **Fallback**: If no database match or AI fails, user is directed to relevant website pages

## Chatbot Capabilities

The advanced chatbot can answer questions about:

- **College Information**: "Tell me about X college", "What courses does Y college offer?"
- **Courses**: "What are the fees for B.Com?", "Which colleges offer Engineering?"
- **Admission**: "How do I apply to X college?", "What are the cutoffs?"
- **Placements**: "What is the placement rate?", "Which companies recruit from X?"
- **General Navigation**: "How do I compare colleges?", "How to save colleges?"

### Advanced Capabilities

- **Context-Aware Conversations**: Remembers previous messages in the conversation
- **Intelligent Follow-ups**: Suggests relevant questions based on current conversation
- **Detailed Responses**: Provides comprehensive answers with formatted markdown
- **Code/Data Formatting**: Displays structured information in code blocks when helpful
- **Multi-step Conversations**: Handles complex multi-turn conversations

## Customization

### Change AI Provider or Model

#### Switch Between Providers

Edit `backend/.env`:

```env
# Choose preferred provider (if both are configured)
AI_PROVIDER=gemini  # Options: 'openai' or 'gemini'
```

#### Change OpenAI Model

Edit `backend/.env`:

```env
OPENAI_MODEL=gpt-4  # Options: gpt-3.5-turbo, gpt-4, gpt-4-turbo
```

#### Change Gemini Model

Edit `backend/.env`:

```env
GEMINI_MODEL=gemini-pro-vision  # Options: gemini-pro, gemini-pro-vision
```

**Note**: Restart your backend server after changing environment variables.

### Adjust Rate Limiting

Edit `backend/routes/chatbotRoutes.js` to modify rate limits:

```javascript
const chatbotLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // Time window
  max: 20, // Max requests per window
  // ...
});
```

### Customize Prompts

Edit `backend/services/chatbotService.js` to customize the AI prompt:

- `systemPrompt`: System instructions for the AI
- `userPrompt`: Format for user queries with context

## Troubleshooting

### Chatbot Not Responding

1. **Check API Keys**: Verify that at least one API key is set in `.env`:
   - `OPENAI_API_KEY` for ChatGPT
   - `GEMINI_API_KEY` for Gemini
2. **Verify API Key Validity**:
   - OpenAI: Check your API key at https://platform.openai.com/api-keys
   - Gemini: Check your API key at https://makersuite.google.com/app/apikey
3. **Check Credits/Billing**:
   - OpenAI: Ensure you have credits in your OpenAI account
   - Gemini: Verify your Google Cloud billing is enabled (free tier available)
4. **Check Backend Logs**: Look for initialization messages:
   - `✅ OpenAI (ChatGPT) initialized` - OpenAI is ready
   - `✅ Google Gemini (gemini-pro) initialized` - Gemini is ready
5. **Check Active Provider**: Visit `/api/chatbot/providers` endpoint to see which provider is active
6. **Rate Limiting**: Ensure rate limiting isn't blocking requests
7. **Fallback**: If one provider fails, the system will automatically try the other if available

### Responses Are Too Generic

- Ensure your database has sufficient data
- Check if the database search is finding relevant results
- Adjust the AI prompt in `chatbotService.js` for more specific responses

### Widget Not Appearing

1. Check browser console for errors
2. Verify `ChatbotWidget` is imported in `App.jsx`
3. Check if there are CSS conflicts
4. Clear browser cache and reload

## Security Considerations

- **API Key Security**: Never expose `OPENAI_API_KEY` in frontend code
- **Rate Limiting**: Rate limits are in place to prevent abuse
- **Input Validation**: User inputs are validated and sanitized
- **Error Handling**: Errors are handled gracefully without exposing sensitive information

## Future Enhancements

Possible future improvements:

- Conversation context persistence (database storage)
- Admin analytics dashboard for chat logs
- Predefined quick response buttons
- Multi-language support
- Voice input/output
- Integration with search history for personalized responses

## Support

For issues or questions, please check:

- **Backend Logs**: Check console for initialization and error messages
- **Browser Console**: Check for frontend errors in browser DevTools
- **API Status Pages**:
  - OpenAI Status: https://status.openai.com/
  - Google Cloud Status: https://status.cloud.google.com/
- **Provider Status**: Call `GET /api/chatbot/providers` to check available providers
- **API Documentation**:
  - OpenAI: https://platform.openai.com/docs
  - Gemini: https://ai.google.dev/docs

## API Endpoints

### Get Available Providers

```
GET /api/chatbot/providers
```

Response:

```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "name": "openai",
        "label": "OpenAI (ChatGPT)",
        "model": "gpt-3.5-turbo"
      },
      {
        "name": "gemini",
        "label": "Google Gemini",
        "model": "gemini-pro"
      }
    ],
    "active": "openai",
    "available": true
  }
}
```
