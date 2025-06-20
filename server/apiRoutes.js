const express = require('express');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const accessControlRoutes = require('./routes/accessControl');
const protectedRoutes = require('./routes/protectedRoutes');
const studentsRoutes = require('./routes/students');
const teachersRoutes = require('./routes/teachers');
const groupsRoutes = require('./routes/groups');
const classroomsRoutes = require('./routes/classrooms');
const schedulesRoutes = require('./routes/schedules');
const attendanceRoutes = require('./routes/attendance');
const paymentsRoutes = require('./routes/payments');

const router = express.Router();

// Authentication routes
router.use('/auth', authRoutes);

// Dashboard routes
router.use('/dashboard', dashboardRoutes);

// Access control routes
router.use('/access-control', accessControlRoutes);

// Protected routes based on roles
router.use('/protected', protectedRoutes);

// Student management routes
router.use('/students', studentsRoutes);

// Teacher management routes
router.use('/teachers', teachersRoutes);

// Group management routes
router.use('/groups', groupsRoutes);

// Classroom management routes
router.use('/classrooms', classroomsRoutes);

// Schedule management routes
router.use('/schedules', schedulesRoutes);

// Attendance management routes
router.use('/attendance', attendanceRoutes);

// Payment management routes
router.use('/payments', paymentsRoutes);

module.exports = router;
