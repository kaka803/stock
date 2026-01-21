import dbConnect from '@/lib/db';
import User from '@/models/User';
import LoyaltyTransaction from '@/models/LoyaltyTransaction';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const user = await User.findById(id).select('loyaltyPoints referralCode referredBy inventory email name');
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // 🚀 Fallback: If user doesn't have a referral code yet (old user), generate one
    if (!user.referralCode) {
      const initials = (user.name || 'USR').substring(0, 3).toUpperCase();
      user.referralCode = `${initials}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      await user.save();
    }

    const history = await LoyaltyTransaction.find({ userId: id }).sort({ createdAt: -1 }).limit(20);

    // Get all unique completed task IDs for this user
    const completedTransactions = await LoyaltyTransaction.find({ 
      userId: id, 
      source: 'task' 
    }).select('sourceId');
    
    const completedTaskIds = completedTransactions.map(tx => tx.sourceId.toString());

    return NextResponse.json({ 
      success: true, 
      user: {
        ...user.toObject(),
        history,
        completedTaskIds
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
