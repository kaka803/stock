import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    await dbConnect();
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const adminToken = cookieStore.get('admin_token')?.value;
    
    if (!token && !adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let currentUserId;

    if (adminToken === 'authenticated') {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
        let admin = await User.findOne({ email: adminEmail });
        
        if (admin) {
            if (admin.role !== 'admin') {
                admin.role = 'admin';
                await admin.save();
            }
        } else {
            admin = await User.create({
                name: "Admin",
                email: adminEmail,
                password: process.env.ADMIN_PASSWORD || "admin123",
                role: "admin",
                isVerified: true
            });
        }
        currentUserId = admin._id;
    } else {
        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        currentUserId = decoded.userId;
    }

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get('userId');

    let finalOtherUserId = otherUserId;

    // If no otherUserId or it's the string "undefined", default to admin (for user-side chat)
    if (!finalOtherUserId || finalOtherUserId === 'undefined') {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
      let admin = await User.findOne({ email: adminEmail });
      
      if (admin) {
          if (admin.role !== 'admin') {
              admin.role = 'admin';
              await admin.save();
          }
      } else {
        admin = await User.create({
          name: "Admin",
          email: adminEmail,
          password: process.env.ADMIN_PASSWORD || "admin123",
          role: "admin",
          isVerified: true
        });
      }
      finalOtherUserId = admin._id;
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: finalOtherUserId },
        { sender: finalOtherUserId, receiver: currentUserId },
      ],
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name email avatar')
    .populate('receiver', 'name email avatar');

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Chat fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
