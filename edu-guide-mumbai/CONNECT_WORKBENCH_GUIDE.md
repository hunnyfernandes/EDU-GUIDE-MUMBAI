# 🚀 Ultimate Guide: Fix "No Features Working" & Connect Workbench

## Part 1: Fix "No Features Working" on Vercel
Your live website is currently **blind**. It doesn't know where your database is.
Even if you added data to TiDB, your Vercel website cannot see it until you add the **Environment Variables**.

1.  Go to **[Vercel Dashboard](https://vercel.com/dashboard)** > Select Project > **Settings** > **Environment Variables**.
2.  Add these exact variables (Copy from your TiDB Connect info):

| Variable Name | Value (Example - Use YOURS) |
|---------------|-----------------------------|
| `DB_HOST`     | `gateway01.us-east-1.prod.aws.tidbcloud.com` |
| `DB_PORT`     | `4000` |
| `DB_USER`     | `28Tj8jRq9PYA0ot.root` (Ensure `.root` is there if TiDB shows it!) |
| `DB_PASSWORD` | `nmPYTeOZXv4gkfP0` |
| `DB_NAME`     | `test` |
| `DB_SSL`      | `true` |
| `JWT_SECRET`  | `my-secret-key-123` |
| `CLIENT_URL`  | `https://frontend-edu-guide.vercel.app` |

3.  **IMPORTANT:** Go to **Deployments** and click **Redeploy** on the latest one.
    *   Without redeploying, the new variables won't load!

---

## Part 2: See Your Data in MySQL Workbench
You want to see the TiDB data in your local MySQL Workbench. This is easy!
You just need to create a **New Connection** that points to the Cloud instead of `localhost`.

1.  Open **MySQL Workbench**.
2.  Click the **(+)** icon next to "MySQL Connections".
3.  Fill in these details:
    *   **Connection Name**: `TiDB Cloud` (or whatever you want)
    *   **Hostname**: `gateway01.us-east-1.prod.aws.tidbcloud.com` (Your TiDB Host)
    *   **Port**: `4000`
    *   **Username**: `28Tj8jRq9PYA0ot.root` (Your TiDB User)
    *   **Password**: Click "Store in Vault" and enter `nmPYTeOZXv4gkfP0`
4.  Click **Test Connection**.
    *   If it says "Success", click **OK**.
5.  Open this connection. You will now see the tables (`users`, `colleges`, etc.) that are in the Cloud!

## Part 3: Verify Everything
1.  **Workbench**: Can you see the `users` table? Is it empty?
    *   If it's empty, run your `schema.sql` here (File > Open SQL Script).
2.  **Website**: Go to `https://frontend-edu-guide.vercel.app/signup`.
    *   Create a new user.
3.  **Workbench**: Click "Refresh" on the `users` table.
    *   You should see the new user appear instantly!

## Summary
*   **Vercel** needs credentials to **run** the app.
*   **Workbench** needs credentials to **view/edit** the data.
*   They both connect to the **SAME** TiDB Cloud database.
