const express = require('express');
const router = express.Router();
const { getUsers, toggleUserStatus } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// All user management routes are admin-only
router.get('/', protect, authorizeRoles('admin'), getUsers);
router.patch('/:id/toggle-status', protect, authorizeRoles('admin'), toggleUserStatus);

module.exports = router;
