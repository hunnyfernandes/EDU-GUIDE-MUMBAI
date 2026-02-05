
/* eslint-disable */
// Simple debug tool to check environment variables
// Access this via /api/debug-env (if routed) or check via console
console.log("=== ENV DEBUG ===");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_SSL:", process.env.DB_SSL);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("VERCEL:", process.env.VERCEL);
console.log("=================");
