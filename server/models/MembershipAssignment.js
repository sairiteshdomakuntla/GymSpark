const mongoose = require('mongoose');

const membershipAssignmentSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  membershipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired'], required: true },
});

module.exports = mongoose.model('MembershipAssignment', membershipAssignmentSchema);