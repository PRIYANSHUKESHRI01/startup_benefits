const express = require('express');
const {
  getAllDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  getCategories,
} = require('../controllers/dealController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllDeals);
router.get('/categories', getCategories);
router.get('/:id', getDealById);
router.post('/', protect, adminOnly, createDeal);
router.put('/:id', protect, adminOnly, updateDeal);
router.delete('/:id', protect, adminOnly, deleteDeal);

module.exports = router;