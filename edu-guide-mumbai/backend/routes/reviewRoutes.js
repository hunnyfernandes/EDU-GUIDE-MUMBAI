const express = require("express");
const router = express.Router();
const {
  getCollegeReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  getMyReviews,
} = require("../controllers/reviewController");
const { verifyToken } = require("../middleware/auth");
const {
  validateCreateReview,
  validateUpdateReview,
  validateReviewId,
  validateQueryParams,
} = require("../middleware/validators");

// Public routes
router.get("/college/:collegeId", validateQueryParams, getCollegeReviews);
router.put("/:id/helpful", validateReviewId, markHelpful);

// Private routes with validation
router.post("/", verifyToken, validateCreateReview, createReview);
router.get("/my-reviews", verifyToken, getMyReviews);
router.put(
  "/:id",
  verifyToken,
  validateReviewId,
  validateUpdateReview,
  updateReview
);
router.delete("/:id", verifyToken, validateReviewId, deleteReview);

module.exports = router;
