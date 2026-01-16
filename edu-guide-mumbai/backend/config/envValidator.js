/**
 * Environment variable validation
 * Ensures all required environment variables are present before server starts
 */

const requiredEnvVars = {
  // Database
  DB_HOST: "Database host",
  DB_USER: "Database user",
  DB_PASSWORD: "Database password",
  DB_NAME: "Database name",

  // JWT
  JWT_SECRET: "JWT secret key for token generation",

  // Server
  PORT: "Server port (optional, defaults to 5000)",
  NODE_ENV: "Node environment (optional, defaults to development)",
};

const optionalEnvVars = {
  CLIENT_URL: "Frontend client URL for CORS",
  JWT_EXPIRE: "JWT expiration time",
  DB_PORT: "Database port",
  // Email configuration (optional - uses console logging in development)
  SMTP_HOST: "SMTP server host",
  SMTP_PORT: "SMTP server port",
  SMTP_SECURE: "Use secure connection (true/false)",
  SMTP_USER: "SMTP username",
  SMTP_PASSWORD: "SMTP password",
  SMTP_FROM: "Email sender address",
  // AI Chatbot configuration (optional - chatbot will use fallback responses if not set)
  // OpenAI (ChatGPT) Configuration
  OPENAI_API_KEY: "OpenAI API key for ChatGPT (ChatGPT)",
  OPENAI_MODEL: "OpenAI model to use (defaults to 'gpt-3.5-turbo', options: gpt-3.5-turbo, gpt-4, gpt-4-turbo)",
  // Google Gemini Configuration
  GEMINI_API_KEY: "Google Gemini API key for Gemini AI",
  GEMINI_MODEL: "Gemini model to use (defaults to 'gemini-pro', options: gemini-pro, gemini-pro-vision)",
  // General AI Configuration
  AI_PROVIDER: "Preferred AI provider: 'openai' or 'gemini' (defaults to 'openai' if both are available)",
  LOG_CHAT_ENABLED: "Enable chat logging to database (set to 'true' to enable)",
};

/**
 * Validates that all required environment variables are set
 * @throws {Error} If any required environment variable is missing
 */
const validateEnv = () => {
  const missing = [];
  const warnings = [];

  // Check required variables
  for (const [varName, description] of Object.entries(requiredEnvVars)) {
    if (!process.env[varName]) {
      missing.push({ varName, description });
    }
  }

  // Check optional but recommended variables
  for (const [varName, description] of Object.entries(optionalEnvVars)) {
    if (!process.env[varName]) {
      warnings.push({ varName, description });
    }
  }

  // Throw error if required variables are missing
  if (missing.length > 0) {
    console.error("\n❌ Missing required environment variables:\n");
    missing.forEach(({ varName, description }) => {
      console.error(`  - ${varName}: ${description}`);
    });
    console.error("\nPlease create a .env file with these variables.\n");
    throw new Error(
      `Missing ${missing.length} required environment variable(s)`
    );
  }

  // Show warnings for optional variables
  if (warnings.length > 0 && process.env.NODE_ENV !== "production") {
    console.warn("\n⚠️  Missing optional environment variables:\n");
    warnings.forEach(({ varName, description }) => {
      console.warn(`  - ${varName}: ${description}`);
    });
    console.warn("\nThese are optional but recommended for production.\n");
  }

  // Validate specific formats
  validateFormats();

  console.log("✅ Environment variables validated successfully");
};

/**
 * Validates format of specific environment variables
 */
const validateFormats = () => {
  // Validate CLIENT_URL if provided
  if (process.env.CLIENT_URL) {
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(process.env.CLIENT_URL)) {
      throw new Error("CLIENT_URL must be a valid HTTP/HTTPS URL");
    }

    // Warn if wildcard in production
    if (
      process.env.NODE_ENV === "production" &&
      process.env.CLIENT_URL === "*"
    ) {
      console.warn(
        '⚠️  WARNING: CLIENT_URL is set to "*" in production. This is not recommended for security.'
      );
    }
  }

  // Validate NODE_ENV
  if (
    process.env.NODE_ENV &&
    !["development", "production", "test"].includes(process.env.NODE_ENV)
  ) {
    console.warn(
      `⚠️  WARNING: NODE_ENV="${process.env.NODE_ENV}" is not a standard value. Use 'development', 'production', or 'test'.`
    );
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(
      "⚠️  WARNING: JWT_SECRET should be at least 32 characters long for security."
    );
  }
};

module.exports = {
  validateEnv,
  requiredEnvVars,
  optionalEnvVars,
};
