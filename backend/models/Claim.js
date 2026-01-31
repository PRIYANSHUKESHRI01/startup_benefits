const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal',
      required: [true, 'Deal ID is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected', 'expired'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    claimCode: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance and uniqueness
claimSchema.index({ userId: 1, dealId: 1 }, { unique: true });
claimSchema.index({ status: 1 });
claimSchema.index({ claimedAt: -1 });

claimSchema.statics.hasUserClaimedDeal = async function (userId, dealId) {
  const claim = await this.findOne({ userId, dealId });
  return !!claim;
};

claimSchema.methods.approve = async function (claimCode = '') {
  this.status = 'approved';
  this.approvedAt = new Date();
  if (claimCode) {
    this.claimCode = claimCode;
  }
  await this.save();
};

claimSchema.methods.reject = async function (reason = '') {
  this.status = 'rejected';
  this.rejectedAt = new Date();
  if (reason) {
    this.notes = reason;
  }
  await this.save();
};

claimSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'approved' && !this.approvedAt) {
      this.approvedAt = new Date();
    } else if (this.status === 'rejected' && !this.rejectedAt) {
      this.rejectedAt = new Date();
    }

  }
  next();
});

claimSchema.set('toJSON', { virtuals: true });
claimSchema.set('toObject', { virtuals: true });

const Claim = mongoose.model('Claim', claimSchema);

module.exports = Claim;