const express = require('express');
const { 
  getMemberships, 
  createMembership, 
  getMembership,
  updateMembership,
  deleteMembership 
} = require('../controllers/membershipController');

const router = express.Router();

router.get('/', getMemberships);
router.get('/:id', getMembership);
router.post('/', createMembership);
router.put('/:id', updateMembership);
router.delete('/:id', deleteMembership);

module.exports = router;