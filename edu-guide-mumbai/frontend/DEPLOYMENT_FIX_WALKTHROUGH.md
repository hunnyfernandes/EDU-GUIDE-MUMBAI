# Serverless Function Migration Walkthrough

This document details the critical changes made to migrate the backend from a monolithic Express application to Vercel Serverless Functions, resolving the persistent `504 Gateway Timeout` errors and fixing search/history issues.

## Problem
The initial deployment used `serverless-http` to wrap the entire `server.js` application. This caused:
- **Cold Boot Timeouts**: Loading all middleware, controllers, and database connections took longer than Vercel's 10s limit.
- **504 Gateway Timeouts**: The API became unresponsive.
- **Search Issues**: Search was case-sensitive, returning no results for "somaiya" vs "Somaiya".
- **History Issues**: User history endpoints were timing out.

## Solution
We refactored the backend to use **Native Vercel Handlers** for critical routes, bypassing the Express overhead entirely while reusing the existing controller logic.

### 1. Dedicated API Handlers
Created specific handlers for each feature group:
- `frontend/api/auth.js`: Handles all authentication routes (`/login`, `/register`, etc.)
- `frontend/api/colleges.js`: Handles all college-related routes (`/colleges`, `/colleges/featured`, etc.)
- `frontend/api/user.js`: Handles user history and dashboard (`/history`, `/saved-colleges`, etc.)

These handlers export a native `(req, res) => { ... }` function expected by Vercel.

### 2. Native Wrapper Utility (`frontend/utils/nativeWrapper.js`)
To reuse the existing Express controllers without rewriting them, we created a utility that:
- Adapts the native Vercel `res` object to support Express methods like `.status()`, `.json()`, and `.cookie()`.
- Wraps controller execution in a `try-catch` block.
- Mocks the `next()` function to handle errors gracefully.

### 3. Manual Routing Dispatch
Instead of `express.Router()`, the native handlers use simple conditional logic to dispatch requests based on `req.method` and `req.query.path`:

**Example (Auth):**
```javascript
const path = req.query.path;
if (req.method === 'POST' && path === 'login') {
    await nativeWrapper(authController.login)(req, res);
}
```

This approach is extremely lightweight and fast.

### 4. Vercel Configuration (`vercel.json`)
Updated rewrites to route requests to the new handlers:
```json
{
  "functions": {
    "api/**/*.js": { "maxDuration": 10 }
  },
  "rewrites": [
    { "source": "/api/auth/:path*", "destination": "/api/auth.js" },
    { "source": "/api/colleges/:path*", "destination": "/api/colleges.js" },
    { "source": "/api/user/:path*", "destination": "/api/user.js" }
  ]
}
```

### 5. Search Logic Update
Modified `collegeController.js` to use `LOWER(column) LIKE LOWER(?)` for case-insensitive search, ensuring terms like "somaiya" match "Somaiya".

## Verification
We verified the fix by deploying and running test scripts against the live API:
- `POST /api/auth/login`: Confirmed working.
- `GET /api/colleges`: Confirmed working.
- `GET /api/colleges/featured`: Confirmed working.
- `GET /api/user/popular-searches`: Confirmed working (User API active).
- **Search**: Verified "somaiya" returns "K.J. Somaiya College".

## Next Steps for Development
- When adding new routes, update the corresponding `api/*.js` handler with a new `else if` block.
- Ensure any new middleware is compatible with the `nativeWrapper` or manually invoked.
