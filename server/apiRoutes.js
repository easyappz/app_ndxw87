const express = require('express');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const accessControlRoutes = require('./routes/accessControl');
const protectedRoutes = require('./routes/protectedRoutes');

const router = express.Router();

// Authentication routes
router.use('/auth', authRoutes);

// Dashboard routes
router.use('/dashboard', dashboardRoutes);

// Access control routes
router.use('/access-control', accessControlRoutes);

// Protected routes based on roles
router.use('/protected', protectedRoutes);

module.exports = router;
