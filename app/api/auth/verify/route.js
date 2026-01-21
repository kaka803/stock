import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
        return NextResponse.json({ message: 'User already verified' }, { status: 200 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (user.otpExpiry < new Date()) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // 🏆 Referral logic: Award points to the referrer
    if (user.referredBy) {
      try {
        const referrer = await User.findOne({ referralCode: user.referredBy });
        if (referrer) {
           // Find referral task to get point value
           const LoyaltyTask = (await import('@/models/LoyaltyTask')).default;
           const LoyaltyTransaction = (await import('@/models/LoyaltyTransaction')).default;
           
           const refTask = await LoyaltyTask.findOne({ type: 'referral', isActive: true });
           const pointsToAward = refTask ? refTask.points : 100; // Default 100 if no task found

           referrer.loyaltyPoints += pointsToAward;
           await referrer.save();

           await LoyaltyTransaction.create({
             userId: referrer._id,
             type: 'earn',
             source: 'referral',
             sourceId: user._id,
             description: `Referral bonus for inviting ${user.name}`,
             points: pointsToAward
           });
        }
      } catch (refError) {
        console.error('Referral award failed:', refError);
        // Don't fail the verification if referral logic fails
      }
    }

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
