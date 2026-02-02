# EduGuide Mumbai - Deployment Guide

This guide covers deploying the EduGuide Mumbai application to production using popular hosting platforms.

## 📋 Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Frontend Deployment (Vercel/Netlify)](#frontend-deployment)
- [Backend Deployment (Render/Railway)](#backend-deployment)
- [Database Deployment (PlanetScale/Railway)](#database-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment Steps](#post-deployment-steps)

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] All code committed to a Git repository (GitHub, GitLab, or Bitbucket)
- [ ] Environment variables documented
- [ ] Database schema ready
- [ ] Production-ready API endpoints
- [ ] CORS configured for production URLs
- [ ] Build tested locally (`npm run build`)

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

**Step 1: Prepare the Frontend**

1. Create a `vercel.json` in the frontend directory:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Step 2: Deploy to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Step 3: Configure Environment Variables**

In Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add: `REACT_APP_API_URL=https://your-backend-url.com/api`

**Alternative: Deploy via Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Set Root Directory to `frontend`
5. Add environment variables
6. Click "Deploy"

---

### Option 2: Netlify

**Step 1: Create `netlify.toml`**

Create in the root directory:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Step 2: Deploy via Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd frontend

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Step 3: Configure Environment Variables**

In Netlify Dashboard:
- Go to Site Settings → Environment Variables
- Add: `REACT_APP_API_URL=https://your-backend-url.com/api`

---

## 🚀 Backend Deployment

### Option 1: Render (Recommended)

**Step 1: Prepare Backend**

1. Ensure `package.json` has the correct start script:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

**Step 2: Deploy to Render**

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure:
   - **Name**: edu-guide-mumbai-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

**Step 3: Add Environment Variables**

In Render Dashboard, add:

```
NODE_ENV=production
PORT=5002
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=edu_guide_mumbai
DB_PORT=3306
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-url.vercel.app
```

---

### Option 2: Railway

**Step 1: Deploy via Railway CLI**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend
cd backend

# Initialize and deploy
railway init
railway up
```

**Step 2: Add Environment Variables**

Use Railway Dashboard or CLI:

```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-secret-key
# ... add all other variables
```

---

## 🗄️ Database Deployment

### Option 1: PlanetScale (MySQL)

**Step 1: Create Database**

1. Go to [planetscale.com](https://planetscale.com)
2. Create new database
3. Create a branch (e.g., `main`)

**Step 2: Import Schema**

```bash
# Install PlanetScale CLI
brew install planetscale/tap/pscale

# Login
pscale auth login

# Connect to database
pscale connect edu-guide-mumbai main --port 3309

# In another terminal, import schema
mysql -h 127.0.0.1 -P 3309 -u root < database/schema.sql
mysql -h 127.0.0.1 -P 3309 -u root < database/sample_data.sql
```

**Step 3: Get Connection String**

1. In PlanetScale Dashboard, go to "Connect"
2. Select "Node.js"
3. Copy the connection details
4. Update backend environment variables

---

### Option 2: Railway MySQL

**Step 1: Add MySQL Plugin**

1. In Railway Dashboard, click "New"
2. Select "Database" → "MySQL"
3. Wait for provisioning

**Step 2: Get Connection Details**

Railway will provide:
- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_PORT`

**Step 3: Import Schema**

```bash
# Connect to Railway MySQL
mysql -h MYSQL_HOST -P MYSQL_PORT -u MYSQL_USER -p

# Import schema
source /path/to/schema.sql
source /path/to/sample_data.sql
```

---

## 🔐 Environment Variables

### Frontend (.env.production)

```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend (.env.production)

```env
NODE_ENV=production
PORT=5002

# Database
DB_HOST=your-production-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=edu_guide_mumbai
DB_PORT=3306

# JWT
JWT_SECRET=your-super-secret-production-jwt-key
JWT_EXPIRE=7d

# CORS
CLIENT_URL=https://your-frontend-url.vercel.app

# Optional: Email (for future features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 🔧 Post-Deployment Steps

### 1. Test the Deployment

- [ ] Visit your frontend URL
- [ ] Test user registration and login
- [ ] Browse colleges
- [ ] Test college comparison
- [ ] Submit a review
- [ ] Test admin dashboard (if applicable)

### 2. Update CORS Settings

Ensure your backend allows requests from your production frontend:

```javascript
// backend/server.js
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
};
```

### 3. Set Up Custom Domain (Optional)

**For Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**For Render:**
1. Go to Settings → Custom Domains
2. Add your domain
3. Update DNS records

### 4. Enable HTTPS

Both Vercel and Render provide automatic HTTPS. Ensure:
- [ ] Frontend uses HTTPS
- [ ] Backend uses HTTPS
- [ ] Update `CLIENT_URL` to use HTTPS

### 5. Monitor Application

**Set up monitoring:**
- Use Vercel Analytics for frontend
- Use Render metrics for backend
- Set up error tracking (e.g., Sentry)

### 6. Database Backups

**PlanetScale:**
- Automatic backups included
- Can create manual backups

**Railway:**
- Set up automated backups
- Export database regularly

---

## 🚨 Troubleshooting

### Common Issues

**1. CORS Errors**
- Verify `CLIENT_URL` in backend matches frontend URL
- Check CORS middleware configuration

**2. Database Connection Failed**
- Verify database credentials
- Check if database is accessible from backend host
- Ensure database is running

**3. Build Failures**
- Check Node version compatibility
- Verify all dependencies are in `package.json`
- Review build logs for specific errors

**4. Environment Variables Not Working**
- Ensure variables are set in hosting platform
- Restart the service after adding variables
- Check variable names (case-sensitive)

---

## 📊 Deployment Architecture

```
┌─────────────────┐
│   Users/Clients │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Vercel/Netlify │ ← Frontend (React)
│  (CDN + Hosting)│
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│  Render/Railway │ ← Backend (Node.js/Express)
│  (Web Service)  │
└────────┬────────┘
         │
         │ Database Queries
         ▼
┌─────────────────┐
│  PlanetScale/   │ ← Database (MySQL)
│  Railway MySQL  │
└─────────────────┘
```

---

## 🎯 Quick Deploy Commands

### Full Stack Deployment (Recommended Order)

```bash
# 1. Deploy Database (PlanetScale/Railway)
# Follow platform-specific instructions above

# 2. Deploy Backend (Render/Railway)
cd backend
# Deploy via platform dashboard or CLI

# 3. Deploy Frontend (Vercel)
cd frontend
vercel --prod
```

---

## 📝 Deployment Checklist

- [ ] Database deployed and schema imported
- [ ] Backend deployed with environment variables
- [ ] Frontend deployed with API URL configured
- [ ] CORS configured correctly
- [ ] HTTPS enabled on all services
- [ ] Test all major features
- [ ] Set up monitoring and error tracking
- [ ] Configure custom domain (optional)
- [ ] Set up automated backups
- [ ] Document production URLs

---

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [PlanetScale Documentation](https://planetscale.com/docs)

---

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Review error logs in platform dashboard
3. Verify environment variables
4. Test locally with production environment variables

---

**Deployment Complete! 🎉**

Your EduGuide Mumbai application is now live and ready to help students find their perfect college!
