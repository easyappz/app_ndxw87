const express = require('express');
const Classroom = require('./models/Classroom');
const Teacher = require('./models/Teacher');
const Group = require('./models/Group');
const Student = require('./models/Student');
const Schedule = require('./models/Schedule');
const Attendance = require('./models/Attendance');
const Payment = require('./models/Payment');
const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
const accessControlRoutes = require('./routes/accessControl');
const { authenticateUser, checkPermission, checkRole } = require('./middleware/auth');

const router = express.Router();

// Use dashboard routes
router.use('/', dashboardRoutes);

// Use auth routes
router.use('/auth', authRoutes);

// Apply authentication middleware to all routes below
router.use(authenticateUser);

// Use access control routes
router.use('/access', accessControlRoutes);

// Classroom Routes
router.get('/classrooms', checkRole(['admin']), async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.json(classrooms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching classrooms', error: err.message });
  }
});

router.post('/classrooms', checkRole(['admin']), async (req, res) => {
  try {
    const classroom = new Classroom(req.body);
    await classroom.save();
    res.status(201).json(classroom);
  } catch (err) {
    res.status(400).json({ message: 'Error creating classroom', error: err.message });
  }
});

router.put('/classrooms/:id', checkRole(['admin']), async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.json(classroom);
  } catch (err) {
    res.status(400).json({ message: 'Error updating classroom', error: err.message });
  }
});

router.delete('/classrooms/:id', checkRole(['admin']), async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndDelete(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.json({ message: 'Classroom deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting classroom', error: err.message });
  }
});

// Get Classroom Schedule by Day/Week/Month
router.get('/classrooms/:id/schedule', checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    const { view } = req.query; // 'day', 'week', 'month'
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    let scheduleData = {};
    if (view === 'day') {
      scheduleData = classroom.schedule.days;
    } else if (view === 'week') {
      scheduleData = classroom.schedule.weeks;
    } else if (view === 'month') {
      scheduleData = classroom.schedule.months;
    } else {
      scheduleData = classroom.schedule;
    }
    res.json(scheduleData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching classroom schedule', error: err.message });
  }
});

// Teacher Routes
router.get('/teachers', checkRole(['admin']), async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching teachers', error: err.message });
  }
});

router.post('/teachers', checkRole(['admin']), async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).json(teacher);
  } catch (err) {
    res.status(400).json({ message: 'Error creating teacher', error: err.message });
  }
});

router.put('/teachers/:id', checkRole(['admin']), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (err) {
    res.status(400).json({ message: 'Error updating teacher', error: err.message });
  }
});

router.delete('/teachers/:id', checkRole(['admin']), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting teacher', error: err.message });
  }
});

// Get Teacher Groups from Journal
router.get('/teachers/:id/groups', checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('journal.group');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    if (req.user.role === 'teacher' && req.user.referenceId.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied to other teacher data' });
    }
    const groups = teacher.journal.map(entry => entry.group);
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching teacher groups', error: err.message });
  }
});

// Add Group to Teacher Journal
router.post('/teachers/:id/journal', checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    if (req.user.role === 'teacher' && req.user.referenceId.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied to other teacher data' });
    }
    teacher.journal.push(req.body);
    await teacher.save();
    res.status(201).json(teacher.journal);
  } catch (err) {
    res.status(400).json({ message: 'Error adding to teacher journal', error: err.message });
  }
});

// Group Routes
router.get('/groups', checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    const groups = await Group.find().populate('teacher students');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching groups', error: err.message });
  }
});

router.post('/groups', checkRole(['admin']), async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ message: 'Error creating group', error: err.message });
  }
});

router.put('/groups/:id', checkRole(['admin']), async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (err) {
    res.status(400).json({ message: 'Error updating group', error: err.message });
  }
});

router.delete('/groups/:id', checkRole(['admin']), async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting group', error: err.message });
  }
});

// Get Group Schedule
router.get('/groups/:id/schedule', checkRole(['admin', 'teacher', 'student']), async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('schedule.classroom');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    if (req.user.role === 'student') {
      const student = await Student.findById(req.user.referenceId);
      if (!student.learningData.groups.some(g => g.toString() === req.params.id)) {
        return res.status(403).json({ message: 'Access denied to this group' });
      }
    }
    res.json(group.schedule);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching group schedule', error: err.message });
  }
});

// Get Group Attendance Report
router.get('/groups/:id/attendance-report', checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('attendance.studentAttendance.student');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group.attendance);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching group attendance report', error: err.message });
  }
});

// Student Routes
router.get('/students', checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
});

router.post('/students', checkRole(['admin']), async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: 'Error creating student', error: err.message });
  }
});

router.put('/students/:id', checkRole(['admin']), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: 'Error updating student', error: err.message });
  }
});

router.delete('/students/:id', checkRole(['admin']), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student', error: err.message });
  }
});

// Get Student Payment Status
router.get('/students/:id/payment-status', checkRole(['admin', 'student']), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('paymentStatus.group');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (req.user.role === 'student' && req.user.referenceId.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied to other student data' });
    }
    res.json(student.paymentStatus);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student payment status', error: err.message });
  }
});

// Update Student Payment Status
router.post('/students/:id/payment-status', checkRole(['admin']), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    student.paymentStatus.push(req.body);
    await student.save();
    res.status(201).json(student.paymentStatus);
  } catch (err) {
    res.status(400).json({ message: 'Error updating student payment status', error: err.message });
  }
});

// Schedule Routes
router.get('/schedules', checkRole(['admin', 'teacher', 'student']), async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('group classroom');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching schedules', error: err.message });
  }
});

router.post('/schedules', checkRole(['admin']), async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ message: 'Error creating schedule', error: err.message });
  }
});

router.put('/schedules/:id', checkRole(['admin']), async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (err) {
    res.status(400).json({ message: 'Error updating schedule', error: err.message });
  }
});

router.delete('/schedules/:id', checkRole(['admin']), async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting schedule', error: err.message });
  }
});

// Attendance Routes
router.get('/attendances', checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    const attendances = await Attendance.find().populate('student group schedule');
    res.json(attendances);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendances', error: err.message });
  }
});

router.post('/attendances', checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ message: 'Error creating attendance', error: err.message });
  }
});

router.put('/attendances/:id', checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ message: 'Error updating attendance', error: err.message });
  }
});

router.delete('/attendances/:id', checkRole(['admin']), async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.json({ message: 'Attendance deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting attendance', error: err.message });
  }
});

// Get Attendance by Date for Highlighting Lesson Days
router.get('/attendances/dates', checkRole(['admin', 'teacher', 'student']), async (req, res) => {
  try {
    const { studentId, groupId, startDate, endDate } = req.query;
    const query = {};
    if (studentId) {
      if (req.user.role === 'student' && req.user.referenceId.toString() !== studentId) {
        return res.status(403).json({ message: 'Access denied to other student data' });
      }
      query.student = studentId;
    }
    if (groupId) query.group = groupId;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const attendances = await Attendance.find(query).select('date status');
    res.json(attendances);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance dates', error: err.message });
  }
});

// Payment Routes
router.get('/payments', checkRole(['admin']), async (req, res) => {
  try {
    const payments = await Payment.find().populate('student group');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payments', error: err.message });
  }
});

router.post('/payments', checkRole(['admin']), async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ message: 'Error creating payment', error: err.message });
  }
});

router.put('/payments/:id', checkRole(['admin']), async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (err) {
    res.status(400).json({ message: 'Error updating payment', error: err.message });
  }
});

router.delete('/payments/:id', checkRole(['admin']), async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting payment', error: err.message });
  }
});

// Confirm Payment for Cycle (8 Lessons)
router.post('/payments/:id/confirm', checkRole(['admin']), async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id, 
      { confirmed: true }, 
      { new: true }
    ).populate('student group');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    // Update student payment status
    const student = await Student.findById(payment.student._id);
    const paymentStatusIndex = student.paymentStatus.findIndex(
      status => status.group.toString() === payment.group._id.toString() 
        && status.cycleStartDate.getTime() === payment.cycleStartDate.getTime()
    );
    if (paymentStatusIndex !== -1) {
      student.paymentStatus[paymentStatusIndex].confirmed = true;
      student.paymentStatus[paymentStatusIndex].amountPaid = payment.amount;
      await student.save();
    }
    res.json(payment);
  } catch (err) {
    res.status(400).json({ message: 'Error confirming payment', error: err.message });
  }
});

// Attendance Report
router.get('/reports/attendance', checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    const { studentId, groupId, startDate, endDate } = req.query;
    const query = {};
    if (studentId) query.student = studentId;
    if (groupId) query.group = groupId;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const report = await Attendance.find(query).populate('student group schedule');
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error generating attendance report', error: err.message });
  }
});

// Payment Report
router.get('/reports/payments', checkRole(['admin']), async (req, res) => {
  try {
    const { studentId, groupId, startDate, endDate } = req.query;
    const query = {};
    if (studentId) query.student = studentId;
    if (groupId) query.group = groupId;
    if (startDate && endDate) {
      query.paymentDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const report = await Payment.find(query).populate('student group');
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error generating payment report', error: err.message });
  }
});

module.exports = router;
