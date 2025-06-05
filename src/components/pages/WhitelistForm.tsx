import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Snackbar, 
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { sendWhitelistApplication, LoginCredentials } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const FormContainer = styled(Paper)`
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(12px);
  padding: 2.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  margin: 0 auto;
`;

const GradientText = styled(Typography)`
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 2rem;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 1.5rem;
  
  .MuiOutlinedInput-root {
    color: white;
    background: rgba(0, 0, 0, 0.2);
    
    fieldset {
      border-color: rgba(255, 255, 255, 0.1);
    }
    
    &:hover fieldset {
      border-color: rgba(249, 212, 35, 0.3);
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

  .MuiInputBase-input {
    color: white !important;
    caret-color: #f9d423 !important;
    &::placeholder {
      color: rgba(255, 255, 255, 0.5) !important;
    }
  }

  .MuiInputBase-inputMultiline {
    color: white !important;
    caret-color: #f9d423 !important;
    &::placeholder {
      color: rgba(255, 255, 255, 0.5) !important;
    }
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  color: black;
  font-weight: bold;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    background: linear-gradient(45deg, #ff4e50, #f9d423);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.3);
  }
`;

const FormSection = styled(Box)`
  margin-bottom: 2rem;
`;

const SectionTitle = styled(Typography)`
  color: #f9d423;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const DiscordButton = styled(Button)`
  background: #5865F2;
  color: white;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  text-transform: none;
  width: 100%;
  
  &:hover {
    background: #4752C4;
  }
  
  .MuiButton-startIcon {
    margin-right: 12px;
    margin-left: 0;
  }
  
  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }
`;

const OrDivider = styled(Box)`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: rgba(255, 255, 255, 0.5);
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  span {
    padding: 0 1rem;
  }
`;

const LoginSection = styled(Box)`
  margin-bottom: 2rem;
`;

const LoginButton = styled(Button)`
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  color: black;
  font-weight: bold;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    background: linear-gradient(45deg, #ff4e50, #f9d423);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.3);
  }
`;

const WhitelistForm = () => {
  const location = useLocation();
  const { login: authLogin } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    discordId: '',
    gamingId: '',
    age: '',
    rpExperience: '',
    motivation: ''
  });
  
  const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
  const REDIRECT_URI = `${window.location.origin}/auth/discord/callback`;

  const handleDiscordLogin = () => {
    const scope = 'identify';
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${scope}`;
    window.location.href = discordAuthUrl;
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar({ open: false, message: '', severity: 'success' });
    try {
      await authLogin(loginCredentials.username, loginCredentials.password);
      setSnackbar({
        open: true,
        message: 'Login successful!',
        severity: 'success'
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Login failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const discordUser = location.state?.discordUser || JSON.parse(localStorage.getItem('discordUser') || 'null');
    
    if (discordUser) {
      setFormData(prev => ({
        ...prev,
        name: discordUser.username,
        discordId: `${discordUser.username}#${discordUser.discriminator}`
      }));
      localStorage.removeItem('discordUser');
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar({ open: false, message: '', severity: 'success' });
    
    try {
      await sendWhitelistApplication(formData);
      setSnackbar({
        open: true,
        message: 'Application submitted successfully! We will review your application and contact you soon.',
        severity: 'success'
      });
      setFormData({
        name: '',
        discordId: '',
        gamingId: '',
        age: '',
        rpExperience: '',
        motivation: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to submit application. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <FormContainer>
      <GradientText variant="h2">
        Whitelist Application
      </GradientText>

      <DiscordButton
        variant="contained"
        onClick={handleDiscordLogin}
        startIcon={
          <img 
            src="/discord.png" 
            alt="Discord" 
            style={{ 
              width: '24px', 
              height: '24px',
              objectFit: 'contain'
            }} 
          />
        }
      >
        Sign in with Discord
      </DiscordButton>

      <OrDivider>
        <span>or login with email</span>
      </OrDivider>

      <LoginSection>
        <form onSubmit={handleLoginSubmit}>
          <StyledTextField
            fullWidth
            label="Email"
            name="username"
            value={loginCredentials.username}
            onChange={handleLoginChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={loginCredentials.password}
            onChange={handleLoginChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoginButton
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </LoginButton>
        </form>
      </LoginSection>

      <OrDivider>
        <span>or fill out application manually</span>
      </OrDivider>
      
      <form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Personal Information</SectionTitle>
          <StyledTextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            InputProps={{
              style: { color: 'white' }
            }}
          />
          <StyledTextField
            fullWidth
            label="Discord ID (e.g., username#0000)"
            name="discordId"
            value={formData.discordId}
            onChange={handleChange}
            required
            variant="outlined"
            InputProps={{
              style: { color: 'white' }
            }}
          />
          <StyledTextField
            fullWidth
            label="Gaming Platform ID (Optional)"
            name="gamingId"
            value={formData.gamingId}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              style: { color: 'white' }
            }}
            helperText="Enter your ID from any platform: Steam (STEAM_0:0:123456789), Rockstar (PlayerName123), or Epic Games (PlayerName123)"
          />
          <StyledTextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
            variant="outlined"
            InputProps={{
              style: { color: 'white' }
            }}
          />
        </FormSection>

        <FormSection>
          <SectionTitle>Roleplay Experience</SectionTitle>
          <StyledTextField
            fullWidth
            label="Previous RP Experience"
            name="rpExperience"
            multiline
            rows={4}
            value={formData.rpExperience}
            onChange={handleChange}
            required
            placeholder="Tell us about your previous roleplay experience..."
            variant="outlined"
            InputProps={{
              style: { color: 'white' }
            }}
          />
        </FormSection>

        <FormSection>
          <SectionTitle>Motivation</SectionTitle>
          <StyledTextField
            fullWidth
            label="Why do you want to join EMERALD RP?"
            name="motivation"
            multiline
            rows={4}
            value={formData.motivation}
            onChange={handleChange}
            required
            placeholder="Tell us why you want to join our community..."
            variant="outlined"
            InputProps={{
              style: { color: 'white' }
            }}
          />
        </FormSection>

        <SubmitButton
          type="submit"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Application'}
        </SubmitButton>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </FormContainer>
  );
};

export default WhitelistForm; 