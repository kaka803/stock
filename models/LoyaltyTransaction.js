import mongoose from 'mongoose';

const LoyaltyTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['earn', 'redeem'],
    required: true,
  },
  source: {
    type: String, // 'task', 'referral', 'purchase'
    required: true,
  },
  sourceId: {
    type: String, // TaskID or RewardID
  },
  description: String,
  points: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.LoyaltyTransaction || mongoose.model('LoyaltyTransaction', LoyaltyTransactionSchema);
