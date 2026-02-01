const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require('cookie-parser');
require("dotenv").config();



const { testConnection } = require("./config/database");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const path = require("path");


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

// CORS - Allow all origins for now (restrict in production)
app.use(cors({
  origin: true,
  credentials: true
}));


// Rate limiting - General API rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test database connection (only in development, not in serverless)
if (process.env.NODE_ENV !== 'production') {
  testConnection();
}

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

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;