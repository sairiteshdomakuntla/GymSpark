const Membership = require('../models/Membership');
const MembershipAssignment = require('../models/MembershipAssignment');

exports.getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships.map(membership => ({
      ...membership.toObject(),
      id: membership.id
    })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch memberships', error: error.message });
  }
};

exports.getMembership = async (req, res) => {
  try {
    console.log('Fetching membership with ID:', req.params.id);
    const membership = await Membership.findOne({ id: req.params.id });
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }
    res.json({
      ...membership.toObject(),
      id: membership.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch membership', error: error.message });
  }
};

exports.createMembership = async (req, res) => {
  try {
    const { id, name, description, price, durationMonths, features, discount, active } = req.body;

    // Validate required fields
    if (!id || !name || !price) {
      return res.status(400).json({ 
        message: 'Missing required fields. ID, name, and price are required.' 
      });
    }

    // Check if membership with ID already exists
    const existingMembership = await Membership.findOne({ id });
    if (existingMembership) {
      return res.status(400).json({ message: 'Membership ID already exists' });
    }

    const newMembership = new Membership({
      id,
      name,
      description,
      price,
      durationMonths,
      features,
      discount,
      active
    });

    const savedMembership = await newMembership.save();
    res.status(201).json(savedMembership);
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({ 
      message: 'Failed to create membership', 
      error: error.message 
    });
  }
};

exports.updateMembership = async (req, res) => {
  try {
    const { name, description, price, durationMonths, features, discount, active } = req.body;
    
    const membership = await Membership.findOneAndUpdate(
      { id: req.params.id },
      { 
        name, 
        description, 
        price, 
        durationMonths, 
        features: features || [], // Ensure features are always included
        discount, 
        active 
      },
      { new: true }
    );

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    res.json(membership);
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({ message: 'Failed to update membership', error: error.message });
  }
};

exports.deleteMembership = async (req, res) => {
  try {
    const membershipId = req.params.id;
    console.log('Attempting to delete membership:', membershipId);

    // First check if there are any active assignments
    const activeAssignments = await MembershipAssignment.findOne({
      membershipId: membershipId,
      status: 'active'
    });

    if (activeAssignments) {
      return res.status(400).json({ 
        message: 'Cannot delete membership with active members' 
      });
    }

    const membership = await Membership.findOne({ id: membershipId });
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // First delete related membership assignments
    await MembershipAssignment.deleteMany({ membershipId: membership._id });
    console.log('Deleted membership assignments for membership:', membershipId);

    // Then delete the membership
    await Membership.findOneAndDelete({ id: membershipId });
    console.log('Membership deleted successfully:', membershipId);

    res.status(200).json({ message: 'Membership deleted successfully' });
  } catch (error) {
    console.error('Error in deleteMembership:', error);
    res.status(500).json({ 
      message: 'Failed to delete membership', 
      error: error.message 
    });
  }
};