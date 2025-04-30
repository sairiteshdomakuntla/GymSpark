const express = require('express');
const { getMemberships, createMembership } = require('../controllers/membershipController');

const router = express.Router();

router.get('/', getMemberships);
router.post('/', createMembership);

module.exports = router;