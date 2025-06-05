import { RowDataPacket } from 'mysql2';

export interface ForumCategory extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
  category_type: 'main' | 'sub' | 'section';
  status: 'active' | 'archived' | 'hidden';
  order_position: number;
  is_new: boolean;
  thread_count: number;
  post_count: number;
  last_thread_id: number | null;
  last_post_id: number | null;
  last_post_at: Date | null;
  last_post_user_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface ForumThread extends RowDataPacket {
  id: number;
  category_id: number;
  user_id: number;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  views: number;
  created_at: Date;
  updated_at: Date;
}

export interface ForumPost extends RowDataPacket {
  id: number;
  thread_id: number;
  user_id: number;
  content: string;
  is_edited: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ThreadWithMetadata extends ForumThread {
  author_username: string;
  reply_count: number;
  last_post_at: Date;
  last_post_user: string;
}

export interface CategoryWithMetadata extends ForumCategory {
  thread_count: number;
  post_count: number;
  last_post_at: Date | null;
  last_post_thread: string | null;
  last_post_user: string | null;
}