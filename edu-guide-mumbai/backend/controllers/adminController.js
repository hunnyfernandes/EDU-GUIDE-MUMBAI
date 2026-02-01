const { promisePool } = require('../config/database');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
    try {
        // Get total colleges
        const [collegeCount] = await promisePool.query(
            'SELECT COUNT(*) as count FROM colleges WHERE status = "active"'
        );

        // Get total users
        const [userCount] = await promisePool.query(
            'SELECT COUNT(*) as count FROM users WHERE role = "student"'
        );

        // Get pending reviews
        const [pendingReviews] = await promisePool.query(
            'SELECT COUNT(*) as count FROM reviews WHERE status = "pending"'
        );

        // Get total reviews
        const [totalReviews] = await promisePool.query(
            'SELECT COUNT(*) as count FROM reviews'
        );

        // Get recent activities
        const [recentReviews] = await promisePool.query(`
            SELECT
                r.review_id,
                r.rating,
                r.status,
                r.created_at,
                u.full_name as user_name,
                c.college_name
            FROM reviews r
            INNER JOIN users u ON r.user_id = u.user_id
            INNER JOIN colleges c ON r.college_id = c.college_id
            ORDER BY r.created_at DESC
            LIMIT 10
        `);

        // Get top rated colleges
        const [topColleges] = await promisePool.query(`
            SELECT college_id, college_name, average_rating, total_reviews
            FROM colleges
            WHERE status = 'active' AND total_reviews > 0
            ORDER BY average_rating DESC
            LIMIT 5
        `);

        res.json({
            success: true,
            data: {
                stats: {
                    total_colleges: collegeCount[0].count,
                    total_users: userCount[0].count,
                    pending_reviews: pendingReviews[0].count,
                    total_reviews: totalReviews[0].count
                },
                recent_reviews: recentReviews,
                top_colleges: topColleges
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all pending reviews
// @route   GET /api/admin/reviews/pending
// @access  Private/Admin
const getPendingReviews = async (req, res, next) => {
    try {
        const [reviews] = await promisePool.query(`
            SELECT
                r.*,
                u.full_name as user_name,
                u.email as user_email,
                c.college_name
            FROM reviews r
            INNER JOIN users u ON r.user_id = u.user_id
            INNER JOIN colleges c ON r.college_id = c.college_id
            WHERE r.status = 'pending'
            ORDER BY r.created_at DESC
        `);

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve or reject review
// @route   PUT /api/admin/reviews/:id/status
// @access  Private/Admin
const updateReviewStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be "approved" or "rejected"'
            });
        }

        const [result] = await promisePool.query(
            'UPDATE reviews SET status = ? WHERE review_id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            message: `Review ${status} successfully`
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new college
// @route   POST /api/admin/colleges
// @access  Private/Admin
const createCollege = async (req, res, next) => {
    try {
        const {
            college_name,
            college_code,
            address,
            pincode,
            phone,
            email,
            website,
            established_year,
            college_type,
            affiliation,
            description,
            streams
        } = req.body;

        // Validation
        if (!college_name || !address) {
            return res.status(400).json({
                success: false,
                message: 'Please provide required fields'
            });
        }

        // Insert college
        const [result] = await promisePool.query(`
            INSERT INTO colleges (
                college_name, college_code, address, pincode, phone,
                email, website, established_year, college_type, affiliation, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            college_name, college_code, address, pincode, phone,
            email, website, established_year, college_type, affiliation, description
        ]);

        const collegeId = result.insertId;

        // Add streams if provided
        if (streams && Array.isArray(streams)) {
            for (const streamId of streams) {
                await promisePool.query(
                    'INSERT INTO college_streams (college_id, stream_id) VALUES (?, ?)',
                    [collegeId, streamId]
                );
            }
        }

        res.status(201).json({
            success: true,
            message: 'College created successfully',
            data: { college_id: collegeId }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update college
// @route   PUT /api/admin/colleges/:id
// @access  Private/Admin
const updateCollege = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Build update query dynamically
        const updates = [];
        const values = [];

        const allowedFields = [
            'college_name', 'college_code', 'address', 'pincode', 'phone',
            'email', 'website', 'established_year', 'college_type',
            'affiliation', 'description', 'status'
        ];

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(updateData[field]);
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        values.push(id);

        const [result] = await promisePool.query(
            `UPDATE colleges SET ${updates.join(', ')} WHERE college_id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'College not found'
            });
        }

        res.json({
            success: true,
            message: 'College updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete college
// @route   DELETE /api/admin/colleges/:id
// @access  Private/Admin
const deleteCollege = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Soft delete by setting status to inactive
        const [result] = await promisePool.query(
            'UPDATE colleges SET status = "inactive" WHERE college_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'College not found'
            });
        }

        res.json({
            success: true,
            message: 'College deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let query = 'SELECT user_id, full_name, email, phone, role, created_at FROM users WHERE 1=1';
        const queryParams = [];

        if (search) {
            query += ' AND (full_name LIKE ? OR email LIKE ?)';
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const [users] = await promisePool.query(query, queryParams);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
        const countParams = [];
        if (search) {
            countQuery += ' AND (full_name LIKE ? OR email LIKE ?)';
            countParams.push(`%${search}%`, `%${search}%`);
        }

        const [countResult] = await promisePool.query(countQuery, countParams);
        const totalUsers = countResult[0].total;
        const totalPages = Math.ceil(totalUsers / parseInt(limit));

        res.json({
            success: true,
            data: users,
            pagination: {
                current_page: parseInt(page),
                total_pages: totalPages,
                total_items: totalUsers,
                items_per_page: parseInt(limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all streams
// @route   GET /api/admin/streams
// @access  Private/Admin
const getStreams = async (req, res, next) => {
    try {
        const [streams] = await promisePool.query('SELECT * FROM streams ORDER BY stream_name');

        res.json({
            success: true,
            data: streams
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload college logo
// @route   POST /api/admin/colleges/:id/logo
// @access  Private/Admin
const uploadCollegeLogo = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const { getFileUrl } = require('../middleware/upload');
        const logoUrl = getFileUrl(req.file.filename, 'logo');

        // Update college with logo URL
        const [result] = await promisePool.query(
            'UPDATE colleges SET logo_url = ? WHERE college_id = ?',
            [logoUrl, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'College not found'
            });
        }

        res.json({
            success: true,
            message: 'Logo uploaded successfully',
            data: {
                logo_url: logoUrl
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload college cover image
// @route   POST /api/admin/colleges/:id/cover-image
// @access  Private/Admin
const uploadCollegeCoverImage = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const { getFileUrl } = require('../middleware/upload');
        const coverImageUrl = getFileUrl(req.file.filename, 'cover_image');

        // Update college with cover image URL
        const [result] = await promisePool.query(
            'UPDATE colleges SET cover_image_url = ? WHERE college_id = ?',
            [coverImageUrl, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'College not found'
            });
        }

        res.json({
            success: true,
            message: 'Cover image uploaded successfully',
            data: {
                cover_image_url: coverImageUrl
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getPendingReviews,
    updateReviewStatus,
    createCollege,
    updateCollege,
    deleteCollege,
    uploadCollegeLogo,
    uploadCollegeCoverImage,
    getUsers,
    getStreams
};
