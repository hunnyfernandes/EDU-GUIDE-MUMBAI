const express = require("express");
const app = express();

// Minimal health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy (minimal)" });
});

// Needed for Vercel
module.exports = app;

// Local dev support
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
