import { transporter, emailTemplates } from '../config/email';
import { pool } from '../config/database';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

interface ResetCode {
  code: string;
  expiresAt: Date;
}

// Store reset codes in memory (consider using Redis in production)
const resetCodes = new Map<string, ResetCode>();

// Generate a random 6-digit code
const generateResetCode = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string): Promise<string> => {
  try {
    // Check if email exists
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))',
      [email]
    );

    if ((users as any[]).length === 0) {
      throw new Error('The provided email address is not registered in our system. Please check the email address or register a new account.');
    }

    // Generate reset code
    const code = generateResetCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store reset code
    resetCodes.set(email, { code, expiresAt });

    // Send email
    await transporter.sendMail({
      from: 'EMERALD RP Support <umairmillat@gmail.com>',
      to: email,
      subject: emailTemplates.passwordReset.subject,
      html: emailTemplates.passwordReset.html(code)
    });

    return code;
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw error;
  }
};

// Verify reset code
export const verifyResetCode = (email: string, code: string): boolean => {
  const resetData = resetCodes.get(email);
  
  if (!resetData) {
    return false;
  }

  if (Date.now() > resetData.expiresAt.getTime()) {
    resetCodes.delete(email);
    return false;
  }

  return resetData.code === code;
};

// Reset password
export const resetPassword = async (email: string, code: string, newPassword: string): Promise<void> => {
  try {
    if (!verifyResetCode(email, code)) {
      throw new Error('Invalid or expired reset code');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [hashedPassword, email]
    );

    // Remove used reset code
    resetCodes.delete(email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};