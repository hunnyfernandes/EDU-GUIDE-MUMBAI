const { promisePool } = require('../config/database');

// @desc    Save/bookmark a college
// @route   POST /api/user/saved-colleges
// @access  Private
const saveCollege = async (req, res, next) => {
    try {
        const { college_id } = req.body;
        const userId = req.user.user_id;

        if (!college_id) {
            return res.status(400).json({
                success: false,
                message: 'Please provide college ID'
            });
        }

        // Check if college exists
        const [colleges] = await promisePool.query(
            'SELECT college_id FROM colleges WHERE college_id = ?',
            [college_id]
        );

        if (colleges.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'College not found'
            });
        }

        // Check if already saved
        const [existing] = await promisePool.query(
            'SELECT saved_id FROM saved_colleges WHERE user_id = ? AND college_id = ?',
            [userId, college_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'College already saved'
            });
        }

        // Save college
        await promisePool.query(
            'INSERT INTO saved_colleges (user_id, college_id) VALUES (?, ?)',
            [userId, college_id]
        );

        res.status(201).json({
            success: true,
            message: 'College saved successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get saved colleges
// @route   GET /api/user/saved-colleges
// @access  Private
const getSavedColleges = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        const [savedColleges] = await promisePool.query(`
            SELECT
                c.*,
                sc.created_at as saved_at,
                GROUP_CONCAT(DISTINCT s.stream_name) as streams
            FROM saved_colleges sc
            INNER JOIN colleges c ON sc.college_id = c.college_id
            LEFT JOIN college_streams cs ON c.college_id = cs.college_id
            LEFT JOIN streams s ON cs.stream_id = s.stream_id
            WHERE sc.user_id = ? AND c.status = 'active'
            GROUP BY c.college_id
            ORDER BY sc.created_at DESC
        `, [userId]);

        res.json({
            success: true,
            data: savedColleges
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove saved college
// @route   DELETE /api/user/saved-colleges/:collegeId
// @access  Private
const removeSavedCollege = async (req, res, next) => {
    try {
        const { collegeId } = req.params;
        const userId = req.user.user_id;

        const [result] = await promisePool.query(
            'DELETE FROM saved_colleges WHERE user_id = ? AND college_id = ?',
            [userId, collegeId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Saved college not found'
            });
        }

        res.json({
            success: true,
            message: 'College removed from saved list'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Check if college is saved
// @route   GET /api/user/saved-colleges/check/:collegeId
// @access  Private
const checkSavedCollege = async (req, res, next) => {
    try {
        const { collegeId } = req.params;
        const userId = req.user.user_id;

        const [saved] = await promisePool.query(
            'SELECT saved_id FROM saved_colleges WHERE user_id = ? AND college_id = ?',
            [userId, collegeId]
        );

        res.json({
            success: true,
            is_saved: saved.length > 0
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user dashboard stats
// @route   GET /api/user/dashboard
// @access  Private
const getDashboard = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        // Count saved colleges
        const [savedCount] = await promisePool.query(
            'SELECT COUNT(*) as count FROM saved_colleges WHERE user_id = ?',
            [userId]
        );

        // Count reviews
        const [reviewCount] = await promisePool.query(
            'SELECT COUNT(*) as count FROM reviews WHERE user_id = ?',
            [userId]
        );

        // Get recent saved colleges
        const [recentSaved] = await promisePool.query(`
            SELECT
                c.college_id,
                c.college_name,
                c.city,
                c.average_rating,
                sc.created_at as saved_at
            FROM saved_colleges sc
            INNER JOIN colleges c ON sc.college_id = c.college_id
            WHERE sc.user_id = ?
            ORDER BY sc.created_at DESC
            LIMIT 5
        `, [userId]);

        // Get recent reviews
        const [recentReviews] = await promisePool.query(`
            SELECT
                r.review_id,
                r.rating,
                r.review_title,
                r.status,
                r.created_at,
                c.college_name
            FROM reviews r
            INNER JOIN colleges c ON r.college_id = c.college_id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
            LIMIT 5
        `, [userId]);

        res.json({
            success: true,
            data: {
                stats: {
                    saved_colleges: savedCount[0].count,
                    total_reviews: reviewCount[0].count
                },
                recent_saved: recentSaved,
                recent_reviews: recentReviews
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Log search query
// @route   POST /api/user/search-history
// @access  Private
const logSearch = async (req, res, next) => {
    try {
        const { search_query, filters_applied, results_count } = req.body;
        const userId = req.user.user_id;

        if (!search_query || search_query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Insert into search_log
        await promisePool.query(
            `INSERT INTO search_log (user_id, search_query, filters_applied, results_count)
             VALUES (?, ?, ?, ?)`,
            [userId, search_query.trim(), JSON.stringify(filters_applied || {}), results_count || 0]
        );

        res.status(201).json({
            success: true,
            message: 'Search logged successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user search history
// @route   GET /api/user/search-history
// @access  Private
const getSearchHistory = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { limit = 10 } = req.query;

        const [searchHistory] = await promisePool.query(
            `SELECT 
                log_id,
                search_query,
                results_count,
                search_timestamp
            FROM search_log
            WHERE user_id = ?
            ORDER BY search_timestamp DESC
            LIMIT ?`,
            [userId, parseInt(limit)]
        );

        res.json({
            success: true,
            data: searchHistory
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get popular searches
// @route   GET /api/user/popular-searches
// @access  Public
const getPopularSearches = async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;

        const [popularSearches] = await promisePool.query(
            `SELECT 
                search_query,
                COUNT(*) as search_count,
                AVG(results_count) as avg_results,
                MAX(search_timestamp) as last_searched
            FROM search_log
            WHERE search_timestamp > DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY search_query
            ORDER BY search_count DESC
            LIMIT ?`,
            [parseInt(limit)]
        );

        res.json({
            success: true,
            data: popularSearches
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear search history
// @route   DELETE /api/user/search-history
// @access  Private
const clearSearchHistory = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        await promisePool.query(
            'DELETE FROM search_log WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'Search history cleared'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Log college view
// @route   POST /api/user/view-history
// @access  Private
const logView = async (req, res, next) => {
    try {
        const { college_id, college_name } = req.body;
        const userId = req.user.user_id;

        if (!college_id || !college_name) {
            return res.status(400).json({
                success: false,
                message: 'College ID and name are required'
            });
        }

        // Check if college exists
        const [colleges] = await promisePool.query(
            'SELECT college_id FROM colleges WHERE college_id = ?',
            [college_id]
        );

        if (colleges.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'College not found'
            });
        }

        // Insert view history (allow duplicates - user can view same college multiple times)
        await promisePool.query(
            'INSERT INTO view_history (user_id, college_id, college_name) VALUES (?, ?, ?)',
            [userId, college_id, college_name]
        );

        res.status(201).json({
            success: true,
            message: 'View logged successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user view history
// @route   GET /api/user/view-history
// @access  Private
const getViewHistory = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { limit = 10 } = req.query;

        const [viewHistory] = await promisePool.query(
            `SELECT 
                view_id,
                college_id,
                college_name,
                viewed_at
            FROM view_history
            WHERE user_id = ?
            ORDER BY viewed_at DESC
            LIMIT ?`,
            [userId, parseInt(limit)]
        );

        res.json({
            success: true,
            data: viewHistory
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get combined history (searches + views)
// @route   GET /api/user/history
// @access  Private
const getCombinedHistory = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { limit = 20 } = req.query;

        // Get search history
        const [searchHistory] = await promisePool.query(
            `SELECT 
                log_id as id,
                'search' as type,
                search_query as title,
                results_count,
                search_timestamp as timestamp,
                NULL as college_id
            FROM search_log
            WHERE user_id = ?`,
            [userId]
        );

        // Get view history
        const [viewHistory] = await promisePool.query(
            `SELECT 
                view_id as id,
                'view' as type,
                college_name as title,
                NULL as results_count,
                viewed_at as timestamp,
                college_id
            FROM view_history
            WHERE user_id = ?`,
            [userId]
        );

        // Combine and sort by timestamp
        const combinedHistory = [...searchHistory, ...viewHistory]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, parseInt(limit));

        res.json({
            success: true,
            data: combinedHistory
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear view history
// @route   DELETE /api/user/view-history
// @access  Private
const clearViewHistory = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        await promisePool.query(
            'DELETE FROM view_history WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'View history cleared'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    saveCollege,
    getSavedColleges,
    removeSavedCollege,
    checkSavedCollege,
    getDashboard,
    logSearch,
    getSearchHistory,
    getPopularSearches,
    clearSearchHistory,
    logView,
    getViewHistory,
    getCombinedHistory,
    clearViewHistory
};
