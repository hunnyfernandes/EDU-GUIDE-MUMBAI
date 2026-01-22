# 🚨 IMPORTANT: Backend API URL Configuration for Production

## Issue
The search suggestions feature (and all API calls) require a backend API URL to be configured on Vercel.

## Solution

### Step 1: Set Up Environment Variable on Vercel
1. Go to https://vercel.com/dashboard
2. Find and click on your **edu-guide-mumbai** project
3. Click **Settings** → **Environment Variables**
4. Click **Add New**
5. Fill in:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: Enter your backend server URL (example: `https://your-backend-server.com/api`)
   - **Environments**: Select `Production`, `Preview`, and `Development`
6. Click **Save**

### Step 2: Redeploy on Vercel
1. In Vercel Dashboard, go to **Deployments**
2. Click the three dots (...) on the latest deployment
3. Select **Redeploy**
4. This will rebuild with the new environment variable

### Step 3: Verify the Feature Works
1. Open https://build-1iw8jzbol-hunnys-projects-a5d9492d.vercel.app/colleges
2. Type in the search box (e.g., "Engineering")
3. You should see a dropdown with search suggestions
4. Click on a suggestion to filter by that college

## Environment Variable Values

### Local Development
```
REACT_APP_API_URL=http://localhost:5002/api
```

### Production (Vercel)
```
REACT_APP_API_URL=https://your-actual-backend-domain.com/api
```

Replace `your-actual-backend-domain.com` with your real backend server URL.

## Vercel Backend URL Options

### Option 1: Render/Railway/Heroku Backend
- If your backend is hosted on these platforms, use the provided domain
- Example: `https://edu-guide-backend-xyz.onrender.com/api`

### Option 2: Your Own VPS/Server
- Use your server's domain or IP
- Example: `https://api.edu-guide.com/api`

### Option 3: AWS/GCP/Azure Backend
- Use the service's provided URL
- Example: `https://your-aws-instance.compute.amazonaws.com/api`

## Features That Require Backend API URL

✅ **College Search** - Filters colleges by search query
✅ **Search Suggestions** - Shows autocomplete dropdown while typing
✅ **Stream/Type Filtering** - Filters by engineering, commerce, etc.
✅ **College Details** - Loads full college information
✅ **Reviews** - Loads and posts reviews
✅ **Saved Colleges** - Save colleges to your profile
✅ **Comparison** - Compare multiple colleges

## Testing the Connection

### Test from Browser Console
```javascript
// Open browser DevTools (F12)
// Go to Console tab
// Paste this command:
fetch('https://your-backend-url/api/colleges/search/autocomplete?q=st')
  .then(r => r.json())
  .then(d => console.log(d))
```

If you see results with college names, the connection is working!

## Common Issues & Solutions

### Issue: Search suggestions not showing
**Solution**: 
- Check that `REACT_APP_API_URL` is set in Vercel
- Verify backend server is running and accessible
- Check browser console (F12) for CORS errors

### Issue: "Failed to load colleges" error
**Solution**:
- Verify `REACT_APP_API_URL` is correct
- Check backend is responding to `/api/colleges` endpoint
- Ensure backend has CORS enabled for your Vercel domain

### Issue: 404 errors on API calls
**Solution**:
- Verify the API URL path ends with `/api`
- Check that backend routes are correctly configured
- Ensure backend is on the correct port

## After Setting Environment Variable

Once you set the environment variable and redeploy:

✅ **All Features Will Work**:
- Search suggestions dropdown
- College filtering
- Reviews system
- Save/compare colleges
- User authentication
- Analytics

## Need Help?

1. Check Vercel Deployment Logs:
   - Deployments → Click latest → View logs
   - Look for any build errors

2. Test Backend Connectivity:
   - Open DevTools (F12)
   - Go to Network tab
   - Try a search
   - Check if API requests are succeeding (green 200 status)

3. Backend Health Check:
   - Visit: `https://your-backend-url/api/health` or `https://your-backend-url/api/colleges/featured`
   - Should return valid JSON response

---

**Status**: The search suggestions feature code is deployed ✅
**Next Step**: Set `REACT_APP_API_URL` environment variable on Vercel 🔑
**Expected Result**: All features work on production 🚀
