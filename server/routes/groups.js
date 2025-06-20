const express = require('express');
const Group = require('../models/Group');
const { authenticateUser, checkRole } = require('../middleware/auth');
const { APIError, handleAsyncError } = require('../utils/errorHandler');

const router = express.Router();

// Get all groups (admin and teacher access)
router.get('/', authenticateUser, checkRole(['admin', 'teacher']), handleAsyncError(async (req, res) => {
  const groups = await Group.find().populate('teacher students');
  res.json(groups);
}));

// Get a specific group by ID (admin and teacher access)
router.get('/:id', authenticateUser, checkRole(['admin', 'teacher']), handleAsyncError(async (req, res) => {
  const group = await Group.findById(req.params.id).populate('teacher students');
  if (!group) {
    throw new APIError(404, 'Group not found');
  }
  res.json(group);
}));

// Create a new group (admin access only)
router.post('/', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const { name, subject, teacher, students } = req.body;
  const newGroup = new Group({
    name,
    subject,
    teacher,
    students: students || []
  });
  await newGroup.save();
  res.status(201).json({ message: 'Group created successfully', groupId: newGroup._id });
}));

// Update a group (admin access only)
router.put('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const { name, subject, teacher, students } = req.body;
  const group = await Group.findByIdAndUpdate(
    req.params.id,
    { name, subject, teacher, students },
    { new: true }
  );
  if (!group) {
    throw new APIError(404, 'Group not found');
  }
  res.json({ message: 'Group updated successfully', group });
}));

// Delete a group (admin access only)
router.delete('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const group = await Group.findByIdAndDelete(req.params.id);
  if (!group) {
    throw new APIError(404, 'Group not found');
  }
  res.json({ message: 'Group deleted successfully' });
}));

module.exports = router;
