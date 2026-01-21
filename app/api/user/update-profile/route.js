import { NextResponse } from 'next/server';
import { verifyToken, hashPassword, comparePassword } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { name, phone, currentPassword, newPassword } = body;

    // Update basic info
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    // Handle password change
    if (currentPassword && newPassword) {
      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
      }

      user.password = await hashPassword(newPassword);
    } else if (newPassword && !currentPassword) {
      return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
    }

    await user.save();

    // Return updated user (excluding sensitive fields)
    const updatedUser = await User.findById(payload.userId).select('-password -otp -otpExpiry');

    return NextResponse.json({ 
      message: 'Profile updated successfully', 
      user: updatedUser 
    }, { status: 200 });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
