import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { sendOTPEmail } from '@/lib/email';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  referralCode: z.string().optional(),
});

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, password, phone, referralCode } = result.data;

    const existingUser = await User.findOne({ email });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingUser) {
        if (!existingUser.isVerified) {
             existingUser.otp = otp;
             existingUser.otpExpiry = otpExpiry;
             existingUser.phone = phone;
             if (password) {
                existingUser.password = await hashPassword(password);
             }
             // Update referredBy if provided and not already set
             if (referralCode && !existingUser.referredBy) {
                existingUser.referredBy = referralCode;
             }
             await existingUser.save();
             await sendOTPEmail(email, otp);
             return NextResponse.json({ 
                message: 'User already registered but not verified. A new OTP has been sent.',
                isExistingUnverified: true 
             }, { status: 201 });
        }
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Generate unique referral code for the new user
    const newUserReferralCode = `${name.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpiry,
      referredBy: referralCode,
      referralCode: newUserReferralCode,
    });

    await sendOTPEmail(email, otp);

    return NextResponse.json({ message: 'User created successfully. Please verify your email.' }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
