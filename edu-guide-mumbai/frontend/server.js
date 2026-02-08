const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require('cookie-parser');
require("dotenv").config();

// Validate environment variables before starting server
// In Vercel, env vars might be injected differently, so we catch errors instead of crashing
try {
  const { validateEnv } = require("./config/envValidator");
  validateEnv();
} catch (err) {
  console.warn("⚠️ Env validation failed:", err.message);
}

const { testConnection, promisePool } = require("./config/database");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const path = require("path");

// Swagger documentation
let swaggerUi, swaggerSpec, swaggerOptions;
try {
  // Skip Swagger in Vercel to improve startup time and avoid timeouts
  if (!process.env.VERCEL) {
    const swaggerConfig = require("./config/swagger");
    swaggerUi = swaggerConfig.swaggerUi;
    swaggerSpec = swaggerConfig.swaggerSpec;
    swaggerOptions = swaggerConfig.swaggerOptions;
  } else {
    console.log("ℹ️ Skipping Swagger setup in Vercel environment");
  }
} catch (err) {
  console.warn("⚠️ Swagger setup failed:", err.message);
}

// Caching middleware
const { cacheMiddleware } = require("./middleware/cache");

// Import routes
const authRoutes = require("./routes/authRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const chatbotRoutes = require("./routes/chatbotRoutes");

// Initialize express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:5173", "http://localhost:5174", "https://frontend-edu-guide.vercel.app", "https://frontend-git-main-edu-guide.vercel.app"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://plus.unsplash.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// CORS configuration - Support multiple origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'https://frontend-git-main-edu-guide.vercel.app',
  'https://frontend-edu-guide.vercel.app',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, curl, etc.)
      if (!origin) return callback(null, true);

      // In development or if explicitly allowed
      if (process.env.NODE_ENV !== 'production' || allowedOrigins.some(o => origin.startsWith(o))) {
        return callback(null, true);
      }

      // For debugging, allow Vercel previews
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // Check if origin is in allowed list (strict check)
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Temporarily allow ALL origins to debug "none of the feature is working"
        // TODO: Re-enable strict CORS later
        console.warn(`⚠️ CORS Warning: Request from ${origin} allowed temporarily.`);
        callback(null, true);
        // logger.warn(`CORS blocked request from origin: ${origin}`);
        // callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.get("/api/test-simple", (req, res) => {
  res.json({ message: "Simple route works" });
});

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
if (swaggerUi && swaggerSpec) {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerOptions)
  );
}

// Test database connection
// Only test connection if not in serverless mode to avoid cold start delays/errors
if (!process.env.VERCEL) {
  testConnection();
}

app.get("/api/debug/db", async (req, res) => {
  try {
    const connection = await promisePool.getConnection();
    await connection.query("SELECT 1");
    connection.release();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, code: err.code, message: err.message });
  }
});

// API Routes
console.log(`[${new Date().toISOString()}] Mounting routes...`);

try {
  console.log(`[${new Date().toISOString()}] Require authRoutes...`);
  const authRoutes = require("./routes/authRoutes");
  app.use("/api/auth", authRoutes);
  console.log(`[${new Date().toISOString()}] ✅ Auth routes mounted successfully`);
} catch (error) {
  console.error("❌ Failed to mount auth routes:", error);
}

// Re-enabled college and review routes
try {
  console.log(`[${new Date().toISOString()}] Require collegeRoutes...`);
  const collegeRoutes = require("./routes/collegeRoutes");
  app.use("/api/colleges", collegeRoutes);
  console.log(`[${new Date().toISOString()}] ✅ College routes mounted successfully`);
} catch (error) {
  console.error("❌ Failed to mount college routes:", error);
}

try {
  console.log(`[${new Date().toISOString()}] Require reviewRoutes...`);
  const reviewRoutes = require("./routes/reviewRoutes");
  app.use("/api/reviews", reviewRoutes);
  console.log(`[${new Date().toISOString()}] ✅ Review routes mounted successfully`);
} catch (error) {
  console.error("❌ Failed to mount review routes:", error);
}

// try {
//   const adminRoutes = require("./routes/adminRoutes");
//   app.use("/api/admin", adminRoutes);
//   console.log("✅ Admin routes mounted successfully");
// } catch (error) {
//   console.error("❌ Failed to mount admin routes:", error);
// }

try {
  const userRoutes = require("./routes/userRoutes");
  app.use("/api/user", userRoutes);
} catch (error) {
  console.error("❌ Failed to mount user routes:", error);
}

try {
  const adminRoutes = require("./routes/adminRoutes");
  app.use("/api/admin", adminRoutes);
  console.log("✅ Admin routes mounted successfully");
} catch (error) {
  console.error("❌ Failed to mount admin routes:", error);
}

try {
  const chatbotRoutes = require("./routes/chatbotRoutes");
  app.use("/api/chatbot", chatbotRoutes);
  console.log("✅ Chatbot routes mounted successfully");
} catch (error) {
  console.error("❌ Failed to mount chatbot routes:", error);
}

// Health check route
app.get("/api/health", (req, res) => {
  // Get list of mounted routes for debugging
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push(Object.keys(middleware.route.methods).join(', ').toUpperCase() + ' ' + middleware.route.path);
    } else if (middleware.name === 'router') {
      // This is a mounted router
      // We can't easily get the prefix here without extra work, but we can see it's mounted
      routes.push('ROUTER MOUNTED');
    }
  });

  res.json({
    success: true,
    message: "Edu Guide Mumbai API is running (All Routes Enabled + Diagnostic)",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    vercel: process.env.VERCEL ? true : false,
    routes_summary: routes.length,
    debug_routes: routes // This will help us see if /api/auth is mounted
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

const PORT = process.env.PORT || 5002;

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║   Edu Guide Mumbai API Server                 ║
║   Environment: ${process.env.NODE_ENV || "development"}                      ║
║   Port: ${PORT}                                  ║
║   URL: http://localhost:${PORT}                   ║
╚═══════════════════════════════════════════════╝
    `);
  });
}

module.exports = app;

// Handle unhandled promise rejections
