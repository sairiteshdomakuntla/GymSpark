const Member = require('../models/Member');
const MembershipAssignment = require('../models/MembershipAssignment');
exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members.map(member => ({
      ...member.toObject(),
      id: member.id || member._id.toString()
    })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch members', error: error.message });
  }
};

exports.createMember = async (req, res) => {
  try {
    const { id, name, age, email, contactNumber, gender, fitnessGoal } = req.body;

    // Validate required fields
    if (!id || !name || !email || !gender) {
      return res.status(400).json({ 
        message: 'Missing required fields. ID, name, email, and gender are required.' 
      });
    }

    // Check if member with ID already exists
    const existingMember = await Member.findOne({ id });
    if (existingMember) {
      return res.status(400).json({ message: 'Member ID already exists' });
    }

    const newMember = new Member({
      id,
      name,
      age,
      email,
      contactNumber,
      gender,
      fitnessGoal,
    });

    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to create member',
      details: error.errors // Include validation errors if any
    });
  }
};

exports.getMember = async (req, res) => {
  try {
    const member = await Member.findOne({ id: req.params.id });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch member', error: error.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const { name, age, email, contactNumber, gender, fitnessGoal } = req.body;
    
    const member = await Member.findOneAndUpdate(
      { id: req.params.id },
      { name, age, email, contactNumber, gender, fitnessGoal },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update member', error: error.message });
  }
};


exports.deleteMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    console.log('Attempting to delete member:', memberId);

    const member = await Member.findOne({ id: memberId });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // First delete related membership assignments
    await MembershipAssignment.deleteMany({ memberId: member._id });
    console.log('Deleted membership assignments for member:', memberId);

    // Then delete the member
    await Member.findOneAndDelete({ id: memberId });
    console.log('Member deleted successfully:', memberId);

    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error in deleteMember:', error);
    res.status(500).json({ 
      message: 'Failed to delete member', 
      error: error.message 
    });
  }
};