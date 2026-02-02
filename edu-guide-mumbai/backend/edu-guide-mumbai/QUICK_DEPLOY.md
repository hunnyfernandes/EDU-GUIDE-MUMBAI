# 🚀 Quick Start: Deploy Backend in 5 Minutes

## Prerequisites
- GitHub account
- Your code pushed to GitHub
- 5 minutes of your time

## Step-by-Step (Render.com)

### 1️⃣ Sign Up (30 seconds)
```
1. Go to: https://render.com
2. Click "Get Started for Free"
3. Sign in with GitHub
```

### 2️⃣ Create Web Service (1 minute)
```
1. Click "New +" → "Web Service"
2. Click "Connect account" (if first time)
3. Select repository: "edu-guide-mumbai"
4. Click "Connect"
```

### 3️⃣ Configure Service (2 minutes)
```
Name: edu-guide-mumbai-backend
Region: Singapore
Branch: main
Root Directory: backend
Environment: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

### 4️⃣ Add Environment Variables (2 minutes)

Click "Advanced" → Add these one by one:

**Required (Copy-Paste Ready)**:
```
NODE_ENV=production
PORT=5002
JWT_SECRET=841d18aa8977948cb5a351f2142ef9230388e6470a17434ccc7ea7324ae86fac7bd0a3d3a93cf2fdcbd6be399bb26bb067f842f7f4fdb4ddebd24185defc4195
JWT_EXPIRE=7d
CLIENT_URL=https://build-1iw8jzbol-hunnys-projects-a5d9492d.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hunnyfernandes27@gmail.com
SMTP_PASSWORD=qebkndvymnpyyblg
SMTP_SECURE=false
```

**Database (You need to setup first - see below)**:
```
DB_HOST=<from-planetscale-or-railway>
DB_USER=<from-planetscale-or-railway>
DB_PASSWORD=<from-planetscale-or-railway>
DB_NAME=edu_guide_mumbai
DB_PORT=3306
```

### 5️⃣ Deploy
```
1. Click "Create Web Service"
2. Wait 2-3 minutes for deployment
3. Copy your URL: https://edu-guide-mumbai-backend.onrender.com
```

## Database Setup (Choose One)

### Option A: PlanetScale (Recommended)

**Time**: 5 minutes

```
1. Go to: https://planetscale.com
2. Sign up with GitHub
3. Click "Create database"
   - Name: edu-guide-mumbai
   - Region: AWS Mumbai (ap-south-1)
   - Plan: Hobby (Free)
4. Click "Connect"
5. Select: Node.js
6. Copy connection details:
   - Host: aws.connect.psdb.cloud
   - Username: <shown>
   - Password: <shown>
7. Paste into Render environment variables
```

**Import Data**:
```bash
# Export from local
mysqldump -u root -p edu_guide_mumbai > backup.sql

# Import to PlanetScale (use their CLI or web interface)
pscale shell edu-guide-mumbai main < backup.sql
```

### Option B: Railway (Includes Backend)

**Time**: 3 minutes

```
1. Go to: https://railway.app
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select "edu-guide-mumbai"
6. Click "Add MySQL"
7. Copy connection details from MySQL service
8. Add to your backend environment variables
```

## Update Vercel

### Add Environment Variable (1 minute)

```
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add:
   Name: VITE_API_URL
   Value: https://edu-guide-mumbai-backend.onrender.com/api
5. Select: Production, Preview, Development
6. Click "Save"
```

### Redeploy (30 seconds)

```
1. Go to: Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
```

## Test (30 seconds)

### Backend Health Check
```bash
curl https://edu-guide-mumbai-backend.onrender.com/api/health
```

Expected:
```json
{"success":true,"message":"Edu Guide Mumbai API is running"}
```

### Mobile Login
```
1. Open Vercel URL on Android
2. Click hamburger menu
3. Click "Login"
4. Enter credentials
5. Should work! ✅
```

## Troubleshooting

### ❌ "Application failed to respond"
**Fix**: Check Render logs for errors

### ❌ "Database connection failed"
**Fix**: Verify DB credentials in environment variables

### ❌ "CORS error"
**Fix**: Make sure CLIENT_URL matches your Vercel URL exactly

### ❌ "First request is slow (30-60 seconds)"
**This is normal**: Free tier sleeps after 15 minutes
**Solution**: Upgrade to paid ($7/month) or accept cold starts

## Cost

| Service | Free | Paid |
|---------|------|------|
| Render Backend | ✅ (sleeps) | $7/mo |
| PlanetScale DB | ✅ (5GB) | $29/mo |
| Vercel Frontend | ✅ | $20/mo |
| **Total** | **$0** | **$7-56/mo** |

## Alternative: Quick Test (No Deployment)

### Use ngrok (Expires in 2 hours)

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Expose with ngrok
npm install -g ngrok
ngrok http 5002
```

Copy ngrok URL → Add to Vercel as `VITE_API_URL`

⚠️ **Warning**: ngrok URLs expire after 2 hours

## Summary

✅ **What You Did**:
1. Deployed backend to Render
2. Setup cloud database
3. Updated Vercel environment variables
4. Redeployed frontend

✅ **What Works Now**:
- Login from laptop ✅
- Login from Android ✅
- Login from anywhere ✅

🎉 **You're Done!**

---

**Need Help?** Check `DEPLOYMENT_SUMMARY.md` for detailed troubleshooting.
