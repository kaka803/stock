import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken, hashPassword } from '@/lib/auth';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper to check if requester is SUPER ADMIN
async function isSuperAdmin(req) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const adminToken = cookieStore.get('admin_token')?.value;

    console.log("Subadmin API Auth Check - Standard Token:", !!token, "Admin Token:", !!adminToken);

    // 1. Check specialized admin token
    if (adminToken === 'authenticated') {
        return true; // Simple check for now, consistent with AdminPanelLayout
    }

    // 2. Check standard JWT token
    if (token) {
        const decoded = verifyToken(token);
        if (decoded && decoded.userId && isValidObjectId(decoded.userId)) {
            await dbConnect();
            try {
                const user = await User.findById(decoded.userId);
                return user && user.role === 'admin';
            } catch (e) {
                return false;
            }
        }
    }

    return false;
}

export async function GET(req) {
    try {
        if (!await isSuperAdmin(req)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const subadmins = await User.find({ role: 'sub-admin' }).select('-password -otp -otpExpiry');
        return NextResponse.json({ success: true, subadmins });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        console.log("Subadmin POST request received");
        if (!await isSuperAdmin(req)) {
            console.warn("Unauthorized Subadmin POST attempt");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, email, password, phone } = body;
        console.log("Creating subadmin for email:", email);
        
        await dbConnect();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);
        const newSubAdmin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'sub-admin',
            isVerified: true, // Sub-admins are pre-verified by admin
            phone
        });

        console.log("Subadmin created successfully:", newSubAdmin._id);
        return NextResponse.json({ success: true, subadmin: newSubAdmin });
    } catch (error) {
        console.error("Subadmin POST Global Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        if (!await isSuperAdmin(req)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await req.json();
        await dbConnect();
        await User.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
