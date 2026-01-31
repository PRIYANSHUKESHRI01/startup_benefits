const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Deal title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['cloud', 'marketing', 'productivity', 'analytics', 'development', 'design'],
        message: '{VALUE} is not a valid category',
      },
      lowercase: true,
    },
    partnerName: {
      type: String,
      required: [true, 'Partner name is required'],
      trim: true,
    },
    partnerLogo: {
      type: String,
      default: '',
    },
    discountValue: {
      type: String,
      required: [true, 'Discount value is required'],
      trim: true,
    },
    eligibilityRules: {
      type: [String],
      required: [true, 'Eligibility rules are required'],
      validate: {
        validator: function (rules) {
          return rules && rules.length > 0;
        },
        message: 'At least one eligibility rule is required',
      },
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    websiteUrl: {
      type: String,
      default: '',
    },
    claimInstructions: {
      type: String,
      default: '',
    },
    maxClaims: {
      type: Number,
      default: null,
    },
    currentClaims: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
dealSchema.index({ category: 1 });
dealSchema.index({ isLocked: 1 });
dealSchema.index({ expiryDate: 1 });
dealSchema.index({ createdAt: -1 });
dealSchema.index({ title: 'text', description: 'text' }); // Text search

// Virtuals
dealSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});
dealSchema.virtual('isMaxedOut').get(function () {
  if (!this.maxClaims) return false;
  return this.currentClaims >= this.maxClaims;
});

dealSchema.methods.isClaimable = function () {
  if (this.isExpired) return false;
  if (this.isMaxedOut) return false;
  return true;
};

dealSchema.virtual('claimable').get(function () {
  return !this.isExpired && !this.isMaxedOut;
});

dealSchema.methods.incrementClaims = async function () {
  this.currentClaims += 1;
  await this.save();
};

dealSchema.set('toJSON', { virtuals: true });
dealSchema.set('toObject', { virtuals: true });

dealSchema.index({ category: 1 });
dealSchema.index({ isLocked: 1 });
dealSchema.index({ expiryDate: 1 });
dealSchema.index({ createdAt: -1 });
dealSchema.index({ title: 'text', description: 'text' });

dealSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});
dealSchema.virtual('isMaxedOut').get(function () {
  if (!this.maxClaims) return false;
  return this.currentClaims >= this.maxClaims;
});

dealSchema.methods.isClaimable = function () {
  if (this.isExpired) return false;
  if (this.isMaxedOut) return false;
  return true;
};

dealSchema.virtual('claimable').get(function () {
  return !this.isExpired && !this.isMaxedOut;
});

dealSchema.methods.incrementClaims = async function () {
  this.currentClaims += 1;
  await this.save();
};

dealSchema.set('toJSON', { virtuals: true });
dealSchema.set('toObject', { virtuals: true });

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;