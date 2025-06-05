import express from 'express';
import { pool } from '../config/database';
import { authenticateToken as authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all forum categories
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT c.*, COUNT(DISTINCT t.id) as thread_count, COUNT(DISTINCT p.id) as post_count FROM forum_categories c LEFT JOIN forum_threads t ON c.id = t.category_id LEFT JOIN forum_posts p ON t.id = p.thread_id GROUP BY c.id ORDER BY c.order_position'
    );
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(200).json([]);
  }
});

// Create a new category
router.post('/categories', authMiddleware, async (req, res) => {
  try {
    const { name, description, order } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO forum_categories (name, description, order_position) VALUES (?, ?, ?)',
      [name, description, order]
    );
    const categoryId = (result as any).insertId;
    res.status(201).json({ id: categoryId, name, description, order_position: order });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Failed to create category' });
  }
});

// Get threads in a category
router.get('/categories/:id/threads', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const [threads] = await pool.execute(
      'SELECT t.*, u.username FROM forum_threads t JOIN users u ON t.user_id = u.id WHERE t.category_id = ? ORDER BY t.is_pinned DESC, t.created_at DESC',
      [categoryId]
    );
    res.json(threads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    res.status(500).json({ message: 'Failed to fetch threads' });
  }
});

// Get a single thread with its posts
router.get('/thread/:id', async (req, res) => {
  try {
    const threadId = req.params.id;
    const [rows] = await pool.execute(
      'SELECT t.*, u.username FROM forum_threads t JOIN users u ON t.user_id = u.id WHERE t.id = ?',
      [threadId]
    );
    const thread = (rows as any[])[0];

    if (!thread) {
      return res.status(403).json({ message: 'Not authorized to update this thread' });
    }

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const [posts] = await pool.execute(
      'SELECT p.*, u.username FROM forum_posts p JOIN users u ON p.user_id = u.id WHERE p.thread_id = ? ORDER BY p.created_at',
      [threadId]
    );

    res.json({ thread, posts });
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({ message: 'Failed to fetch thread' });
  }
});

// Create a new thread
router.post('/threads', authMiddleware, async (req, res) => {
  try {
    const { categoryId, userId, title, content } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO forum_threads (category_id, user_id, title, content) VALUES (?, ?, ?, ?)',
      [categoryId, userId, title, content]
    );

    const threadId = (result as any).insertId;
    res.status(201).json({ id: threadId, title, content });
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({ message: 'Failed to create thread' });
  }
});

// Update a thread
router.patch('/threads/:id', authMiddleware, async (req, res) => {
  try {
    const threadId = req.params.id;
    const { userId, title, content, is_pinned, is_locked } = req.body;

    // Check user permissions
    const [threadRows] = await pool.execute(
      'SELECT user_id FROM forum_threads WHERE id = ?',
      [threadId]
    );
    const thread = (threadRows as any[])[0];

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const [permissionRows] = await pool.execute(
      'SELECT can_moderate FROM user_permissions WHERE user_id = ?',
      [userId]
    );
    const permissions = (permissionRows as any[])[0];

    if (thread.user_id !== userId && !permissions?.can_moderate) {
      return res.status(403).json({ message: 'Not authorized to update this thread' });
    }

    const updates = [];
    const values = [];
    if (title) {
      updates.push('title = ?');
      values.push(title);
    }
    if (content) {
      updates.push('content = ?');
      values.push(content);
    }
    if (typeof is_pinned !== 'undefined' && permissions?.can_moderate) {
      updates.push('is_pinned = ?');
      values.push(is_pinned);
    }
    if (typeof is_locked !== 'undefined' && permissions?.can_moderate) {
      updates.push('is_locked = ?');
      values.push(is_locked);
    }

    if (updates.length > 0) {
      values.push(threadId);
      await pool.execute(
        `UPDATE forum_threads SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating thread:', error);
    res.status(500).json({ message: 'Failed to update thread' });
  }
});

// Create a new post
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { threadId, userId, content } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO forum_posts (thread_id, user_id, content) VALUES (?, ?, ?)',
      [threadId, userId, content]
    );

    const postId = (result as any).insertId;
    res.status(201).json({ id: postId, content });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// Update a post
router.patch('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId, content } = req.body;

    // Check user permissions
    const [rows] = await pool.execute(
      'SELECT user_id FROM forum_posts WHERE id = ?',
      [postId]
    );
    const post = (rows as any[])[0];

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const [permissionRows] = await pool.execute(
      'SELECT can_moderate FROM user_permissions WHERE user_id = ?',
      [userId]
    );
    const permissions = (permissionRows as any[])[0];

    if (post.user_id !== userId && !permissions?.can_moderate) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    await pool.execute(
      'UPDATE forum_posts SET content = ?, is_edited = true WHERE id = ?',
      [content, postId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
});

// Get user permissions
router.get('/users/:id/permissions', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const [rows] = await pool.execute(
      'SELECT * FROM user_permissions WHERE user_id = ?',
      [userId]
    );
    const permissions = (rows as any[])[0];

    if (!permissions) {
      // Return default permissions if not set
      return res.json({
        can_create_thread: true,
        can_create_post: true,
        can_edit_own: true,
        can_delete_own: false,
        can_pin_thread: false,
        can_lock_thread: false,
        can_moderate: false
      });
    }

    res.json(permissions);
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    res.status(500).json({ message: 'Failed to fetch user permissions' });
  }
});

export default router;