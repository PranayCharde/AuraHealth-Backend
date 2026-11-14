const express = require('express');
const { body } = require('express-validator');
const {
  getDailyNutrition,
  addFoodItem,
  addMultipleFoodItems,
  deleteFoodItem,
  updateTargets,
  toggleSupplement,
  analyzeMeal,
  searchFoods,
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Public food database & natural language parser routes
router.post(
  '/analyze-meal',
  [body('query').notEmpty().withMessage('Query text is required')],
  validate,
  analyzeMeal
);

router.get('/foods/search', searchFoods);

// Protected user nutrition logs
router.get('/', protect, getDailyNutrition);
router.post('/', protect, addFoodItem);
router.post('/food', protect, addFoodItem);
router.post('/foods/bulk', protect, addMultipleFoodItems);
router.delete('/food/:foodId', protect, deleteFoodItem);
router.put('/targets', protect, updateTargets);
router.put('/supplements/:supplementId', protect, toggleSupplement);

module.exports = router;

