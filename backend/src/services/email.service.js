import nodemailer from 'nodemailer';

// For development, we can use a dummy account from ethereal.email
// In production, you'd use a real email service provider
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'testuser@example.com', // generated ethereal user
    pass: 'password', // generated ethereal password
  },
});

export const sendPasswordResetEmail = async (to, token) => {
  const resetUrl = `http://localhost:5173/reset-password/${token}`;
  const mailOptions = {
    from: '"TradeZella" <noreply@tradezella.com>',
    to,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset. Click the link below to reset your password:</p>
           <a href="${resetUrl}">${resetUrl}</a>
           <p>This link will expire in 1 hour.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Could not send password reset email.');
  }
};
