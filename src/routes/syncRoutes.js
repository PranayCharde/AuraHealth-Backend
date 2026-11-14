const express = require('express');
const { pullFullState, pushFullState } = require('../controllers/syncController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/pull', pullFullState);
router.post('/push', pushFullState);

module.exports = router;

