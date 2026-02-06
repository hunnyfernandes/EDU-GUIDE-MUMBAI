const express = require("express");
const cors = require("cors");
const app = express();

// Basic middleware
app.use(express.json());
app.use(cors({ 
  origin: true, // Allow all for debug
  credentials: true 
}));

// Debug route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Minimal Server Active",
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  res.send("Minimal Server Root");
});

// Export for Vercel
module.exports = app;

// Local dev support
if (require.main === module) {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`Minimal Server running on port ${PORT}`);
  });
}
