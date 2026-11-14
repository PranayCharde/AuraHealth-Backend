const express = require('express');
const { getSessions, logSession } = require('../controllers/mindfulnessController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getSessions);
router.post('/', logSession);
router.post('/session', logSession);

module.exports = router;

