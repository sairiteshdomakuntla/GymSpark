const MembershipAssignment = require('../models/MembershipAssignment');
const Member = require('../models/Member');
const Membership = require('../models/Membership');

// Get all assignments
exports.getMembershipAssignments = async (req, res) => {
  try {
    const currentDate = new Date();
    const assignments = await MembershipAssignment
      .find({
        status: 'active',
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate }
      })
      .populate('memberId')
      .populate('membershipId')
      .sort({ startDate: -1 });

    const transformedAssignments = assignments
      .filter(assignment => assignment.memberId && assignment.membershipId)
      .map(assignment => ({
        id: assignment._id.toString(),
        memberId: assignment.memberId.id,
        membershipId: assignment.membershipId.id,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
        status: assignment.status,
        paymentStatus: assignment.paymentStatus,
        member: {
          id: assignment.memberId.id,
          name: assignment.memberId.name,
          email: assignment.memberId.email
        },
        membership: {
          id: assignment.membershipId.id,
          name: assignment.membershipId.name,
          price: assignment.membershipId.price,
          durationMonths: assignment.membershipId.durationMonths
        }
      }));

    res.json(transformedAssignments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assignments', error: error.message });
  }
};

// Get single assignment
exports.getMembershipAssignment = async (req, res) => {
  try {
    const assignment = await MembershipAssignment.findById(req.params.id)
      .populate('memberId')
      .populate('membershipId');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assignment', error: error.message });
  }
};

// Create assignment
exports.createMembershipAssignment = async (req, res) => {
  try {
    const { memberId, membershipId, startDate, endDate } = req.body;

    const member = await Member.findOne({ id: memberId });
    const membership = await Membership.findOne({ id: membershipId });

    if (!member || !membership) {
      return res.status(404).json({
        message: !member ? 'Member not found' : 'Membership not found'
      });
    }

    const existingActive = await MembershipAssignment.findOne({
      memberId: member._id,
      status: 'active',
      endDate: { $gte: new Date() }
    });

    if (existingActive) {
      return res.status(400).json({
        message: 'Member already has an active membership'
      });
    }

    const newAssignment = new MembershipAssignment({
      memberId: member._id,
      membershipId: membership._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'active',
      paymentStatus: 'paid'
    });

    const savedAssignment = await newAssignment.save();
    const populatedAssignment = await MembershipAssignment.findById(savedAssignment._id)
      .populate('memberId')
      .populate('membershipId');

    res.status(201).json({
      id: savedAssignment._id.toString(),
      memberId: member.id,
      membershipId: membership.id,
      startDate: savedAssignment.startDate,
      endDate: savedAssignment.endDate,
      status: savedAssignment.status,
      paymentStatus: savedAssignment.paymentStatus,
      member: {
        id: member.id,
        name: member.name,
        email: member.email
      },
      membership: {
        id: membership.id,
        name: membership.name,
        price: membership.price,
        durationMonths: membership.durationMonths
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create assignment', error: error.message });
  }
};

// Update assignment
exports.updateMembershipAssignment = async (req, res) => {
  try {
    const assignment = await MembershipAssignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('memberId').populate('membershipId');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update assignment', error: error.message });
  }
};

// Delete assignment
exports.deleteMembershipAssignment = async (req, res) => {
  try {
    const assignment = await MembershipAssignment.findByIdAndDelete(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete assignment', error: error.message });
  }
};