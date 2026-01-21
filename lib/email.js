import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendOTPEmail = async (email, otp) => {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.warn('SMTP credentials not found. OTP email simulated.');
        console.warn(`OTP for ${email}: ${otp}`);
        return { success: true, simulated: true };
    }

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: 'Verify Your Email - StockApp',
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Verify Your Email Address</h2>
            <p>Thank you for signing up. Please use the verification code below to complete your registration:</p>
            <h1 style="background-color: #f3f4f6; padding: 10px; text-align: center; letter-spacing: 5px; border-radius: 5px;">${otp}</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
        `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export const sendAdminEmail = async (email, subject, body) => {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.warn('SMTP credentials not found. Admin email simulated.');
        console.warn(`Subject: ${subject} | To: ${email}\nBody: ${body}`);
        return { success: true, simulated: true };
    }

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: subject,
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
                <h2 style="color: #2563eb; margin-top: 0;">Message from Support</h2>
                <div style="white-space: pre-wrap; margin-bottom: 20px;">${body}</div>
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 12px; color: #9ca3af;">This is an official communication from StockApp Admin Panel.</p>
            </div>
        </div>
        `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending admin email:', error);
    return { success: false, error: error.message };
  }
};

