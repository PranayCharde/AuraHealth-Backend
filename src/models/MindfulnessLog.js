const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  title: { type: String, default: 'Box Breathing (Parasympathetic)' },
  duration: { type: String, default: '10 mins' },
  durationMinutes: { type: Number, default: 10 },
  technique: { type: String, default: 'Box Breathing' },
  time: { type: String, default: '07:30 AM' },
  hrvBoost: { type: String, default: '+14%' },
  timestamp: { type: Date, default: Date.now },
});

const MindfulnessLogSchema = new mongoose.Schema(
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
    completedMinutes: { type: Number, default: 15 },
    targetMinutes: { type: Number, default: 20 },
    hrvBoost: { type: String, default: '+14%' },
    sessions: [SessionSchema],
  },
  {
    timestamps: true,
  }
);

MindfulnessLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MindfulnessLog', MindfulnessLogSchema);

