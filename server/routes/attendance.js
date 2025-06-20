const express = require('express');
const Attendance = require('../models/Attendance');
const { authenticateUser, checkRole } = require('../middleware/auth');
const { APIError, handleAsyncError } = require('../utils/errorHandler');

const router = express.Router();

// Get all attendance records (admin and teacher access)
router.get('/', authenticateUser, checkRole(['admin', 'teacher']), handleAsyncError(async (req, res) => {
  const attendance = await Attendance.find().populate('student group schedule');
  res.json(attendance);
}));

// Get a specific attendance record by ID (admin and teacher access)
router.get('/:id', authenticateUser, checkRole(['admin', 'teacher']), handleAsyncError(async (req, res) => {
  const attendance = await Attendance.findById(req.params.id).populate('student group schedule');
  if (!attendance) {
    throw new APIError(404, 'Attendance record not found');
  }
  res.json(attendance);
}));

// Create a new attendance record (admin and teacher access)
router.post('/', authenticateUser, checkRole(['admin', 'teacher']), handleAsyncError(async (req, res) => {
  const { student, group, schedule, date, status } = req.body;
  const newAttendance = new Attendance({
    student,
    group,
    schedule,
    date,
    status
  });
  await newAttendance.save();
  res.status(201).json({ message: 'Attendance record created successfully', attendanceId: newAttendance._id });
}));

// Update an attendance record (admin and teacher access)
router.put('/:id', authenticateUser, checkRole(['admin', 'teacher']), handleAsyncError(async (req, res) => {
  const { status } = req.body;
  const attendance = await Attendance.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!attendance) {
    throw new APIError(404, 'Attendance record not found');
  }
  res.json({ message: 'Attendance record updated successfully', attendance });
}));

// Delete an attendance record (admin access only)
router.delete('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const attendance = await Attendance.findByIdAndDelete(req.params.id);
  if (!attendance) {
    throw new APIError(404, 'Attendance record not found');
  }
  res.json({ message: 'Attendance record deleted successfully' });
}));

module.exports = router;
