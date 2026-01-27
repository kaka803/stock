import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String, // 'stock', 'crypto', 'forex', or 'etf'
    required: [true, 'Please provide order type'],
  },
  symbol: {
    type: String,
    required: [true, 'Please provide asset symbol'],
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide price per unit'],
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please provide total amount'],
  },
  paymentProof: {
    type: String, // Storing file path or base64
    required: [false, 'Please upload payment proof'], // Made optional for now to test flow easily, but logic will require it
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  originalTotal: Number,
  discountAmount: Number,
  appliedCardInfo: {
    name: String,
    value: Number, // Percentage
  },
}, { timestamps: true });

OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
