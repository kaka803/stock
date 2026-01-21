import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function GET(req) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;
    const standardToken = cookieStore.get('token')?.value;

    try {
        await dbConnect();

        // 1. Check specialized admin token
        if (adminToken === 'authenticated') {
            console.log("✨ API /admin/me: Admin token is authenticated.");
            
            if (standardToken) {
                const decoded = verifyToken(standardToken);
                if (decoded && decoded.userId && isValidObjectId(decoded.userId)) {
                    try {
                        const user = await User.findById(decoded.userId).select('-password -otp -otpExpiry');
                        if (user && (user.role === 'admin' || user.role === 'sub-admin')) {
                            console.log("✅ API /admin/me: Found user via standard token with role:", user.role);
                            return NextResponse.json({ authenticated: true, user });
                        }
                    } catch (e) {
                        console.warn("⚠️ API /admin/me: DB query failed for userId:", decoded.userId);
                    }
                }
            }

            // Fallback for hardcoded admin or if userId was not a valid DB ID
            const admin = await User.findOne({ role: 'admin' }).select('-password -otp -otpExpiry');
            if (admin) {
                console.log("✅ API /admin/me: Found fallback admin in DB.");
                return NextResponse.json({ authenticated: true, user: admin });
            }
            
            console.log("✅ API /admin/me: Falling back to hardcoded config admin.");
            return NextResponse.json({ 
                authenticated: true, 
                user: { name: 'Admin', role: 'admin', email: process.env.ADMIN_EMAIL || 'admin@stocks.com' } 
            });
        }

        // 2. Fallback to standard token if it's an admin
        if (standardToken) {
            console.log("📡 API /admin/me: Checking standard token fallback...");
            const decoded = verifyToken(standardToken);
            if (decoded && decoded.userId && isValidObjectId(decoded.userId)) {
                const user = await User.findById(decoded.userId).select('-password -otp -otpExpiry');
                if (user && (user.role === 'admin' || user.role === 'sub-admin')) {
                    console.log("✅ API /admin/me: Found user via fallback standard token with role:", user.role);
                    return NextResponse.json({ authenticated: true, user });
                }
            }
        }

        console.warn("⚠️ API /admin/me: Not authenticated.");
        return NextResponse.json({ authenticated: false }, { status: 401 });
    } catch (error) {
        console.error("🔥 API /admin/me GLOBAL ERROR:", error);
        return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
    }
}
