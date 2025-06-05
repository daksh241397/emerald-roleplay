import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import forumRoutes from './routes/forum';
import permissionsRouter from './routes/permissions';
import usersRoutes from './routes/users';
import passwordResetRoutes from './routes/passwordReset';
import { pool, testConnection } from './config/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Test database connection on startup
testConnection().catch(error => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/forum', permissionsRouter);
app.use('/api/users', usersRoutes);
app.use('/api/password-reset', passwordResetRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { pool };
