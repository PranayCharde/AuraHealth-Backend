const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: String, default: '45 mins' },
  durationMinutes: { type: Number, default: 45 },
  calories: { type: Number, default: 350 },
  avgHr: { type: Number, default: 138 },
  maxHr: { type: Number, default: 168 },
  time: { type: String, default: '05:30 PM' },
  intensity: { type: String, enum: ['Light', 'Moderate', 'Vigorous', 'Maximum'], default: 'Moderate' },
  loggedAt: { type: Date, default: Date.now },
});

const ActivityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    strain: { type: Number, default: 14.8, min: 0, max: 21 },
    strainTarget: { type: Number, default: 15.0 },
    calories: { type: Number, default: 620 },
    activeMinutes: { type: Number, default: 75 },
    streak: { type: Number, default: 12 },
    goalPct: { type: Number, default: 98 },
    workouts: [WorkoutSchema],
    weeklyStrain: [
      {
        day: { type: String },
        value: { type: Number },
        heightPct: { type: Number },
        label: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ActivityLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);

