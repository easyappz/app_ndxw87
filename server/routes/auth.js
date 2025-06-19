const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, authenticateUser, checkRole } = require('../middleware/auth');

const router = express.Router();

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, referenceId, referenceModel, permissions } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Проверка при регистрации пользователя с ролью admin
    if (role === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin) {
        return res.status(403).json({ message: 'Administrator already exists. Registration of a new administrator is prohibited.' });
      }
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

    res.status(201).json({ message: 'User successfully registered', userId: newUser._id });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Вход пользователя и возврат JWT токена
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
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Получить профиль пользователя
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile retrieval error:', error.message);
    res.status(500).json({ message: 'Error retrieving user profile', error: error.message });
  }
});

// Создание администратора (доступно только если администратор еще не существует)
router.post('/create-admin', async (req, res) => {
  try {
    // Проверяем, существует ли уже пользователь с ролью admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(403).json({ message: 'Administrator already exists. Creation of a new administrator is prohibited.' });
    }

    const { email, password, firstName, lastName } = req.body;

    // Проверка на существование пользователя с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Создаем нового администратора
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'admin',
      referenceId: null,
      referenceModel: null,
      permissions: []
    });

    await adminUser.save();

    res.status(201).json({ message: 'Administrator successfully created', userId: adminUser._id });
  } catch (error) {
    console.error('Admin creation error:', error.message);
    res.status(500).json({ message: 'Error creating administrator', error: error.message });
  }
});

// Проверка существования администратора
router.get('/check-admin', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (error) {
    console.error('Admin existence check error:', error.message);
    res.status(500).json({ message: 'Error checking administrator existence', error: error.message });
  }
});

// Новый маршрут для регистрации администратора (доступен только для существующих администраторов)
router.post('/register-admin', authenticateUser, checkRole(['admin']), async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Проверка на существование пользователя с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Создаем нового администратора
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'admin',
      referenceId: null,
      referenceModel: null,
      permissions: []
    });

    await newAdmin.save();

    res.status(201).json({ message: 'New administrator successfully registered', userId: newAdmin._id });
  } catch (error) {
    console.error('New admin registration error:', error.message);
    res.status(500).json({ message: 'Error registering new administrator', error: error.message });
  }
});

module.exports = router;
