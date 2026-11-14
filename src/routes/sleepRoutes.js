const express = require('express');
const { getSleep, logSleep } = require('../controllers/sleepController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getSleep);
router.post('/', logSleep);

module.exports = router;

