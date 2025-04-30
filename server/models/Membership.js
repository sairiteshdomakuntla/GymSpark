const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  durationMonths: { type: Number },
  features: [{ type: String }],
  discount: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model('Membership', membershipSchema);