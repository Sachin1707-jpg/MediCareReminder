const Medicine = require('../models/Medicine');
const AdherenceLog = require('../models/AdherenceLog');
const AppError = require('../utils/AppError');

// Helper to determine if a time string (HH:mm) has passed relative to now
const isTimePassed = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  return now > target;
};

// @desc    Get dashboard statistics for the logged in user
// @route   GET /api/v1/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 1. Fetch all active medicines for today
    const activeMedicines = await Medicine.find({
      user: userId,
      'duration.startDate': { $lte: endOfToday },
      'duration.endDate': { $gte: startOfToday },
    });

    // 2. Fetch today's adherence logs
    const todayLogs = await AdherenceLog.find({
      user: userId,
      dateLogged: { $gte: startOfToday, $lte: endOfToday }
    }).populate('medicine', 'name colorLabel');

    // 3. Calculate metrics
    let totalScheduledToday = 0;
    let upcomingMedicines = [];
    let missedMedicines = [];
    
    activeMedicines.forEach((med) => {
      totalScheduledToday += med.reminderTimes.length;
      
      med.reminderTimes.forEach((time) => {
        // Check if there is a log for this specific medicine and time today
        const log = todayLogs.find(
          l => l.medicine._id.toString() === med._id.toString() && l.scheduledTime === time
        );

        if (!log) {
          if (isTimePassed(time)) {
            missedMedicines.push({ medicine: med, time });
          } else {
            upcomingMedicines.push({ medicine: med, time });
          }
        } else if (log.status === 'Missed') {
          missedMedicines.push({ medicine: med, time });
        }
      });
    });

    const takenCount = todayLogs.filter(log => log.status === 'Taken').length;
    
    // 4. Calculate Completion Percentage
    let completionPercentage = 0;
    if (totalScheduledToday > 0) {
      completionPercentage = Math.round((takenCount / totalScheduledToday) * 100);
    }

    // 5. Recent Activity (Last 5 logs globally)
    const recentActivity = await AdherenceLog.find({ user: userId })
      .sort({ dateLogged: -1 })
      .limit(5)
      .populate('medicine', 'name colorLabel priority');

    res.status(200).json({
      status: 'success',
      data: {
        metrics: {
          totalScheduledToday,
          takenCount,
          upcomingCount: upcomingMedicines.length,
          missedCount: missedMedicines.length,
          completionPercentage
        },
        upcomingMedicines: upcomingMedicines.slice(0, 5), // Top 5
        missedMedicines: missedMedicines.slice(0, 5), // Top 5
        recentActivity
      },
    });
  } catch (error) {
    next(error);
  }
};
