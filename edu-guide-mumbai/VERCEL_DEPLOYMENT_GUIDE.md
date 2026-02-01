# EDU-GUIDE-MUMBAI: Complete Vercel Deployment Guide

## Overview

This guide will walk you through deploying both the frontend and backend of EDU-GUIDE-MUMBAI to Vercel, with TiDB Cloud as your database.

**Architecture:**
- **Frontend**: React + Vite → Deployed to Vercel (Static Site)
- **Backend**: Node.js + Express → Deployed to Vercel (Serverless Functions)
- **Database**: TiDB Cloud (MySQL-compatible)

---

## PART 1: PREPARATION

### Step 1: Gather Your Information

Before starting, collect these details:

**From TiDB Cloud Dashboard:**
- Host (e.g., `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`)
- Port (usually `4000`)
- Database name
- Username
- Password

**For Vercel:**
- Your Vercel account login
- Your GitHub repository access

---

## PART 2: BACKEND DEPLOYMENT (Deploy First!)

The backend MUST be deployed first because the frontend needs the backend URL.

### Step 2.1: Create Backend vercel.json

In your `backend/` folder, create a `vercel.json` file:

```json
{
  "version": 2,
  "name": "edu-guide-mumbai-api",
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET,POST,PUT,DELETE,OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

### Step 2.2: Modify Backend server.js for Vercel

Your current `server.js` needs modifications for serverless deployment. Update it:

```javascript
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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later."
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
```

### Step 2.3: Update Backend package.json

Add/modify these scripts in `backend/package.json`:

```json
{
  "name": "edu-guide-mumbai-backend",
  "version": "1.0.0",
  "description": "Backend API for Edu Guide Mumbai college information system",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "@google/generative-ai": "^0.24.1",
    "bcrypt": "^5.1.1",
    "bcryptjs": "^3.0.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.6.1",
    "express": "^4.21.2",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^9.0.0",
    "multer": "^1.4.5-lts.1",
    "mysql2": "^3.6.5",
    "nodemailer": "^7.0.10",
    "openai": "^6.16.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### Step 2.4: Push Backend to GitHub

```bash
cd edu-guide-mumbai/backend

# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "Prepare backend for Vercel deployment"

# Push to GitHub (create a new repo or use existing)
git push origin main
```

### Step 2.5: Deploy Backend to Vercel

1. **Go to [vercel.com](https://vercel.com) and login**

2. **Click "Add New Project"**

3. **Import your GitHub repository**
   - If you don't see it, click "Adjust GitHub App Permissions" and grant access

4. **Configure Project:**
   - **Project Name**: `edu-guide-mumbai-api` (or your preferred name)
   - **Framework Preset**: `Other`
   - **Root Directory**: `backend` (IMPORTANT!)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. **Environment Variables - ADD THESE:**

   Click "Environment Variables" and add:

   | Variable | Value | Example |
   |----------|-------|---------|
   | `NODE_ENV` | `production` | production |
   | `DB_HOST` | Your TiDB host | gateway01.ap-southeast-1.prod.aws.tidbcloud.com |
   | `DB_PORT` | Your TiDB port | 4000 |
   | `DB_USER` | Your TiDB username | yourusername |
   | `DB_PASSWORD` | Your TiDB password | yourpassword |
   | `DB_NAME` | Your database name | edu_guide_mumbai |
   | `DB_SSL` | `true` | true |
   | `JWT_SECRET` | Strong random string | your-super-secret-jwt-key-min-32-chars |
   | `JWT_EXPIRE` | `7d` | 7d |
   | `CLIENT_URL` | Your frontend URL (we'll update later) | https://your-frontend.vercel.app |
   | `GOOGLE_API_KEY` | Your Google API key (for chatbot) | your-google-api-key |
   | `OPENAI_API_KEY` | Your OpenAI key (optional fallback) | your-openai-key |

6. **Click "Deploy"**

7. **Wait for deployment to complete**

8. **Get your backend URL:**
   - After deployment, Vercel will show you the URL
   - It looks like: `https://edu-guide-mumbai-api.vercel.app`
   - **SAVE THIS URL - you'll need it for the frontend!**

---

## PART 3: FRONTEND DEPLOYMENT

### Step 3.1: Update Frontend Environment Variables

In `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```

Replace `your-backend-url.vercel.app` with the actual backend URL from Step 2.5.

### Step 3.2: Update Frontend vercel.json

Your `frontend/vercel.json` should be:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/service-worker.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Step 3.3: Update Frontend API Service

In `frontend/src/services/api.jsx`, ensure it uses the environment variable:

```javascript
import axios from 'axios';

// Use Vite's import.meta.env for environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Rest of your interceptors...
export default api;
```

### Step 3.4: Update Frontend package.json Build Script

Ensure `frontend/package.json` has:

```json
{
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 3.5: Push Frontend to GitHub

```bash
cd edu-guide-mumbai/frontend

# Add all files
git add .

# Commit
git commit -m "Prepare frontend for Vercel deployment"

# Push
git push origin main
```

### Step 3.6: Deploy Frontend to Vercel

1. **Go to [vercel.com](https://vercel.com)**

2. **Click "Add New Project"**

3. **Import your GitHub repository**

4. **Configure Project:**
   - **Project Name**: `edu-guide-mumbai` (or your preferred name)
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (IMPORTANT!)
   - **Build Command**: `npm run build` (or vite build)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Environment Variables - ADD THESE:**

   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://your-backend-url.vercel.app/api` |

6. **Click "Deploy"**

7. **Wait for deployment**

---

## PART 4: POST-DEPLOYMENT CONFIGURATION

### Step 4.1: Update Backend CORS

Now that frontend is deployed, update the backend CORS settings:

1. **Go to your backend project in Vercel Dashboard**

2. **Go to Settings → Environment Variables**

3. **Update `CLIENT_URL`:**
   - Old: `https://your-frontend.vercel.app`
   - New: Your actual frontend URL (e.g., `https://edu-guide-mumbai.vercel.app`)

4. **Redeploy the backend:**
   - Go to Deployments tab
   - Click the three dots on latest deployment
   - Click "Redeploy"

### Step 4.2: Update Backend CORS Code (Optional but Recommended)

For better security, update `backend/server.js` CORS:

```javascript
// CORS - Restrict to specific origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Then redeploy.

---

## PART 5: VERIFICATION

### Step 5.1: Test Backend Health

Open browser and go to:
```
https://your-backend-url.vercel.app/api/health
```

You should see:
```json
{
  "success": true,
  "message": "Edu Guide Mumbai API is running",
  "timestamp": "2026-02-01T..."
}
```

### Step 5.2: Test Frontend

Open your frontend URL:
```
https://your-frontend-url.vercel.app
```

### Step 5.3: Test Full Flow

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to:
   - View colleges list
   - Register a new user
   - Login
   - Search colleges

Check that API calls are going to your backend URL.

---

## PART 6: TROUBLESHOOTING

### Issue 1: "Cannot connect to backend"

**Symptoms:** Frontend loads but data doesn't load

**Fix:**
1. Check `VITE_API_URL` is set correctly in frontend environment variables
2. Verify backend is deployed and `/api/health` works
3. Check CORS is configured properly

### Issue 2: "CORS error"

**Symptoms:** Console shows CORS errors

**Fix:**
1. Update `CLIENT_URL` in backend to match frontend URL exactly
2. Redeploy backend
3. If still failing, temporarily use `origin: '*'` in backend CORS for testing

### Issue 3: "Database connection failed"

**Symptoms:** Backend health works but API calls fail

**Fix:**
1. Verify all DB environment variables in Vercel
2. Check TiDB Cloud allows connections from Vercel IPs
3. In TiDB Cloud, go to Security → IP Access List → Add `0.0.0.0/0` (allow all) for testing

### Issue 4: "Build failed"

**Symptoms:** Vercel build fails

**Fix:**
1. Check build logs in Vercel dashboard
2. Ensure `package.json` has correct build script
3. For frontend: ensure `dist` folder is output
4. For backend: ensure `vercel.json` is correct

### Issue 5: "404 on page refresh"

**Symptoms:** Refreshing a page shows 404

**Fix:**
Ensure `vercel.json` in frontend has the rewrite rule:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## PART 7: IMPORTANT NOTES

### Vercel Serverless Limitations

1. **Cold Starts:** First request after idle may be slow (1-3 seconds)
2. **File System:** Files written during runtime are lost
3. **Timeouts:** Functions timeout after 10 seconds (Hobby) or 60 seconds (Pro)
4. **Memory:** Limited memory (1024MB Hobby, 3008MB Pro)

### Database Connection Pooling

Your backend uses connection pooling. In serverless, this can cause issues. If you see "Too many connections" errors:

1. Reduce `connectionLimit` in `backend/config/database.js`:
```javascript
const pool = mysql.createPool({
    // ... other config
    connectionLimit: 2, // Reduce from 10 to 2
});
```

2. Or use a connection pooler like TiDB Cloud's serverless tier which handles this automatically.

### Environment Variables Security

- NEVER commit `.env` files to GitHub
- Vercel encrypts environment variables
- Rotate secrets regularly

---

## PART 8: DOMAIN SETUP (Optional)

### Custom Domain

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Vercel dashboard:
   - Go to your project → Settings → Domains
   - Add your domain
   - Follow DNS configuration instructions
3. Update `CLIENT_URL` in backend to new domain
4. Update `VITE_API_URL` in frontend to new domain

---

## Quick Reference: File Structure for Deployment

```
edu-guide-mumbai/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js          ← Main entry point
│   ├── package.json
│   └── vercel.json        ← NEW: Backend Vercel config
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json        ← Frontend Vercel config
│   └── .env.production    ← Environment variables
│
└── database/
    └── schema.sql
```

---

## Summary Checklist

- [ ] Backend `vercel.json` created
- [ ] Backend `server.js` updated for serverless
- [ ] Backend environment variables added in Vercel
- [ ] Backend deployed successfully
- [ ] Backend health endpoint works
- [ ] Frontend `.env.production` updated with backend URL
- [ ] Frontend environment variables added in Vercel
- [ ] Frontend deployed successfully
- [ ] Backend `CLIENT_URL` updated with frontend URL
- [ ] Backend redeployed with updated CORS
- [ ] Full application tested

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- TiDB Cloud Docs: https://docs.pingcap.com/tidbcloud
- Check Vercel deployment logs for specific errors
