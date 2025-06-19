const express = require('express');
const User = require('../models/User');
const { checkRole } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/users', checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// Get a specific user by ID (Admin only)
router.get('/users/:id', checkRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

// Update user role (Admin only)
router.put('/users/:id/role', checkRole(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'teacher', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role value' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user role', error: err.message });
  }
});

// Update user permissions (Admin only)
router.put('/users/:id/permissions', checkRole(['admin']), async (req, res) => {
  try {
    const { permissions } = req.body;
    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: 'Permissions must be an array' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { permissions },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user permissions', error: err.message });
  }
});

// Assign reference ID and model to user (Admin only)
router.put('/users/:id/reference', checkRole(['admin']), async (req, res) => {
  try {
    const { referenceId, referenceModel } = req.body;
    if (referenceModel && !['Teacher', 'Student'].includes(referenceModel)) {
      return res.status(400).json({ message: 'Invalid reference model' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { referenceId, referenceModel },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user reference', error: err.message });
  }
});

module.exports = router;
