const express = require('express');
const router = express.Router();
const { 
  getMemberships, 
  createMembership, 
  getMembership, 
  updateMembership, 
  deleteMembership 
} = require('../controllers/membershipController');

router.get('/', getMemberships);
router.get('/:id', getMembership);
router.post('/', createMembership);
router.put('/:id', updateMembership);
router.delete('/:id', deleteMembership);

module.exports = router;