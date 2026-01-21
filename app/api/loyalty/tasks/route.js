import dbConnect from '@/lib/db';
import LoyaltyTask from '@/models/LoyaltyTask';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();
    const tasks = await LoyaltyTask.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Simple admin check (in a real app, verify session/token here)
    // For now assuming the caller is authorized or UI handles protection
    
    const task = await LoyaltyTask.create(body);
    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
