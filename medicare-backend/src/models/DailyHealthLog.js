const mongoose = require('mongoose');

const DailyHealthLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD format for easy querying and uniqueness
      required: true,
    },
    waterIntake: {
      type: Number, // In milliliters (ml)
      default: 0,
    },
    steps: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number, // In kg
    },
    bmi: {
      type: Number, // Calculated on frontend or before save
    },
    heartRate: {
      type: Number, // bpm
    },
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
    },
    sugarLevel: {
      type: Number, // mg/dL
    },
    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
    },
  },
  { timestamps: true }
);

// Ensure a user only has ONE log per day
DailyHealthLogSchema.index({ user: 1, date: 1 }, { unique: true });
// Index for history querying (e.g. get logs from the last 30 days)
DailyHealthLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('DailyHealthLog', DailyHealthLogSchema);
