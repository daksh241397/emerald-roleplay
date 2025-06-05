import styled from '@emotion/styled';
import { Typography, Container, Box, Paper, TextField, Button, Checkbox, FormControlLabel, Stepper, Step, StepLabel, IconButton, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { register } from '../../services/api';

import { Visibility, VisibilityOff, Person, Person2, Lock, Email } from '@mui/icons-material';
import DiscordIcon from '../icons/DiscordIcon';

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

const RegisterContainer = styled(Paper)`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 3rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(249, 212, 35, 0.1);
  max-width: 600px;
  width: 100%;
`;

const Logo = styled(Typography)`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(249, 212, 35, 0.3);
`;

const StyledStepper = styled(Stepper)`
  margin-bottom: 2rem;
  
  .MuiStepLabel-label {
    color: rgba(255, 255, 255, 0.7);
    
    &.Mui-active {
      color: #f9d423;
    }
    
    &.Mui-completed {
      color: #ff4e50;
    }
  }
  
  .MuiStepIcon-root {
    color: rgba(255, 255, 255, 0.3);
    
    &.Mui-active {
      color: #f9d423;
    }
    
    &.Mui-completed {
      color: #ff4e50;
    }
  }
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

const ActionButton = styled(Button)`
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  color: black;
  font-weight: bold;
  padding: 0.8rem;
  margin-top: 1rem;
  
  &:hover {
    background: linear-gradient(45deg, #ff4e50, #f9d423);
  }
  
  &.secondary {
    background: transparent;
    color: #f9d423;
    border: 1px solid #f9d423;
    
    &:hover {
      background-color: rgba(249, 212, 35, 0.1);
    }
  }
`;

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
`;

const InfoText = styled(Typography)`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    characterName: '',
    discordId: '',
    age18Plus: false,
    termsAccepted: false
  });

  const clearError = () => setError('');

  const steps = ['Account Info', 'Character Basics', 'Verification'];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age18Plus' || name === 'termsAccepted' ? checked : value
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.age18Plus) {
        throw new Error('You must confirm that you are 18 years or older');
      }
      if (!formData.termsAccepted) {
        throw new Error('You must accept the terms of service');
      }

      const { username, email, password } = formData;
      const response = await register({ username, email, password });
      
      if (response.success) {
        // TODO: Add character creation endpoint to backend API
        // const { characterName, discordId } = formData;
        // await createCharacter(userData.id, characterName, discordId);
      }

      // Redirect to login page or dashboard
      window.location.href = '/login';
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <InfoText>
              Create your account to join the EMERALD RP community. Choose a unique username
              and provide a secure password.
            </InfoText>
            <StyledTextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
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
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
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
          </>
        );
      case 1:
        return (
          <>
            <InfoText>
              Create your character's basic information. This will be your identity
              in the roleplay world.
            </InfoText>
            <StyledTextField
              fullWidth
              label="Character Name"
              name="characterName"
              value={formData.characterName}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person2 />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              fullWidth
              label="Discord ID"
              name="discordId"
              value={formData.discordId}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DiscordIcon />
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
      case 2:
        return (
          <>
            <InfoText>
              Please verify your age and accept our terms of service to complete
              your registration.
            </InfoText>
            <FormControlLabel
              control={
                <Checkbox
                  name="age18Plus"
                  checked={formData.age18Plus}
                  onChange={handleChange}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-checked': {
                      color: '#f9d423',
                    },
                  }}
                />
              }
              label="I confirm that I am 18 years or older"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-checked': {
                      color: '#f9d423',
                    },
                  }}
                />
              }
              label="I accept the terms of service and community guidelines"
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <Container maxWidth="md">
        <RegisterContainer>
          <Logo variant="h1">EMERALD RP</Logo>
          <StyledStepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </StyledStepper>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <Typography
                color="error"
                sx={{
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  padding: '1rem',
                  borderRadius: '4px',
                  marginBottom: '1rem'
                }}
              >
                {error}
              </Typography>
            )}
            {getStepContent(activeStep)}
            
            <ButtonContainer>
              <ActionButton
                className="secondary"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </ActionButton>
              
              {activeStep === steps.length - 1 ? (
                <ActionButton 
                  type="submit" 
                  variant="contained" 
                  disabled={isLoading}
                  onClick={clearError}
                >
                  {isLoading ? 'Processing...' : 'Complete Registration'}
                </ActionButton>
              ) : (
                <ActionButton onClick={handleNext} variant="contained">
                  Next
                </ActionButton>
              )}
            </ButtonContainer>
          </form>
        </RegisterContainer>
      </Container>
    </PageContainer>
  );
};

export default Register;