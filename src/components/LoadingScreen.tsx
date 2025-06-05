import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const pulse = keyframes`
  0% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 0.8; transform: scale(1); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const particleAnimation = keyframes`
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x), var(--y)) scale(1);
    opacity: 0;
  }
`;

const LoadingContainer = styled.div<{ isExiting: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-EMERALDex: 9999;
  animation: ${({ isExiting }) => (isExiting ? fadeOut : fadeIn)} 0.5s ease-in-out;
`;

const Logo = styled.div`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3rem;
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(249, 212, 35, 0.3);
  animation: ${pulse} 2s infinite ease-in-out;
  margin-bottom: 20px;
`;

const LoadingEMERALDicator = styled.div`
  width: 80px;
  height: 80px;
  border: 3px solid #1a1a1a;
  border-top: 3px solid #f9d423;
  border-right: 3px solid #ff4e50;
  border-radius: 50%;
  animation: ${rotate} 1.5s linear infinite;
  margin-bottom: 20px;
`;

const LoadingText = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  color: #ffffff;
  opacity: 0.8;
  margin-top: 20px;
  letter-spacing: 1px;
`;

const Particle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  border-radius: 50%;
  pointer-events: none;
  animation: ${particleAnimation} 1.5s ease-out forwards;
`;

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading, onLoadingComplete }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [loadingText, setLoadingText] = useState('Loading Page ...');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        onLoadingComplete();
        setParticles([]);
        setIsExiting(false);
      }, 500);
      return () => {
        clearTimeout(timer);
        setIsExiting(false);
        setParticles([]);
      };
    }
  }, [isLoading, onLoadingComplete]);

  useEffect(() => {
    if (isLoading && !isExiting) {
      const texts = [
        'Loading Page ...',
        'Please Wait...',
        'Website Loading Soon...'
      ];
      let currentEMERALDex = 0;

      const textInterval = setInterval(() => {
        currentEMERALDex = (currentEMERALDex + 1) % texts.length;
        setLoadingText(texts[currentEMERALDex]);
      }, 3000);

      return () => clearInterval(textInterval);
    }
  }, [isLoading, isExiting]);

  useEffect(() => {
    if (isLoading && !isExiting) {
      const createParticles = () => {
        const newParticles = [];
        for (let i = 0; i < 5; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = 100 + Math.random() * 50;
          newParticles.push({
            id: Date.now() + i,
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance
          });
        }
        setParticles(prev => [...prev, ...newParticles]);
      };

      const particleInterval = setInterval(createParticles, 500);
      const cleanupInterval = setInterval(() => {
        setParticles(prev => prev.slice(-20));
      }, 1500);

      return () => {
        clearInterval(particleInterval);
        clearInterval(cleanupInterval);
        setParticles([]);
      };
    } else if (!isLoading) {
      setParticles([]);
    }
  }, [isLoading, isExiting]);

  if (!isLoading && !isExiting) return null;

  return (
    <LoadingContainer isExiting={isExiting}>
      <LoadingEMERALDicator />
      {particles.map(particle => (
        <Particle
          key={particle.id}
          style={{
            '--x': `${particle.x}px`,
            '--y': `${particle.y}px`
          } as React.CSSProperties}
        />
      ))}
      <LoadingText>{loadingText}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingScreen;