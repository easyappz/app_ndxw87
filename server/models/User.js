const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8
  },
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true
  },
  role: { 
    type: String, 
    enum: ['admin', 'teacher', 'student'], 
    required: true,
    default: 'student'
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
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Обновление поля updatedAt перед сохранением
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Проверка уникальности email перед сохранением
userSchema.pre('save', async function(next) {
  if (this.isModified('email')) {
    const existingUser = await this.constructor.findOne({ email: this.email });
    if (existingUser && !existingUser._id.equals(this._id)) {
      const error = new Error('Email уже используется другим пользователем');
      return next(error);
    }
  }
  next();
});

// Установка значений по умолчанию для администратора
userSchema.pre('save', function(next) {
  if (this.role === 'admin') {
    this.referenceId = null;
    this.referenceModel = null;
    this.permissions = [];
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
