const Member = require('../models/Member');
const MembershipAssignment = require('../models/MembershipAssignment');
const Membership = require('../models/Membership');

exports.getDashboardStats = async (req, res) => {
  try {
    const currentDate = new Date();

    // Get total members count
    const totalMembers = await Member.countDocuments();
    
    // Get active memberships with proper population
    const activeAssignments = await MembershipAssignment
      .find({
        status: 'active',
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate }
      })
      .populate('memberId')
      .populate('membershipId');

    const activeMemberships = activeAssignments.length;

    // Get expired memberships
    const expiredMemberships = await MembershipAssignment.countDocuments({
      $or: [
        { status: 'expired' },
        { endDate: { $lt: currentDate } }
      ]
    });

    // Calculate total revenue from active memberships
    const totalRevenue = activeAssignments.reduce((sum, assignment) => {
      if (assignment.membershipId && assignment.membershipId.price) {
        return sum + assignment.membershipId.price;
      }
      return sum;
    }, 0);

    res.json({
      totalMembers,
      activeMemberships,
      expiredMemberships,
      totalRevenue
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Failed to get dashboard stats', error: error.message });
  }
};