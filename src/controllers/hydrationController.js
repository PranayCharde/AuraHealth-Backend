const HydrationLog = require('../models/HydrationLog');
const { isDbConnected } = require('../config/db');

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

// @desc    Get daily hydration
// @route   GET /api/hydration
// @access  Private
exports.getHydration = async (req, res, next) => {
  try {
    const date = req.query.date || getTodayDateStr();

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        date,
        dbConnected: false,
        data: {
          target: 2800,
          total: 2100,
          percentage: 75,
          logs: [
            { amount: 500, time: '08:00 AM' },
            { amount: 350, time: '10:15 AM' },
            { amount: 500, time: '12:30 PM' },
            { amount: 250, time: '02:45 PM' },
            { amount: 500, time: '04:20 PM' },
          ],
        },
      });
    }

    let log = await HydrationLog.findOne({ user: req.user.id, date });
    if (!log) log = await HydrationLog.create({ user: req.user.id, date });

    const total = log.logs.reduce((sum, item) => sum + item.amount, 0);
    const percentage = Math.min(100, Math.round((total / (log.target || 2800)) * 100));

    res.status(200).json({
      success: true,
      date,
      data: {
        target: log.target,
        total,
        percentage,
        logs: log.logs,
      },
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Log water intake
// @route   POST /api/hydration/log
// @access  Private
exports.logWater = async (req, res, next) => {
  try {
    const { amount, date = getTodayDateStr() } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ success: false, message: 'Please provide valid amount in ml.' });
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!isDbConnected()) {
      return res.status(201).json({
        success: true,
        message: `${amount}ml logged (Offline mode).`,
        entry: { amount: Number(amount), time },
        dbConnected: false,
      });
    }

    let log = await HydrationLog.findOne({ user: req.user.id, date });
    if (!log) log = await HydrationLog.create({ user: req.user.id, date, logs: [] });

    log.logs.push({ amount: Number(amount), time, timestamp: Date.now() });
    await log.save();

    const total = log.logs.reduce((sum, item) => sum + item.amount, 0);

    res.status(201).json({
      success: true,
      message: `Logged ${amount}ml of water.`,
      data: {
        total,
        target: log.target,
        logs: log.logs,
      },
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update hydration target
// @route   PUT /api/hydration/target
// @access  Private
exports.updateTarget = async (req, res, next) => {
  try {
    const { target, date = getTodayDateStr() } = req.body;

    if (!target || isNaN(target)) {
      return res.status(400).json({ success: false, message: 'Please provide target in ml.' });
    }

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Hydration target updated (Offline mode).',
        target: Number(target),
        dbConnected: false,
      });
    }

    let log = await HydrationLog.findOne({ user: req.user.id, date });
    if (!log) log = await HydrationLog.create({ user: req.user.id, date });

    log.target = Number(target);
    await log.save();

    res.status(200).json({
      success: true,
      message: `Daily target set to ${target}ml.`,
      target: log.target,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

