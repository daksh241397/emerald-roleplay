import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const SessionExpirationWarning: React.FC = () => {
  const { sessionExpiring } = useAuth();

  return (
    <Snackbar
      open={sessionExpiring}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity="warning" variant="filled" sx={{ width: '100%' }}>
        Your session will expire soon. Please save your work and refresh the page to continue.
      </Alert>
    </Snackbar>
  );
};

export default SessionExpirationWarning;