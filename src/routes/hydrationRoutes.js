const express = require('express');
const {
  getHydration,
  logWater,
  updateTarget,
} = require('../controllers/hydrationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getHydration);
router.post('/', logWater);
router.post('/log', logWater);
router.put('/target', updateTarget);

module.exports = router;

