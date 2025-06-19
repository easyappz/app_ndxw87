const express = require('express');
const маршрутыАутентификации = require('./routes/auth');
const маршрутыПанели = require('./routes/dashboard');
const маршрутыКонтроляДоступа = require('./routes/accessControl');
const защищенныеМаршруты = require('./routes/protectedRoutes');

const маршрутизатор = express.Router();

// Маршруты аутентификации
маршрутизатор.use('/auth', маршрутыАутентификации);

// Маршруты панели управления
маршрутизатор.use('/dashboard', маршрутыПанели);

// Маршруты контроля доступа
маршрутизатор.use('/access-control', маршрутыКонтроляДоступа);

// Защищенные маршруты на основе ролей
маршрутизатор.use('/protected', защищенныеМаршруты);

module.exports = маршрутизатор;
