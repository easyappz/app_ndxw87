const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Пользователь = require('../models/User');
const { JWT_СЕКРЕТ } = require('../middleware/auth');

const маршрутизатор = express.Router();

// Регистрация нового пользователя
маршрутизатор.post('/register', async (запрос, ответ) => {
  try {
    const { email, password, firstName, lastName, role, referenceId, referenceModel, permissions } = запрос.body;

    const существующийПользователь = await Пользователь.findOne({ email });
    if (существующийПользователь) {
      return ответ.status(400).json({ сообщение: 'Пользователь с этим email уже существует' });
    }

    const зашифрованныйПароль = await bcrypt.hash(password, 10);
    const новыйПользователь = new Пользователь({
      email,
      password: зашифрованныйПароль,
      firstName,
      lastName,
      role,
      referenceId: role !== 'admin' ? referenceId : null,
      referenceModel: role !== 'admin' ? referenceModel : null,
      permissions: role === 'admin' ? [] : permissions || []
    });

    await новыйПользователь.save();

    ответ.status(201).json({ сообщение: 'Пользователь успешно зарегистрирован', userId: новыйПользователь._id });
  } catch (ошибка) {
    console.error('Ошибка регистрации:', ошибка.message);
    ответ.status(500).json({ сообщение: 'Ошибка при регистрации пользователя', ошибка: ошибка.message });
  }
});

// Вход пользователя и возврат JWT токена
маршрутизатор.post('/login', async (запрос, ответ) => {
  try {
    const { email, password } = запрос.body;

    const пользователь = await Пользователь.findOne({ email });
    if (!пользователь) {
      return ответ.status(400).json({ сообщение: 'Неверный email или пароль' });
    }

    const парольВерный = await bcrypt.compare(password, пользователь.password);
    if (!парольВерный) {
      return ответ.status(400).json({ сообщение: 'Неверный email или пароль' });
    }

    const токен = jwt.sign({ userId: пользователь._id, role: пользователь.role }, JWT_СЕКРЕТ, { expiresIn: '1h' });
    ответ.json({ токен, пользователь: { id: пользователь._id, email: пользователь.email, role: пользователь.role, firstName: пользователь.firstName, lastName: пользователь.lastName } });
  } catch (ошибка) {
    console.error('Ошибка входа:', ошибка.message);
    ответ.status(500).json({ сообщение: 'Ошибка при входе', ошибка: ошибка.message });
  }
});

// Получить профиль пользователя
маршрутизатор.get('/profile', async (запрос, ответ) => {
  try {
    const пользователь = await Пользователь.findById(запрос.user._id).select('-password');
    if (!пользователь) {
      return ответ.status(404).json({ сообщение: 'Пользователь не найден' });
    }
    ответ.json(пользователь);
  } catch (ошибка) {
    console.error('Ошибка получения профиля:', ошибка.message);
    ответ.status(500).json({ сообщение: 'Ошибка при получении профиля пользователя', ошибка: ошибка.message });
  }
});

module.exports = маршрутизатор;
