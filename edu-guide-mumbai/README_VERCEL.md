# Vercel Deployment Guide

## Which Folder to Deploy?
**IMPORTANT:** You should deploy the **`frontend`** folder. 
This project is configured as a "Monorepo" where the frontend also contains the backend API (in `frontend/api`).

- **Root Directory**: `edu-guide-mumbai/frontend` (or just `frontend` if you are in the repo root).
- **Framework Preset**: Vite
- **Build Command**: `vite build`
- **Output Directory**: `dist`

## Environment Variables
You MUST set the environment variables in Vercel for the application to work.
1. Open `VERCEL_ENV_VALUES.txt` in this repository.
2. Copy the values.
3. Go to Vercel > Settings > Environment Variables.
4. Paste the values.

## Database Connection
The application is configured to connect to TiDB Cloud.
- Ensure `DB_USER` is correct (try with `.root` suffix first).
- Use `CONNECT_WORKBENCH_GUIDE.md` to connect your local MySQL Workbench to the same database.

## Troubleshooting
- If you see "Function Invocation Failed", check the Vercel Logs.
- If features aren't working, check the Browser Console (F12) for network errors.
