const mongoose = require('mongoose');

const WaterEntrySchema = new mongoose.Schema({
  amount: { type: Number, required: true }, // in ml
  time: { type: String, default: '12:00 PM' },
  timestamp: { type: Number, default: () => Date.now() },
});

const HydrationLogSchema = new mongoose.Schema(
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
    target: { type: Number, default: 2800 }, // in ml
    logs: [WaterEntrySchema],
  },
  {
    timestamps: true,
  }
);

HydrationLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HydrationLog', HydrationLogSchema);

