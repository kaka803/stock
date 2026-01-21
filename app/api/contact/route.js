import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, subject, message } = await req.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please provide all required fields' 
      }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please provide a valid email address' 
      }, { status: 400 });
    }

    // Save to database
    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully! We will get back to you soon.' 
    }, { status: 201 });

  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send message. Please try again later.' 
    }, { status: 500 });
  }
}
