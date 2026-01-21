import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json({ success: true });
        
        // Clear the admin_token cookie
        response.cookies.delete('admin_token');
        
        // Also ensure we set it to expire immediately for older browsers/fallback
        response.cookies.set('admin_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 0,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Logout failed" }, { status: 500 });
    }
}
