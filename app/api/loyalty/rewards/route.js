import dbConnect from '@/lib/db';
import Reward from '@/models/Reward';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();
    const rewards = await Reward.find({ isActive: true }).sort({ cost: 1 });
    return NextResponse.json({ success: true, rewards });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const reward = await Reward.create(body);
    return NextResponse.json({ success: true, reward }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
