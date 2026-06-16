const express = require('express');
const router = express.Router();
const { getFileHistory, getSessions } = require('../controllers/historyController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// All history routes are admin-only
router.get('/file/:fileId', protect, authorizeRoles('admin'), getFileHistory);
router.get('/sessions', protect, authorizeRoles('admin'), getSessions);

module.exports = router;
