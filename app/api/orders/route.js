import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Stock from '@/models/Stock';
import { verifyToken } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectDB();
    
    // Auth Check
    const token = req.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
         return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }

    const { 
        type, 
        symbol, 
        quantity, 
        price, 
        totalAmount, 
        paymentProof, 
        appliedCardId,
        originalTotal,
        discountAmount,
        appliedCardInfo 
    } = await req.json();

    if (!quantity || !price || !totalAmount) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if it's a custom stock to save in order status
    let isCustom = false;
    if (type === 'stock') {
        const customStock = await Stock.findOne({ symbol: symbol.toUpperCase(), isCustom: true });
        if (customStock) isCustom = true;
    }

    const newOrder = await Order.create({
      user: decoded.userId,
      type,
      symbol,
      quantity,
      price,
      totalAmount,
      paymentProof,
      status: 'pending',
      originalTotal,
      discountAmount,
      appliedCardInfo,
      isCustom
    });

    // Handle Freeze Card Usage
    if (appliedCardId) {
        const User = (await import('@/models/User')).default;
        await User.updateOne(
            { _id: decoded.userId, "inventory._id": appliedCardId },
            { $set: { "inventory.$.isUsed": true } }
        );
    }

    // Price Logic: If it's a custom stock, increase its price
    if (type === 'stock') {
        const customStock = await Stock.findOne({ symbol: symbol.toUpperCase(), isCustom: true });
        if (customStock) {
            // Increase price by 0.1% per quantity bought (arbitrary but logical)
            const priceIncreasePercent = 0.001 * quantity; 
            const newPrice = customStock.price * (1 + priceIncreasePercent);
            
            customStock.price = parseFloat(newPrice.toFixed(2));
            // Also update change and changeValue for visual feedback
            const changeAmount = newPrice - (newPrice / (1 + priceIncreasePercent));
            customStock.change = `+${changeAmount.toFixed(2)}`;
            customStock.changeValue = `+${(priceIncreasePercent * 100).toFixed(2)}%`;
            customStock.isNegative = false;
            
            await customStock.save();
        }
    }

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });

  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(req) {
    try {
        await connectDB();
        
        // Auth Check
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
             return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
        }

        // Return orders for this user
        const orders = await Order.find({ user: decoded.userId }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, orders }, { status: 200 });

    } catch (error) {
        console.error("Fetch orders error:", error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
