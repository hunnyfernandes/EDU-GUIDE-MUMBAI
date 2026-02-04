/**
 * Logger utility for application logging
 * Uses console for now, can be extended to use winston or other logging libraries
 */

const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const currentLogLevel =
  process.env.LOG_LEVEL ||
  (process.env.NODE_ENV === "production" ? "INFO" : "DEBUG");

const shouldLog = (level) => {
  return logLevels[level] <= logLevels[currentLogLevel];
};

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaStr =
    Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
};

const logger = {
  error: (message, meta = {}) => {
    if (shouldLog("ERROR")) {
      console.error(formatMessage("ERROR", message, meta));
    }
  },

  warn: (message, meta = {}) => {
    if (shouldLog("WARN")) {
      console.warn(formatMessage("WARN", message, meta));
    }
  },

  info: (message, meta = {}) => {
    if (shouldLog("INFO")) {
      console.log(formatMessage("INFO", message, meta));
    }
  },

  debug: (message, meta = {}) => {
    if (shouldLog("DEBUG")) {
      console.log(formatMessage("DEBUG", message, meta));
    }
  },

  // Request logging helper
  request: (req, res, responseTime) => {
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.connection.remoteAddress,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get("user-agent"),
    };

    // Add user info if authenticated
    if (req.user) {
      logData.userId = req.user.user_id;
      logData.userEmail = req.user.email;
    }

    if (res.statusCode >= 400) {
      logger.warn("HTTP Request", logData);
    } else {
      logger.info("HTTP Request", logData);
    }
  },

  // Error logging helper
  errorWithContext: (error, req = null) => {
    const errorData = {
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      name: error.name,
    };

    if (req) {
      errorData.request = {
        method: req.method,
        url: req.originalUrl || req.url,
        ip: req.ip || req.connection.remoteAddress,
        body: req.body,
        params: req.params,
        query: req.query,
      };

      if (req.user) {
        errorData.userId = req.user.user_id;
      }
    }

    logger.error("Application Error", errorData);
  },
};

module.exports = logger;










