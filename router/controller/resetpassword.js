// src/api/routes/resetpassword.js

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { transport } from '../../mail.util.js';
import { Registermodel } from '../../db.utils/model.js';

const ResetPassword = express.Router();

ResetPassword.post('/', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Registermodel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Successful',
      text: 'Your password has been successfully reset.',
    };

    await transport.sendMail(mailOptions);

    // Send success response
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    // Handle different types of errors appropriately
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: 'Error resetting password' });
  }
});

export default ResetPassword;
