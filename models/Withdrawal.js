import mongoose from "mongoose";

const WithdrawalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assetType: {
      type: String, // 'stock', 'crypto', 'forex'
      required: [true, "Please provide asset type"],
    },
    symbol: {
      type: String,
      required: [true, "Please provide asset symbol"],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide quantity"],
    },
    amount: {
      type: Number, // Value in USD at time of request (optional, for reference)
    },
    paymentMethod: {
      type: String,
      default: "binance",
    },
    paymentDetail: {
      type: String, // Binance ID or Email
      required: [true, "Please provide payment detail (Binance ID/Email)"],
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    remarks: {
      type: String, // Admin remarks if rejected
    },
  },
  { timestamps: true },
);

WithdrawalSchema.index({ createdAt: -1 });

export default mongoose.models.Withdrawal ||
  mongoose.model("Withdrawal", WithdrawalSchema);
