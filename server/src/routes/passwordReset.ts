import express from 'express';
import { sendPasswordResetEmail, verifyResetCode, resetPassword } from '../services/passwordResetService';

const router = express.Router();

// Request password reset
router.post('/request', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    await sendPasswordResetEmail(email);
    
    res.status(200).json({
      message: 'Password reset code sent successfully'
    });
  } catch (error: any) {
    console.error('Error requesting password reset:', error);
    if (error.message.includes('not registered')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to send reset code' });
  }
});

// Verify reset code
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message: 'Email and verification code are required'
      });
    }

    const isValid = verifyResetCode(email, code);

    res.status(200).json({
      valid: isValid,
      message: isValid ? 'Code verified successfully' : 'Invalid or expired code'
    });
  } catch (error) {
    console.error('Error verifying reset code:', error);
    res.status(500).json({ message: 'Failed to verify code' });
  }
});

// Reset password with verification code
router.post('/reset', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        message: 'Email, verification code, and new password are required'
      });
    }

    await resetPassword(email, code, newPassword);

    res.status(200).json({
      message: 'Password reset successfully'
    });
  } catch (error: any) {
    console.error('Error resetting password:', error);
    if (error.message === 'Invalid or expired reset code') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

export default router;