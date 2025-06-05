import express from 'express';
import { pool } from '../config/database';
import { authenticateToken as authMiddleware } from '../middleware/auth';

const router = express.Router();

// (Route removed to avoid conflict with forum.ts)

export default router;