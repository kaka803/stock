import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Stock from '@/models/Stock';
import { verifyToken } from '@/lib/auth';

// Helper to check for admin role
const isAdmin = (req) => {
    const token = req.cookies.get('admin_token')?.value;
    return token === 'authenticated';
};

export async function POST(req) {
    try {
        await connectDB();
        if (!isAdmin(req)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const newStock = await Stock.create({
            ...body,
            symbol: body.symbol.toUpperCase(),
            isCustom: true
        });

        return NextResponse.json({ success: true, stock: newStock }, { status: 201 });
    } catch (error) {
        console.error("Create stock error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectDB();
        if (!isAdmin(req)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const stocks = await Stock.find({ isCustom: true }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, stocks });
    } catch (error) {
        console.error("Fetch stocks error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
