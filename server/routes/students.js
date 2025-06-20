const express = require('express');
const Student = require('../models/Student');
const { authenticateUser, checkRole } = require('../middleware/auth');
const { APIError, handleAsyncError } = require('../utils/errorHandler');

const router = express.Router();

// Get all students (admin and teacher access)
router.get('/', authenticateUser, checkRole(['admin', 'teacher']), handleAsyncError(async (req, res) => {
  const students = await Student.find().populate('learningData.groups');
  res.json(students);
}));

// Get a specific student by ID (admin and teacher access)
router.get('/:id', authenticateUser, checkRole(['admin', 'teacher']), handleAsyncError(async (req, res) => {
  const student = await Student.findById(req.params.id).populate('learningData.groups');
  if (!student) {
    throw new APIError(404, 'Student not found');
  }
  res.json(student);
}));

// Create a new student (admin access only)
router.post('/', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const { firstName, lastName, email, phone, parentName, parentPhone } = req.body;
  const newStudent = new Student({
    firstName,
    lastName,
    email,
    phone,
    parentName,
    parentPhone
  });
  await newStudent.save();
  res.status(201).json({ message: 'Student created successfully', studentId: newStudent._id });
}));

// Update a student (admin access only)
router.put('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const { firstName, lastName, email, phone, parentName, parentPhone } = req.body;
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { firstName, lastName, email, phone, parentName, parentPhone },
    { new: true }
  );
  if (!student) {
    throw new APIError(404, 'Student not found');
  }
  res.json({ message: 'Student updated successfully', student });
}));

// Delete a student (admin access only)
router.delete('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) {
    throw new APIError(404, 'Student not found');
  }
  res.json({ message: 'Student deleted successfully' });
}));

// Add student to a group (admin access only)
router.post('/:id/groups', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const { groupId } = req.body;
  const student = await Student.findById(req.params.id);
  if (!student) {
    throw new APIError(404, 'Student not found');
  }
  if (!student.learningData.groups.includes(groupId)) {
    student.learningData.groups.push(groupId);
    await student.save();
  }
  res.json({ message: 'Student added to group successfully', student });
}));

module.exports = router;
