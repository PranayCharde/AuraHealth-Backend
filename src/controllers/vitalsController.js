const VitalLog = require('../models/VitalLog');
const { isDbConnected } = require('../config/db');

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

// @desc    Get vitals & ECG history for a date
// @route   GET /api/vitals
// @access  Private
exports.getVitals = async (req, res, next) => {
  try {
    const date = req.query.date || getTodayDateStr();

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        date,
        dbConnected: false,
        data: {
          heartRate: {
            current: 64,
            resting: 58,
            hrv: 78,
            status: 'Normal Sinus Rhythm',
            lastUpdated: '1m ago',
            history: [
              { time: '06:00', bpm: 56, hrv: 82 },
              { time: '09:00', bpm: 68, hrv: 74 },
              { time: '12:00', bpm: 72, hrv: 71 },
              { time: '15:00', bpm: 65, hrv: 79 },
              { time: '18:00', bpm: 64, hrv: 78 },
            ],
          },
          bloodPressure: { systolic: 118, diastolic: 76, map: 90, pulse: 62, category: 'Optimal', timestamp: 'Today, 08:30 AM' },
          bloodGlucose: { value: 94, unit: 'mg/dL', state: 'Fasting', range: '70-99 (Optimal)', timestamp: 'Today, 07:15 AM' },
          oxygen: { value: 99, unit: '%', status: 'Optimal Saturation', timestamp: 'Today, 09:00 AM' },
          temperature: { value: 98.4, unit: '°F', variance: '±0.1°', status: 'Afebrile Baseline', timestamp: 'Today, 08:00 AM' },
          ecgRecords: [
            { id: 'ecg_1', title: 'Resting Clinical Baseline', time: 'Today, 07:45 AM', rhythm: 'Normal Sinus Rhythm', bpm: 62, qtc: 408, tag: 'Standard 1-Lead', notes: 'No arrhythmia or ST-elevation observed.' },
          ],
        },
      });
    }

    let log = await VitalLog.findOne({ user: req.user.id, date });
    if (!log) {
      log = await VitalLog.create({ user: req.user.id, date });
    }

    res.status(200).json({
      success: true,
      date,
      data: log,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Log single vital (Heart Rate, BP, Glucose, Oxygen, Temperature)
// @route   POST /api/vitals/:vitalType
// @access  Private
exports.logVital = async (req, res, next) => {
  try {
    const { vitalType } = req.params;
    const { payload, date = getTodayDateStr() } = req.body;

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: `${vitalType} recorded (Offline mode).`,
        vitalType,
        payload,
        dbConnected: false,
      });
    }

    let log = await VitalLog.findOne({ user: req.user.id, date });
    if (!log) log = await VitalLog.create({ user: req.user.id, date });

    switch (vitalType) {
      case 'heart-rate':
        log.heartRate.current = payload.bpm;
        if (payload.resting) log.heartRate.resting = payload.resting;
        if (payload.hrv) log.heartRate.hrv = payload.hrv;
        log.heartRate.lastUpdated = 'Just now';
        log.heartRate.history.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          bpm: payload.bpm,
          hrv: payload.hrv || log.heartRate.hrv,
        });
        break;

      case 'blood-pressure':
        log.bloodPressure = {
          systolic: payload.systolic,
          diastolic: payload.diastolic,
          map: Math.round(payload.diastolic + (payload.systolic - payload.diastolic) / 3),
          pulse: payload.pulse || 64,
          category: payload.systolic < 120 && payload.diastolic < 80 ? 'Optimal' : 'Elevated',
          timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        break;

      case 'blood-glucose':
        log.bloodGlucose = {
          value: payload.value,
          unit: payload.unit || 'mg/dL',
          state: payload.state || 'Fasting',
          range: payload.value < 100 ? '70-99 (Optimal)' : 'Elevated',
          timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        break;

      case 'oxygen':
        log.oxygen = {
          value: payload.value,
          unit: '%',
          status: payload.value >= 95 ? 'Optimal Saturation' : 'Sub-optimal Saturation',
          timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        break;

      case 'temperature':
        log.temperature = {
          value: payload.value,
          unit: payload.unit || '°F',
          variance: '±0.1°',
          status: payload.value > 99.5 ? 'Feverish' : 'Afebrile Baseline',
          timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        break;

      default:
        return res.status(400).json({ success: false, message: `Unknown vitalType: ${vitalType}` });
    }

    await log.save();

    res.status(200).json({
      success: true,
      message: `${vitalType} updated successfully.`,
      data: log,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add manual ECG Record
// @route   POST /api/vitals/ecg
// @access  Private
exports.addEcgRecord = async (req, res, next) => {
  try {
    const { title, bpm, qtc, notes, doctor, date = getTodayDateStr() } = req.body;

    const newRecord = {
      title: title || 'Single-Lead Rhythm Assessment',
      time: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rhythm: 'Normal Sinus Rhythm',
      bpm: Number(bpm) || 64,
      qtc: Number(qtc) || 410,
      tag: 'Manual Record',
      notes: notes || 'Clinical assessment recorded by user.',
      doctor: doctor || 'Self-Recorded',
    };

    if (!isDbConnected()) {
      return res.status(201).json({
        success: true,
        message: 'ECG record saved (Offline mode).',
        data: newRecord,
        dbConnected: false,
      });
    }

    let log = await VitalLog.findOne({ user: req.user.id, date });
    if (!log) log = await VitalLog.create({ user: req.user.id, date });

    log.ecgRecords.unshift(newRecord);
    await log.save();

    res.status(201).json({
      success: true,
      message: 'ECG record added successfully.',
      data: log.ecgRecords,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete ECG record
// @route   DELETE /api/vitals/ecg/:recordId
// @access  Private
exports.deleteEcgRecord = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const date = req.query.date || getTodayDateStr();

    if (!isDbConnected()) {
      return res.status(200).json({ success: true, message: 'ECG record deleted (Offline mode).' });
    }

    const log = await VitalLog.findOne({ user: req.user.id, date });
    if (!log) return res.status(404).json({ success: false, message: 'No records found for date.' });

    log.ecgRecords = log.ecgRecords.filter((r) => String(r._id) !== recordId);
    await log.save();

    res.status(200).json({
      success: true,
      message: 'ECG record deleted successfully.',
      data: log.ecgRecords,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

