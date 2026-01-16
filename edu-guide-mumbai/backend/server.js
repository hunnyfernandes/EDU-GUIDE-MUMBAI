const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require('cookie-parser');
require("dotenv").config();

// Validate environment variables before starting server
const { validateEnv } = require("./config/envValidator");
validateEnv();

const { testConnection } = require("./config/database");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const path = require("path");

// Swagger documentation
const { swaggerSpec, swaggerUi, swaggerOptions } = require("./config/swagger");

// Caching middleware
const { cacheMiddleware } = require("./middleware/cache");

// Import routes
const authRoutes = require("./routes/authRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    credentials: true,
  })
);

// Rate limiting - General API rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs (prevents brute force)
  message:
    "Too many authentication attempts from this IP, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

app.use("/api/", limiter);

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();

  // Log response when finished
  res.on("finish", () => {
    const responseTime = Date.now() - startTime;
    logger.request(req, res, responseTime);
  });

  next();
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger API Documentation
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerOptions)
);

// Test database connection
testConnection();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Edu Guide Mumbai API is running",
    timestamp: new Date().toISOString(),
  });
});

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Edu Guide Mumbai API",
    version: "1.0.0",
    documentation: "/api/docs",
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║   Edu Guide Mumbai API Server                 ║
║   Environment: ${process.env.NODE_ENV || "development"}                      ║
║   Port: ${PORT}                                  ║
║   URL: http://localhost:${PORT}                   ║
╚═══════════════════════════════════════════════╝
    `);
});

// Handle unhandled promise rejections