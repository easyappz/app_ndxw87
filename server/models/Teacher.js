const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
  subjects: [{ type: String, required: true }],
  journal: [{
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    notes: [{ 
      date: { type: Date, required: true },
      content: { type: String, required: true }
    }]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

teacherSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);
