const express = require('express');
const Payment = require('../models/Payment');
const { authenticateUser, checkRole } = require('../middleware/auth');
const { APIError, handleAsyncError } = require('../utils/errorHandler');

const router = express.Router();

// Get all payments (admin access only)
router.get('/', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const payments = await Payment.find().populate('student group');
  res.json(payments);
}));

// Get a specific payment by ID (admin access only)
router.get('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('student group');
  if (!payment) {
    throw new APIError(404, 'Payment not found');
  }
  res.json(payment);
}));

// Create a new payment (admin access only)
router.post('/', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const { student, group, amount, paymentDate, cycleStartDate, cycleEndDate, cycleLessonsCount, confirmed } = req.body;
  const newPayment = new Payment({
    student,
    group,
    amount,
    paymentDate,
    cycleStartDate,
    cycleEndDate,
    cycleLessonsCount,
    confirmed
  });
  await newPayment.save();
  res.status(201).json({ message: 'Payment created successfully', paymentId: newPayment._id });
}));

// Update a payment (admin access only)
router.put('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const { amount, paymentDate, confirmed } = req.body;
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { amount, paymentDate, confirmed },
    { new: true }
  );
  if (!payment) {
    throw new APIError(404, 'Payment not found');
  }
  res.json({ message: 'Payment updated successfully', payment });
}));

// Delete a payment (admin access only)
router.delete('/:id', authenticateUser, checkRole(['admin']), handleAsyncError(async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) {
    throw new APIError(404, 'Payment not found');
  }
  res.json({ message: 'Payment deleted successfully' });
}));

module.exports = router;
