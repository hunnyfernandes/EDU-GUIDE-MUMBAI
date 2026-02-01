# 🔧 Fix Mobile Login Issue - Oppo A3 Pro 5G

## Problem
Login works on laptop but fails on Android phone because frontend is trying to connect to `localhost` instead of the deployed backend.

## Solution (2 minutes)

### Option A: Update via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in if needed

2. **Select Your Project**
   - Click on your `edu-guide-mumbai` project

3. **Go to Settings**
   - Click "Settings" tab
   - Click "Environment Variables" in the left sidebar

4. **Update VITE_API_URL**
   - Find `VITE_API_URL` in the list
   - Click the "..." menu → "Edit"
   - Change value to: `https://edu-guide-mumbai-backend.onrender.com/api`
   - Make sure it's selected for: **Production**, **Preview**, and **Development**
   - Click "Save"

5. **Redeploy**
   - Go to "Deployments" tab
   - Click "..." on the latest deployment
   - Click "Redeploy"
   - Wait 1-2 minutes for deployment to complete

### Option B: Update via Vercel CLI (Faster)

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project
cd frontend
vercel link

# Add environment variable
vercel env add VITE_API_URL production
# When prompted, enter: https://edu-guide-mumbai-backend.onrender.com/api

# Trigger new deployment
vercel --prod
```

## Verify the Fix

### 1. Check Backend is Running
Open in browser: https://edu-guide-mumbai-backend.onrender.com/api/health

Expected response:
```json
{
  "success": true,
  "message": "Edu Guide Mumbai API is running",
  "timestamp": "2026-01-23T..."
}
```

### 2. Test on Mobile
1. Open your Vercel URL on Oppo A3 Pro 5G
2. Click hamburger menu (☰)
3. Click "Login"
4. Enter credentials:
   - Email: hunnyfernandes27@gmail.com
   - Password: (your password)
5. Click "Login"
6. Should work! ✅

## Common Issues

### ❌ Backend shows "Application failed to respond"
**Cause**: Render free tier sleeps after 15 minutes of inactivity
**Fix**: Wait 30-60 seconds for the first request (cold start)

### ❌ Still getting CORS error
**Cause**: Vercel URL doesn't match CLIENT_URL in backend
**Fix**: 
1. Check your actual Vercel URL
2. Update CLIENT_URL in Render environment variables
3. Restart Render service

### ❌ "Network Error" on mobile
**Cause**: Frontend still using old cached version
**Fix**: 
1. Clear browser cache on phone
2. Or use incognito/private mode
3. Or wait 5 minutes for CDN cache to clear

## Important Notes

⚠️ **First Request Delay**: The first API call after 15 minutes of inactivity will take 30-60 seconds because Render's free tier puts the server to sleep. This is normal.

✅ **After First Request**: All subsequent requests will be fast (< 1 second)

💡 **To Avoid Sleep**: Upgrade to Render's paid plan ($7/month) or use a service like UptimeRobot to ping your backend every 10 minutes.

## Checklist

- [ ] Updated VITE_API_URL in Vercel to point to Render backend
- [ ] Redeployed frontend on Vercel
- [ ] Tested backend health endpoint
- [ ] Tested login on mobile device
- [ ] Login works! 🎉

---

**Need more help?** Check `QUICK_DEPLOY.md` for full deployment guide.
