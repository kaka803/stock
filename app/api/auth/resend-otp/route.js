import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { sendOTPEmail } from '@/lib/email';

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: 'User is already verified' }, { status: 400 });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPEmail(email, otp);

    return NextResponse.json({ message: 'A new verification code has been sent to your email.' }, { status: 200 });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
