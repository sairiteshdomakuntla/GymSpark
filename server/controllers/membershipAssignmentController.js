const MembershipAssignment = require('../models/MembershipAssignment');

exports.getMembershipAssignments = async (req, res) => {
  try {
    const assignments = await MembershipAssignment.find({ status: 'active' })
      .populate('memberId')
      .populate('membershipId');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch membership assignments', error: error.message });
  }
};