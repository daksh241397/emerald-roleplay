import axios from 'axios';
import { ForumCategory, ForumThread, ForumPost, ThreadWithMetadata, CategoryWithMetadata } from '../models/forum';

const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    ...getAuthHeaders()
  };
  return config;
});

export class ForumApi {
  // Category operations
  static async getCategories(signal?: AbortSignal): Promise<CategoryWithMetadata[]> {
    const response = await axiosInstance.get('/forum/categories', { signal });
    return response.data;
  }

  static async createCategory(name: string, description: string, order: number): Promise<ForumCategory> {
    const response = await axiosInstance.post('/forum/categories', { name, description, order });
    return response.data;
  }

  // Thread operations
  static async getThreadsByCategory(categoryId: number): Promise<ThreadWithMetadata[]> {
    const response = await axiosInstance.get(`/forum/categories/${categoryId}/threads`);
    return response.data;
  }

  static async createThread(
    categoryId: number,
    userId: number,
    title: string,
    content: string
  ): Promise<ForumThread> {
    const response = await axiosInstance.post('/forum/threads', {
      categoryId,
      userId,
      title,
      content
    });
    return response.data;
  }

  static async updateThread(
    threadId: number,
    userId: number,
    updates: Partial<Pick<ForumThread, 'title' | 'content' | 'is_pinned' | 'is_locked'>>
  ): Promise<boolean> {
    const response = await axiosInstance.patch(`/forum/threads/${threadId}`, {
      userId,
      ...updates
    });
    return response.data.success;
  }

  // Post operations
  static async getPostsByThread(threadId: number): Promise<ForumPost[]> {
    const response = await axiosInstance.get(`/forum/threads/${threadId}/posts`);
    return response.data;
  }

  static async createPost(threadId: number, userId: number, content: string): Promise<ForumPost> {
    const response = await axiosInstance.post('/forum/posts', {
      threadId,
      userId,
      content
    });
    return response.data;
  }

  static async updatePost(postId: number, userId: number, content: string): Promise<boolean> {
    const response = await axiosInstance.patch(`/forum/posts/${postId}`, {
      userId,
      content
    });
    return response.data.success;
  }

  // Permission checks
  static async getUserPermissions(userId: number): Promise<any> {
    const response = await axiosInstance.get(`/forum/users/${userId}/permissions`);
    return response.data;
  }
}