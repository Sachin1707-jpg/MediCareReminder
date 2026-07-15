const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a medicine name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Pill', 'Syrup', 'Injection', 'Drops', 'Inhaler', 'Other'],
      default: 'Pill'
    },
    dosage: {
      type: String,
      required: [true, 'Please add dosage information'],
    },
    frequency: {
      type: [String],
      enum: ['Morning', 'Afternoon', 'Night'],
      required: true,
    },
    reminderTimes: {
      type: [String], // Array of HH:mm strings
      required: true,
    },
    duration: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      }
    },
    doctorName: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    colorLabel: {
      type: String,
      default: '#3B82F6', // Default blue
    }
  },
  { timestamps: true }
);

// Indexes to speed up queries for a specific user and sorting by priority/date
MedicineSchema.index({ user: 1, 'duration.endDate': 1 });
MedicineSchema.index({ user: 1, priority: 1 });

module.exports = mongoose.model('Medicine', MedicineSchema);
