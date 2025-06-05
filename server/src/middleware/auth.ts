import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';

interface AuthRequest extends Request {
  user?: { id: number };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: number };
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const checkPermissions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM user_permissions WHERE user_id = ?',
      [req.user.id]
    );
    const permissions = (rows as any[])[0];

    if (!permissions) {
      // Create default permissions if they don't exist
      await pool.execute(
        'INSERT INTO user_permissions (user_id) VALUES (?)',
        [req.user.id]
      );
    }

    next();
  } catch (error) {
    console.error('Permission check error:', error);
    return res.status(500).json({ message: 'Failed to check permissions' });
  }
};