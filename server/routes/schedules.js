const express = require('express');
const Schedule = require('../models/Schedule');
const { authenticateUser, checkRole } = require('../middleware/auth');
const { APIError, handleAsyncError } = require('../utils/errorHandler');

const router = express.Router();

// Get all schedules (admin and teacher access)
router.get('/', authenticateUser, checkRole(['admin', 'teacher']), handleAsyncError(async (req, res) => {
  const schedules = await Schedule.find().populate('group classroom');
  res.json(schedules);
}));

// Get a specific schedule by ID (admin and teacher access)
router.get('/:id', authenticateUser, checkRole(['admin', 'teacher']), handleAsyncError(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id).populate('group classroom');
  if (!schedule) {
    throw new APIError(404, 'Schedule not found');
  }
  res.json(schedule);
}));

// Create a new schedule (admin access only)
router.post('/', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const { group, classroom, startTime, endTime, dayOfWeek } = req.body;
  const newSchedule = new Schedule({
    group,
    classroom,
    startTime,
    endTime,
    dayOfWeek
  });
  await newSchedule.save();
  res.status(201).json({ message: 'Schedule created successfully', scheduleId: newSchedule._id });
}));

// Update a schedule (admin access only)
router.put('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const { group, classroom, startTime, endTime, dayOfWeek } = req.body;
  const schedule = await Schedule.findByIdAndUpdate(
    req.params.id,
    { group, classroom, startTime, endTime, dayOfWeek },
    { new: true }
  );
  if (!schedule) {
    throw new APIError(404, 'Schedule not found');
  }
  res.json({ message: 'Schedule updated successfully', schedule });
}));

// Delete a schedule (admin access only)
router.delete('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const schedule = await Schedule.findByIdAndDelete(req.params.id);
  if (!schedule) {
    throw new APIError(404, 'Schedule not found');
  }
  res.json({ message: 'Schedule deleted successfully' });
}));

module.exports = router;
