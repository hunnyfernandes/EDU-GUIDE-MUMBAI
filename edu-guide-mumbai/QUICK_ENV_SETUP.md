# ⚡ QUICK START: Enable Search Suggestions on Production

## The Issue
Search suggestions feature works locally but not on production Vercel because the backend API URL is not configured.

## The Fix (3 minutes)

### 1️⃣ Go to Vercel
https://vercel.com/dashboard → Click **edu-guide-mumbai** → **Settings**

### 2️⃣ Add Environment Variable
**Environment Variables** → Click **Add New**

| Field | Value |
|-------|-------|
| Name | `REACT_APP_API_URL` |
| Value | `https://your-backend-url.com/api` |
| Environments | ✅ Production, Preview, Development |

### 3️⃣ Redeploy
**Deployments** → Click (...) on latest → **Redeploy**

---

## Example Backend URLs

```
Render:    https://edu-guide-backend.onrender.com/api
Railway:   https://edu-guide-api.up.railway.app/api
Heroku:    https://edu-guide-api.herokuapp.com/api
Local Dev: http://localhost:5002/api
VPS:       https://api.yourdomain.com/api
```

---

## Test It Works

1. Open: https://build-1iw8jzbol-hunnys-projects-a5d9492d.vercel.app/colleges
2. Type: **"st"**
3. See dropdown? ✅ It's working!

---

## That's It! 🎉

Search suggestions will now work on your production site.

**For detailed help**, see: **PRODUCTION_SYNC_GUIDE.md** or **VERCEL_SETUP.md**
