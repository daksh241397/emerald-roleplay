import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { handleDiscordCallback } from '../../services/api';

const DiscordCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const code = new URLSearchParams(location.search).get('code');
      
      if (!code) {
        navigate('/');
        return;
      }

      try {
        const userData = await handleDiscordCallback(code);
        // Store the user data in localStorage or state management
        localStorage.setItem('discordUser', JSON.stringify(userData));
        navigate('/', { state: { discordUser: userData } });
      } catch (error) {
        console.error('Discord authentication failed:', error);
        navigate('/');
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <CircularProgress />
    </Box>
  );
};

export default DiscordCallback; 