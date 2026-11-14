const express = require('express');
const {
  getAllUsers,
  getUserById,
  deleteUser,
  getSystemMetrics,
  getActivityStream,
} = require('../controllers/adminController');

const router = express.Router();

router.get('/', getSystemMetrics);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.get('/metrics', getSystemMetrics);
router.get('/activity', getActivityStream);

module.exports = router;

