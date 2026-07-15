const mongoose = require('mongoose');

const AdherenceLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    medicine: {
      type: mongoose.Schema.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    scheduledTime: {
      type: String, // HH:mm format
      required: true,
    },
    status: {
      type: String,
      enum: ['Taken', 'Missed', 'Skipped', 'Snoozed'],
      default: 'Taken',
    },
    snoozedUntil: {
      type: Date,
      default: null, // Populated if status is 'Snoozed'
    },
    dateLogged: {
      type: Date,
      default: Date.now, // Will represent the actual day it was taken
    }
  },
  { timestamps: true }
);

// Indexes for faster dashboard metric aggregations
AdherenceLogSchema.index({ user: 1, dateLogged: -1 });
AdherenceLogSchema.index({ user: 1, medicine: 1, dateLogged: -1 });

module.exports = mongoose.model('AdherenceLog', AdherenceLogSchema);
