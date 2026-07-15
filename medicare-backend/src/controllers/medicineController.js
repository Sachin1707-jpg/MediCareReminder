const Medicine = require('../models/Medicine');
const AppError = require('../utils/AppError');

// @desc    Get all medicines for logged in user (with pagination, search, filter)
// @route   GET /api/v1/medicines
// @access  Private
exports.getMedicines = async (req, res, next) => {
  try {
    const { search, category, priority, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { user: req.user.id };

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Pagination setup
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    // Execute query
    const medicines = await Medicine.find(query)
      .sort({ 'duration.endDate': 1 }) // Sort by soonest end date
      .skip(startIndex)
      .limit(limitNum);

    const total = await Medicine.countDocuments(query);

    res.status(200).json({
      status: 'success',
      count: medicines.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
      data: medicines,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single medicine
// @route   GET /api/v1/medicines/:id
// @access  Private
exports.getMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!medicine) {
      return next(new AppError(`No medicine found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: medicine,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new medicine
// @route   POST /api/v1/medicines
// @access  Private
exports.createMedicine = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const medicine = await Medicine.create(req.body);

    res.status(201).json({
      status: 'success',
      data: medicine,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update medicine
// @route   PUT /api/v1/medicines/:id
// @access  Private
exports.updateMedicine = async (req, res, next) => {
  try {
    let medicine = await Medicine.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!medicine) {
      return next(new AppError(`No medicine found with id ${req.params.id}`, 404));
    }

    medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: medicine,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete medicine
// @route   DELETE /api/v1/medicines/:id
// @access  Private
exports.deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!medicine) {
      return next(new AppError(`No medicine found with id ${req.params.id}`, 404));
    }

    await medicine.deleteOne();

    res.status(200).json({
      status: 'success',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
