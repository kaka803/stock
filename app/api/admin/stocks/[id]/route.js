import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Stock from '@/models/Stock';
import { verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const isAdmin = (req) => {
    const token = req.cookies.get('admin_token')?.value;
    return token === 'authenticated';
};

export async function PUT(req, { params }) {
    try {
        await connectDB();
        if (!isAdmin(req)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid Stock ID' }, { status: 400 });
        }

        const body = await req.json();
        if (body.symbol) body.symbol = body.symbol.toUpperCase();
        const updatedStock = await Stock.findByIdAndUpdate(id, body, { new: true });

        if (!updatedStock) {
            return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, stock: updatedStock });
    } catch (error) {
        console.error("Update stock error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        if (!isAdmin(req)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid Stock ID' }, { status: 400 });
        }
        const deletedStock = await Stock.findByIdAndDelete(id);

        if (!deletedStock) {
            return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Stock deleted' });
    } catch (error) {
        console.error("Delete stock error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
