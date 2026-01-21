import { StreamChat } from 'stream-chat';
import { NextResponse } from 'next/server';
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/lib/db";

export async function GET(req) {
  console.log("Stream Token API called");
  try {
    await connectDB();
    console.log("DB connected");

    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;
    
    let userId;
    let user;

    if (adminToken === 'authenticated') {
      // Standardize Admin Identity to 'admin_primary' for both Admin and Sub-admin
      userId = 'admin_primary';
      let dbUser;
      
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          dbUser = await User.findById(decoded.userId);
        } catch (e) {}
      }

      if (!dbUser) {
        dbUser = await User.findOne({ role: { $in: ['admin', 'sub-admin'] } });
      }

      if (!dbUser || (dbUser.role !== 'admin' && dbUser.role !== 'sub-admin')) {
        return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 403 });
      }

      user = { 
          id: 'admin_primary', 
          name: 'Support Team', 
          role: 'admin', 
          email: dbUser.email,
          avatar: dbUser.avatar || ""
      };
    } else if (token) {
      // Verify standard token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
      user = await User.findById(userId);
    }

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ success: false, error: "Stream API Key or Secret missing" }, { status: 500 });
    }

    const serverClient = StreamChat.getInstance(apiKey, apiSecret);
    
    // Helper to handle "user was deleted" error
    const safeUpsert = async (userData) => {
      try {
        await serverClient.upsertUser(userData);
      } catch (error) {
        if (error.code === 16 && error.message?.includes('deleted')) {
          console.log(`User ${userData.id} was deleted in Stream, restoring...`);
          await serverClient.restoreUsers([userData.id]);
          await serverClient.upsertUser(userData);
        } else {
          throw error;
        }
      }
    };

    console.log("Upserting current user:", user.email || user.id);
    // Ensure current user exists in Stream
    await safeUpsert({
      id: userId.toString(),
      name: user.name || "User",
      image: user.avatar || user.image || "",
      role: (user.role === 'admin' || user.role === 'sub-admin' || userId === 'admin_primary') ? 'admin' : 'user',
    });
    console.log("✅ Current user upserted successfully");

    // The support ID is now always admin_primary
    const adminId = 'admin_primary';
    const adminName = 'Admin Support';

    console.log("Using primary Admin ID for support channels:", adminId);
    
    // Ensure admin_primary exists (if we're a user, we might be the first ones to reference it)
    if (user.role !== 'admin') {
      console.log("Upserting admin_primary user...");
      await safeUpsert({
        id: adminId,
        name: adminName,
        image: "https://getstream.io/random_svg/?name=Support",
        role: 'admin',
      });
      console.log("✅ Admin user upserted successfully");
    }

    // Create token
    const streamToken = serverClient.createToken(userId.toString());
    console.log("Stream token generated for:", userId);

    const responseData = {
      success: true,
      token: streamToken,
      apiKey: apiKey,
      adminId: adminId,
      user: {
        id: userId.toString(),
        name: user.name || "User",
        image: user.avatar || user.image || "",
        role: user.role || 'user'
      }
    };
    
    console.log("✅ Sending response:", JSON.stringify(responseData, null, 2));
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Stream Token Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
