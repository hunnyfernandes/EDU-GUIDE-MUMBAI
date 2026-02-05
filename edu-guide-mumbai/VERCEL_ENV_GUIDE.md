# 🚀 Final Setup: Connect Database & Configure Vercel

Great news! Your Backend is **ALIVE** (`/api/status` is "ok").
The only remaining step is to connect the Database and set the API Keys.

## Step 1: Get Correct TiDB Connection Details
My automatic attempts to connect failed because of a "Access Denied" error. This means the **Host** or **Username** is slightly different from what we tried.

1. Log in to **[TiDB Cloud Console](https://tidbcloud.com/)**.
2. Go to your Cluster (`Cluster0` or similar).
3. Click the **"Connect"** button (top right).
4. Select **"Connect with General"** (or Standard Connection).
5. **COPY** these exact values:
   - **Host**: (e.g., `gateway01.us-east-1.prod.aws.tidbcloud.com`)
   - **Port**: `4000`
   - **User**: (It usually looks like `28Tj8jRq9PYA0ot.root`. Make sure to include the `.root` part if shown!)
   - **Password**: (The one you created, `nmPYTeOZXv4gkfP0`)
   - **Database**: `test` (or `edu_guide_mumbai` if you created it)

## Step 2: Set Environment Variables in Vercel
1. Go to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Select your project: **`frontend-edu-guide`** (or `frontend-git-main...`).
3. Go to **Settings** > **Environment Variables**.
4. Add the following variables (copy-paste exactly):

| Variable Name | Value (Example / Your Data) |
|---------------|-----------------------------|
| `DB_HOST` | `gateway01.us-east-1.prod.aws.tidbcloud.com` (Use YOUR Host from Step 1) |
| `DB_PORT` | `4000` |
| `DB_USER` | `28Tj8jRq9PYA0ot.root` (Use YOUR User from Step 1) |
| `DB_PASSWORD` | `nmPYTeOZXv4gkfP0` |
| `DB_NAME` | `test` |
| `DB_SSL` | `true` |
| `JWT_SECRET` | `my-secret-key-123` (Or any random string) |
| `GEMINI_API_KEY` | `AIzaSyB2DUFGTtbtqXsa1hW3Y-GrktWLsOmPbUk` |
| `AI_PROVIDER` | `gemini` |
| `CLIENT_URL` | `https://frontend-edu-guide.vercel.app` |

5. **IMPORTANT**: After adding these, go to the **Deployments** tab and click **Redeploy** on the latest commit (or push a small change) for them to take effect.

## Step 3: Initialize the Database (Create Tables)
Since I couldn't connect automatically, you need to create the tables manually in TiDB.

1. In the TiDB Cloud Console, click on **"SQL Editor"** (left sidebar).
2. Paste the content of the `database/schema.sql` file (from your project) into the editor.
3. Click **Run**.
   - This will create the `users`, `colleges`, `streams`, etc. tables.

## Step 4: Verify
1. Open `https://frontend-edu-guide.vercel.app/`
2. Try to **Sign Up** or view **Colleges**.
3. It should work now!
