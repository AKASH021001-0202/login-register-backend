// src/api/routes/forgetpassword.js

import express from 'express';
import { transport } from '../../mail.util.js';
import jwt from 'jsonwebtoken';
import { Registermodel } from '../../db.utils/model.js';

const ForgetPassword = express.Router();

ForgetPassword.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await Registermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate JWT token for password reset link
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Construct reset link
    const resetLink = `${process.env.FRONTEND_URL}/resetpassword?token=${resetToken}`;

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    // Send email
    await transport.sendMail(mailOptions);

    // Send response
    return res.json({ message: 'Reset email sent' });
  } catch (error) {
    console.error('Error in password reset:', error);
    return res.status(500).json({ message: 'Error sending reset email' });
  }
});

export default ForgetPassword;
