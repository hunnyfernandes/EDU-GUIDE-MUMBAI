const express = require('express');
const router = express.Router();
const {
    getColleges,
    getCollegeById,
    getFeaturedColleges,
    compareColleges,
    autocompleteSearch
} = require('../controllers/collegeController');
const { optionalAuth } = require('../middleware/auth');
const {
    validateCollegeId,
    validateQueryParams
} = require('../middleware/validators');
const { cacheMiddleware } = require('../middleware/cache');

// Public routes with validation and caching (5 minutes TTL)
router.get('/', cacheMiddleware(5 * 60 * 1000), validateQueryParams, getColleges);
router.get('/featured', cacheMiddleware(5 * 60 * 1000), getFeaturedColleges);
router.get('/search/autocomplete', cacheMiddleware(2 * 60 * 1000), autocompleteSearch);
router.get('/streams/all', cacheMiddleware(5 * 60 * 1000), async (req, res) => {
    try {
        const { promisePool } = require('../config/database');
        const [streams] = await promisePool.query('SELECT stream_id, stream_name, stream_code, description FROM streams ORDER BY stream_id');
        res.json({ data: streams });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch streams' });
    }
});
router.get('/:id', cacheMiddleware(5 * 60 * 1000), validateCollegeId, getCollegeById);
router.post('/compare', optionalAuth, compareColleges);

module.exports = router;
