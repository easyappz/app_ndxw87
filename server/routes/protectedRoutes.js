const express = require('express');
const { authenticateUser, checkRole } = require('../middleware/auth');

const router = express.Router();

// Пример маршрута, доступного только администратору
router.get('/admin-only', authenticateUser, checkRole(['admin']), (req, res) => {
  res.json({ message: 'Это конечная точка только для администратора', user: req.user });
});

// Пример маршрута, доступного администратору и учителю
router.get('/teacher-admin', authenticateUser, checkRole(['admin', 'teacher']), (req, res) => {
  res.json({ message: 'Это доступно учителям и администраторам', user: req.user });
});

// Пример маршрута, доступного для всех ролей
router.get('/all-roles', authenticateUser, checkRole(['admin', 'teacher', 'student']), (req, res) => {
  res.json({ message: 'Это доступно всем аутентифицированным пользователям', user: req.user });
});

module.exports = router;
