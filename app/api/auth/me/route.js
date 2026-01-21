import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function GET(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    const adminToken = cookieStore.get('admin_token')?.value;

    // 1. Check for Admin Token (High priority for admin sessions)
    if (adminToken === 'authenticated') {
      await dbConnect();
      
      // If we have a standard token, try to find specific user first
      if (token) {
        const payload = verifyToken(token);
        if (payload && payload.userId && isValidObjectId(payload.userId)) {
          try {
            const user = await User.findById(payload.userId).select('-password -otp -otpExpiry');
            if (user && (user.role === 'admin' || user.role === 'sub-admin')) {
              return NextResponse.json({ user }, { status: 200 });
            }
          } catch (e) {
            console.warn("Auth check: DB query failed for userId:", payload.userId);
          }
        }
      }

      // Fallback to any admin in DB
      const admin = await User.findOne({ role: 'admin' }).select('-password -otp -otpExpiry');
      if (admin) {
        return NextResponse.json({ user: admin }, { status: 200 });
      }

      // Final fallback for hardcoded super admin
      return NextResponse.json({ 
        user: { name: 'Admin', role: 'admin', email: process.env.ADMIN_EMAIL || 'admin@stocks.com' } 
      }, { status: 200 });
    }

    // 2. Standard User Check
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();
    
    if (isValidObjectId(payload.userId)) {
        const user = await User.findById(payload.userId).select('-password -otp -otpExpiry');
        if (user) {
            return NextResponse.json({ user }, { status: 200 });
        }
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
