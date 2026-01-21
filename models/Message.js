import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Index for faster lookups
MessageSchema.index({ sender: 1, receiver: 1 });
MessageSchema.index({ createdAt: 1 });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
