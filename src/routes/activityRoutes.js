const express = require('express');
const {
  getActivity,
  addWorkout,
  deleteWorkout,
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getActivity);
router.post('/', addWorkout);
router.post('/workout', addWorkout);
router.delete('/workout/:workoutId', deleteWorkout);

module.exports = router;

