const express = require('express');
const Classroom = require('../models/Classroom');
const { authenticateUser, checkRole } = require('../middleware/auth');
const { APIError, handleAsyncError } = require('../utils/errorHandler');

const router = express.Router();

// Get all classrooms (admin and teacher access)
router.get('/', authenticateUser, checkRole(['admin', 'teacher']), handleAsyncError(async (req, res) => {
  const classrooms = await Classroom.find();
  res.json(classrooms);
}));

// Get a specific classroom by ID (admin and teacher access)
router.get('/:id', authenticateUser, checkRole(['admin', 'teacher']), handleAsyncError(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id);
  if (!classroom) {
    throw new APIError(404, 'Classroom not found');
  }
  res.json(classroom);
}));

// Create a new classroom (admin access only)
router.post('/', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const { name, capacity, location, description } = req.body;
  const newClassroom = new Classroom({
    name,
    capacity,
    location,
    description
  });
  await newClassroom.save();
  res.status(201).json({ message: 'Classroom created successfully', classroomId: newClassroom._id });
}));

// Update a classroom (admin access only)
router.put('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const { name, capacity, location, description } = req.body;
  const classroom = await Classroom.findByIdAndUpdate(
    req.params.id,
    { name, capacity, location, description },
    { new: true }
  );
  if (!classroom) {
    throw new APIError(404, 'Classroom not found');
  }
  res.json({ message: 'Classroom updated successfully', classroom });
}));

// Delete a classroom (admin access only)
router.delete('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const classroom = await Classroom.findByIdAndDelete(req.params.id);
  if (!classroom) {
    throw new APIError(404, 'Classroom not found');
  }
  res.json({ message: 'Classroom deleted successfully' });
}));

module.exports = router;
