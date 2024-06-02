import pool from '../../lib/db';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import moment from 'moment-timezone';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;
    try {
      const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(404).json({ message: 'Email not found' });
      }
      const user = users[0];
      const token = crypto.randomBytes(32).toString('hex');


      const expires = moment().tz('Europe/Albania').add(1, 'hour').toDate();

      console.log('Generated Token:', token);
      console.log('Expires:', expires);

      await pool.query('UPDATE user SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE user_id = ?', [token, expires, user.user_id]);

      const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Password Reset Request',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
               Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
               ${resetLink}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Password reset link has been sent to your email' });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
