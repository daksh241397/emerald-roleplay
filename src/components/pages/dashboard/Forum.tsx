import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, List, ListItem, ListItemText, ListItemIcon, IconButton, Button, Divider } from '@mui/material';
import { Forum as ForumIcon, Add as AddIcon, PushPin as PinIcon, Flag as FlagIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import { useForumContext } from '../../../context/ForumContext';
import { CategoryWithMetadata } from '../../../models/forum';

const Section = styled(Paper)`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(249, 212, 35, 0.1);
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled(Typography)`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8rem;
  color: #f9d423;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const ThreadItem = styled(ListItem)`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: rgba(249, 212, 35, 0.1);
  }
`;

const CategoryTitle = styled(Typography)`
  color: #f9d423;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem 0;
`;

const StyledIconButton = styled(IconButton)`
  color: rgba(255, 255, 255, 0.7);
  
  &:hover {
    color: #f9d423;
  }
`;

const Forum = () => {
  const { user } = useAuth();
  const { threads, loadThreads, categories: forumCategories, loadCategories } = useForumContext();
  const [categories, setCategories] = useState<CategoryWithMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadForumData = async () => {
      setLoading(true);
      setError(null);
      try {
        await loadCategories();
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading forum data:', error);
        if (mounted) {
          setError('Failed to load forum data. Please try again.');
          setLoading(false);
        }
      }
    };
    
    loadForumData();
    return () => {
      mounted = false;
    };
  }, [loadCategories]);

  // Load server rules threads when categories are loaded
  useEffect(() => {
    let mounted = true;
    let isLoading = false; // Local loading state to prevent re-renders
    
    const loadServerRules = async () => {
      if (forumCategories.length > 0 && !isLoading) {
        const rulesCategory = forumCategories.fEMERALD(c => c.name.toLowerCase() === 'server rules');
        if (rulesCategory) {
          try {
            isLoading = true;
            setLoading(true);
            await loadThreads(rulesCategory.id);
            if (mounted) {
              setLoading(false);
              isLoading = false;
            }
          } catch (error) {
            console.error('Error loading server rules:', error);
            if (mounted) {
              setError('Failed to load server rules. Please try again.');
              setLoading(false);
              isLoading = false;
            }
          }
        }
      }
    };

    loadServerRules();
    return () => {
      mounted = false;
    };
  }, [forumCategories, loadThreads]); // Removed loading from dependencies

  // Ensure categories are updated when threads change
  useEffect(() => {
    if (forumCategories.length > 0 && threads && !loading) {
      const processedCategories = forumCategories.map(category => ({
        ...category,
        threads: threads.filter(thread => thread.category_id === category.id)
      }));
      setCategories(processedCategories);
    }
  }, [forumCategories, threads, loading]);

  // Handle error state for missing server rules category
  useEffect(() => {
    if (forumCategories.length > 0 && !forumCategories.fEMERALD(c => c.name.toLowerCase() === 'server rules')) {
      setError('Server rules category not found. Please contact an administrator.');
    }
  }, [forumCategories]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography>Loading forum content...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Filter out empty categories and ensure server rules are always shown first
  const visibleCategories = categories.filter(category => {
    const hasThreads = category.threads && category.threads.length > 0;
    const isServerRules = category.name.toLowerCase() === 'server rules';
    return hasThreads || isServerRules;
  }).sort((a, b) => {
    if (a.name.toLowerCase() === 'server rules') return -1;
    if (b.name.toLowerCase() === 'server rules') return 1;
    return a.order_position - b.order_position;
  });


  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Section>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <SectionTitle>
                <ForumIcon /> Forum Management
              </SectionTitle>
              <Box>
                <ActionButton startIcon={<AddIcon />}>
                  New Thread
                </ActionButton>
              </Box>
            </Box>

            {categories.map((category) => (
              <Box key={category.id} sx={{ mb: 4 }}>
                <CategoryTitle variant="h6">
                  {category.name}
                </CategoryTitle>
                <List>
                  {category.threads.map((thread) => (
                    <ThreadItem key={thread.id}>
                      <ListItemIcon>
                        {thread.pinned && <PinIcon sx={{ color: '#f9d423' }} />}
                      </ListItemIcon>
                      <ListItemText
                        primary={thread.title}
                        secondary={`${thread.replies} replies`}
                        sx={{
                          '& .MuiListItemText-primary': { color: 'white' },
                          '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.7)' }
                        }}
                      />
                      <Box>
                        {thread.flags > 0 && (
                          <StyledIconButton>
                            <FlagIcon />
                            <Typography variant="caption" sx={{ ml: 0.5 }}>
                              {thread.flags}
                            </Typography>
                          </StyledIconButton>
                        )}
                        <StyledIconButton>
                          <SettingsIcon />
                        </StyledIconButton>
                      </Box>
                    </ThreadItem>
                  ))}
                </List>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              </Box>
            ))}
          </Section>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Forum;