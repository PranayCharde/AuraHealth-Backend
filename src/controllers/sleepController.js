const SleepLog = require('../models/SleepLog');
const { isDbConnected } = require('../config/db');

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

// @desc    Get sleep architecture for date
// @route   GET /api/sleep
// @access  Private
exports.getSleep = async (req, res, next) => {
  try {
    const date = req.query.date || getTodayDateStr();

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        date,
        dbConnected: false,
        data: {
          duration: '8h 12m',
          totalMinutes: 492,
          targetHours: 8.0,
          score: 89,
          status: 'Restful Deep State',
          bedtime: '10:45 PM',
          wakeTime: '06:57 AM',
          stages: { awake: '32m', awakePct: 6, light: '4h 15m', lightPct: 52, deep: '1h 50m', deepPct: 22, rem: '1h 35m', remPct: 20 },
          debtCut: '-15m from baseline',
          weeklyHistory: [
            { day: 'M', hours: 7.2, score: 82 },
            { day: 'T', hours: 7.8, score: 86 },
            { day: 'W', hours: 8.0, score: 89 },
            { day: 'T', hours: 6.9, score: 78 },
            { day: 'F', hours: 7.5, score: 85 },
            { day: 'S', hours: 8.4, score: 92 },
            { day: 'S', hours: 8.2, score: 89 },
          ],
        },
      });
    }

    let log = await SleepLog.findOne({ user: req.user.id, date });
    if (!log) {
      log = await SleepLog.create({ user: req.user.id, date });
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

// @desc    Log sleep session
// @route   POST /api/sleep
// @access  Private
exports.logSleep = async (req, res, next) => {
  try {
    const { hours, minutes = 0, bedtime, wakeTime, qualityScore = 85, notes, date = getTodayDateStr() } = req.body;

    const totalMins = Number(hours) * 60 + Number(minutes);
    const deepMins = Math.round(totalMins * 0.22);
    const remMins = Math.round(totalMins * 0.20);
    const lightMins = totalMins - deepMins - remMins - 30;

    const sleepData = {
      duration: `${hours}h ${minutes}m`,
      totalMinutes: totalMins,
      score: Number(qualityScore),
      status: Number(qualityScore) >= 80 ? 'Restful' : 'Fair',
      bedtime: bedtime || '11:00 PM',
      wakeTime: wakeTime || '07:00 AM',
      stages: {
        awake: '30m',
        awakePct: 6,
        light: `${Math.floor(lightMins / 60)}h ${lightMins % 60}m`,
        lightPct: 52,
        deep: `${Math.floor(deepMins / 60)}h ${deepMins % 60}m`,
        deepPct: 22,
        rem: `${Math.floor(remMins / 60)}h ${remMins % 60}m`,
        remPct: 20,
      },
      notes: notes || 'Sleep recorded by user.',
    };

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Sleep recorded (Offline mode).',
        data: sleepData,
        dbConnected: false,
      });
    }

    let log = await SleepLog.findOne({ user: req.user.id, date });
    if (!log) {
      log = await SleepLog.create({ user: req.user.id, date, ...sleepData });
    } else {
      Object.assign(log, sleepData);
      await log.save();
    }

    res.status(200).json({
      success: true,
      message: 'Sleep logged successfully.',
      data: log,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

