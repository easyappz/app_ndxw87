const express = require('express');
const Пользователь = require('../models/User');
const { проверитьРоль } = require('../middleware/auth');

const маршрутизатор = express.Router();

// Получить всех пользователей (только для администратора)
маршрутизатор.get('/users', проверитьРоль(['admin']), async (запрос, ответ) => {
  try {
    const пользователи = await Пользователь.find().select('-password');
    ответ.json(пользователи);
  } catch (ошибка) {
    ответ.status(500).json({ сообщение: 'Ошибка при получении пользователей', ошибка: ошибка.message });
  }
});

// Получить конкретного пользователя по ID (только для администратора)
маршрутизатор.get('/users/:id', проверитьРоль(['admin']), async (запрос, ответ) => {
  try {
    const пользователь = await Пользователь.findById(запрос.params.id).select('-password');
    if (!пользователь) {
      return ответ.status(404).json({ сообщение: 'Пользователь не найден' });
    }
    ответ.json(пользователь);
  } catch (ошибка) {
    ответ.status(500).json({ сообщение: 'Ошибка при получении пользователя', ошибка: ошибка.message });
  }
});

// Обновить роль пользователя (только для администратора)
маршрутизатор.put('/users/:id/role', проверитьРоль(['admin']), async (запрос, ответ) => {
  try {
    const { role } = запрос.body;
    if (!['admin', 'teacher', 'student'].includes(role)) {
      return ответ.status(400).json({ сообщение: 'Неверное значение роли' });
    }

    const пользователь = await Пользователь.findByIdAndUpdate(
      запрос.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!пользователь) {
      return ответ.status(404).json({ сообщение: 'Пользователь не найден' });
    }
    ответ.json(пользователь);
  } catch (ошибка) {
    ответ.status(500).json({ сообщение: 'Ошибка при обновлении роли пользователя', ошибка: ошибка.message });
  }
});

// Обновить права доступа пользователя (только для администратора)
маршрутизатор.put('/users/:id/permissions', проверитьРоль(['admin']), async (запрос, ответ) => {
  try {
    const { permissions } = запрос.body;
    if (!Array.isArray(permissions)) {
      return ответ.status(400).json({ сообщение: 'Права доступа должны быть массивом' });
    }

    const пользователь = await Пользователь.findByIdAndUpdate(
      запрос.params.id,
      { permissions },
      { new: true }
    ).select('-password');

    if (!пользователь) {
      return ответ.status(404).json({ сообщение: 'Пользователь не найден' });
    }
    ответ.json(пользователь);
  } catch (ошибка) {
    ответ.status(500).json({ сообщение: 'Ошибка при обновлении прав доступа пользователя', ошибка: ошибка.message });
  }
});

// Назначить ссылочный ID и модель пользователю (только для администратора)
маршрутизатор.put('/users/:id/reference', проверитьРоль(['admin']), async (запрос, ответ) => {
  try {
    const { referenceId, referenceModel } = запрос.body;
    if (referenceModel && !['Teacher', 'Student'].includes(referenceModel)) {
      return ответ.status(400).json({ сообщение: 'Неверная модель ссылки' });
    }

    const пользователь = await Пользователь.findByIdAndUpdate(
      запрос.params.id,
      { referenceId, referenceModel },
      { new: true }
    ).select('-password');

    if (!пользователь) {
      return ответ.status(404).json({ сообщение: 'Пользователь не найден' });
    }
    ответ.json(пользователь);
  } catch (ошибка) {
    ответ.status(500).json({ сообщение: 'Ошибка при обновлении ссылки пользователя', ошибка: ошибка.message });
  }
});

module.exports = маршрутизатор;
