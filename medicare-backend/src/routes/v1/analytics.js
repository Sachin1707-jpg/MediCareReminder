const express = require('express');
const { getAdherenceAnalytics, getHealthAnalytics } = require('../../controllers/analyticsController');
const { protect } = require('../../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/adherence', getAdherenceAnalytics);
router.get('/health', getHealthAnalytics);

module.exports = router;
