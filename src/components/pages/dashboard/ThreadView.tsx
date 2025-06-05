import styled from '@emotion/styled';
import { useState } from 'react';
import { Box, Paper, Typography, IconButton, Button, Avatar, Divider, Menu, MenuItem } from '@mui/material';
import { MoreVert, Flag, Edit, Delete, Lock, PushPin, Reply } from '@mui/icons-material';

const ThreadContainer = styled(Paper)`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(249, 212, 35, 0.1);
`;

const ThreadTitle = styled(Typography)`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  color: #f9d423;
  margin-bottom: 1rem;
`;

const PostContainer = styled(Box)`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Username = styled(Typography)`
  color: #f9d423;
  font-weight: bold;
`;

const PostContent = styled(Typography)`
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  white-space: pre-wrap;
`;

const PostMeta = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.5);
`;

const ActionButton = styled(Button)`
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    color: #f9d423;
    border-color: #f9d423;
    background: rgba(249, 212, 35, 0.1);
  }
`;

const StyledIconButton = styled(IconButton)`
  color: rgba(255, 255, 255, 0.7);
  
  &:hover {
    color: #f9d423;
    background-color: rgba(249, 212, 35, 0.1);
  }
`;

interface Post {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  edited?: boolean;
  avatar?: string;
}

interface ThreadViewProps {
  title: string;
  posts: Post[];
  isPinned: boolean;
  isLocked: boolean;
  onPin: () => void;
  onLock: () => void;
  onEdit: (postId: number) => void;
  onDelete: (postId: number) => void;
  onFlag: (postId: number) => void;
  onReply: () => void;
}

const ThreadView: React.FC<ThreadViewProps> = ({
  title,
  posts,
  isPinned,
  isLocked,
  onPin,
  onLock,
  onEdit,
  onDelete,
  onFlag,
  onReply
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, postId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const handleAction = (action: 'edit' | 'delete' | 'flag') => {
    if (selectedPostId === null) return;

    switch (action) {
      case 'edit':
        onEdit(selectedPostId);
        break;
      case 'delete':
        onDelete(selectedPostId);
        break;
      case 'flag':
        onFlag(selectedPostId);
        break;
    }

    handleMenuClose();
  };

  return (
    <ThreadContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <ThreadTitle>{title}</ThreadTitle>
        <Box>
          <StyledIconButton onClick={onPin} title={isPinned ? 'Unpin thread' : 'Pin thread'}>
            <PushPin sx={{ color: isPinned ? '#f9d423' : 'inherit' }} />
          </StyledIconButton>
          <StyledIconButton onClick={onLock} title={isLocked ? 'Unlock thread' : 'Lock thread'}>
            <Lock sx={{ color: isLocked ? '#f9d423' : 'inherit' }} />
          </StyledIconButton>
        </Box>
      </Box>

      {posts.map((post) => (
        <PostContainer key={post.id}>
          <UserInfo>
            <Avatar src={post.avatar} sx={{ width: 40, height: 40, bgcolor: 'rgba(249, 212, 35, 0.1)' }} />
            <Box>
              <Username variant="subtitle1">{post.author}</Username>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {post.timestamp}
                {post.edited && ' (edited)'}
              </Typography>
            </Box>
          </UserInfo>

          <PostContent>{post.content}</PostContent>

          <PostMeta>
            <Box>
              <ActionButton
                size="small"
                startIcon={<Reply />}
                onClick={onReply}
                disabled={isLocked}
              >
                Reply
              </ActionButton>
            </Box>
            <StyledIconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, post.id)}
            >
              <MoreVert />
            </StyledIconButton>
          </PostMeta>
        </PostContainer>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            '& .MuiMenuItem-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                bgcolor: 'rgba(249, 212, 35, 0.1)',
                color: '#f9d423'
              }
            }
          }
        }}
      >
        <MenuItem onClick={() => handleAction('edit')}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleAction('flag')}>
          <Flag sx={{ mr: 1 }} /> Report
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: '#ff4e50' }}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </ThreadContainer>
  );
};

export default ThreadView;