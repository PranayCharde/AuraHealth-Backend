const express = require('express');
const {
  getVitals,
  logVital,
  addEcgRecord,
  deleteEcgRecord,
} = require('../controllers/vitalsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getVitals);
router.post('/', logVital);
router.post('/:vitalType', logVital);
router.post('/ecg/record', addEcgRecord);
router.delete('/ecg/:recordId', deleteEcgRecord);

module.exports = router;

