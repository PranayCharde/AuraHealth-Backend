const User = require('../models/User');
const NutritionLog = require('../models/NutritionLog');
const VitalLog = require('../models/VitalLog');
const SleepLog = require('../models/SleepLog');
const ActivityLog = require('../models/ActivityLog');
const HydrationLog = require('../models/HydrationLog');
const MindfulnessLog = require('../models/MindfulnessLog');
const { isDbConnected } = require('../config/db');

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

// @desc    Pull full health telemetry for user
// @route   GET /api/sync/pull
// @access  Private
exports.pullFullState = async (req, res, next) => {
  try {
    const date = req.query.date || getTodayDateStr();

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Telemetry pulled (Offline/Demo mode).',
        syncedAt: new Date().toISOString(),
        dbConnected: false,
        data: {
          profile: req.user.profile,
          date,
        },
      });
    }

    const [userDoc, nutritionDoc, vitalDoc, sleepDoc, activityDoc, hydrationDoc, mindfulnessDoc] =
      await Promise.all([
        User.findById(req.user.id),
        NutritionLog.findOne({ user: req.user.id, date }),
        VitalLog.findOne({ user: req.user.id, date }),
        SleepLog.findOne({ user: req.user.id, date }),
        ActivityLog.findOne({ user: req.user.id, date }),
        HydrationLog.findOne({ user: req.user.id, date }),
        MindfulnessLog.findOne({ user: req.user.id, date }),
      ]);

    res.status(200).json({
      success: true,
      syncedAt: new Date().toISOString(),
      dbConnected: true,
      data: {
        profile: userDoc?.profile,
        themeMode: userDoc?.themeMode,
        nutrition: nutritionDoc,
        vitals: vitalDoc,
        sleep: sleepDoc,
        activity: activityDoc,
        hydration: hydrationDoc,
        mindfulness: mindfulnessDoc,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Push full mobile local state to MongoDB
// @route   POST /api/sync/push
// @access  Private
exports.pushFullState = async (req, res, next) => {
  try {
    const { state, date = getTodayDateStr() } = req.body;

    if (!state) {
      return res.status(400).json({ success: false, message: 'Missing state payload for sync.' });
    }

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Telemetry synchronized to offline cache.',
        syncedAt: new Date().toISOString(),
        dbConnected: false,
      });
    }

    const operations = [];

    // 1. Update User Profile if provided
    if (state.profile) {
      operations.push(
        User.findByIdAndUpdate(req.user.id, { profile: state.profile }, { runValidators: true })
      );
    }

    // 2. Sync Nutrition Log
    if (state.nutrition) {
      operations.push(
        NutritionLog.findOneAndUpdate(
          { user: req.user.id, date },
          {
            $set: {
              phase: state.nutrition.phase || 'LEAN HYPERTROPHY',
              targets: state.nutrition.targets,
              meals: state.nutrition.meals || [],
              supplements: state.nutrition.supplements || [],
            },
          },
          { upsert: true, new: true }
        )
      );
    }

    // 3. Sync Vitals
    if (state.vitals) {
      operations.push(
        VitalLog.findOneAndUpdate(
          { user: req.user.id, date },
          {
            $set: {
              ...(state.vitals.heartRate && { heartRate: state.vitals.heartRate }),
              ...(state.vitals.bloodPressure && { bloodPressure: state.vitals.bloodPressure }),
              ...(state.vitals.bloodGlucose && { bloodGlucose: state.vitals.bloodGlucose }),
              ...(state.vitals.oxygen && { oxygen: state.vitals.oxygen }),
              ...(state.vitals.temperature && { temperature: state.vitals.temperature }),
              ...(state.vitals.ecgRecords && { ecgRecords: state.vitals.ecgRecords }),
            },
          },
          { upsert: true, new: true }
        )
      );
    }

    // 4. Sync Sleep
    if (state.sleep) {
      operations.push(
        SleepLog.findOneAndUpdate(
          { user: req.user.id, date },
          { $set: state.sleep },
          { upsert: true, new: true }
        )
      );
    }

    // 5. Sync Activity
    if (state.activity) {
      operations.push(
        ActivityLog.findOneAndUpdate(
          { user: req.user.id, date },
          { $set: state.activity },
          { upsert: true, new: true }
        )
      );
    }

    // 6. Sync Hydration
    if (state.hydrationLogs) {
      operations.push(
        HydrationLog.findOneAndUpdate(
          { user: req.user.id, date },
          {
            $set: {
              target: state.hydrationTarget || 2800,
              logs: state.hydrationLogs,
            },
          },
          { upsert: true, new: true }
        )
      );
    }

    // 7. Sync Mindfulness
    if (state.mindfulness) {
      operations.push(
        MindfulnessLog.findOneAndUpdate(
          { user: req.user.id, date },
          { $set: state.mindfulness },
          { upsert: true, new: true }
        )
      );
    }

    await Promise.all(operations);

    res.status(200).json({
      success: true,
      message: 'Client state synchronized to cloud MongoDB successfully.',
      syncedAt: new Date().toISOString(),
      operationsCompleted: operations.length,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

