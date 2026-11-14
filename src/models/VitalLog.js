const mongoose = require('mongoose');

const EcgRecordSchema = new mongoose.Schema({
  title: { type: String, default: 'Manual Single-Lead Rhythm' },
  time: { type: String, default: 'Today' },
  rhythm: { type: String, default: 'Normal Sinus Rhythm' },
  bpm: { type: Number, default: 64 },
  qtc: { type: Number, default: 410 },
  tag: { type: String, default: 'Manual Assessment' },
  notes: { type: String, default: 'Clinical rhythm confirmed by user.' },
  doctor: { type: String, default: 'Self-Recorded' },
  recordedAt: { type: Date, default: Date.now },
});

const VitalLogSchema = new mongoose.Schema(
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
    heartRate: {
      current: { type: Number, default: 64 },
      resting: { type: Number, default: 58 },
      hrv: { type: Number, default: 78 },
      status: { type: String, default: 'Normal Sinus Rhythm' },
      lastUpdated: { type: String, default: 'Just now' },
      history: [
        {
          time: { type: String },
          bpm: { type: Number },
          hrv: { type: Number },
        },
      ],
    },
    bloodPressure: {
      systolic: { type: Number, default: 118 },
      diastolic: { type: Number, default: 76 },
      map: { type: Number, default: 90 },
      pulse: { type: Number, default: 62 },
      category: { type: String, default: 'Optimal' },
      timestamp: { type: String, default: 'Today, 08:30 AM' },
    },
    bloodGlucose: {
      value: { type: Number, default: 94 },
      unit: { type: String, default: 'mg/dL' },
      state: { type: String, default: 'Fasting' },
      range: { type: String, default: '70-99 (Optimal)' },
      timestamp: { type: String, default: 'Today, 07:15 AM' },
    },
    oxygen: {
      value: { type: Number, default: 99 },
      unit: { type: String, default: '%' },
      status: { type: String, default: 'Optimal Saturation' },
      timestamp: { type: String, default: 'Today, 09:00 AM' },
    },
    temperature: {
      value: { type: Number, default: 98.4 },
      unit: { type: String, default: '°F' },
      variance: { type: String, default: '±0.1°' },
      status: { type: String, default: 'Afebrile Baseline' },
      timestamp: { type: String, default: 'Today, 08:00 AM' },
    },
    ecgRecords: [EcgRecordSchema],
  },
  {
    timestamps: true,
  }
);

VitalLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('VitalLog', VitalLogSchema);

