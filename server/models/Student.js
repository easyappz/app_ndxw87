const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  parentName: { type: String, required: false },
  parentPhone: { type: String, required: false },
  balance: { type: Number, default: 0 },
  learningData: {
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    progress: [{
      group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
      date: { type: Date, required: true },
      note: { type: String, required: false },
      score: { type: Number, required: false }
    }]
  },
  paymentStatus: [{
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    cycleStartDate: { type: Date, required: true },
    cycleEndDate: { type: Date, required: true },
    amountDue: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    confirmed: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Student', studentSchema);
