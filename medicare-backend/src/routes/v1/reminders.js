const express = require('express');
const { logAdherence, getAdherenceLogs } = require('../../controllers/adherenceController');
const { protect } = require('../../middlewares/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(logAdherence)
  .get(getAdherenceLogs);

module.exports = router;
