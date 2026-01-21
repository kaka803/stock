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

    let currentUser;
    let adminId;

    if (adminToken === 'authenticated') {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
        let admin = await User.findOne({ email: adminEmail });
        
        if (admin) {
            if (admin.role !== 'admin') {
                console.log("Updating role to admin...");
                admin.role = 'admin';
                await admin.save();
            }
        } else {
            console.log("Creating admin record...");
            admin = await User.create({
                name: "Admin",
                email: adminEmail,
                password: process.env.ADMIN_PASSWORD || "admin123",
                role: "admin",
                isVerified: true
            });
        }
        currentUser = admin;
        adminId = admin._id;
    } else {
        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        currentUser = await User.findById(decoded.userId);
        if (!currentUser || currentUser.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        adminId = currentUser._id;
    }

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: adminId }, { receiver: adminId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", adminId] },
              "$receiver",
              "$sender"
            ]
          },
          lastMessage: { $first: "$content" },
          lastMessageTime: { $first: "$createdAt" },
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          lastMessageTime: 1,
          'user.name': 1,
          'user.email': 1,
          'user.avatar': 1,
          'user.role': 1,
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      }
    ]);

    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    console.error('Conversations fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
