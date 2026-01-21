import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide stock name'],
  },
  symbol: {
    type: String,
    required: [true, 'Please provide stock symbol'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide stock price'],
  },
  change: {
    type: String,
    default: '0.00',
  },
  changeValue: {
    type: String,
    default: '0.00%',
  },
  isNegative: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: '',
  },
  marketCap: {
    type: String,
    default: 'N/A',
  },
  peRatio: {
    type: String,
    default: 'N/A',
  },
  dividendYield: {
    type: String,
    default: '0.00%',
  },
  revenue: {
    type: String,
    default: 'N/A',
  },
  isCustom: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export default mongoose.models.Stock || mongoose.model('Stock', StockSchema);
