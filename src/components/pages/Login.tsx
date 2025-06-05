import styled from '@emotion/styled';
import { Typography, Container, Box, Paper, TextField, Button, Checkbox, FormControlLabel, IconButton, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const PageContainer = styled(Box)`
  padding-top: 84px;
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginContainer = styled(Paper)`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 3rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(249, 212, 35, 0.1);
  max-width: 400px;
  width: 100%;
`;

const Logo = styled(Typography)`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(249, 212, 35, 0.3);
`;

const Tagline = styled(Typography)`
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 1.5rem;
  
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
  
  .MuiInputAdornment-root {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const LoginButton = styled(Button)`
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  color: black;
  font-weight: bold;
  padding: 0.8rem;
  margin-top: 1rem;
  width: 100%;
  
  &:hover {
    background: linear-gradient(45deg, #ff4e50, #f9d423);
  }
`;

const StyledLink = styled(Link)`
  color: #f9d423;
  text-decoration: none;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RegisterLink = styled(Button)`
  color: #f9d423;
  border: 1px solid #f9d423;
  margin-top: 1rem;
  width: 100%;
  
  &:hover {
    background-color: rgba(249, 212, 35, 0.1);
  }
`;

const StyledRegisterLink = styled(Link)`
  text-decoration: none;
  width: 100%;
  display: block;
`;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<{username: string; password: string}>({
    username: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(credentials.username, credentials.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Container maxWidth="sm">
        <LoginContainer>
          <Logo variant="h1">EMERALD RP</Logo>
          <Tagline variant="h6">Enter the Roleplay</Tagline>
          
          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              label="Username"
              name="username"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
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
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
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
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-checked': {
                        color: '#f9d423',
                      },
                    }}
                  />
                }
                label="Remember me"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              />
              <StyledLink to="/forgot-password">Forgot Password?</StyledLink>
            </Box>
            
            <LoginButton 
              type="submit" 
              variant="contained"
              disabled={loading}
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </LoginButton>
            
            {error && (
              <Typography 
                color="error" 
                sx={{ mt: 2, textAlign: 'center' }}
              >
                {error}
              </Typography>
            )}
            
            <StyledRegisterLink to="/register">
              <RegisterLink variant="outlined">
                REGISTER
              </RegisterLink>
            </StyledRegisterLink>
          </form>
        </LoginContainer>
      </Container>
    </PageContainer>
  );
};

export default Login;