# How to Connect MySQL Workbench to TiDB Cloud

1. Open MySQL Workbench.
2. Click the **(+)** icon next to "MySQL Connections".
3. Enter the following details:
   - **Connection Name**: Edu Guide TiDB (or any name you like)
   - **Hostname**: `gateway01.us-central-prod.aws.tidbcloud.com`
   - **Port**: `4000`
   - **Username**: `28Tj8jRq9PYA0ot.root` 
     *(Note: If that doesn't work, try `28Tj8jRq9PYA0ot`)*
   - **Password**: Click "Store in Vault..." and enter `nmPYTeOZXv4gkfP0`
   - **Default Schema**: `test`

4. **SSL Configuration** (Important for Cloud DBs):
   - Go to the **SSL** tab.
   - Set **Use SSL** to `Require` or `If Available`.

5. Click **Test Connection**.
   - If successful, click **OK**.

6. Open the connection to view your tables and data.
