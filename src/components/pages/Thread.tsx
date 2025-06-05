import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Box, Paper, Typography, TextField, Button, Avatar, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Flag as FlagIcon } from '@mui/icons-material';
import { useForumContext } from '../../context/ForumContext';
import { useAuth } from '../../context/AuthContext';
import { ForumPost } from '../../models/forum';

const ThreadContainer = styled(Paper)`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(249, 212, 35, 0.1);
  margin-bottom: 1.5rem;
`;

const PostContainer = styled(Box)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
`;

const PostHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const UserInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Username = styled(Typography)`
  color: #f9d423;
  font-weight: bold;
`;

const PostDate = styled(Typography)`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
`;

const PostContent = styled(Typography)`
  color: white;
  white-space: pre-wrap;
`;

const ActionButton = styled(Button)`
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  color: black;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  
  &:hover {
    background: linear-gradient(45deg, #ff4e50, #f9d423);
  }
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    color: white;
    border-color: rgba(249, 212, 35, 0.3);
    &:hover {
      border-color: rgba(249, 212, 35, 0.5);
    }
    &.Mui-focused {
      border-color: #f9d423;
    }
  }
  .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
  }
`;

interface ThreadProps {
  threadId: number;
}

const Thread = ({ threadId }: ThreadProps) => {
  const { user, isAuthenticated } = useAuth();
  const { posts, loading, error, userPermissions, loadPosts, createPost, updatePost } = useForumContext();
  const [newPost, setNewPost] = useState('');
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (threadId) {
      loadPosts(threadId);
    }
  }, [threadId]);

  const handleCreatePost = () => {
    if (!threadId || !newPost.trim()) return;
    createPost(threadId, newPost.trim());
    setNewPost('');
  };

  const handleEditPost = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setEditingPost(postId);
      setEditContent(post.content);
    }
  };

  const handleUpdatePost = (postId: number) => {
    if (!editContent.trim()) return;
    updatePost(postId, editContent.trim());
    setEditingPost(null);
    setEditContent('');
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return <Box color="error.main">{error}</Box>;
  }

  return (
    <ThreadContainer>
      {posts.map((post: ForumPost) => (
        <PostContainer key={post.id}>
          <PostHeader>
            <UserInfo>
              <Avatar sx={{ bgcolor: '#f9d423' }}>
                {post.author_username?.[0]?.toUpperCase()}
              </Avatar>
              <Box>
                <Username variant="subtitle1">{post.author_username}</Username>
                <PostDate variant="caption">
                  {new Date(post.created_at).toLocaleString()}
                  {post.is_edited && ' (edited)'}
                </PostDate>
              </Box>
            </UserInfo>
            {isAuthenticated && (user?.id === String(post.user_id) || userPermissions?.can_moderate) && (
              <Box>
                <IconButton size="small" onClick={() => handleEditPost(post.id)}>
                  <EditIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </IconButton>
                <IconButton size="small">
                  <DeleteIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </IconButton>
                <IconButton size="small">
                  <FlagIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </IconButton>
              </Box>
            )}
          </PostHeader>
          {editingPost === post.id ? (
            <Box sx={{ mt: 2 }}>
              <StyledTextField
                fullWidth
                multiline
                rows={4}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={() => setEditingPost(null)} sx={{ color: 'white' }}>
                  Cancel
                </Button>
                <ActionButton onClick={() => handleUpdatePost(post.id)}>
                  Update
                </ActionButton>
              </Box>
            </Box>
          ) : (
            <PostContent>{post.content}</PostContent>
          )}
        </PostContainer>
      ))}

      {isAuthenticated && userPermissions?.can_create_post && (
        <Box sx={{ mt: 3 }}>
          <StyledTextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write your reply..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <ActionButton onClick={handleCreatePost} disabled={!newPost.trim()}>
              Post Reply
            </ActionButton>
          </Box>
        </Box>
      )}
    </ThreadContainer>
  );
};

export default Thread;