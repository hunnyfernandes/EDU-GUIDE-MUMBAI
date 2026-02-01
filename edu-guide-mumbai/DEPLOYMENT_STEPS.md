# EDU-GUIDE-MUMBAI: Step-by-Step Deployment Instructions

## Files Created for You

I've prepared the following modified files in `/mnt/okcomputer/output/deployment-files/`:

### Backend Files:
- `vercel.json` - Vercel serverless configuration
- `server.js` - Modified for Vercel deployment

### Frontend Files:
- `.env.production` - Environment variables template
- `vercel.json` - SPA routing configuration

---

## DEPLOYMENT STEPS

### STEP 1: Apply the Modified Files to Your Repository

Copy these files to your local repository:

```bash
# Navigate to your repository
cd /path/to/your/EDU-GUIDE-MUMBAI

# Copy backend files
cp /mnt/okcomputer/output/deployment-files/backend/vercel.json edu-guide-mumbai/backend/vercel.json
cp /mnt/okcomputer/output/deployment-files/backend/server.js edu-guide-mumbai/backend/server.js

# Copy frontend files  
cp /mnt/okcomputer/output/deployment-files/frontend/.env.production edu-guide-mumbai/frontend/.env.production
cp /mnt/okcomputer/output/deployment-files/frontend/vercel.json edu-guide-mumbai/frontend/vercel.json
```

---

### STEP 2: Deploy Backend First (IMPORTANT!)

#### 2.1 Push Backend to GitHub

```bash
cd edu-guide-mumbai/backend

# Add the new files
git add vercel.json server.js

# Commit
git commit -m "Prepare backend for Vercel deployment"

# Push
git push origin main
```

#### 2.2 Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com) and login
2. Click "Add New Project"
3. Import your GitHub repository: `hunnyfernandes/EDU-GUIDE-MUMBAI`
4. **Configure the project:**

   | Setting | Value |
   |---------|-------|
   | Project Name | `edu-guide-mumbai-api` |
   | Framework Preset | `Other` |
   | Root Directory | `edu-guide-mumbai/backend` |
   | Build Command | (leave empty) |
   | Output Directory | (leave empty) |

5. **Add Environment Variables** (click "Environment Variables"):

   | Variable | Value | Get From |
   |----------|-------|----------|
   | `NODE_ENV` | `production` | - |
   | `DB_HOST` | your-tidb-host | TiDB Cloud Dashboard |
   | `DB_PORT` | `4000` | TiDB Cloud Dashboard |
   | `DB_USER` | your-tidb-username | TiDB Cloud Dashboard |
   | `DB_PASSWORD` | your-tidb-password | TiDB Cloud Dashboard |
   | `DB_NAME` | your-database-name | TiDB Cloud Dashboard |
   | `DB_SSL` | `true` | - |
   | `JWT_SECRET` | random-string-32-chars | Generate one |
   | `JWT_EXPIRE` | `7d` | - |
   | `CLIENT_URL` | `https://placeholder.com` | Will update later |
   | `GOOGLE_API_KEY` | your-google-api-key | Google Cloud Console |

6. Click **"Deploy"**

7. Wait for deployment to complete (2-3 minutes)

8. **Get your backend URL:**
   - After deployment, you'll see a URL like: `https://edu-guide-mumbai-api.vercel.app`
   - **COPY THIS URL - you'll need it!**

---

### STEP 3: Update Frontend with Backend URL

#### 3.1 Edit .env.production

Open `edu-guide-mumbai/frontend/.env.production` and replace:

```env
# OLD:
VITE_API_URL=https://YOUR_BACKEND_URL.vercel.app/api

# NEW (example):
VITE_API_URL=https://edu-guide-mumbai-api.vercel.app/api
```

#### 3.2 Push Frontend Changes

```bash
cd edu-guide-mumbai/frontend

# Add files
git add .env.production vercel.json

# Commit
git commit -m "Prepare frontend for Vercel deployment"

# Push
git push origin main
```

---

### STEP 4: Deploy Frontend

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. **Configure the project:**

   | Setting | Value |
   |---------|-------|
   | Project Name | `edu-guide-mumbai` |
   | Framework Preset | `Vite` |
   | Root Directory | `edu-guide-mumbai/frontend` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

5. **Add Environment Variable:**

   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://your-backend-url.vercel.app/api` |

6. Click **"Deploy"**

7. Wait for deployment to complete

8. **Get your frontend URL** (e.g., `https://edu-guide-mumbai.vercel.app`)

---

### STEP 5: Update Backend CORS with Frontend URL

1. Go to your backend project in Vercel Dashboard
2. Go to **Settings → Environment Variables**
3. Find `CLIENT_URL` and update it:
   - Old: `https://placeholder.com`
   - New: `https://edu-guide-mumbai.vercel.app` (your actual frontend URL)
4. Go to **Deployments** tab
5. Find the latest deployment, click the three dots (⋯)
6. Click **"Redeploy"**

---

### STEP 6: Test Your Deployment

1. Open your frontend URL: `https://edu-guide-mumbai.vercel.app`
2. Check that the page loads
3. Open browser DevTools (F12) → Network tab
4. Try to:
   - View the colleges list
   - Register a new account
   - Login
5. Check that API calls are successful (200 status)

---

## TROUBLESHOOTING

### Issue: "Cannot connect to backend"

**Check:**
1. Backend health endpoint: `https://your-backend.vercel.app/api/health`
2. Frontend `VITE_API_URL` is correct
3. Backend `CLIENT_URL` matches frontend URL exactly

### Issue: "CORS error"

**Fix:**
1. Update `CLIENT_URL` in backend environment variables
2. Redeploy backend
3. Clear browser cache and try again

### Issue: "Database connection failed"

**Check TiDB Cloud:**
1. Go to TiDB Cloud Dashboard
2. Go to Security → IP Access List
3. Add `0.0.0.0/0` to allow all IPs (for testing)
4. Verify all DB environment variables are correct

### Issue: "Build failed"

**Check:**
1. Build logs in Vercel dashboard
2. Ensure `package.json` has correct scripts
3. For frontend: ensure `dist` folder exists after build

---

## DEPLOYMENT CHECKLIST

- [ ] Backend `vercel.json` copied to repository
- [ ] Backend `server.js` copied to repository
- [ ] Backend pushed to GitHub
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables added
- [ ] Backend URL copied
- [ ] Frontend `.env.production` updated with backend URL
- [ ] Frontend `vercel.json` copied to repository
- [ ] Frontend pushed to GitHub
- [ ] Frontend deployed to Vercel
- [ ] Backend `CLIENT_URL` updated with frontend URL
- [ ] Backend redeployed
- [ ] Application tested and working

---

## YOUR DEPLOYMENT FILES LOCATION

All files are ready at:
```
/mnt/okcomputer/output/deployment-files/
├── backend/
│   ├── vercel.json
│   └── server.js
└── frontend/
    ├── .env.production
    └── vercel.json
```

**Next:** Copy these files to your repository and follow the steps above.
