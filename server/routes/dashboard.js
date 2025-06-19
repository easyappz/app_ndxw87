const express = require('express');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Group = require('../models/Group');
const Attendance = require('../models/Attendance');
const Payment = require('../models/Payment');
const { checkRole } = require('../middleware/auth');

const router = express.Router();

// Dashboard summary data
router.get('/dashboard-summary', checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    const teacherCount = await Teacher.countDocuments();
    const groupCount = await Group.countDocuments();

    // Attendance summary for the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const attendanceSummary = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth
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

    const attendanceData = {
      present: 0,
      absent: 0,
      late: 0
    };

    attendanceSummary.forEach(item => {
      if (item._id === 'present') attendanceData.present = item.count;
      if (item._id === 'absent') attendanceData.absent = item.count;
      if (item._id === 'late') attendanceData.late = item.count;
    });

    // Payment summary for the current month (Admin only)
    let paymentData = { total: 0, confirmed: 0 };
    if (req.user.role === 'admin') {
      const paymentSummary = await Payment.aggregate([
        {
          $match: {
            paymentDate: {
              $gte: startOfMonth,
              $lte: endOfMonth
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

      paymentData = {
        total: paymentSummary.length > 0 ? paymentSummary[0].totalAmount : 0,
        confirmed: paymentSummary.length > 0 ? paymentSummary[0].confirmedAmount : 0
      };
    }

    res.json({
      students: studentCount,
      teachers: req.user.role === 'admin' ? teacherCount : 0,
      groups: groupCount,
      attendance: attendanceData,
      payments: paymentData
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard summary', error: err.message });
  }
});

// Recent activities for dashboard
router.get('/recent-activities', checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));

    const recentAttendance = await Attendance.find({
      date: { $gte: sevenDaysAgo }
    })
    .populate('student group')
    .sort({ date: -1 })
    .limit(5);

    let recentPayments = [];
    if (req.user.role === 'admin') {
      recentPayments = await Payment.find({
        paymentDate: { $gte: sevenDaysAgo }
      })
      .populate('student group')
      .sort({ paymentDate: -1 })
      .limit(5);
    }

    const activities = [
      ...recentAttendance.map(att => ({
        type: 'attendance',
        description: `${att.student.firstName} ${att.student.lastName} marked as ${att.status} in group ${att.group.name}`,
        date: att.date
      })),
      ...recentPayments.map(pay => ({
        type: 'payment',
        description: `${pay.student.firstName} ${pay.student.lastName} paid ${pay.amount} for group ${pay.group.name}`,
        date: pay.paymentDate
      }))]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recent activities', error: err.message });
  }
});

module.exports = router;
