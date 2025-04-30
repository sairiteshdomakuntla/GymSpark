const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  contactNumber: String,
  fitnessGoal: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);