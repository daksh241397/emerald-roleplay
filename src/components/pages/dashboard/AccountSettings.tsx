import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import type { Session } from '../../../utils/session';
import { Box, Grid, Paper, Typography, TextField, Switch, Button, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from '@mui/material';
import { sessionManager } from '../../../utils/session';
import { Save, Security, Notifications, Lock, DevicesOther } from '@mui/icons-material';
import { validateUserData, updateUserProfile, updatePassword, ValidationErrors } from '../../../services/userUpdateService';

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

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
  
  .MuiOutlinedInput-root {
    color: white;
    
    fieldset {
      border-color: rgba(255, 255, 255, 0.23);
    }
    
    &:hover fieldset {
      border-color: rgba(249, 212, 35, 0.5);
    }
    
    &.Mui-focused fieldset {
      border-color: #f9d423;
    }
  }
  
  .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
    
    &.Mui-focused {
      color: #f9d423;
    }
  }
`;

const SaveButton = styled(Button)`
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  color: black;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  
  &:hover {
    background: linear-gradient(45deg, #ff4e50, #f9d423);
  }
`;

const SessionItem = styled(ListItem)`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: rgba(249, 212, 35, 0.1);
  }
`;

const EndSessionButton = styled(Button)`
  color: #f9d423;
  border: 1px solid #f9d423;
  
  &:hover {
    background-color: rgba(249, 212, 35, 0.1);
  }
`;

const AccountSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [confirmEndSession, setConfirmEndSession] = useState<{ open: boolean; token: string | null }>({ open: false, token: null });

  const confirmEndSessionHandler = () => {
    if (confirmEndSession.token) {
      try {
        sessionManager.invalidateSession(confirmEndSession.token);
        const updatedSessions = sessionManager.getActiveSessions(user?.id || '');
        setActiveSessions(updatedSessions);
        setSnackbar({ open: true, message: 'Session ended successfully', severity: 'success' });
        
        // If ending current session, navigate to home page
        if (confirmEndSession.token === localStorage.getItem('sessionToken')) {
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to end session:', error);
        setSnackbar({ open: true, message: 'Failed to end session', severity: 'error' });
      }
    }
    setConfirmEndSession({ open: false, token: null });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  const [settings, setSettings] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleEndSession = (token: string) => {
    setConfirmEndSession({ open: true, token });
  };

  const [activeSessions, setActiveSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (user) {
      const sessions = sessionManager.getActiveSessions(user.id);
      setActiveSessions(sessions);
      
      // Refresh sessions every minute
      const interval = setInterval(() => {
        const updatedSessions = sessionManager.getActiveSessions(user.id);
        setActiveSessions(updatedSessions);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [user]);



  const handleSave = async () => {
    // Validate form data
    const validationErrors = validateUserData(settings);
    setErrors(validationErrors);
    
    // If there are validation errors, don't proceed
    if (Object.keys(validationErrors).length > 0) {
      setSnackbar({ open: true, message: 'Please fix the errors before saving', severity: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get the current token from localStorage
      const token = localStorage.getItem('sessionToken') || '';
      
      // Check if we need to update profile info (username or email)
      if (user && (settings.username !== user.username || settings.email !== user.email)) {
        const profileData = {
          username: settings.username !== user.username ? settings.username : undefined,
          email: settings.email !== user.email ? settings.email : undefined
        };
        
        // Only include fields that have changed
        const dataToUpdate = Object.fromEntries(
          Object.entries(profileData).filter(([_, value]) => value !== undefined)
        );
        
        if (Object.keys(dataToUpdate).length > 0) {
          await updateUserProfile(user.id, dataToUpdate, token);
          
          // Update local storage with new user data
          const updatedUser = {
            ...user,
            username: settings.username,
            email: settings.email
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
      
      // Check if we need to update password
      if (settings.currentPassword && settings.newPassword && settings.confirmPassword) {
        await updatePassword(user?.id || '', {
          currentPassword: settings.currentPassword,
          newPassword: settings.newPassword
        }, token);
        
        // Clear password fields after successful update
        setSettings(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
      
      setSnackbar({ open: true, message: 'Settings saved successfully!', severity: 'success' });
    } catch (error: any) {
      console.error('Failed to update settings:', error);
      setSnackbar({ 
        open: true, 
        message: error.message || 'Failed to update settings. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatLastActive = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Section>
            <SectionTitle>
              <DevicesOther /> Account Information
            </SectionTitle>
            <StyledTextField
              fullWidth
              label="Username"
              value={settings.username}
              onChange={(e) => {
                setSettings(prev => ({ ...prev, username: e.target.value }));
                setErrors(prev => ({ ...prev, username: undefined }));
              }}
              error={!!errors.username}
              helperText={errors.username}
              FormHelperTextProps={{ sx: { color: 'error.main' } }}
            />
            <StyledTextField
              fullWidth
              label="Email"
              type="email"
              value={settings.email}
              onChange={(e) => {
                setSettings(prev => ({ ...prev, email: e.target.value }));
                setErrors(prev => ({ ...prev, email: undefined }));
              }}
              error={!!errors.email}
              helperText={errors.email}
              FormHelperTextProps={{ sx: { color: 'error.main' } }}
            />
          </Section>

          <Section>
            <SectionTitle>
              <Security /> Password Change
            </SectionTitle>
            <StyledTextField
              fullWidth
              label="Current Password"
              type="password"
              value={settings.currentPassword}
              onChange={(e) => {
                setSettings(prev => ({ ...prev, currentPassword: e.target.value }));
                setErrors(prev => ({ ...prev, currentPassword: undefined }));
              }}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              FormHelperTextProps={{ sx: { color: 'error.main' } }}
            />
            <StyledTextField
              fullWidth
              label="New Password"
              type="password"
              value={settings.newPassword}
              onChange={(e) => {
                setSettings(prev => ({ ...prev, newPassword: e.target.value }));
                setErrors(prev => ({ ...prev, newPassword: undefined }));
              }}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              FormHelperTextProps={{ sx: { color: 'error.main' } }}
            />
            <StyledTextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={settings.confirmPassword}
              onChange={(e) => {
                setSettings(prev => ({ ...prev, confirmPassword: e.target.value }));
                setErrors(prev => ({ ...prev, confirmPassword: undefined }));
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              FormHelperTextProps={{ sx: { color: 'error.main' } }}
            />
          </Section>
        </Grid>

        <Grid item xs={12}>
          <Section>
            <SectionTitle>
              <DevicesOther /> Active Sessions
            </SectionTitle>
            <List>
              {activeSessions.map((session) => (
                <ListItem key={session.token} sx={{ 
                  backgroundColor: session.token === localStorage.getItem('sessionToken') ? 'rgba(249, 212, 35, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  mb: 1,
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ color: session.token === localStorage.getItem('sessionToken') ? '#f9d423' : 'rgba(255, 255, 255, 0.9)' }}>
                      {session.token === localStorage.getItem('sessionToken') ? '(Current Session) ' : ''}{session.deviceInfo.deviceType} • {session.deviceInfo.browser} on {session.deviceInfo.os}
                    </Typography>
                    <Box>
                      {session.token === localStorage.getItem('sessionToken') ? (
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          onClick={() => handleEndSession(session.token)}
                          sx={{ borderColor: '#f9d423', color: '#f9d423' }}
                        >
                          Log Out
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleEndSession(session.token)}
                          sx={{ borderColor: '#ff4444', color: '#ff4444' }}
                        >
                          End Session
                        </Button>
                      )}
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    IP: {session.deviceInfo.ip} • Location: {session.deviceInfo.location}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Last active: {formatLastActive(session.lastActivity)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Section>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <SaveButton
          variant="contained"
          startIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : <Save />}
          onClick={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </SaveButton>
      </Box>

      <Dialog
        open={confirmEndSession.open}
        onClose={() => setConfirmEndSession({ open: false, token: null })}
      >
        <DialogTitle>End Session</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to end this session? This will log out the device associated with this session.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmEndSession({ open: false, token: null })} sx={{ color: 'white' }}>
            Cancel
          </Button>
          <SaveButton onClick={confirmEndSessionHandler}>
            End Session
          </SaveButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%', bgcolor: snackbar.severity === 'success' ? 'rgba(46, 125, 50, 0.9)' : 'rgba(211, 47, 47, 0.9)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccountSettings;


