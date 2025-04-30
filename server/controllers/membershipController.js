const Membership = require('../models/Membership');

exports.getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch memberships', error: error.message });
  }
};

exports.createMembership = async (req, res) => {
  try {
    const { name, description, price, durationMonths, features, discount, active } = req.body;

    const newMembership = new Membership({
      name,
      description,
      price,
      durationMonths,
      features,
      discount,
      active,
    });

    const savedMembership = await newMembership.save();
    res.status(201).json(savedMembership);
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({ message: 'Failed to create membership', error: error.message });
  }
};