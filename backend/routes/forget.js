const router = require('express').Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      from: `"Inkwell" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your Inkwell password',
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 24px;">
          <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 24px;">Reset your password</h1>
          <p style="font-size: 16px; color: #6b6b6b; line-height: 1.7; margin-bottom: 32px;">
            We received a request to reset your Inkwell password. Click the button below to choose a new password.
          </p>
          <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background: #242424; color: #fff; border-radius: 999px; font-size: 15px; font-weight: 600; text-decoration: none; margin-bottom: 32px;">
            Reset Password
          </a>
          <p style="font-size: 14px; color: #9b9b9b;">This link expires in 1 hour. If you did not request this, ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e6e6e6; margin: 32px 0;" />
          <p style="font-size: 13px; color: #9b9b9b;">© 2025 Inkwell</p>
        </div>
      `,
    });

    res.json({ message: 'Password reset email sent!' });
  } catch (e) {
    console.error('FORGOT ERROR:', e);
    res.status(500).json({ message: e.message });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset link' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successfully!' });
  } catch (e) {
    console.error('RESET ERROR:', e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;