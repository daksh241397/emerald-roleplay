import { ForumApi } from './forumApi';
import { ForumCategory, ForumThread, ForumPost, ThreadWithMetadata, CategoryWithMetadata } from '../models/forum';

export class ForumService {
  // Category operations
  static async getCategories(signal?: AbortSignal): Promise<CategoryWithMetadata[]> {
    return ForumApi.getCategories(signal);
  }

  static async createCategory(
    name: string,
    description: string,
    parentId: number | null,
    type: 'main' | 'sub' | 'section',
    order: number = 0
  ): Promise<ForumCategory> {
    return ForumApi.createCategory(name, description, parentId, type, order);
  }

  static async updateCategory(
    categoryId: number,
    updates: Partial<Pick<ForumCategory, 'name' | 'description' | 'status' | 'order_position'>>
  ): Promise<boolean> {
    return ForumApi.updateCategory(categoryId, updates);
  }

  // Thread operations
  static async getThreadsByCategory(categoryId: number): Promise<ThreadWithMetadata[]> {
    return ForumApi.getThreadsByCategory(categoryId);
  }

  static async createThread(
    categoryId: number,
    userId: number,
    title: string,
    content: string
  ): Promise<ForumThread> {
    return ForumApi.createThread(categoryId, userId, title, content);
  }

  static async updateThread(
    threadId: number,
    userId: number,
    updates: Partial<Pick<ForumThread, 'title' | 'content' | 'is_pinned' | 'is_locked'>>
  ): Promise<boolean> {
    return ForumApi.updateThread(threadId, userId, updates);
  }

  // Post operations
  static async getPostsByThread(threadId: number): Promise<ForumPost[]> {
    return ForumApi.getPostsByThread(threadId);
  }

  static async createPost(threadId: number, userId: number, content: string): Promise<ForumPost> {
    return ForumApi.createPost(threadId, userId, content);
  }

  static async updatePost(postId: number, userId: number, content: string): Promise<boolean> {
    return ForumApi.updatePost(postId, userId, content);
  }

  // Permission checks
  static async getUserPermissions(userId: number): Promise<any> {
    const response = await ForumApi.getUserPermissions(userId);
    return response;
  }
}