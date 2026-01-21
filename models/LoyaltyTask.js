import mongoose from 'mongoose';

const LoyaltyTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  type: {
    type: String,
    enum: ['link', 'referral', 'social', 'custom'],
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  url: String, // For link/social tasks
  timer: {
    type: Number, // Seconds user must wait/watch
    default: 10,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.models.LoyaltyTask || mongoose.model('LoyaltyTask', LoyaltyTaskSchema);
