# How to Connect MySQL Workbench to TiDB Cloud & Vercel

## 1. Get Correct Connection Details from TiDB Cloud
You need the **correct Hostname** and **Username** because the one you provided (`gateway01.us-central-prod...`) is invalid.

1.  Log in to [TiDB Cloud Console](https://tidbcloud.com/).
2.  Go to your Cluster (e.g., "Cluster0").
3.  Click the **"Connect"** button (top right).
4.  In the "Connect with" dropdown, select **"General"** or **"MySQL Client"**.
5.  Copy the following details:
    *   **Host**: It will look like `gateway01.us-east-1.prod.aws.tidbcloud.com` or `gateway01.us-west-2...`.
    *   **Port**: `4000`
    *   **User**: It will look like `28Tj8jRq9PYA0ot.root`. (Note the `.root` suffix!)
    *   **Password**: The one you created (e.g., `nmPYTeOZXv4gkfP0`).

## 2. Update Vercel Environment Variables (CRITICAL)
The reason your features are not working is that Vercel is connected to an **OLD or DIFFERENT** database (EU Region) which is likely empty. You must update Vercel to use the NEW database.

1.  Go to your Vercel Project Dashboard.
2.  Click **Settings** > **Environment Variables**.
3.  Edit the following variables with the new values from Step 1:
    *   `DB_HOST`
    *   `DB_USER`
    *   `DB_PASSWORD`
    *   `DB_NAME` (usually `test`)
    *   `DB_SSL` (set to `true`)
4.  **Redeploy** your application (Go to Deployments -> Redeploy) for changes to take effect.

## 3. Connect MySQL Workbench
1.  Open MySQL Workbench.
2.  Click the **(+)** icon next to "MySQL Connections".
3.  Fill in the details:
    *   **Connection Name**: `TiDB Cloud`
    *   **Hostname**: The Host from Step 1.
    *   **Port**: `4000`
    *   **Username**: The User from Step 1 (e.g., `28Tj8jRq9PYA0ot.root`).
    *   **Password**: Click "Store in Vault" and enter your password.
4.  Click **"Test Connection"**.
5.  If successful, click **OK**.

Now you can see your tables and data in Workbench!
