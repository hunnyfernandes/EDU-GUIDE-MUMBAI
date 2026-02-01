const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { uploadLogo, uploadCoverImage, handleUploadError } = require('../middleware/upload');

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(isAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Reviews management
router.get('/reviews/pending', getPendingReviews);
router.put('/reviews/:id/status', updateReviewStatus);

// College management
router.post('/colleges', createCollege);
router.put('/colleges/:id', updateCollege);
router.delete('/colleges/:id', deleteCollege);
router.post('/colleges/:id/logo', uploadLogo, handleUploadError, uploadCollegeLogo);
router.post('/colleges/:id/cover-image', uploadCoverImage, handleUploadError, uploadCollegeCoverImage);

// User management
router.get('/users', getUsers);

// Streams
router.get('/streams', getStreams);

module.exports = router;
