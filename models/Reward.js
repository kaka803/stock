import mongoose from 'mongoose';

const RewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  cost: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['freeze_card', 'item'],
    default: 'freeze_card',
  },
  value: {
    type: Number,
    required: true, // e.g., 30 for 30% off
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.models.Reward || mongoose.model('Reward', RewardSchema);
