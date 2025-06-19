const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Пользователь = require('./models/User');

const apiМаршруты = require('./apiRoutes');

// Инициализация приложения Express
const приложение = express();

// Middleware
приложение.use(cors());
приложение.use(bodyParser.json());
приложение.use(bodyParser.urlencoded({ extended: true }));

// API маршруты
приложение.use('/api', apiМаршруты);

// Подключение к MongoDB
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB успешно подключен');
  await создатьАдмина();
})
.catch((ошибка) => {
  console.error('Ошибка подключения к MongoDB:', ошибка);
});

// Функция для создания пользователя-администратора
const создатьАдмина = async () => {
  try {
    const админПочта = 'ilez2017@mail.ru';
    const админПароль = '123123123';
    const существующийАдмин = await Пользователь.findOne({ email: админПочта });
    if (!существующийАдмин) {
      const зашифрованныйПароль = await bcrypt.hash(админПароль, 10);
      const админПользователь = new Пользователь({
        email: админПочта,
        password: зашифрованныйПароль,
        firstName: 'Админ',
        lastName: 'Пользователь',
        role: 'admin'
      });
      await админПользователь.save();
      console.log('Пользователь-администратор успешно создан');
    } else {
      console.log('Пользователь-администратор уже существует');
    }
  } catch (ошибка) {
    console.error('Ошибка при создании администратора:', ошибка.message);
  }
};

// Middleware для обработки ошибок
приложение.use((ошибка, запрос, ответ, следующий) => {
  console.error(ошибка.stack);
  ответ.status(500).json({ сообщение: 'Что-то пошло не так!' });
});

// Запуск сервера
const ПОРТ = process.env.PORT || 5000;
приложение.listen(ПОРТ, () => {
  console.log(`Сервер запущен на порту ${ПОРТ}`);
});

module.exports = приложение;
