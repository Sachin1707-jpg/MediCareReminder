const AdherenceLog = require('../models/AdherenceLog');
const DailyHealthLog = require('../models/DailyHealthLog');

// @desc    Get adherence analytics (taken vs missed over time)
// @route   GET /api/v1/analytics/adherence
// @access  Private
exports.getAdherenceAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // Default to last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. Overall Pie Chart Data (Total Taken vs Missed)
    const overallStats = await AdherenceLog.aggregate([
      { $match: { user: userId, dateLogged: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Format for frontend
    const pieData = { Taken: 0, Missed: 0, Snoozed: 0, Skipped: 0 };
    overallStats.forEach(stat => {
      pieData[stat._id] = stat.count;
    });

    // 2. Weekly Bar Chart Data (Daily breakdown for the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0,0,0,0);

    const weeklyStats = await AdherenceLog.aggregate([
      { $match: { user: userId, dateLogged: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$dateLogged" } },
            status: "$status"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        pieData,
        weeklyStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get health analytics (BMI, Water, Steps over time)
// @route   GET /api/v1/analytics/health
// @access  Private
exports.getHealthAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // Default to last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateString = thirtyDaysAgo.toISOString().split('T')[0];

    const healthLogs = await DailyHealthLog.find({
      user: userId,
      date: { $gte: dateString } // Using string comparison since YYYY-MM-DD sorts alphabetically correctly
    }).sort({ date: 1 });

    res.status(200).json({
      status: 'success',
      data: healthLogs
    });
  } catch (error) {
    next(error);
  }
};
