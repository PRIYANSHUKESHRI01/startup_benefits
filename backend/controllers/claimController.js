

const Claim = require('../models/Claim');
const Deal = require('../models/Deal');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Claim a deal
const claimDeal = asyncHandler(async (req, res) => {
  const { dealId } = req.params;
  const userId = req.user._id;

  const dealRecord = await Deal.findById(dealId);
  if (!dealRecord) {
    return res.status(404).json({
      status: 'error',
      message: 'Deal not found',
    });
  }
  if (dealRecord.isLocked && !req.user.isVerified) {
    return res.status(403).json({
      status: 'error',
      message: 'This deal requires account verification. Please verify your account first.',
    });
  }
  if (!dealRecord.isClaimable()) {
    return res.status(400).json({
      status: 'error',
      message: 'This deal is no longer available',
    });
  }
  const duplicateClaim = await Claim.findOne({ userId, dealId });
  if (duplicateClaim) {
    return res.status(400).json({
      status: 'error',
      message: 'You have already claimed this deal',
      data: {
        claim: duplicateClaim,
      },
    });
  }
  const update = { $inc: { currentClaims: 1 } };
  const maxClaims = dealRecord.maxClaims;
  let updatedDeal;
  if (maxClaims) {
    updatedDeal = await Deal.findOneAndUpdate(
      { _id: dealId, currentClaims: { $lt: maxClaims } },
      update,
      { new: true }
    );
    if (!updatedDeal) {
      return res.status(400).json({
        status: 'error',
        message: 'Deal claim limit reached',
      });
    }
  } else {
    updatedDeal = await Deal.findByIdAndUpdate(dealId, update, { new: true });
  }
  let claimRecord;
  try {
    claimRecord = await Claim.create({
      userId,
      dealId,
      status: 'pending',
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already claimed this deal',
      });
    }
    throw error;
  }
  await claimRecord.populate('dealId', 'title partnerName discountValue');
  res.status(201).json({
    status: 'success',
    message: 'Deal claimed successfully',
    data: {
      claim: claimRecord,
    },
  });
});


/**
 * @route   GET /api/claims/my
 * @desc    Get all claims for current user
 * @access  Private
 */
const getMyClaims = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { status, page = 1, limit = 10 } = req.query;

  // Build query
  let query = { userId };

  // Status filter
  if (status && status !== 'all') {
    query.status = status;
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const claims = await Claim.find(query)
    .populate('dealId', 'title description partnerName discountValue category websiteUrl')
    .sort({ claimedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Claim.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: claims.length,
    data: {
      claims,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

/**
 * @route   GET /api/claims/:id
 * @desc    Get single claim by ID
 * @access  Private
 */
const getClaimById = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id)
    .populate('userId', 'name email')
    .populate('dealId');

  if (!claim) {
    return res.status(404).json({
      status: 'error',
      message: 'Claim not found',
    });
  }

  // Check if user owns this claim or is admin
  if (claim.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to view this claim',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      claim,
    },
  });
});

/**
 * @route   PUT /api/claims/:id/approve
 * @desc    Approve a claim (admin only)
 * @access  Private/Admin
 */
const approveClaim = asyncHandler(async (req, res) => {
  const { claimCode } = req.body;

  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return res.status(404).json({
      status: 'error',
      message: 'Claim not found',
    });
  }

  if (claim.status !== 'pending') {
    return res.status(400).json({
      status: 'error',
      message: 'Only pending claims can be approved',
    });
  }

  await claim.approve(claimCode);

  await claim.populate('userId', 'name email');
  await claim.populate('dealId', 'title partnerName');

  res.status(200).json({
    status: 'success',
    message: 'Claim approved successfully',
    data: {
      claim,
    },
  });
});

/**
 * @route   PUT /api/claims/:id/reject
 * @desc    Reject a claim (admin only)
 * @access  Private/Admin
 */
const rejectClaim = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return res.status(404).json({
      status: 'error',
      message: 'Claim not found',
    });
  }

  if (claim.status !== 'pending') {
    return res.status(400).json({
      status: 'error',
      message: 'Only pending claims can be rejected',
    });
  }

  await claim.reject(reason);

  await claim.populate('userId', 'name email');
  await claim.populate('dealId', 'title partnerName');

  res.status(200).json({
    status: 'success',
    message: 'Claim rejected',
    data: {
      claim,
    },
  });
});

/**
 * @route   GET /api/claims/all
 * @desc    Get all claims (admin only)
 * @access  Private/Admin
 */
const getAllClaims = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  // Build query
  let query = {};
  if (status && status !== 'all') {
    query.status = status;
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const claims = await Claim.find(query)
    .populate('userId', 'name email isVerified')
    .populate('dealId', 'title partnerName discountValue')
    .sort({ claimedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Claim.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: claims.length,
    data: {
      claims,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

module.exports = {
  claimDeal,
  getMyClaims,
  getClaimById,
  approveClaim,
  rejectClaim,
  getAllClaims,
};