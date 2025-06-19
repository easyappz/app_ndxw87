const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, referenceId, referenceModel, permissions } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      referenceId: role !== 'admin' ? referenceId : null,
      referenceModel: role !== 'admin' ? referenceModel : null,
      permissions: role === 'admin' ? [] : permissions || []
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login user and return JWT token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

module.exports = router;
