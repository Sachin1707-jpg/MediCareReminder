const DailyHealthLog = require('../models/DailyHealthLog');

// @desc    Get all health logs for user
// @route   GET /api/v1/health
// @access  Private
exports.getHealthLogs = async (req, res, next) => {
  try {
    const logs = await DailyHealthLog.find({ user: req.user.id }).sort({ date: 1 });
    res.status(200).json({
      status: 'success',
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save or update daily health log
// @route   POST /api/v1/health
// @access  Private
exports.saveHealthLog = async (req, res, next) => {
  try {
    const { date, weight, waterIntake, sleepHours, bloodPressure } = req.body;
    
    // Check if log already exists for this date
    let log = await DailyHealthLog.findOne({ user: req.user.id, date });
    
    if (log) {
      // Update existing
      log.weight = weight || log.weight;
      log.waterIntake = waterIntake || log.waterIntake;
      log.sleepHours = sleepHours || log.sleepHours;
      if (bloodPressure) log.bloodPressure = bloodPressure;
      
      await log.save();
    } else {
      // Create new
      log = await DailyHealthLog.create({
        user: req.user.id,
        date,
        weight,
        waterIntake,
        sleepHours,
        bloodPressure
      });
    }

    res.status(200).json({
      status: 'success',
      data: log,
    });
  } catch (error) {
    next(error);
  }
};
