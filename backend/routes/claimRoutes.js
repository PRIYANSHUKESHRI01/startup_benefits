const express = require('express');
const {
  claimDeal,
  getMyClaims,
  getClaimById,
  approveClaim,
  rejectClaim,
  getAllClaims,
} = require('../controllers/claimController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my', protect, getMyClaims);
router.post('/:dealId', protect, claimDeal);
router.get('/:id', protect, getClaimById);
router.get('/all', protect, adminOnly, getAllClaims);
router.put('/:id/approve', protect, adminOnly, approveClaim);
router.put('/:id/reject', protect, adminOnly, rejectClaim);

module.exports = router;