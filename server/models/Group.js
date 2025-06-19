const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  schedule: [{
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    dayOfWeek: { type: String, required: true }
  }],
  attendance: [{
    date: { type: Date, required: true },
    studentAttendance: [{
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
      status: { type: String, enum: ['present', 'absent', 'late'], default: 'absent' }
    }]
  }],
  payments: [{
    cycleStartDate: { type: Date, required: true },
    cycleEndDate: { type: Date, required: true },
    studentPayments: [{
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
      amount: { type: Number, required: true },
      paymentDate: { type: Date, required: true },
      confirmed: { type: Boolean, default: false }
    }]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

groupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Group', groupSchema);
