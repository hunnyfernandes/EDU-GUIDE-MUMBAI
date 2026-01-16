# API Keys Setup Guide

Quick reference for setting up OpenAI (ChatGPT) and Google Gemini API keys for the chatbot.

## Quick Start

### 1. Create `.env` file in `backend/` directory

If you don't have one, copy from `.env.example`:
```bash
cd backend
cp .env.example .env
```

### 2. Add API Keys to `.env`

Open `backend/.env` and add your API keys:

```env
# OpenAI (ChatGPT) - Get key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...your-key-here...

# Google Gemini - Get key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AI...your-key-here...

# Choose which provider to use (optional, defaults to openai)
AI_PROVIDER=openai
```

### 3. Restart Backend Server

After adding API keys, restart your backend server:
```bash
cd backend
npm run dev
```

You should see initialization messages:
```
✅ OpenAI (ChatGPT) initialized
✅ Google Gemini (gemini-pro) initialized
```

## Getting OpenAI (ChatGPT) API Key

### Step-by-Step

1. **Visit OpenAI Platform**: https://platform.openai.com/
2. **Sign Up / Log In**: Create an account or sign in
3. **Add Payment Method** (required for API usage):
   - Go to Settings → Billing
   - Add a payment method (credit card)
   - Note: Free tier provides $5 credit initially
4. **Create API Key**:
   - Navigate to: https://platform.openai.com/api-keys
   - Click **"Create new secret key"**
   - Give it a name (e.g., "Edu Guide Mumbai")
   - Click **"Create secret key"**
   - **IMPORTANT**: Copy the key immediately (starts with `sk-`)
   - You won't be able to see it again!

### Pricing (as of 2024)
- **GPT-3.5-turbo**: $0.0015 per 1K input tokens, $0.002 per 1K output tokens
- **GPT-4**: More expensive, check current pricing at https://openai.com/pricing

### Free Tier
- New users get $5 free credit
- Expires after 3 months

---

## Getting Google Gemini API Key

### Step-by-Step

1. **Visit Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Sign In**: Use your Google account
3. **Create API Key**:
   - Click **"Create API Key"** or **"Get API Key"**
   - Select a Google Cloud project (or create new one)
   - The API key will be generated and displayed
   - Copy the key (starts with `AI`)

### Free Tier
- **Generous Free Tier**: 60 requests per minute
- No credit card required initially
- More information: https://ai.google.dev/pricing

### Pricing
- **Gemini Pro**: Free tier available, paid plans available
- Check current pricing: https://ai.google.dev/pricing

---

## Configuration Options

### Model Selection

#### OpenAI Models
```env
OPENAI_MODEL=gpt-3.5-turbo    # Fast, cost-effective (recommended)
OPENAI_MODEL=gpt-4            # More capable, slower, expensive
OPENAI_MODEL=gpt-4-turbo      # Latest GPT-4, improved performance
```

#### Gemini Models
```env
GEMINI_MODEL=gemini-pro           # Text generation (recommended)
GEMINI_MODEL=gemini-pro-vision    # Text + image understanding
```

### Provider Selection

If you have both API keys configured:

```env
# Use OpenAI (ChatGPT) as primary
AI_PROVIDER=openai

# Use Google Gemini as primary
AI_PROVIDER=gemini
```

**Fallback Behavior**: If the selected provider fails, the system will automatically try the other provider if available.

---

## Verification

### Check Provider Status

After starting your backend server, check which providers are available:

**Via Browser:**
```
http://localhost:5002/api/chatbot/providers
```

**Via cURL:**
```bash
curl http://localhost:5002/api/chatbot/providers
```

**Expected Response:**
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

### Test Chatbot

1. Start your frontend: `cd frontend && npm start`
2. Open the chatbot widget (floating button in bottom-right)
3. Ask a question: "Tell me about colleges in Mumbai"
4. Check the response - it should be AI-generated if API keys are working

---

## Troubleshooting

### OpenAI Issues

**Error: "OpenAI client not initialized"**
- Check if `OPENAI_API_KEY` is set in `.env`
- Verify the key starts with `sk-`
- Restart backend server after adding key

**Error: "Insufficient quota"**
- Check your OpenAI billing: https://platform.openai.com/account/billing
- Add credits if needed
- Check usage limits

**Error: "Invalid API key"**
- Verify the key is correct (no extra spaces)
- Regenerate key if needed
- Make sure key hasn't been revoked

### Gemini Issues

**Error: "Gemini client not initialized"**
- Check if `GEMINI_API_KEY` is set in `.env`
- Verify the key starts with `AI`
- Restart backend server after adding key

**Error: "API key not valid"**
- Verify the key is correct
- Check if API is enabled in Google Cloud Console
- Regenerate key if needed

**Error: "Quota exceeded"**
- Check your usage limits
- Free tier: 60 requests per minute
- Wait a minute or upgrade your plan

### General Issues

**No providers available**
- Check backend logs for initialization messages
- Verify at least one API key is configured
- Check `.env` file is in `backend/` directory
- Ensure no typos in environment variable names

**Provider fallback not working**
- Check that both API keys are valid
- Verify both providers initialize in logs
- Check error messages in backend console

---

## Security Best Practices

### 🔒 Keep API Keys Secure

1. **Never commit `.env` to git**
   - `.env` should be in `.gitignore`
   - Use `.env.example` for documentation (without actual keys)

2. **Use Environment Variables**
   - Never hardcode keys in code
   - Use environment variables only

3. **Rotate Keys Regularly**
   - Regenerate keys periodically
   - Revoke old keys if compromised

4. **Limit Key Permissions**
   - Use keys with minimal required permissions
   - Don't share keys between projects unnecessarily

5. **Monitor Usage**
   - Set up billing alerts
   - Monitor API usage regularly
   - Check for unusual activity

---

## Cost Optimization Tips

### OpenAI
- Use `gpt-3.5-turbo` for most queries (cheaper)
- Use `gpt-4` only for complex queries
- Monitor token usage in OpenAI dashboard
- Set usage limits in OpenAI dashboard

### Gemini
- Take advantage of free tier (60 req/min)
- Monitor usage in Google Cloud Console
- Use `gemini-pro` (not vision) for text-only queries

### General
- Cache responses when possible
- Use database search first, AI second
- Implement rate limiting (already included)
- Monitor chat logs for patterns

---

## Need Help?

- **OpenAI Support**: https://help.openai.com/
- **Gemini Support**: https://ai.google.dev/docs
- **Project Issues**: Check backend logs and browser console
- **API Status**: 
  - OpenAI: https://status.openai.com/
  - Google Cloud: https://status.cloud.google.com/
