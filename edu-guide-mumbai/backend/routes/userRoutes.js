const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// Public route
router.get('/popular-searches', getPopularSearches);

// All other user routes require authentication
router.use(verifyToken);

router.get('/dashboard', getDashboard);
router.post('/saved-colleges', saveCollege);
router.get('/saved-colleges', getSavedColleges);
router.delete('/saved-colleges/:collegeId', removeSavedCollege);
router.get('/saved-colleges/check/:collegeId', checkSavedCollege);

// Search history routes
router.post('/search-history', logSearch);
router.get('/search-history', getSearchHistory);
router.delete('/search-history', clearSearchHistory);

// View history routes
router.post('/view-history', logView);
router.get('/view-history', getViewHistory);
router.delete('/view-history', clearViewHistory);

// Combined history route
router.get('/history', getCombinedHistory);

module.exports = router;
