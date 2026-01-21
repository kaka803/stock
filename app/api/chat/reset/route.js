import { StreamChat } from 'stream-chat';
import { NextResponse } from 'next/server';
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/lib/db";

export async function GET(req) {
  try {
    await connectDB();

    // 1. Auth Check (Admins Only)
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: "Admins only" }, { status: 403 });
    }

    // 2. Stream Setup
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;
    const serverClient = StreamChat.getInstance(apiKey, apiSecret);

    // 3. Reset Logic
    console.log("Starting Chat Reset...");
    
    // Query all messaging channels
    const channels = await serverClient.queryChannels({ type: 'messaging' });
    const count = channels.length;

    // Delete each channel
    for (const channel of channels) {
      await channel.delete();
    }

    console.log(`Reset complete. Deleted ${count} channels.`);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully deleted ${count} channels. Your chat history is now clean.`,
      count: count
    });

  } catch (error) {
    console.error("Reset Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
