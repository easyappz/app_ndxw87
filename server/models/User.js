const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'teacher', 'student'], 
    required: true 
  },
  referenceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'referenceModel',
    required: false 
  },
  referenceModel: { 
    type: String, 
    enum: ['Teacher', 'Student'], 
    required: false 
  },
  permissions: [{ 
    resource: { type: String, required: true },
    actions: [{ type: String, required: true }] 
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
