import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';
import User from '@/models/User';
import { pusherServer } from '@/lib/pusher';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(req) {
  console.log("POST /api/chat/send hit");
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
                console.log("Found user with admin email but wrong role, updating to admin...");
                admin.role = 'admin';
                await admin.save();
            }
        } else {
            console.log("No user found with admin email, creating record...");
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
    
    const { content, receiverId } = await req.json();
    
    if (!content) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    let finalReceiverId = receiverId;

    // If no receiverId or it's the string "undefined", default to admin
    if (!finalReceiverId || finalReceiverId === 'undefined') {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
      let admin = await User.findOne({ email: adminEmail });
      
      if (admin) {
          if (admin.role !== 'admin') {
              admin.role = 'admin';
              await admin.save();
          }
      } else {
        console.log("No admin user found in DB, creating one...");
        admin = await User.create({
          name: "Admin",
          email: adminEmail,
          password: process.env.ADMIN_PASSWORD || "admin123",
          role: "admin",
          isVerified: true
        });
      }
      finalReceiverId = admin._id;
    }

    const newMessage = await Message.create({
      sender: currentUserId,
      receiver: finalReceiverId,
      content,
    });

    console.log("Message created successfully:", newMessage._id);

    // Populate sender info for the real-time event
    const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'name email avatar');

    // Trigger Pusher event
    if (pusherServer) {
        try {
            await pusherServer.trigger(`chat_${finalReceiverId}`, 'new-message', populatedMessage);
            await pusherServer.trigger(`chat_${currentUserId}`, 'new-message', populatedMessage);
            console.log("Pusher triggers successful");
        } catch (pError) {
            console.error("Pusher trigger error:", pError);
        }
    } else {
        console.warn("Pusher server not initialized.");
    }

    return NextResponse.json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error('Chat send error FULL:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
