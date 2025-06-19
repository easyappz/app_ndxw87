const express = require('express');
const { authenticateUser, checkRole } = require('../middleware/auth');

const router = express.Router();

// Example of a route only accessible by admin
router.get('/admin-only', authenticateUser, checkRole(['admin']), (req, res) => {
  res.json({ message: 'This is an admin-only endpoint', user: req.user });
});

// Example of a route accessible by admin and teacher
router.get('/teacher-admin', authenticateUser, checkRole(['admin', 'teacher']), (req, res) => {
  res.json({ message: 'This is accessible to teachers and admins', user: req.user });
});

// Example of a route accessible by all roles
router.get('/all-roles', authenticateUser, checkRole(['admin', 'teacher', 'student']), (req, res) => {
  res.json({ message: 'This is accessible to all authenticated users', user: req.user });
});

module.exports = router;
