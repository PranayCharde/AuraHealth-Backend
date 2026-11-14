const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  quantity: { type: String, default: '1 serving' },
  calories: { type: Number, required: true, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sodium: { type: Number, default: 0 },
  potassium: { type: Number, default: 0 },
  category: { type: String, default: 'Custom' },
  loggedAt: { type: Date, default: Date.now },
});

const MealSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Breakfast', 'Post-Workout', 'Lunch', 'Dinner', 'Snack'],
    default: 'Breakfast',
  },
  title: { type: String, default: 'Meal' },
  time: { type: String, default: '12:00 PM' },
  foods: [FoodItemSchema],
});

const SupplementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, default: '1 dose' },
  taken: { type: Boolean, default: false },
  time: { type: String, default: 'Daily' },
});

const NutritionLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String, // Stored as YYYY-MM-DD for easy daily lookup
      required: true,
      index: true,
    },
    phase: {
      type: String,
      default: 'LEAN HYPERTROPHY',
      enum: ['LEAN HYPERTROPHY', 'CUTTING / VASCULARITY', 'AGGRESSIVE BULK', 'RECOMPOSITION', 'MAINTENANCE'],
    },
    targets: {
      calories: { type: Number, default: 2750 },
      protein: { type: Number, default: 195 },
      carbs: { type: Number, default: 280 },
      fats: { type: Number, default: 65 },
      fiber: { type: Number, default: 38 },
      sodium: { type: Number, default: 2300 },
      potassium: { type: Number, default: 3500 },
    },
    meals: [MealSchema],
    supplements: {
      type: [SupplementSchema],
      default: [
        { name: 'Creatine Monohydrate', dosage: '5g (Creapure)', taken: true, time: 'Post-Workout' },
        { name: 'Ultra Omega-3 EPA/DHA', dosage: '2000mg', taken: true, time: 'With Breakfast' },
        { name: 'Vitamin D3 + K2', dosage: '5000 IU', taken: true, time: 'Morning' },
        { name: 'Magnesium Glycinate', dosage: '400mg', taken: false, time: 'Before Bed' },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index on user and date so each user has one daily record per day
NutritionLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('NutritionLog', NutritionLogSchema);

