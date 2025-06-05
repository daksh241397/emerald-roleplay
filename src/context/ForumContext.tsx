import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ForumService } from '../services/forumService';
import { CategoryWithMetadata, ThreadWithMetadata, ForumPost } from '../models/forum';
import { useAuth } from './AuthContext';
import { sessionManager } from '../utils/session';
import { useNavigate } from 'react-router-dom';

interface ForumContextType {
  categories: CategoryWithMetadata[];
  threads: ThreadWithMetadata[];
  currentCategory: number | null;
  setCurrentCategory: (categoryId: number | null) => void;
  currentThread: number | null;
  posts: ForumPost[];
  loading: boolean;
  error: string | null;
  userPermissions: any;
  loadCategories: () => Promise<void>;
  loadThreads: (categoryId: number) => Promise<void>;
  loadPosts: (threadId: number) => Promise<void>;
  createCategory: (name: string, description: string, parentId: number | null, type: 'main' | 'sub' | 'section') => Promise<void>;
  updateCategory: (categoryId: number, updates: Partial<Pick<ForumCategory, 'name' | 'description' | 'status' | 'order_position'>>) => Promise<void>;
  createThread: (categoryId: number, title: string, content: string) => Promise<void>;
  createPost: (threadId: number, content: string) => Promise<void>;
  updateThread: (threadId: number, updates: any) => Promise<void>;
  updatePost: (postId: number, content: string) => Promise<void>;
}

const ForumContext = createContext<ForumContextType | undefined>(undefined);

export const useForumContext = () => {
  const context = useContext(ForumContext);
  if (context === undefined) {
    throw new Error('useForumContext must be used within a ForumProvider');
  }
  return context;
};

interface ForumProviderProps {
  children: ReactNode;
}

// Add mock data for initial load
const mockCategories: CategoryWithMetadata[] = [
  {
    id: 1,
    name: 'Announcements',
    description: 'Important updates and news about EMERALD RP',
    parent_id: null,
    order_position: 1,
    status: 'active',
    thread_count: 12,
    post_count: 156,
    last_thread_id: 1,
    last_post_id: 1,
    last_post_user_id: 1,
    last_post_at: new Date().toISOString(),
    depth: 0,
    stats: { threads: 12, posts: 156 }
  },
  {
    id: 2,
    name: 'General Discussion',
    description: 'Chat about anything related to EMERALD RP',
    parent_id: null,
    order_position: 2,
    status: 'active',
    thread_count: 45,
    post_count: 892,
    last_thread_id: 2,
    last_post_id: 2,
    last_post_user_id: 2,
    last_post_at: new Date().toISOString(),
    depth: 0,
    stats: { threads: 45, posts: 892 }
  },
  {
    id: 3,
    name: 'Applications',
    description: 'Apply for staff positions and leadership roles',
    parent_id: null,
    order_position: 3,
    status: 'active',
    thread_count: 0,
    post_count: 0,
    last_thread_id: null,
    last_post_id: null,
    last_post_user_id: null,
    last_post_at: null,
    depth: 0,
    stats: { threads: 0, posts: 0 }
  },
  {
    id: 4,
    name: 'Admin Applications',
    description: 'Apply for administrative positions',
    parent_id: 3,
    order_position: 1,
    status: 'active',
    thread_count: 15,
    post_count: 234,
    last_thread_id: 4,
    last_post_id: 4,
    last_post_user_id: 4,
    last_post_at: new Date().toISOString(),
    depth: 1,
    stats: { threads: 15, posts: 234 }
  },
  {
    id: 5,
    name: 'Leader Applications',
    description: 'Apply for leadership positions in organizations',
    parent_id: 3,
    order_position: 2,
    status: 'active',
    thread_count: 18,
    post_count: 267,
    last_thread_id: 5,
    last_post_id: 5,
    last_post_user_id: 5,
    last_post_at: new Date().toISOString(),
    depth: 1,
    stats: { threads: 18, posts: 267 }
  },
  {
    id: 6,
    name: 'Support',
    description: 'Get help with technical issues and questions',
    parent_id: null,
    order_position: 4,
    status: 'active',
    thread_count: 67,
    post_count: 1234,
    last_thread_id: 6,
    last_post_id: 6,
    last_post_user_id: 6,
    last_post_at: new Date().toISOString(),
    depth: 0,
    stats: { threads: 67, posts: 1234 }
  },
  {
    id: 7,
    name: 'Bug Reports',
    description: 'Report and track bugs in the game',
    parent_id: null,
    order_position: 5,
    status: 'active',
    thread_count: 34,
    post_count: 567,
    last_thread_id: 7,
    last_post_id: 7,
    last_post_user_id: 7,
    last_post_at: new Date().toISOString(),
    depth: 0,
    stats: { threads: 34, posts: 567 }
  },
  {
    id: 8,
    name: 'Featured Content',
    description: 'Showcase your best roleplay moments and creations',
    parent_id: null,
    order_position: 6,
    status: 'active',
    thread_count: 23,
    post_count: 456,
    last_thread_id: 8,
    last_post_id: 8,
    last_post_user_id: 8,
    last_post_at: new Date().toISOString(),
    depth: 0,
    stats: { threads: 23, posts: 456 }
  }
];

export const ForumProvider = ({ children }: ForumProviderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryWithMetadata[]>(mockCategories);
  const [threads, setThreads] = useState<ThreadWithMetadata[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const [currentThread, setCurrentThread] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<any>(null);
  const [categoryHierarchy, setCategoryHierarchy] = useState<Map<number, number[]>>(new Map());
  const [categoryMetadata, setCategoryMetadata] = useState<Map<number, { threadCount: number, postCount: number, lastPost: any }>>(new Map());
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    if (user && user.id && user.id !== 0 && user.id !== '0') {
      loadUserPermissions(abortController.signal);
    }
    return () => {
      abortController.abort();
    };
  }, [user]);

  useEffect(() => {
    const abortController = new AbortController();
    if (currentThread) {
      loadPosts(currentThread);
    }
    return () => {
      abortController.abort();
    };
  }, [currentThread]);

  const loadUserPermissions = async (signal: AbortSignal) => {
    if (!user || !user.id || user.id === 0 || user.id === '0') return;
    
    try {
      const permissions = await ForumService.getUserPermissions(parseInt(user.id), signal);
      if (!signal.aborted) {
        setUserPermissions(permissions);
        setError(null);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error('Error loading user permissions:', error);
      
      if (!signal.aborted) {
        setUserPermissions(null);
        
        if (error.response?.status === 403) {
          const token = localStorage.getItem('token');
          if (token) {
            sessionManager.invalidateSession(token);
          }
          setError('Your session has expired. Please log in again.');
          navigate('/login', { replace: true });
        } else {
          setError('Failed to load permissions. Please try again later.');
        }
      }
    }
  };

  const loadCategories = async () => {
    if (!initialLoadAttempted) {
      setInitialLoadAttempted(true);
    }
    
    const abortController = new AbortController();
    setLoading(true);
    setError(null);
    
    try {
      // Try to load from backend first
      const data = await ForumService.getCategories(abortController.signal);
      
      if (data && data.length > 0) {
        // Process backend data
        const hierarchy = new Map<number, number[]>();
        const metadata = new Map<number, { threadCount: number, postCount: number, lastPost: any }>();
        const categoryMap = new Map<number, CategoryWithMetadata>();

        data.forEach(category => {
          categoryMap.set(category.id, category);
          
          if (category.parent_id) {
            const parentChildren = hierarchy.get(category.parent_id) || [];
            hierarchy.set(category.parent_id, [...parentChildren, category.id]);
          }

          metadata.set(category.id, {
            threadCount: category.thread_count,
            postCount: category.post_count,
            lastPost: {
              threadId: category.last_thread_id,
              postId: category.last_post_id,
              userId: category.last_post_user_id,
              timestamp: category.last_post_at
            }
          });
        });

        const processedCategories = new Set<number>();
        const uniqueCategories: CategoryWithMetadata[] = [];

        const processCategory = (categoryId: number, depth: number = 0) => {
          if (processedCategories.has(categoryId)) return;
          
          const category = categoryMap.get(categoryId);
          if (!category) return;

          processedCategories.add(categoryId);
          uniqueCategories.push({
            ...category,
            depth
          });

          const children = hierarchy.get(categoryId) || [];
          children
            .map(childId => categoryMap.get(childId))
            .filter((child): child is CategoryWithMetadata => !!child)
            .sort((a, b) => a.order_position - b.order_position)
            .forEach(child => processCategory(child.id, depth + 1));
        };

        Array.from(categoryMap.values())
          .filter(category => !category.parent_id)
          .sort((a, b) => a.order_position - b.order_position)
          .forEach(category => processCategory(category.id));

        if (!abortController.signal.aborted) {
          setCategoryHierarchy(hierarchy);
          setCategoryMetadata(metadata);
          setCategories(uniqueCategories);
          setError(null);
        }
      } else {
        // If no data from backend, use mock data
        setCategories(mockCategories);
        setError(null);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }
      // If there's an error, use mock data
      setCategories(mockCategories);
      setError(null);
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const loadThreads = async (categoryId: number) => {
    const abortController = new AbortController();
    
    if (!loading) {
      setLoading(true);
    }
    setError(null);
    
    try {
      setCurrentCategory(categoryId);
      const data = await ForumService.getThreadsByCategory(categoryId, abortController.signal);
      
      if (!abortController.signal.aborted) {
        setThreads(data);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }
      
      if (!abortController.signal.aborted) {
        setError(error.message || 'Failed to load threads');
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const loadPosts = async (threadId: number) => {
    const abortController = new AbortController();
    setLoading(true);
    setError(null);
    try {
      setCurrentThread(threadId);
      const data = await ForumService.getPostsByThread(threadId, abortController.signal);
      if (!abortController.signal.aborted) {
        setPosts(data);
        setError(null);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }
      if (!abortController.signal.aborted) {
        setError(error.message || 'Failed to load posts');
        setPosts([]);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const createThread = async (categoryId: number, title: string, content: string) => {
    if (!user) throw new Error('Must be logged in to create thread');
    setLoading(true);
    setError(null);
    try {
      await ForumService.createThread(categoryId, parseInt(user.id), title, content);
      await loadThreads(categoryId);
    } catch (error: any) {
      setError(error.message || 'Failed to create thread');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (threadId: number, content: string) => {
    if (!user) throw new Error('Must be logged in to create post');
    setLoading(true);
    setError(null);
    try {
      await ForumService.createPost(threadId, parseInt(user.id), content);
      await loadPosts(threadId);
    } catch (error: any) {
      setError(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const updateThread = async (threadId: number, updates: any) => {
    if (!user) throw new Error('Must be logged in to update thread');
    setLoading(true);
    setError(null);
    try {
      await ForumService.updateThread(threadId, parseInt(user.id), updates);
      if (currentCategory) await loadThreads(currentCategory);
    } catch (error: any) {
      setError(error.message || 'Failed to update thread');
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId: number, content: string) => {
    if (!user) throw new Error('Must be logged in to update post');
    setLoading(true);
    setError(null);
    try {
      await ForumService.updatePost(postId, parseInt(user.id), content);
      if (currentThread) await loadPosts(currentThread);
    } catch (error: any) {
      setError(error.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (name: string, description: string, parentId: number | null, type: 'main' | 'sub' | 'section') => {
    if (!user) throw new Error('Must be logged in to create category');
    setLoading(true);
    setError(null);
    try {
      await ForumService.createCategory(name, description, parentId, type);
      await loadCategories();
    } catch (error: any) {
      setError(error.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (categoryId: number, updates: Partial<Pick<ForumCategory, 'name' | 'description' | 'status' | 'order_position'>>) => {
    if (!user) throw new Error('Must be logged in to update category');
    setLoading(true);
    setError(null);
    try {
      await ForumService.updateCategory(categoryId, updates);
      await loadCategories();
    } catch (error: any) {
      setError(error.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForumContext.Provider
      value={{
        categories,
        threads,
        posts,
        currentCategory,
        setCurrentCategory,
        currentThread,
        loading,
        error,
        userPermissions,
        loadCategories,
        loadThreads,
        loadPosts,
        createCategory,
        updateCategory,
        createThread,
        createPost,
        updateThread,
        updatePost
      }}
    >
      {children}
    </ForumContext.Provider>
  );
};