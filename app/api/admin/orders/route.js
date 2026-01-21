import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function GET(req) {
  try {
    await connectDB();
    
    // Auth Check (Env based)
    const adminToken = req.cookies.get('admin_token')?.value;
    if (adminToken !== 'authenticated') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return all orders (Optimized with lean and limit)
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ success: true, orders }, { status: 200 });

  } catch (error) {
    console.error("Admin fetch orders error:", error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PUT(req) {
    try {
      await connectDB();
      
      // Auth Check (Env based)
      const adminToken = req.cookies.get('admin_token')?.value;
      if (adminToken !== 'authenticated') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const { orderId, status } = await req.json();
  
      if (!orderId || !['pending', 'verified', 'rejected'].includes(status)) {
          return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
      }
  
      if (!isValidObjectId(orderId)) {
          return NextResponse.json({ error: 'Invalid Order ID' }, { status: 400 });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { status },
          { new: true }
      );
  
      if (!updatedOrder) {
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // If verified, add to user portfolio
      if (status === 'verified') {
          const portfolioItem = {
              symbol: updatedOrder.symbol,
              type: updatedOrder.type,
              quantity: updatedOrder.quantity,
              price: updatedOrder.price, // Average price logic could be complex, for now just pushing transaction or item
              date: new Date()
          };

          // Simple push for now. Ideally we aggregate same symbols.
          await User.findByIdAndUpdate(updatedOrder.user, {
              $push: { portfolio: portfolioItem }
          });
      }
  
      return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });
  
    } catch (error) {
      console.error("Admin update order error:", error);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
  }
