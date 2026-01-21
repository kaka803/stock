import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
    try {
        await connectDB();
        
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
             return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
        }

        const withdrawals = await Withdrawal.find({ user: decoded.userId }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, withdrawals });
    } catch (error) {
        console.error("Fetch withdrawals error:", error);
        return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
             return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
        }

        const { assetType, symbol, quantity, paymentDetail, amount } = await req.json();

        if (!assetType || !symbol || !quantity || !paymentDetail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Verify User Holdings
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const assetInPortfolio = user.portfolio.find(a => 
            a.symbol.toUpperCase() === symbol.toUpperCase() && 
            a.type.toLowerCase() === assetType.toLowerCase()
        );

        if (!assetInPortfolio || assetInPortfolio.quantity < quantity) {
            return NextResponse.json({ error: 'Insufficient holdings for this withdrawal' }, { status: 400 });
        }

        // 2. Create Withdrawal Request
        const withdrawal = await Withdrawal.create({
            user: decoded.userId,
            assetType,
            symbol,
            quantity,
            amount,
            paymentDetail,
            status: 'pending'
        });

        return NextResponse.json({ success: true, withdrawal });

    } catch (error) {
        console.error("Create withdrawal error:", error);
        return NextResponse.json({ error: 'Failed to create withdrawal request' }, { status: 500 });
    }
}
