import { ReactNode, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen';

interface LayoutProps {
  children: ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: #121212;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  padding-top: 64px; /* Account for fixed AppBar height */
  
  @media (max-width: 600px) {
    padding-top: 56px; /* Adjust for mobile AppBar height */
  }
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  z-EMERALDex: 1;
`;

const Layout = ({ children }: LayoutProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (mounted) {
        setIsLoading(false);
      }
    }, 1500);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [location]);

  useEffect(() => {
    return () => setIsLoading(false);
  }, []);

  return (
    <LayoutContainer>
      <LoadingScreen
        isLoading={isLoading}
        onLoadingComplete={() => setIsLoading(false)}
      />
      {children}
    </LayoutContainer>
  );
};

export { MainContent };
export default Layout;