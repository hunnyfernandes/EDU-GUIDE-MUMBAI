# Quick Backend Deployment Guide (Render.com)

## Step 1: Prepare Your Backend for Deployment

### 1.1 Create `render.yaml` (Optional but Recommended)

This file tells Render how to deploy your app:

```yaml
services:
  - type: web
    name: edu-guide-mumbai-backend
    env: node
    region: singapore
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5002
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRE
        value: 7d
```

### 1.2 Update package.json

Make sure your `backend/package.json` has:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Step 2: Deploy to Render

### Option A: Using Render Dashboard (Easiest)

1. **Go to**: https://render.com
2. **Sign Up/Login**: Use your GitHub account
3. **Click**: "New +" → "Web Service"
4. **Connect Repository**: 
   - Connect your GitHub account
   - Select `edu-guide-mumbai` repository
5. **Configure**:
   - **Name**: `edu-guide-mumbai-backend`
   - **Region**: Singapore (closest to Mumbai)
   - **Branch**: `main` or `master`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable":
   
   ```
   NODE_ENV=production
   PORT=5002
   
   # Database (You'll need a cloud database)
   DB_HOST=<your-planetscale-or-railway-db-host>
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   DB_NAME=edu_guide_mumbai
   DB_PORT=3306
   
   # JWT
   JWT_SECRET=841d18aa8977948cb5a351f2142ef9230388e6470a17434ccc7ea7324ae86fac7bd0a3d3a93cf2fdcbd6be399bb26bb067f842f7f4fdb4ddebd24185defc4195
   JWT_EXPIRE=7d
   
   # CORS
   CLIENT_URL=https://build-1iw8jzbol-hunnys-projects-a5d9492d.vercel.app
   
   # SMTP
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=hunnyfernandes27@gmail.com
   SMTP_PASSWORD=qebkndvymnpyyblg
   SMTP_SECURE=false
   SMTP_FROM=Edu Guide Mumbai <hunnyfernandes27@gmail.com>
   ```

7. **Click**: "Create Web Service"

8. **Wait**: Render will build and deploy (takes 2-5 minutes)

9. **Copy URL**: After deployment, you'll get a URL like:
   `https://edu-guide-mumbai-backend.onrender.com`

## Step 3: Setup Cloud Database

### Option A: PlanetScale (MySQL, Free Tier)

1. Go to: https://planetscale.com
2. Create account
3. Create new database: `edu-guide-mumbai`
4. Get connection details:
   - Host: `aws.connect.psdb.cloud`
   - Username: (provided)
   - Password: (provided)
5. Import your local database:
   ```bash
   mysqldump -u root -p edu_guide_mumbai > backup.sql
   # Then import to PlanetScale using their CLI or web interface
   ```

### Option B: Railway (Includes MySQL)

1. Go to: https://railway.app
2. Create new project
3. Add MySQL database
4. Copy connection details
5. Use in Render environment variables

### Option C: Clever Cloud (Free MySQL)

1. Go to: https://www.clever-cloud.com
2. Create MySQL addon
3. Get connection string
4. Use in Render

## Step 4: Update Frontend

### 4.1 Update Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to: Settings → Environment Variables
4. Add:
   ```
   VITE_API_URL=https://edu-guide-mumbai-backend.onrender.com/api
   ```
5. Select: Production, Preview, Development
6. Click: Save

### 4.2 Redeploy Frontend

1. Go to: Deployments tab
2. Click: "..." on latest deployment
3. Click: "Redeploy"

OR just push a new commit to trigger auto-deployment.

## Step 5: Test

### 5.1 Test Backend Health

```bash
curl https://edu-guide-mumbai-backend.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Edu Guide Mumbai API is running",
  "timestamp": "2026-01-22T..."
}
```

### 5.2 Test from Mobile

1. Open your Vercel URL on Android
2. Try to login
3. Should work now! 🎉

## Troubleshooting

### Issue: "Application failed to respond"

**Solution**: Check Render logs:
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. Look for errors

### Issue: Database connection failed

**Solution**: 
1. Verify database credentials in Render environment variables
2. Make sure database allows connections from Render's IP
3. Check if database is running

### Issue: CORS errors

**Solution**:
1. Verify `CLIENT_URL` in Render matches your Vercel URL exactly
2. Check backend logs for CORS warnings
3. Make sure you updated `server.js` with the new CORS config

### Issue: Render free tier sleeps after 15 minutes

**Solution**:
- Free tier services sleep after inactivity
- First request after sleep takes 30-60 seconds
- Upgrade to paid tier ($7/month) for always-on
- OR use a service like UptimeRobot to ping your API every 14 minutes

## Alternative: Quick Test with ngrok (Temporary)

If you want to test immediately without full deployment:

```bash
# Install ngrok
npm install -g ngrok

# Start your local backend
cd backend
npm run dev

# In another terminal, expose it
ngrok http 5002
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and add to Vercel:

```
VITE_API_URL=https://abc123.ngrok.io/api
```

⚠️ **Note**: ngrok URLs expire after 2 hours on free tier.

## Cost Summary

- **Render Free Tier**: $0/month (sleeps after 15 min inactivity)
- **Render Starter**: $7/month (always-on, 512MB RAM)
- **PlanetScale**: $0/month (5GB storage, 1 billion row reads)
- **Railway**: $5/month credit (includes database)
- **Vercel**: $0/month (frontend already deployed)

**Total for full production**: $0-7/month depending on your choice.
