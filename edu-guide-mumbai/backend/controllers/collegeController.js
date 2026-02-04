const { promisePool } = require("../config/database");
const {
  validateSortField,
  validateSortOrder,
  validatePagination,
} = require("../utils/queryValidator");

// @desc    Get all colleges with filters
// @route   GET /api/colleges
// @access  Public
const getColleges = async (req, res, next) => {
  try {
    const {
      search,
      stream,
      college_type,
      min_rating,
      max_fees,
      state,
      city,
      page = 1,
      limit = 12,
      sort_by = "college_name",
      order = "ASC",
    } = req.query;

    // Build query
    let query = `
            SELECT DISTINCT
                c.*,
                GROUP_CONCAT(DISTINCT s.stream_name) as streams,
                GROUP_CONCAT(DISTINCT f.facility_name) as facilities
            FROM colleges c
            LEFT JOIN college_streams cs ON c.college_id = cs.college_id
            LEFT JOIN streams s ON cs.stream_id = s.stream_id
            LEFT JOIN college_facilities cf ON c.college_id = cf.college_id
            LEFT JOIN facilities f ON cf.facility_id = f.facility_id
            WHERE c.status = 'active'
        `;

    const queryParams = [];

    // Search filter
    if (search) {
      query += " AND (c.college_name LIKE ? OR c.description LIKE ?)";
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Stream filter
    if (stream) {
      query += " AND s.stream_name = ?";
      queryParams.push(stream);
    }

    // College type filter
    if (college_type) {
      query += " AND c.college_type = ?";
      queryParams.push(college_type);
    }

    // State filter
    if (state) {
      query += " AND c.state = ?";
      queryParams.push(state);
    }

    // City filter
    if (city) {
      query += " AND c.city = ?";
      queryParams.push(city);
    }

    // Rating filter
    if (min_rating) {
      query += " AND c.average_rating >= ?";
      queryParams.push(parseFloat(min_rating));
    }

    query += " GROUP BY c.college_id";

    // Sorting - validate against whitelist
    const validSortFields = [
      "college_name",
      "average_rating",
      "established_year",
      "total_reviews",
    ];
    const validatedSortField = validateSortField(
      sort_by,
      validSortFields,
      "college_name"
    );
    const validatedOrder = validateSortOrder(order, "ASC");
    query += ` ORDER BY c.${validatedSortField} ${validatedOrder}`;

    // Pagination - validate and sanitize
    const {
      page: validatedPage,
      limit: validatedLimit,
      offset,
    } = validatePagination(page, limit);
    query += " LIMIT ? OFFSET ?";
    queryParams.push(validatedLimit, offset);

    // Execute query
    const [colleges] = await promisePool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = `
            SELECT COUNT(DISTINCT c.college_id) as total
            FROM colleges c
            LEFT JOIN college_streams cs ON c.college_id = cs.college_id
            LEFT JOIN streams s ON cs.stream_id = s.stream_id
            WHERE c.status = 'active'
        `;

    const countParams = [];
    if (search) {
      countQuery += " AND (c.college_name LIKE ? OR c.description LIKE ?)";
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (stream) {
      countQuery += " AND s.stream_name = ?";
      countParams.push(stream);
    }
    if (college_type) {
      countQuery += " AND c.college_type = ?";
      countParams.push(college_type);
    }
    if (state) {
      countQuery += " AND c.state = ?";
      countParams.push(state);
    }
    if (city) {
      countQuery += " AND c.city = ?";
      countParams.push(city);
    }
    if (min_rating) {
      countQuery += " AND c.average_rating >= ?";
      countParams.push(parseFloat(min_rating));
    }

    const [countResult] = await promisePool.query(countQuery, countParams);
    const totalColleges = countResult[0].total;
    const totalPages = Math.ceil(totalColleges / validatedLimit);

    res.json({
      success: true,
      data: colleges,
      pagination: {
        current_page: validatedPage,
        total_pages: totalPages,
        total_items: totalColleges,
        items_per_page: validatedLimit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single college details
// @route   GET /api/colleges/:id
// @access  Public
const getCollegeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get college basic info
    const [colleges] = await promisePool.query(
      'SELECT * FROM colleges WHERE college_id = ? AND status = "active"',
      [id]
    );

    if (colleges.length === 0) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    const college = colleges[0];

    // Get streams
    const [streams] = await promisePool.query(
      `
            SELECT s.*
            FROM streams s
            INNER JOIN college_streams cs ON s.stream_id = cs.stream_id
            WHERE cs.college_id = ?
        `,
      [id]
    );

    // Get courses
    const [courses] = await promisePool.query(
      'SELECT * FROM courses WHERE college_id = ? AND status = "active"',
      [id]
    );

    // Get facilities
    const [facilities] = await promisePool.query(
      `
            SELECT f.*, cf.details
            FROM facilities f
            INNER JOIN college_facilities cf ON f.facility_id = cf.facility_id
            WHERE cf.college_id = ?
        `,
      [id]
    );

    // Get admission info
    const [admissionInfo] = await promisePool.query(
      "SELECT * FROM admission_info WHERE college_id = ?",
      [id]
    );

    // Get placement info
    const [placements] = await promisePool.query(
      "SELECT * FROM placements WHERE college_id = ? ORDER BY academic_year DESC LIMIT 1",
      [id]
    );

    // Get reviews
    const [reviews] = await promisePool.query(
      `
            SELECT r.*, u.full_name as user_name
            FROM reviews r
            INNER JOIN users u ON r.user_id = u.user_id
            WHERE r.college_id = ? AND r.status = 'approved'
            ORDER BY r.created_at DESC
            LIMIT 10
        `,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...college,
        streams,
        courses,
        facilities,
        admission_info: admissionInfo[0] || null,
        placement_info: placements[0] || null,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured colleges (top rated)
// @route   GET /api/colleges/featured
// @access  Public
const getFeaturedColleges = async (req, res, next) => {
  try {
    const [colleges] = await promisePool.query(`
            SELECT
                c.*,
                GROUP_CONCAT(DISTINCT s.stream_name) as streams
            FROM colleges c
            LEFT JOIN college_streams cs ON c.college_id = cs.college_id
            LEFT JOIN streams s ON cs.stream_id = s.stream_id
            WHERE c.status = 'active' AND c.average_rating >= 4.0
            GROUP BY c.college_id
            ORDER BY c.average_rating DESC, c.total_reviews DESC
            LIMIT 6
        `);

    res.json({
      success: true,
      data: colleges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Compare colleges
// @route   POST /api/colleges/compare
// @access  Public
const compareColleges = async (req, res, next) => {
  try {
    const { college_ids } = req.body;

    if (!college_ids || !Array.isArray(college_ids) || college_ids.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least 2 college IDs to compare",
      });
    }

    if (college_ids.length > 4) {
      return res.status(400).json({
        success: false,
        message: "Maximum 4 colleges can be compared at once",
      });
    }

    const placeholders = college_ids.map(() => "?").join(",");

    // Get colleges with all details
    const [colleges] = await promisePool.query(
      `
            SELECT * FROM colleges
            WHERE college_id IN (${placeholders}) AND status = 'active'
        `,
      college_ids
    );

    if (colleges.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No colleges found",
      });
    }

    // Get additional details for each college
    const collegesWithDetails = await Promise.all(
      colleges.map(async (college) => {
        // Get streams
        const [streams] = await promisePool.query(
          `
                    SELECT s.stream_name
                    FROM streams s
                    INNER JOIN college_streams cs ON s.stream_id = cs.stream_id
                    WHERE cs.college_id = ?
                `,
          [college.college_id]
        );

        // Get facilities
        const [facilities] = await promisePool.query(
          `
                    SELECT f.facility_name
                    FROM facilities f
                    INNER JOIN college_facilities cf ON f.facility_id = cf.facility_id
                    WHERE cf.college_id = ?
                `,
          [college.college_id]
        );

        // Get placement info
        const [placements] = await promisePool.query(
          "SELECT * FROM placements WHERE college_id = ? ORDER BY academic_year DESC LIMIT 1",
          [college.college_id]
        );

        // Get fee range from courses
        const [feeRange] = await promisePool.query(
          "SELECT MIN(fees_per_year) as min_fee, MAX(fees_per_year) as max_fee FROM courses WHERE college_id = ?",
          [college.college_id]
        );

        return {
          ...college,
          streams: streams.map((s) => s.stream_name),
          facilities: facilities.map((f) => f.facility_name),
          placement_info: placements[0] || null,
          fee_range: feeRange[0],
        };
      })
    );

    // Save comparison history if user is logged in
    if (req.user) {
      await promisePool.query(
        "INSERT INTO comparison_history (user_id, college_ids) VALUES (?, ?)",
        [req.user.user_id, JSON.stringify(college_ids)]
      );
    }

    res.json({
      success: true,
      data: collegesWithDetails,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search colleges with autocomplete
// @route   GET /api/colleges/search/autocomplete
// @access  Public
const autocompleteSearch = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const [results] = await promisePool.query(
      `
            SELECT college_id, college_name, city, average_rating
            FROM colleges
            WHERE status = 'active' AND college_name LIKE ?
            ORDER BY average_rating DESC
            LIMIT 10
        `,
      [`%${q}%`]
    );

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getColleges,
  getCollegeById,
  getFeaturedColleges,
  compareColleges,
  autocompleteSearch,
};
