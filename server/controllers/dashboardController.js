const Member = require('../models/Member');
const MembershipAssignment = require('../models/MembershipAssignment');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    const activeMemberships = await MembershipAssignment.countDocuments({ status: 'active' });
    const expiredMemberships = await MembershipAssignment.countDocuments({ status: 'expired' });
    const totalRevenue = await MembershipAssignment.aggregate([
      { $match: { status: 'active' } },
      { $lookup: { from: 'memberships', localField: 'membershipId', foreignField: '_id', as: 'membership' } },
      { $unwind: '$membership' },
      { $group: { _id: null, total: { $sum: '$membership.price' } } },
    ]);

    res.json({
      totalMembers,
      activeMemberships,
      expiredMemberships,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
};