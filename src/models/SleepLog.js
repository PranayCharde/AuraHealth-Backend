const mongoose = require('mongoose');

const SleepLogSchema = new mongoose.Schema(
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
    duration: { type: String, default: '8h 12m' },
    totalMinutes: { type: Number, default: 492 },
    targetHours: { type: Number, default: 8.0 },
    score: { type: Number, default: 89, min: 0, max: 100 },
    status: { type: String, default: 'Restful Deep State' },
    bedtime: { type: String, default: '10:45 PM' },
    wakeTime: { type: String, default: '06:57 AM' },
    stages: {
      awake: { type: String, default: '32m' },
      awakePct: { type: Number, default: 6 },
      light: { type: String, default: '4h 15m' },
      lightPct: { type: Number, default: 52 },
      deep: { type: String, default: '1h 50m' },
      deepPct: { type: Number, default: 22 },
      rem: { type: String, default: '1h 35m' },
      remPct: { type: Number, default: 20 },
    },
    debtCut: { type: String, default: '-15m from baseline' },
    notes: { type: String, default: 'Optimal slow-wave sleep duration recorded.' },
    weeklyHistory: [
      {
        day: { type: String },
        hours: { type: Number },
        score: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

SleepLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('SleepLog', SleepLogSchema);

