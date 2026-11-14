const NutritionLog = require('../models/NutritionLog');
const { isDbConnected } = require('../config/db');
const {
  FOOD_DATABASE,
  parseAndAnalyzeMeal,
  findFood,
  scaleFood,
} = require('../utils/nutritionDatabase');

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

// @desc    Get nutrition log for a specific date (or today)
// @route   GET /api/nutrition
// @access  Private
exports.getDailyNutrition = async (req, res, next) => {
  try {
    const date = req.query.date || getTodayDateStr();

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        date,
        dbConnected: false,
        data: {
          phase: 'LEAN HYPERTROPHY',
          targets: { calories: 2750, protein: 195, carbs: 280, fats: 65, fiber: 38, sodium: 2300 },
          meals: [
            {
              category: 'Breakfast',
              title: 'Pre-Workout Anabolic Fuel',
              time: '07:30 AM',
              foods: [
                { name: 'Whole Eggs + Egg Whites', quantity: '3 whole + 100g whites', calories: 255, protein: 28, carbs: 1, fats: 15, fiber: 0, sodium: 220 },
                { name: 'Rolled Oats & Cinnamon', quantity: '80g', calories: 304, protein: 11, carbs: 54, fats: 5, fiber: 8, sodium: 4 },
                { name: 'Fresh Banana', quantity: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fats: 0.3, fiber: 3.1, sodium: 1 },
              ],
            },
            {
              category: 'Post-Workout',
              title: 'Post-Workout Hypertrophic Surge',
              time: '10:45 AM',
              foods: [
                { name: 'Whey Protein Isolate', quantity: '35g (1 scoop)', calories: 130, protein: 28, carbs: 2, fats: 1, fiber: 0, sodium: 140 },
                { name: 'Steamed Jasmine Rice', quantity: '250g', calories: 325, protein: 6, carbs: 72, fats: 1, fiber: 1, sodium: 2 },
              ],
            },
          ],
          supplements: [
            { name: 'Creatine Monohydrate', dosage: '5g (Creapure)', taken: true, time: 'Post-Workout' },
            { name: 'Ultra Omega-3 EPA/DHA', dosage: '2000mg', taken: true, time: 'Morning' },
            { name: 'Vitamin D3 + K2', dosage: '5000 IU', taken: true, time: 'Morning' },
            { name: 'Magnesium Glycinate', dosage: '400mg', taken: false, time: 'Before Bed' },
          ],
        },
      });
    }

    let log = await NutritionLog.findOne({ user: req.user.id, date });

    if (!log) {
      // Create fresh default record for today
      log = await NutritionLog.create({
        user: req.user.id,
        date,
        meals: [],
      });
    }

    res.status(200).json({
      success: true,
      date,
      dbConnected: true,
      data: log,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add single food item to meal category
// @route   POST /api/nutrition/food
// @access  Private
exports.addFoodItem = async (req, res, next) => {
  try {
    const { mealCategory = 'Breakfast', food, date = getTodayDateStr() } = req.body;

    if (!food || !food.name) {
      return res.status(400).json({ success: false, message: 'Please provide food details (name, calories, protein).' });
    }

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Food item logged (Offline mode).',
        food,
        dbConnected: false,
      });
    }

    let log = await NutritionLog.findOne({ user: req.user.id, date });
    if (!log) {
      log = await NutritionLog.create({ user: req.user.id, date, meals: [] });
    }

    const mealIndex = log.meals.findIndex((m) => m.category.toLowerCase() === mealCategory.toLowerCase());
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (mealIndex >= 0) {
      log.meals[mealIndex].foods.unshift(food);
    } else {
      log.meals.push({
        category: mealCategory,
        title: mealCategory,
        time: timeStr,
        foods: [food],
      });
    }

    await log.save();

    res.status(200).json({
      success: true,
      message: `Added ${food.name} to ${mealCategory}.`,
      data: log,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Bulk add multiple food items to a meal
// @route   POST /api/nutrition/foods/bulk
// @access  Private
exports.addMultipleFoodItems = async (req, res, next) => {
  try {
    const { mealCategory = 'Breakfast', foods = [], date = getTodayDateStr() } = req.body;

    if (!foods || foods.length === 0) {
      return res.status(400).json({ success: false, message: 'No food items provided to add.' });
    }

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: `${foods.length} items logged (Offline mode).`,
        count: foods.length,
        dbConnected: false,
      });
    }

    let log = await NutritionLog.findOne({ user: req.user.id, date });
    if (!log) {
      log = await NutritionLog.create({ user: req.user.id, date, meals: [] });
    }

    const mealIndex = log.meals.findIndex((m) => m.category.toLowerCase() === mealCategory.toLowerCase());
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (mealIndex >= 0) {
      log.meals[mealIndex].foods.unshift(...foods);
    } else {
      log.meals.push({
        category: mealCategory,
        title: mealCategory,
        time: timeStr,
        foods,
      });
    }

    await log.save();

    res.status(200).json({
      success: true,
      message: `${foods.length} items logged to ${mealCategory}.`,
      data: log,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete food item by ID
// @route   DELETE /api/nutrition/food/:foodId
// @access  Private
exports.deleteFoodItem = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const date = req.query.date || getTodayDateStr();

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Food item deleted (Offline mode).',
        dbConnected: false,
      });
    }

    const log = await NutritionLog.findOne({ user: req.user.id, date });
    if (!log) {
      return res.status(404).json({ success: false, message: 'No nutrition record found for date.' });
    }

    log.meals.forEach((meal) => {
      meal.foods = meal.foods.filter((f) => String(f._id) !== foodId);
    });

    log.meals = log.meals.filter((m) => m.foods.length > 0);
    await log.save();

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully.',
      data: log,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update daily targets & bodybuilding phase
// @route   PUT /api/nutrition/targets
// @access  Private
exports.updateTargets = async (req, res, next) => {
  try {
    const { targets, phase, date = getTodayDateStr() } = req.body;

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Targets updated (Offline mode).',
        targets,
        phase,
        dbConnected: false,
      });
    }

    let log = await NutritionLog.findOne({ user: req.user.id, date });
    if (!log) {
      log = await NutritionLog.create({ user: req.user.id, date, targets, phase });
    } else {
      if (targets) log.targets = { ...log.targets, ...targets };
      if (phase) log.phase = phase;
      await log.save();
    }

    res.status(200).json({
      success: true,
      message: 'Targets updated successfully in MongoDB.',
      data: log,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle supplement status
// @route   PUT /api/nutrition/supplements/:supplementId
// @access  Private
exports.toggleSupplement = async (req, res, next) => {
  try {
    const { supplementId } = req.params;
    const date = req.query.date || getTodayDateStr();

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Supplement status toggled (Offline mode).',
        dbConnected: false,
      });
    }

    const log = await NutritionLog.findOne({ user: req.user.id, date });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Nutrition log not found.' });
    }

    const supp = log.supplements.id(supplementId);
    if (supp) {
      supp.taken = !supp.taken;
      await log.save();
    }

    res.status(200).json({
      success: true,
      message: 'Supplement status updated.',
      data: log.supplements,
      dbConnected: true,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Smart Natural Language Food Analyzer
// @route   POST /api/nutrition/analyze-meal
// @access  Public
exports.analyzeMeal = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a food description query (e.g. "200g chicken and 1 cup rice").',
      });
    }

    const result = parseAndAnalyzeMeal(query);

    res.status(200).json({
      success: true,
      query,
      result,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search 120+ food database
// @route   GET /api/nutrition/foods/search
// @access  Public
exports.searchFoods = async (req, res, next) => {
  try {
    const { q, category } = req.query;

    let foods = FOOD_DATABASE;

    if (category && category !== 'All') {
      foods = foods.filter((f) => f.category.toLowerCase() === category.toLowerCase());
    }

    if (q) {
      const clean = q.toLowerCase().trim();
      foods = foods.filter(
        (f) =>
          f.name.toLowerCase().includes(clean) ||
          f.aliases.some((a) => a.toLowerCase().includes(clean))
      );
    }

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (err) {
    next(err);
  }
};

