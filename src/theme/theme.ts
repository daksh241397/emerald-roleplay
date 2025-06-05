import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f9d423',
      light: '#fae57c',
      dark: '#c4a91c'
    },
    secondary: {
      main: '#ff4e50',
      light: '#ff7173',
      dark: '#c83e3f'
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: '#f9d423'
    },
    h2: {
      color: '#f9d423'
    },
    h3: {
      color: '#f9d423'
    },
    h4: {
      color: '#f9d423'
    },
    h5: {
      color: '#f9d423'
    },
    h6: {
      color: '#f9d423'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none'
        },
        contained: {
          backgroundColor: '#f9d423',
          color: '#121212',
          '&:hover': {
            backgroundColor: '#fae57c'
          }
        },
        outlined: {
          borderColor: '#f9d423',
          color: '#f9d423',
          '&:hover': {
            borderColor: '#fae57c',
            color: '#fae57c'
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#f9d423',
          '&:hover': {
            backgroundColor: 'rgba(249, 212, 35, 0.08)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          backgroundImage: 'none'
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(249, 212, 35, 0.08)'
          }
        }
      }
    }
  }
});
