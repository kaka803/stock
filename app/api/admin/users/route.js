import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(req) {
  try {
    await connectDB();
    
    // Check admin token (for better security, repeat cookie verification here)
    const token = req.cookies.get('admin_token')?.value;
    if (token !== 'authenticated') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, users }, { status: 200 });

  } catch (error) {
    console.error("Admin fetch users error:", error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
