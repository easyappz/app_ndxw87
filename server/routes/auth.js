const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, referenceId, referenceModel, permissions } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с этим email уже существует' });
    }

    // Проверка при регистрации пользователя с ролью admin
    if (role === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin) {
        return res.status(403).json({ message: 'Администратор уже существует. Регистрация нового администратора запрещена.' });
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

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован', userId: newUser._id });
  } catch (error) {
    console.error('Ошибка регистрации:', error.message);
    res.status(500).json({ message: 'Ошибка при регистрации пользователя', error: error.message });
  }
});

// Вход пользователя и возврат JWT токена
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } });
  } catch (error) {
    console.error('Ошибка входа:', error.message);
    res.status(500).json({ message: 'Ошибка при входе', error: error.message });
  }
});

// Получить профиль пользователя
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    console.error('Ошибка получения профиля:', error.message);
    res.status(500).json({ message: 'Ошибка при получении профиля пользователя', error: error.message });
  }
});

// Создание администратора (доступно только если администратор еще не существует)
router.post('/create-admin', async (req, res) => {
  try {
    // Проверяем, существует ли уже пользователь с ролью admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(403).json({ message: 'Администратор уже существует. Создание нового администратора запрещено.' });
    }

    const { email, password, firstName, lastName } = req.body;

    // Проверка на существование пользователя с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с этим email уже существует' });
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

    res.status(201).json({ message: 'Администратор успешно создан', userId: adminUser._id });
  } catch (error) {
    console.error('Ошибка создания администратора:', error.message);
    res.status(500).json({ message: 'Ошибка при создании администратора', error: error.message });
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
    console.error('Ошибка проверки существования администратора:', error.message);
    res.status(500).json({ message: 'Ошибка при проверке существования администратора', error: error.message });
  }
});

module.exports = router;
