const express = require('express');
const {
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} = require('../../controllers/medicineController');

const Medicine = require('../../models/Medicine');

// Middleware
const { protect } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { medicineSchema } = require('../../validators/medicineValidator');

const router = express.Router();

// Apply protect middleware to all medicine routes
router.use(protect);

router
  .route('/')
  .get(getMedicines)
  .post(validate(medicineSchema), createMedicine);

router
  .route('/:id')
  .get(getMedicine)
  .put(validate(medicineSchema), updateMedicine)
  .delete(deleteMedicine);

module.exports = router;
