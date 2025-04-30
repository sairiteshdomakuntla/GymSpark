const express = require('express');
const router = express.Router();
const { getMembers, createMember, getMember, updateMember, deleteMember } = require('../controllers/memberController');

router.get('/', getMembers);
router.get('/:id', getMember);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember); // Add this route

module.exports = router;