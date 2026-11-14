const ActivityLog = require('../models/ActivityLog');
const { isDbConnected } = require('../config/db');

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

// @desc    Get activity & strain for date
// @route   GET /api/activity
// @access  Private
exports.getActivity = async (req, res, next) => {
  try {
    const date = req.query.date || getTodayDateStr();

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        date,
        dbConnected: false,
        data: {
          strain: 14.8,
          strainTarget: 15.0,
          calories: 620,
          activeMinutes: 75,
          streak: 12,
          goalPct: 98,
          workouts: [
            { name: 'Hypertrophic Upper Body Session', duration: '55 mins', calories: 420, avgHr: 142, maxHr: 172, time: '09:00 AM', intensity: 'Vigorous' },
            { name: 'Zone-2 Aerobic Flush', duration: '20 mins', calories: 150, avgHr: 128, maxHr: 142, time: '05:30 PM', intensity: 'Moderate' },
          ],
          weeklyStrain: [
            { day: 'M', value: 12.4, heightPct: 62, label: '12.4' },
            { day: 'T', value: 15.1, heightPct: 75, label: '15.1' },
            { day: 'W', value: 16.8, heightPct: 84, label: '16.8' },
            { day: 'T', value: 11.2, heightPct: 56, label: '11.2' },
            { day: 'F', value: 17.4, heightPct: 87, label: '17.4' },
            { day: 'S', value: 13.9, heightPct: 69, label: '13.9' },
            { day: 'S', value: 14.8, heightPct: 74, label: '14.8' },
          ],
        },
      });
    }

    let log = await ActivityLog.findOne({ user: req.user.id, date });
    if (!log) {
      log = await ActivityLog.create({ user: req.user.id, date });
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

// @desc    Add workout
// @route   POST /api/activity/workout
// @access  Private
exports.addWorkout = async (req, res, next) => {
  try {
    const { name, durationMinutes, calories, avgHr, intensity = 'Moderate', date = getTodayDateStr() } = req.body;

    const newWorkout = {
      name: name || 'Custom Activity',
      duration: `${durationMinutes} mins`,
      durationMinutes: Number(durationMinutes) || 30,
      calories: Number(calories) || 200,
      avgHr: Number(avgHr) || 120,
      maxHr: Math.round((Number(avgHr) || 120) * 1.15),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intensity,
    };

    if (!isDbConnected()) {
      return res.status(201).json({
        success: true,
        message: 'Workout added (Offline mode).',
        data: newWorkout,
        dbConnected: false,
      });
    }

    let log = await ActivityLog.findOne({ user: req.user.id, date });
    if (!log) log = await ActivityLog.create({ user: req.user.id, date, workouts: [] });

    log.workouts.unshift(newWorkout);
    log.calories += Number(calories || 200);
    log.activeMinutes += Number(durationMinutes || 30);
    log.strain = Math.min(21, Number((log.strain + (durationMinutes / 15) * 1.5).toFixed(1)));

    await log.save();

    res.status(201).json({
      success: true,
      message: 'Workout logged successfully.',
      data: log,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete workout
// @route   DELETE /api/activity/workout/:workoutId
// @access  Private
exports.deleteWorkout = async (req, res, next) => {
  try {
    const { workoutId } = req.params;
    const date = req.query.date || getTodayDateStr();

    if (!isDbConnected()) {
      return res.status(200).json({ success: true, message: 'Workout deleted (Offline mode).' });
    }

    const log = await ActivityLog.findOne({ user: req.user.id, date });
    if (!log) return res.status(404).json({ success: false, message: 'No activity found for date.' });

    log.workouts = log.workouts.filter((w) => String(w._id) !== workoutId);
    await log.save();

    res.status(200).json({
      success: true,
      message: 'Workout deleted successfully.',
      data: log,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

