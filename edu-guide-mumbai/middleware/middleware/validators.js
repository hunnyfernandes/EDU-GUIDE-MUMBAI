const { body, param, query, validationResult } = require("express-validator");

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
const validateRegister = [
  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Full name can only contain letters and spaces"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must be exactly 10 digits"),

  handleValidationErrors,
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

/**
 * Validation rules for updating user profile
 */
const validateUpdateProfile = [
  body("full_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Full name can only contain letters and spaces"),

  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must be exactly 10 digits"),

  handleValidationErrors,
];

/**
 * Validation rules for changing password
 */
const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  handleValidationErrors,
];

/**
 * Validation rules for forgot password (request password reset)
 */
const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  handleValidationErrors,
];

/**
 * Validation rules for reset password
 */
const validateResetPassword = [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required")
    .isLength({ min: 64, max: 64 })
    .withMessage("Invalid reset token format"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  handleValidationErrors,
];

/**
 * Validation rules for creating a review
 */
const validateCreateReview = [
  body("college_id")
    .notEmpty()
    .withMessage("College ID is required")
    .isInt({ min: 1 })
    .withMessage("College ID must be a valid positive integer"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("review_text")
    .trim()
    .notEmpty()
    .withMessage("Review text is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Review text must be between 10 and 2000 characters"),

  body("review_title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Review title must not exceed 200 characters"),

  body("course_studied")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Course name must not exceed 100 characters"),

  body("batch_year")
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() + 5 })
    .withMessage("Batch year must be a valid year"),

  handleValidationErrors,
];

/**
 * Validation rules for updating a review
 */
const validateUpdateReview = [
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("review_text")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Review text must be between 10 and 2000 characters"),

  body("review_title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Review title must not exceed 200 characters"),

  body("course_studied")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Course name must not exceed 100 characters"),

  body("batch_year")
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() + 5 })
    .withMessage("Batch year must be a valid year"),

  handleValidationErrors,
];

/**
 * Validation rules for college ID parameter
 */
const validateCollegeId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("College ID must be a valid positive integer"),

  handleValidationErrors,
];

/**
 * Validation rules for review ID parameter
 */
const validateReviewId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Review ID must be a valid positive integer"),

  handleValidationErrors,
];

/**
 * Validation rules for query parameters (pagination, sorting)
 */
const validateQueryParams = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sort_by")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Sort field name is too long"),

  query("order")
    .optional()
    .trim()
    .isIn(["ASC", "DESC", "asc", "desc"])
    .withMessage("Order must be ASC or DESC"),

  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
  validateCreateReview,
  validateUpdateReview,
  validateCollegeId,
  validateReviewId,
  validateQueryParams,
  handleValidationErrors,
};
