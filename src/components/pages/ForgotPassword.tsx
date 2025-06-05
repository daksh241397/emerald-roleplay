import styled from '@emotion/styled';
import { Typography, Box, Paper, TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Email } from '@mui/icons-material';

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

const ResetContainer = styled(Paper)`
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

const Description = styled(Typography)`
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

const ActionButton = styled(Button)`
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  color: black;
  font-weight: bold;
  padding: 0.8rem;
  margin-top: 1rem;
  width: 100%;
  
  &:hover {
    background: linear-gradient(45deg, #ff4e50, #f9d423);
  }

  &.Mui-disabled {
    background: rgba(249, 212, 35, 0.3);
    color: rgba(0, 0, 0, 0.5);
  }
`;

const StyledLink = styled(Link)`
  color: #f9d423;
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  text-align: center;
  margin-top: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Timer = styled(Typography)`
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const PasswordRequirements = styled(Typography)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Verification, 3: New Password
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  const handleSendCode = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:3000/api/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }

      setStep(2);
      // Start countdown timer
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:3000/api/password-reset/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode })
      });

      const data = await response.json();
      
      if (!response.ok || !data.valid) {
        throw new Error(data.message || 'Invalid verification code');
      }

      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:3000/api/password-reset/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: verificationCode,
          newPassword
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }

      // Auto redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <PageContainer>
      <ResetContainer>
        <Logo>EMERALD RP</Logo>
        {step === 1 && (
          <>
            <Description>
              Enter your email address and we'll send you a verification code to reset your password.
            </Description>
            <StyledTextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
              helperText={error}
              InputProps={{
                startAdornment: <Email sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }} />
              }}
            />
            <ActionButton
              onClick={handleSendCode}
              disabled={loading || !email}
            >
              {loading ? <CircularProgress size={24} /> : 'Send Verification Code'}
            </ActionButton>
          </>
        )}

        {step === 2 && (
          <>
            <Description>
              Enter the verification code sent to your email.
            </Description>
            <StyledTextField
              fullWidth
              label="Verification Code"
              variant="outlined"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <Timer>
              Time remaining: {formatTime(timeLeft)}
            </Timer>
            <ActionButton
              onClick={handleVerifyCode}
              disabled={loading || !verificationCode || timeLeft === 0}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify Code'}
            </ActionButton>
          </>
        )}

        {step === 3 && (
          <>
            <Description>
              Create your new password.
            </Description>
            <StyledTextField
              fullWidth
              type="password"
              label="New Password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <StyledTextField
              fullWidth
              type="password"
              label="Confirm New Password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <PasswordRequirements>
              Password must be at least 8 characters long and contain at least one uppercase letter,
              one lowercase letter, one number, and one special character.
            </PasswordRequirements>
            <ActionButton
              onClick={handleResetPassword}
              disabled={loading || !newPassword || !confirmPassword}
            >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </ActionButton>
          </>
        )}

        <StyledLink to="/login">
          Back to Login
        </StyledLink>
      </ResetContainer>
    </PageContainer>
  );
};

export default ForgotPassword;