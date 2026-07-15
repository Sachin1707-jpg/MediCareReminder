const AdherenceLog = require('../models/AdherenceLog');
const Medicine = require('../models/Medicine');

// @desc    Log medicine adherence (Taken/Missed)
// @route   POST /api/v1/reminders
// @access  Private
exports.logAdherence = async (req, res, next) => {
  try {
    const { medicineId, scheduledTime, status } = req.body;
    
    // Check if medicine exists and belongs to user
    const medicine = await Medicine.findOne({ _id: medicineId, user: req.user.id });
    if (!medicine) {
      return res.status(404).json({ status: 'fail', message: 'Medicine not found' });
    }

    const log = await AdherenceLog.create({
      user: req.user.id,
      medicine: medicineId,
      scheduledTime,
      status,
      dateLogged: new Date()
    });

    res.status(201).json({ status: 'success', data: log });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all adherence logs
// @route   GET /api/v1/reminders
// @access  Private
exports.getAdherenceLogs = async (req, res, next) => {
  try {
    const logs = await AdherenceLog.find({ user: req.user.id })
      .populate('medicine', 'name dosage')
      .sort({ dateLogged: -1 });
    res.status(200).json({ status: 'success', data: logs });
  } catch (error) {
    next(error);
  }
};
