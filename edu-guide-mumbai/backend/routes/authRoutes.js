const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  changePassword,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
} = require("../middleware/validators");

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs (prevents brute force)
  message: {
    success: false,
    message:
      "Too many authentication attempts from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Public routes with rate limiting and validation
router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.post("/refresh-token", refreshToken);
router.get("/verify-email", verifyEmail);
router.post(
  "/forgot-password",
  authLimiter,
  validateForgotPassword,
  forgotPassword
);
router.post(
  "/reset-password",
  authLimiter,
  validateResetPassword,
  resetPassword
);

// Private routes with validation
router.get("/me", verifyToken, getMe);
router.post("/logout", verifyToken, logout);
router.put("/profile", verifyToken, validateUpdateProfile, updateProfile);
router.put(
  "/change-password",
  verifyToken,
  validateChangePassword,
  changePassword
);
router.post("/resend-verification", verifyToken, resendVerificationEmail);

module.exports = router;
