import dbConnect from '@/lib/db';
import User from '@/models/User';
import LoyaltyTask from '@/models/LoyaltyTask';
import LoyaltyTransaction from '@/models/LoyaltyTransaction';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, taskId } = await req.json();

    if (!userId || !taskId) {
      return NextResponse.json({ success: false, error: 'Missing userId or taskId' }, { status: 400 });
    }

    const task = await LoyaltyTask.findById(taskId);
    if (!task || !task.isActive) {
      return NextResponse.json({ success: false, error: 'Invalid or inactive task' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Check if already completed
    // We check transaction history for this task
    const existingTransaction = await LoyaltyTransaction.findOne({
      userId: user._id,
      source: 'task',
      sourceId: task._id.toString()
    });

    if (existingTransaction) {
      return NextResponse.json({ success: false, error: 'Task already completed' }, { status: 400 });
    }

    // Award points
    user.loyaltyPoints = (user.loyaltyPoints || 0) + task.points;
    await user.save();

    // Record transaction
    await LoyaltyTransaction.create({
      userId: user._id,
      type: 'earn',
      source: 'task',
      sourceId: task._id,
      description: `Completed task: ${task.title}`,
      points: task.points
    });

    return NextResponse.json({ success: true, points: user.loyaltyPoints, message: 'Points claimed successfully' });

  } catch (error) {
    console.error('Claim Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
