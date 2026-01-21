import { StreamChat } from 'stream-chat';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Auth Check
    const adminToken = req.cookies.get('admin_token')?.value;
    if (adminToken !== 'authenticated') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ success: false, error: "Stream API Key or Secret missing" }, { status: 500 });
    }

    const serverClient = StreamChat.getInstance(apiKey, apiSecret);

    // Find all messaging channels where admin_primary is a member
    // You can also just query all messaging channels if that's the intention
    const filter = { type: 'messaging' };
    const channels = await serverClient.queryChannels(filter);

    if (channels.length === 0) {
      return NextResponse.json({ success: true, message: 'No channels to delete.' });
    }

    // Delete channels
    const channelIds = channels.map(c => c.id);
    console.log(`Deleting ${channelIds.length} channels:`, channelIds);
    
    // Stream allows bulk deletion or individual
    // We'll delete them one by one or using deleteChannels if available in this SDK version
    const deletePromises = channels.map(channel => channel.delete());
    await Promise.all(deletePromises);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully deleted ${channelIds.length} conversations.` 
    });

  } catch (error) {
    console.error("Clear Chats Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
