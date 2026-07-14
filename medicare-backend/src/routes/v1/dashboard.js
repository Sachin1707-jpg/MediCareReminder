const express = require('express');
const { getDashboardStats } = require('../../controllers/dashboardController');
const { protect } = require('../../middlewares/auth');

const router = express.Router();

// Apply auth middleware
router.use(protect);

router.get('/stats', getDashboardStats);

module.exports = router;
