const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  durationMonths: { type: Number },
  features: [{ type: String }],
  discount: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Add pre-save middleware to generate ID if not present
membershipSchema.pre('save', function(next) {
  if (!this.id) {
    this.id = this._id.toString();
  }
  next();
});

module.exports = mongoose.model('Membership', membershipSchema);