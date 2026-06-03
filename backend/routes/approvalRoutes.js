const express = require('express');
const router = express.Router();
const { updateStatus, getPendingFiles } = require('../controllers/approvalController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Admin only routes
router.get('/pending', protect, authorizeRoles('admin'), getPendingFiles);
router.put('/:id/action', protect, authorizeRoles('admin'), updateStatus);

module.exports = router;
