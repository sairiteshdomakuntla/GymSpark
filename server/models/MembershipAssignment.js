const mongoose = require('mongoose');

const membershipAssignmentSchema = new mongoose.Schema({
  memberId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member', 
    required: true 
  },
  membershipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired'], required: true },
});

// Add cascading delete middleware
membershipAssignmentSchema.pre('deleteMany', async function(next) {
  const memberId = this.getQuery().memberId;
  if (memberId) {
    // Perform any cleanup needed when deleting assignments
    console.log(`Deleting all assignments for member: ${memberId}`);
  }
  next();
});

module.exports = mongoose.model('MembershipAssignment', membershipAssignmentSchema);