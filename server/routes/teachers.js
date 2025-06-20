const express = require('express');
const Teacher = require('../models/Teacher');
const { authenticateUser, checkRole } = require('../middleware/auth');
const { APIError, handleAsyncError } = require('../utils/errorHandler');

const router = express.Router();

// Get all teachers (admin access only)
router.get('/', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
}));

// Get a specific teacher by ID (admin access only)
router.get('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    throw new APIError(404, 'Teacher not found');
  }
  res.json(teacher);
}));

// Create a new teacher (admin access only)
router.post('/', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const { firstName, lastName, email, phone, subjects } = req.body;
  const newTeacher = new Teacher({
    firstName,
    lastName,
    email,
    phone,
    subjects
  });
  await newTeacher.save();
  res.status(201).json({ message: 'Teacher created successfully', teacherId: newTeacher._id });
}));

// Update a teacher (admin access only)
router.put('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const { firstName, lastName, email, phone, subjects } = req.body;
  const teacher = await Teacher.findByIdAndUpdate(
    req.params.id,
    { firstName, lastName, email, phone, subjects },
    { new: true }
  );
  if (!teacher) {
    throw new APIError(404, 'Teacher not found');
  }
  res.json({ message: 'Teacher updated successfully', teacher });
}));

// Delete a teacher (admin access only)
router.delete('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const teacher = await Teacher.findByIdAndDelete(req.params.id);
  if (!teacher) {
    throw new APIError(404, 'Teacher not found');
  }
  res.json({ message: 'Teacher deleted successfully' });
}));

module.exports = router;
