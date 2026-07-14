const express = require('express');
const { getHealthLogs, saveHealthLog } = require('../../controllers/healthController');
const { protect } = require('../../middlewares/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getHealthLogs)
  .post(saveHealthLog);

module.exports = router;
