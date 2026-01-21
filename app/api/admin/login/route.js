import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req) {
  try {
    console.log("🔵 Admin login attempt...");
    const { email, password } = await req.json();

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    // 1. Check Super Admin (Hardcoded)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        console.log("✅ Super Admin credentials valid");
        
        await dbConnect();
        // Try to find the admin in DB to get an ID for the token, if not find any admin
        let adminUser = await User.findOne({ role: 'admin' });
        
        const token = signToken({ 
            userId: adminUser ? adminUser._id : 'super-admin-id', 
            email: ADMIN_EMAIL, 
            role: 'admin' 
        });

        const response = NextResponse.json({ success: true, role: 'admin' });
        
        // Set both for compatibility
        response.cookies.set('admin_token', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            sameSite: 'lax',
            path: '/',
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            sameSite: 'lax',
            path: '/',
        });

        return response;
    }

    // 2. Check Database for Sub-admin
    await dbConnect();
    const user = await User.findOne({ email });

    if (user && (user.role === 'sub-admin' || user.role === 'admin')) {
        const isMatch = await comparePassword(password, user.password);
        if (isMatch) {
            console.log(`✅ ${user.role} login valid:`, email);
            
            const token = signToken({ userId: user._id, email: user.email, role: user.role });
            const response = NextResponse.json({ success: true, role: user.role });

            response.cookies.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24,
                sameSite: 'lax',
                path: '/',
            });

            // Also set admin_token for compatibility with some admin-side checks
            response.cookies.set('admin_token', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24,
                sameSite: 'lax',
                path: '/',
            });

            return response;
        }
    }

    console.log("❌ Invalid credentials");
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  } catch (error) {
    console.error("❌ Admin login error:", error);
    return NextResponse.json({ error: 'Login failed: ' + error.message }, { status: 500 });
  }
}
