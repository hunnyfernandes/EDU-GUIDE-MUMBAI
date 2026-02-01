# Production Deployment Fix - Complete Guide

## ✅ Current Status
- ✅ Backend code ready (working locally on port 5002)
- ✅ Frontend deployed to Vercel (https://build-1iw8jzbol-hunnys-projects-a5d9492d.vercel.app)
- ❌ Backend NOT deployed (blocking all authentication, registration, SMTP)
- ❌ Frontend API URL not configured for production

## ❌ Problems
1. **Registration/Login Fails**: Frontend on Vercel tries to reach `http://localhost:5002` which doesn't exist
2. **SMTP Not Working**: Email verification requires backend API running
3. **No Search History**: API calls to log searches fail silently

## ✅ Solution: Deploy Backend to Render + Railway MySQL

### Step 1: Create Railway Database (2 minutes)

1. Go to https://railway.app
2. Sign in with GitHub (https://github.com/hunnyfernandes/EDU-GUIDE-MUMBAI)
3. Click "New Project" → "Database" → "MySQL"
4. Wait for database to provision (~30 seconds)
5. Go to "MySQL" tab and click to see credentials
6. Copy these values (you'll need them):
   - DB_HOST: (something like: `junction.proxy.rlwy.net`)
   - DB_USER: `root`
   - DB_PASSWORD: (auto-generated, copy it)
   - DB_PORT: (usually 3306 or a custom port)

### Step 2: Create Database Schema in Railway

Option A - Using Railway UI (Recommended):
1. In Railway dashboard, click "MySQL" service
2. Go to "Connect" tab
3. Click "Create new database"
4. Use these values:
   ```
   Database name: edu_guide_mumbai
   ```

Option B - Run SQL schema:
```bash
# Connect to Railway MySQL
mysql -h [DB_HOST] -u [DB_USER] -p[DB_PASSWORD]

# Then run (from database/schema.sql)
CREATE DATABASE edu_guide_mumbai;
USE edu_guide_mumbai;
[Paste contents of database/schema.sql]
```

### Step 3: Deploy Backend to Render (5 minutes)

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Select repository: `hunnyfernandes/EDU-GUIDE-MUMBAI`
5. Fill in:
   - **Name**: `edu-guide-mumbai-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Before deploying, set Environment Variables:
   ```
   DB_HOST=[Railway_DB_HOST]
   DB_USER=root
   DB_PASSWORD=[Railway_DB_PASSWORD]
   DB_NAME=edu_guide_mumbai
   DB_PORT=[Railway_DB_PORT - usually 3306]
   PORT=5002
   NODE_ENV=production
   JWT_SECRET=841d18aa8977948cb5a351f2142ef9230388e6470a17434ccc7ea7324ae86fac7bd0a3d3a93cf2fdcbd6be399bb26bb067f842f7f4fdb4ddebd24185defc4195
   JWT_EXPIRE=7d
   CLIENT_URL=https://build-1iw8jzbol-hunnys-projects-a5d9492d.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=hunnyfernandes27@gmail.com
   SMTP_PASSWORD=qebkndvymnpyyblg
   SMTP_SECURE=false
   SMTP_FROM="Edu Guide Mumbai <hunnyfernandes27@gmail.com>"
   ```

7. Click "Deploy"
8. Wait for deployment (~2 minutes)
9. Get the URL (something like `https://edu-guide-mumbai-backend.onrender.com`)

### Step 4: Update Frontend API URL in Vercel

1. Go to https://vercel.com/dashboard
2. Select `build` project
3. Go to "Settings" → "Environment Variables"
4. Add new variable:
   ```
   REACT_APP_API_URL=https://[YOUR-RENDER-BACKEND-URL]/api
   ```
   Example: `REACT_APP_API_URL=https://edu-guide-mumbai-backend.onrender.com/api`

5. Go to "Deployments" 
6. Click the latest deployment
7. Click "Redeploy" button
8. Wait for redeployment (~1-2 minutes)

### Step 5: Verify Everything Works

1. Open https://build-1iw8jzbol-hunnys-projects-a5d9492d.vercel.app
2. Try to register with new email
3. Check email for verification link
4. Login should work
5. Search history should log
6. All features should work

## 🔧 Troubleshooting

**Login still fails?**
- Check browser console (F12) for error messages
- Verify REACT_APP_API_URL is set correctly in Vercel
- Redeploy frontend after changing env variables

**Registration email not received?**
- Check SMTP credentials in backend .env
- Check spam folder
- Verify Render backend is running: `https://[backend-url]/api/colleges` should return data

**Database connection error?**
- Verify Railway credentials are correct in Render env vars
- Make sure database `edu_guide_mumbai` exists
- Check firewall/Railway settings allow connections

**CORS errors?**
- Verify CLIENT_URL in backend .env matches your Vercel URL exactly

## 📊 Final Architecture

```
Frontend (Vercel)
  ↓ REACT_APP_API_URL
Backend API (Render)  ← MongoDB/MySQL (Railway)
  ↓ Process requests & connect to database
```

---

**Time Estimate**: 15 minutes for full setup
**Status**: Ready to deploy (all code ready, just need cloud services)
