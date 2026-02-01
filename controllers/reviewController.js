const { promisePool } = require("../config/database");
const {
  validateSortField,
  validateSortOrder,
  validatePagination,
} = require("../utils/queryValidator");

// @desc    Get reviews for a college
// @route   GET /api/reviews/college/:collegeId
// @access  Public
const getCollegeReviews = async (req, res, next) => {
  try {
    const { collegeId } = req.params;
    const {
      page = 1,
      limit = 10,
      sort_by = "created_at",
      order = "DESC",
    } = req.query;

    // Validate and sanitize query parameters
    const allowedSortFields = ["created_at", "rating", "helpful_count"];
    const validatedSortField = validateSortField(
      sort_by,
      allowedSortFields,
      "created_at"
    );
    const validatedOrder = validateSortOrder(order, "DESC");
    const {
      page: validatedPage,
      limit: validatedLimit,
      offset,
    } = validatePagination(page, limit);

    // Get reviews
    const [reviews] = await promisePool.query(
      `
            SELECT
                r.*,
                u.full_name as user_name
            FROM reviews r
            INNER JOIN users u ON r.user_id = u.user_id
            WHERE r.college_id = ? AND r.status = 'approved'
            ORDER BY r.${validatedSortField} ${validatedOrder}
            LIMIT ? OFFSET ?
        `,
      [collegeId, validatedLimit, offset]
    );

    // Get total count
    const [countResult] = await promisePool.query(
      'SELECT COUNT(*) as total FROM reviews WHERE college_id = ? AND status = "approved"',
      [collegeId]
    );

    const totalReviews = countResult[0].total;
    const totalPages = Math.ceil(totalReviews / validatedLimit);

    // Get rating distribution
    const [ratingDistribution] = await promisePool.query(
      `
            SELECT
                rating,
                COUNT(*) as count
            FROM reviews
            WHERE college_id = ? AND status = 'approved'
            GROUP BY rating
            ORDER BY rating DESC
        `,
      [collegeId]
    );

    res.json({
      success: true,
      data: reviews,
      rating_distribution: ratingDistribution,
      pagination: {
        current_page: validatedPage,
        total_pages: totalPages,
        total_items: totalReviews,
        items_per_page: validatedLimit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const {
      college_id,
      rating,
      review_title,
      review_text,
      course_studied,
      batch_year,
    } = req.body;
    const userId = req.user.user_id;

    // Validation
    if (!college_id || !rating || !review_text) {
      return res.status(400).json({
        success: false,
        message: "Please provide college, rating, and review text",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if college exists
    const [colleges] = await promisePool.query(
      "SELECT college_id FROM colleges WHERE college_id = ?",
      [college_id]
    );

    if (colleges.length === 0) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    // Check if user has already reviewed this college
    const [existingReviews] = await promisePool.query(
      "SELECT review_id FROM reviews WHERE college_id = ? AND user_id = ?",
      [college_id, userId]
    );

    if (existingReviews.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this college",
      });
    }

    // Create review
    const [result] = await promisePool.query(
      `
            INSERT INTO reviews (college_id, user_id, rating, review_title, review_text, course_studied, batch_year)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
      [
        college_id,
        userId,
        rating,
        review_title,
        review_text,
        course_studied,
        batch_year,
      ]
    );

    // Get created review
    const [reviews] = await promisePool.query(
      "SELECT * FROM reviews WHERE review_id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message:
        "Review submitted successfully. It will be visible after admin approval.",
      data: reviews[0],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, review_title, review_text, course_studied, batch_year } =
      req.body;
    const userId = req.user.user_id;

    // Check if review exists and belongs to user
    const [reviews] = await promisePool.query(
      "SELECT * FROM reviews WHERE review_id = ? AND user_id = ?",
      [id, userId]
    );

    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    // Build update query
    const updates = [];
    const values = [];

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }
      updates.push("rating = ?");
      values.push(rating);
    }
    if (review_title !== undefined) {
      updates.push("review_title = ?");
      values.push(review_title);
    }
    if (review_text) {
      updates.push("review_text = ?");
      values.push(review_text);
    }
    if (course_studied !== undefined) {
      updates.push("course_studied = ?");
      values.push(course_studied);
    }
    if (batch_year !== undefined) {
      updates.push("batch_year = ?");
      values.push(batch_year);
    }

    // Set status back to pending for re-approval
    updates.push("status = ?");
    values.push("pending");

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(id);

    await promisePool.query(
      `UPDATE reviews SET ${updates.join(", ")} WHERE review_id = ?`,
      values
    );

    // Get updated review
    const [updatedReviews] = await promisePool.query(
      "SELECT * FROM reviews WHERE review_id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Review updated successfully. It will be re-reviewed by admin.",
      data: updatedReviews[0],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    // Check if review exists and belongs to user
    const [reviews] = await promisePool.query(
      "SELECT * FROM reviews WHERE review_id = ? AND user_id = ?",
      [id, userId]
    );

    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    // Delete review
    await promisePool.query("DELETE FROM reviews WHERE review_id = ?", [id]);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Public
const markHelpful = async (req, res, next) => {
  try {
    const { id } = req.params;

    await promisePool.query(
      "UPDATE reviews SET helpful_count = helpful_count + 1 WHERE review_id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Thank you for your feedback",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const [reviews] = await promisePool.query(
      `
            SELECT
                r.*,
                c.college_name,
                c.city
            FROM reviews r
            INNER JOIN colleges c ON r.college_id = c.college_id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `,
      [userId]
    );

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCollegeReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  getMyReviews,
};
