
const Deal = require('../models/Deal');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Get all deals with filtering and search
const getAllDeals = asyncHandler(async (req, res) => {
  const { category, search, locked, page = 1, limit = 12 } = req.query;
  const query = {};
  if (category && category !== 'all') {
    query.category = category;
  }
  if (locked !== undefined) {
    query.isLocked = locked === 'true';
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { partnerName: { $regex: search, $options: 'i' } },
    ];
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const dealList = await Deal.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  const totalDeals = await Deal.countDocuments(query);
  res.status(200).json({
    status: 'success',
    results: dealList.length,
    data: {
      deals: dealList,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalDeals,
        pages: Math.ceil(totalDeals / parseInt(limit)),
      },
    },
  });
});

// Get single deal by ID
const getDealById = asyncHandler(async (req, res) => {
  const dealRecord = await Deal.findById(req.params.id);
  if (!dealRecord) {
    return res.status(404).json({
      status: 'error',
      message: 'Deal not found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      deal: dealRecord,
    },
  });
});

// Create new deal (admin only)
const createDeal = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    partnerName,
    discountValue,
    eligibilityRules,
    isLocked,
    expiryDate,
    websiteUrl,
    claimInstructions,
    maxClaims,
  } = req.body;
  if (!title || !description || !category || !partnerName || !discountValue || !eligibilityRules) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide all required fields',
    });
  }
  const newDeal = await Deal.create({
    title,
    description,
    category,
    partnerName,
    discountValue,
    eligibilityRules,
    isLocked: isLocked || false,
    expiryDate,
    websiteUrl,
    claimInstructions,
    maxClaims,
  });
  res.status(201).json({
    status: 'success',
    message: 'Deal created successfully',
    data: {
      deal: newDeal,
    },
  });
});

// Update deal (admin only)
const updateDeal = asyncHandler(async (req, res) => {
  const dealRecord = await Deal.findById(req.params.id);
  if (!dealRecord) {
    return res.status(404).json({
      status: 'error',
      message: 'Deal not found',
    });
  }
  const updatedDeal = await Deal.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    message: 'Deal updated successfully',
    data: {
      deal: updatedDeal,
    },
  });
});

// Delete deal (admin only)
const deleteDeal = asyncHandler(async (req, res) => {
  const dealRecord = await Deal.findById(req.params.id);
  if (!dealRecord) {
    return res.status(404).json({
      status: 'error',
      message: 'Deal not found',
    });
  }
  await dealRecord.deleteOne();
  res.status(200).json({
    status: 'success',
    message: 'Deal deleted successfully',
  });
});

// Get all unique categories
const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Deal.distinct('category');
    res.status(200).json({
      status: 'success',
      data: {
        categories,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch categories',
    });
  }
});

module.exports = {
  getAllDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  getCategories,
};