const express = require('express');
const Студент = require('../models/Student');
const Учитель = require('../models/Teacher');
const Группа = require('../models/Group');
const Посещаемость = require('../models/Attendance');
const Платеж = require('../models/Payment');
const { проверитьРоль } = require('../middleware/auth');

const маршрутизатор = express.Router();

// Сводные данные для панели управления
маршрутизатор.get('/dashboard-summary', проверитьРоль(['admin', 'teacher']), async (запрос, ответ) => {
  try {
    const количествоСтудентов = await Студент.countDocuments();
    const количествоУчителей = await Учитель.countDocuments();
    const количествоГрупп = await Группа.countDocuments();

    // Сводка по посещаемости за текущий месяц
    const сейчас = new Date();
    const началоМесяца = new Date(сейчас.getFullYear(), сейчас.getMonth(), 1);
    const конецМесяца = new Date(сейчас.getFullYear(), сейчас.getMonth() + 1, 0, 23, 59, 59, 999);

    const сводкаПосещаемости = await Посещаемость.aggregate([
      {
        $match: {
          date: {
            $gte: началоМесяца,
            $lte: конецМесяца
          }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const данныеПосещаемости = {
      присутствует: 0,
      отсутствует: 0,
      опоздал: 0
    };

    сводкаПосещаемости.forEach(элемент => {
      if (элемент._id === 'present') данныеПосещаемости.присутствует = элемент.count;
      if (элемент._id === 'absent') данныеПосещаемости.отсутствует = элемент.count;
      if (элемент._id === 'late') данныеПосещаемости.опоздал = элемент.count;
    });

    // Сводка по платежам за текущий месяц (только для администратора)
    let данныеПлатежей = { всего: 0, подтверждено: 0 };
    if (запрос.user.role === 'admin') {
      const сводкаПлатежей = await Платеж.aggregate([
        {
          $match: {
            paymentDate: {
              $gte: началоМесяца,
              $lte: конецМесяца
            }
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            confirmedAmount: { $sum: { $cond: ['$confirmed', '$amount', 0] } }
          }
        }
      ]);

      данныеПлатежей = {
        всего: сводкаПлатежей.length > 0 ? сводкаПлатежей[0].totalAmount : 0,
        подтверждено: сводкаПлатежей.length > 0 ? сводкаПлатежей[0].confirmedAmount : 0
      };
    }

    ответ.json({
      студенты: количествоСтудентов,
      учителя: запрос.user.role === 'admin' ? количествоУчителей : 0,
      группы: количествоГрупп,
      посещаемость: данныеПосещаемости,
      платежи: данныеПлатежей
    });
  } catch (ошибка) {
    ответ.status(500).json({ сообщение: 'Ошибка при получении сводки для панели управления', ошибка: ошибка.message });
  }
});

// Недавние активности для панели управления
маршрутизатор.get('/recent-activities', проверитьРоль(['admin', 'teacher']), async (запрос, ответ) => {
  try {
    const сейчас = new Date();
    const семьДнейНазад = new Date(сейчас.setDate(сейчас.getDate() - 7));

    const недавняяПосещаемость = await Посещаемость.find({
      date: { $gte: семьДнейНазад }
    })
    .populate('student group')
    .sort({ date: -1 })
    .limit(5);

    let недавниеПлатежи = [];
    if (запрос.user.role === 'admin') {
      недавниеПлатежи = await Платеж.find({
        paymentDate: { $gte: семьДнейНазад }
      })
      .populate('student group')
      .sort({ paymentDate: -1 })
      .limit(5);
    }

    const активности = [
      ...недавняяПосещаемость.map(посещ => ({
        тип: 'посещаемость',
        описание: `${посещ.student.firstName} ${посещ.student.lastName} отмечен как ${посещ.status} в группе ${посещ.group.name}`,
        дата: посещ.date
      })),
      ...недавниеПлатежи.map(плат => ({
        тип: 'платеж',
        описание: `${плат.student.firstName} ${плат.student.lastName} заплатил ${плат.amount} за группу ${плат.group.name}`,
        дата: плат.paymentDate
      }))]
    .sort((а, б) => б.дата - а.дата)
    .slice(0, 5);

    ответ.json(активности);
  } catch (ошибка) {
    ответ.status(500).json({ сообщение: 'Ошибка при получении недавних активностей', ошибка: ошибка.message });
  }
});

module.exports = маршрутизатор;
