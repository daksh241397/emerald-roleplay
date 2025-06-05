import express from 'express';
import { pool } from '../config/database';
import { authenticateToken as authMiddleware } from '../middleware/auth';

const router = express.Router();

// Update user profile
router.put('/:id', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.params.id;
    const { username, email } = req.body;
    
    // Verify the authenticated user is updating their own profile
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({ message: 'Unauthorized to update other user\'s profile' });
    }
    
    // Check if username or email already exists for another user
    if (username || email) {
      const [existingUsers] = await pool.execute(
        'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
        [username || '', email || '', userId]
      );
      
      if ((existingUsers as any[]).length > 0) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
    }
    
    // Build the update query dynamically based on provided fields
    let updateQuery = 'UPDATE users SET ';
    const updateValues = [];
    const updateFields = [];
    
    if (username) {
      updateFields.push('username = ?');
      updateValues.push(username);
    }
    
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    
    // If no fields to update, return success
    if (updateFields.length === 0) {
      return res.status(200).json({ message: 'No changes to update' });
    }
    
    updateQuery += updateFields.join(', ') + ' WHERE id = ?';
    updateValues.push(userId);
    
    // Execute the update query
    await pool.execute(updateQuery, updateValues);
    
    // Get updated user data
    const [users] = await pool.execute(
      'SELECT id, username, email FROM users WHERE id = ?',
      [userId]
    );
    
    const updatedUser = (users as any[])[0];
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update user profile' });
  }
});

// Update user password
router.put('/:id/password', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;
    
    // Verify the authenticated user is updating their own password
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({ message: 'Unauthorized to update other user\'s password' });
    }
    
    // Verify current password
    const [users] = await pool.execute(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );
    
    const user = (users as any[])[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const bcrypt = require('bcryptjs');
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
    
    if (!validPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Failed to update password' });
  }
});

// Validate current password
router.post('/:id/validate-password', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.params.id;
    const { password } = req.body;
    
    // Verify the authenticated user is validating their own password
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({ message: 'Unauthorized to validate other user\'s password' });
    }
    
    // Get user's password hash
    const [users] = await pool.execute(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );
    
    const user = (users as any[])[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const bcrypt = require('bcryptjs');
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    res.status(200).json({ valid: validPassword });
  } catch (error) {
    console.error('Error validating password:', error);
    res.status(500).json({ message: 'Failed to validate password' });
  }
});

export default router;