import { AppBar, Toolbar, Typography, Button, IconButton, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation, LinkProps, useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';

const glitch = keyframes`
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
`;

const pulse = keyframes`
  0% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 0.8; transform: scale(1); }
`;

const particleAnimation = keyframes`
  0% { transform: translate(0, 0) scale(0); opacity: 1; }
  100% { transform: translate(var(--x), var(--y)) scale(1); opacity: 0; }
`;

interface Particle {
  id: number;
  x: number;
  y: number;
}

interface NavItem {
  text: string;
  path: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface ButtonLinkProps extends LinkProps {
  className?: string;
}

const StyledAppBar = styled(AppBar)`
  background: linear-gradient(180deg, #000000 0%, #121212 100%);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`;

const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

const LogoImage = styled('img')`
  height: 32px; // Adjust size as needed
  margin-right: 8px; // Space between image and text
`;

const Logo = styled(Typography)`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(249, 212, 35, 0.3);
  animation: ${pulse} 3s infinite ease-in-out;
  position: relative;
  
  &:before {
    content: '𝗘𝗠𝗘𝗥𝗔𝗟𝗗 𝗥𝗣';
    position: absolute;
    left: 0;
    text-shadow: 2px 0 #f9d423;
    clip: rect(44px, 450px, 56px, 0);
    animation: ${glitch} 3s infinite linear alternate-reverse;
  }
`;

const Particle = styled.div<{ x: number; y: number }>`
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  border-radius: 50%;
  pointer-events: none;
  animation: ${particleAnimation} 1s ease-out forwards;
  transform: translate(${props => props.x}px, ${props => props.y}px);
`;

const NavButton = styled(Button)<ButtonLinkProps>`
  text-decoration: none;
  color: #ffffff;
  margin: 0 8px;
  position: relative;
  transition: color 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 50%;
    background: linear-gradient(45deg, #f9d423, #ff4e50);
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:hover {
    color: #f9d423;
    text-shadow: 0 0 8px rgba(249, 212, 35, 0.5);
  }
  
  &:hover:after {
    width: 100%;
  }
  
  &.active {
    color: #f9d423;
    animation: ${pulse} 2s infinite ease-in-out;
    
    &:after {
      width: 100%;
    }
  }
`;

const LoginButton = styled(Button)<ButtonLinkProps>`
  margin-left: 16px;
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  color: black;
  font-weight: bold;
  padding: 6px 16px;
  
  &:hover {
    background: linear-gradient(45deg, #ff4e50, #f9d423);
  }
`;

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const createParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        newParticles.push({
          id: Date.now() + i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance
        });
      }
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1000);
    };
    // createParticles(); // Disable particle effect for now if not needed
  }, [location.pathname]);

  const handleWhitelistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/whitelist');
  };

  const navigationItems = [
    { text: 'Home', path: '/' },
    { text: 'Rules', path: '/rules' },
    { text: 'Whitelist Application', path: '/whitelist', onClick: handleWhitelistClick },
    ...(isAuthenticated ? [{ text: 'Dashboard', path: '/dashboard' }] : []),
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
       <ListItem>
          <LogoContainer sx={{ pl: 2 }}>
            <LogoImage src="/assets/logo.png" alt="Emerald RP Logo" />
            <Logo variant="h6" sx={{ fontSize: '1.5rem' }}>𝗘𝗠𝗘𝗥𝗔𝗟𝗗 𝗥𝗣</Logo>
          </LogoContainer>
        </ListItem>
      {navigationItems.map((item) => (
        <ListItem
          key={item.text}
          onClick={handleDrawerToggle}
          component={Link}
          to={item.path}
          sx={{ textDecoration: 'none' }}
        >
          <ListItemText 
            primary={item.text}
            sx={{ 
              color: '#ffffff',
              '& .MuiTypography-root': {
                fontSize: '1.2rem',
                fontWeight: 500
              }
            }}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <StyledToolbar>
           <LogoContainer>
            <LogoImage src="/assets/logo.png" alt="Emerald RP Logo" />
            <Logo variant="h6">𝗘𝗠𝗘𝗥𝗔𝗟𝗗 𝗥𝗣</Logo>
          </LogoContainer>
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {navigationItems.map((item) => (
                <NavButton
                  key={item.text}
                  component={Link}
                  to={item.path}
                  onClick={item.onClick}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  {item.text}
                </NavButton>
              ))}
            </div>
          )}
        </StyledToolbar>
      </StyledAppBar>
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;