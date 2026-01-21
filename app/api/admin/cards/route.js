import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(req) {
  try {
    await connectDB();
    
    // Auth Check (Env based)
    const adminToken = req.cookies.get('admin_token')?.value;
    if (adminToken !== 'authenticated') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find all users who have saved cards
    const users = await User.find({ 'savedCards.0': { $exists: true } })
        .select('name email savedCards')
        .lean();

    // Flatten the cards list
    const allCards = [];
    users.forEach(user => {
        user.savedCards.forEach(card => {
            allCards.push({
                ...card,
                userName: user.name,
                userEmail: user.email,
                userId: user._id
            });
        });
    });

    // Sort by most recent
    allCards.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

    return NextResponse.json({
      success: true,
      cards: allCards
    });

  } catch (error) {
    console.error("Admin cards fetch error:", error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}
