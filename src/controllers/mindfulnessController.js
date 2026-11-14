const MindfulnessLog = require('../models/MindfulnessLog');
const { isDbConnected } = require('../config/db');

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

// @desc    Get mindfulness sessions for date
// @route   GET /api/mindfulness
// @access  Private
exports.getSessions = async (req, res, next) => {
  try {
    const date = req.query.date || getTodayDateStr();

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        date,
        dbConnected: false,
        data: {
          completedMinutes: 15,
          targetMinutes: 20,
          hrvBoost: '+14%',
          sessions: [
            { title: 'Box Breathing (Parasympathetic)', duration: '10 mins', technique: 'Box Breathing', time: '07:30 AM', hrvBoost: '+14%' },
            { title: '4-7-8 Vagus Nerve Reset', duration: '5 mins', technique: '4-7-8 Calm', time: '01:15 PM', hrvBoost: '+8%' },
          ],
        },
      });
    }

    let log = await MindfulnessLog.findOne({ user: req.user.id, date });
    if (!log) log = await MindfulnessLog.create({ user: req.user.id, date });

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

// @desc    Log a completed breathwork / meditation session
// @route   POST /api/mindfulness/session
// @access  Private
exports.logSession = async (req, res, next) => {
  try {
    const { title, durationMinutes = 10, technique = 'Box Breathing', date = getTodayDateStr() } = req.body;

    const newSession = {
      title: title || 'Guided Breathwork',
      duration: `${durationMinutes} mins`,
      durationMinutes: Number(durationMinutes),
      technique,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hrvBoost: '+12%',
    };

    if (!isDbConnected()) {
      return res.status(201).json({
        success: true,
        message: 'Mindfulness session logged (Offline mode).',
        session: newSession,
        dbConnected: false,
      });
    }

    let log = await MindfulnessLog.findOne({ user: req.user.id, date });
    if (!log) log = await MindfulnessLog.create({ user: req.user.id, date, sessions: [] });

    log.sessions.unshift(newSession);
    log.completedMinutes += Number(durationMinutes);
    await log.save();

    res.status(201).json({
      success: true,
      message: 'Mindfulness session recorded.',
      data: log,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

