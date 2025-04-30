const Member = require('../models/Member');

exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 }).limit(5);
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch members', error: error.message });
  }
};

exports.createMember = async (req, res) => {
  try {
    const { name, age, email, contactNumber, gender, fitnessGoal } = req.body;

    const newMember = new Member({
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
    res.status(500).json({ message: 'Failed to create member', error: error.message });
  }
};