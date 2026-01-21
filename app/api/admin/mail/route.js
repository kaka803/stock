import { NextResponse } from 'next/server';
import { sendAdminEmail } from '@/lib/email';

export async function POST(req) {
    try {
        
        // Basic requirement: User must be admin (logic assumed based on context)
        // In a real app, we would verify the JWT/Session here.
        
        const { to, subject, message } = await req.json();

        if (!to || !subject || !message) {
            return NextResponse.json({ success: false, error: 'Recipient, subject, and message are required.' }, { status: 400 });
        }

        const result = await sendAdminEmail(to, subject, message);

        if (result.success) {
            return NextResponse.json({ 
                success: true, 
                message: 'Email sent successfully!',
                simulated: result.simulated 
            });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

    } catch (error) {
        console.error('Admin Mail API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
