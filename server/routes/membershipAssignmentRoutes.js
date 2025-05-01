const express = require('express');
const router = express.Router();
const { 
  getMembershipAssignments,
  createMembershipAssignment,
  getMembershipAssignment,
  updateMembershipAssignment,
  deleteMembershipAssignment
} = require('../controllers/membershipAssignmentController');

router.get('/', getMembershipAssignments);
router.post('/', createMembershipAssignment);
router.get('/:id', getMembershipAssignment);
router.put('/:id', updateMembershipAssignment);
router.delete('/:id', deleteMembershipAssignment);

module.exports = router;