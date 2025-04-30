const express = require('express');
const { getMembershipAssignments } = require('../controllers/membershipAssignmentController');

const router = express.Router();

router.get('/', getMembershipAssignments);

module.exports = router;