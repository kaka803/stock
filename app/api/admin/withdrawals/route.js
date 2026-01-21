import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/User';

export async function GET(req) {
    try {
        await connectDB();
        
        // Admin Auth Check
        const adminToken = req.cookies.get('admin_token')?.value;
        if (adminToken !== 'authenticated') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const withdrawals = await Withdrawal.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(100);

        return NextResponse.json({ success: true, withdrawals });
    } catch (error) {
        console.error("Admin fetch withdrawals error:", error);
        return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectDB();
        
        // Admin Auth Check
        const adminToken = req.cookies.get('admin_token')?.value;
        if (adminToken !== 'authenticated') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { withdrawalId, status, remarks } = await req.json();

        if (!withdrawalId || !['verified', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        const withdrawal = await Withdrawal.findById(withdrawalId);
        if (!withdrawal) {
            return NextResponse.json({ error: 'Withdrawal request not found' }, { status: 404 });
        }

        if (withdrawal.status !== 'pending') {
            return NextResponse.json({ error: 'Withdrawal already processed' }, { status: 400 });
        }

        // If verified, deduct from user's portfolio
        if (status === 'verified') {
            const user = await User.findById(withdrawal.user);
            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            // Aggregated Deduction Logic: Deduct from multiple entries of the same asset if needed
            let remainingToDeduct = withdrawal.quantity;
            const targetSymbol = withdrawal.symbol.toUpperCase();
            const targetType = withdrawal.assetType.toLowerCase();

            // Filter portfolio for matching assets
            const matchingAssets = user.portfolio.filter(a => 
                a.symbol.toUpperCase() === targetSymbol && 
                a.type.toLowerCase() === targetType
            );

            const totalHoldings = matchingAssets.reduce((sum, a) => sum + a.quantity, 0);

            if (totalHoldings < remainingToDeduct) {
                return NextResponse.json({ error: 'User no longer has sufficient holdings' }, { status: 400 });
            }

            // Deduct from entries one by one
            user.portfolio = user.portfolio.map(asset => {
                if (remainingToDeduct <= 0) return asset;
                
                if (asset.symbol.toUpperCase() === targetSymbol && asset.type.toLowerCase() === targetType) {
                    if (asset.quantity <= remainingToDeduct) {
                        remainingToDeduct -= asset.quantity;
                        return null; // Mark for removal
                    } else {
                        asset.quantity -= remainingToDeduct;
                        remainingToDeduct = 0;
                        return asset;
                    }
                }
                return asset;
            }).filter(asset => asset !== null);

            user.markModified('portfolio');
            await user.save();
        }

        withdrawal.status = status;
        if (remarks) withdrawal.remarks = remarks;
        await withdrawal.save();

        return NextResponse.json({ success: true, withdrawal });

    } catch (error) {
        console.error("Admin update withdrawal error:", error);
        return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 500 });
    }
}
