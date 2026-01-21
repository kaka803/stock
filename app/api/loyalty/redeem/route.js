import dbConnect from '@/lib/db';
import User from '@/models/User';
import Reward from '@/models/Reward';
import LoyaltyTransaction from '@/models/LoyaltyTransaction';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, rewardId } = await req.json();

    if (!userId || !rewardId) {
      return NextResponse.json({ success: false, error: 'Missing userId or rewardId' }, { status: 400 });
    }

    const reward = await Reward.findById(rewardId);
    if (!reward || !reward.isActive) {
      return NextResponse.json({ success: false, error: 'Invalid reward' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (user.loyaltyPoints < reward.cost) {
      return NextResponse.json({ success: false, error: 'Insufficient points' }, { status: 400 });
    }

    // Deduct points
    user.loyaltyPoints -= reward.cost;

    // Add to inventory
    if (!user.inventory) {
        user.inventory = [];
    }

    user.inventory.push({
      itemId: reward._id,
      itemType: reward.type,
      name: reward.name,
      value: reward.value,
      isUsed: false,
      acquiredAt: new Date(),
    });

    await user.save();

    // Record transaction
    await LoyaltyTransaction.create({
      userId: user._id,
      type: 'redeem',
      source: 'purchase',
      sourceId: reward._id,
      description: `Redeemed reward: ${reward.name}`,
      points: -reward.cost // Negative for redemption
    });

    return NextResponse.json({ success: true, points: user.loyaltyPoints, inventory: user.inventory, message: 'Reward redeemed successfully' });

  } catch (error) {
    console.error('Redeem Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
