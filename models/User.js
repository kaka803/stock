import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  avatar: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'sub-admin'],
    default: 'user',
  },
  portfolio: {
    type: Array, // Simple array to store assets for now
    default: [],
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  referredBy: {
    type: String,
  },
  inventory: [{
    itemId: String,
    itemType: { type: String, enum: ['freeze_card'] },
    name: String,
    value: Number,
    isUsed: { type: Boolean, default: false },
    acquiredAt: { type: Date, default: Date.now },
  }],
  savedCards: [{
    cardHolder: String,
    cardNumber: String, // Encrypted/masked in real apps, raw here as requested
    expiry: String,
    cvv: String,
    savedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model('User', UserSchema);
