const logger = require("../utils/logger");

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  logger.errorWithContext(err, req);

  // Standardized error response structure
  let error = {
    success: false,
    message: err.message || "Server Error",
    statusCode: err.statusCode || 500,
    errors: err.errors || undefined, // For validation errors with multiple fields
  };

  // MySQL errors
  if (err.code === "ER_DUP_ENTRY") {
    error.message = "Duplicate entry. Resource already exists.";
    error.statusCode = 400;
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    error.message = "Referenced resource not found.";
    error.statusCode = 404;
  }

  if (err.code === "ER_BAD_FIELD_ERROR") {
    error.message = "Invalid field in query.";
    error.statusCode = 400;
  }

  if (err.code === "ER_PARSE_ERROR") {
    error.message = "Database query error.";
    error.statusCode = 500;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token.";
    error.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token has expired.";
    error.statusCode = 401;
  }

  // Validation errors (from express-validator or custom)
  if (err.name === "ValidationError") {
    error.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    error.statusCode = 400;
  }

  // Cast errors (e.g., invalid ObjectId in MongoDB, but also useful for invalid IDs)
  if (err.name === "CastError") {
    error.message = "Invalid ID format.";
    error.statusCode = 400;
  }

  // Build response object
  const response = {
    success: error.success,
    message: error.message,
  };

  // Add errors array if present (for validation errors with multiple fields)
  if (error.errors) {
    response.errors = error.errors;
  }

  // Add stack trace in development only
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  // Send error response
  res.status(error.statusCode).json(response);
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
