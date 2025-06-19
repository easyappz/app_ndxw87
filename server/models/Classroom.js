const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  location: { type: String, required: false },
  description: { type: String, required: false },
  schedule: {
    days: [{ 
      dayOfWeek: { type: String, required: true },
      timeSlots: [{
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: false }
      }]
    }],
    weeks: [{
      weekNumber: { type: Number, required: true },
      days: [{ 
        dayOfWeek: { type: String, required: true },
        timeSlots: [{
          startTime: { type: Date, required: true },
          endTime: { type: Date, required: true },
          group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: false }
        }]
      }]
    }],
    months: [{
      month: { type: String, required: true },
      days: [{ 
        date: { type: Date, required: true },
        timeSlots: [{
          startTime: { type: Date, required: true },
          endTime: { type: Date, required: true },
          group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: false }
        }]
      }]
    }]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

classroomSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Classroom', classroomSchema);
