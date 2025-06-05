import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const cursorGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(249, 212, 35, 0.5), inset 0 0 2px rgba(249, 212, 35, 0.3); }
  50% { box-shadow: 0 0 15px rgba(249, 212, 35, 0.8), inset 0 0 4px rgba(249, 212, 35, 0.5); }
  100% { box-shadow: 0 0 5px rgba(249, 212, 35, 0.5), inset 0 0 2px rgba(249, 212, 35, 0.3); }
`;

const particleFade = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(0); opacity: 0; }
`;

const rippleEffect = keyframes`
  0% { transform: scale(0); opacity: 0.8; }
  100% { transform: scale(4); opacity: 0; }
`;

const targetRing = keyframes`
  0% { transform: scale(0.8); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(0.8); opacity: 0.6; }
`;

const Cursor = styled.div`
  width: 20px;
  height: 20px;
  background: transparent;
  border: 2px solid rgba(249, 212, 35, 0.8);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-EMERALDex: 10000;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  animation: ${cursorGlow} 2s infinite;
  mix-blend-mode: difference;
  filter: drop-shadow(0 0 2px rgba(249, 212, 35, 0.3));

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    background: rgba(249, 212, 35, 0.8);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 1px solid rgba(249, 212, 35, 0.4);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.2s ease;
  }

  &.hovering {
    transform: scale(1.2);
    background: rgba(249, 212, 35, 0.1);
    backdrop-filter: blur(4px);
    cursor: pointer;
    
    &::before {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.2);
    }

    &::after {
      opacity: 1;
      animation: ${targetRing} 2s infinite;
      border-width: 2px;
    }
  }

  &.clicking {
    transform: scale(0.9);
    background: rgba(249, 212, 35, 0.2);
  }
`;

const CursorParticle = styled.div`
  position: fixed;
  width: 4px;
  height: 4px;
  background: rgba(249, 212, 35, 0.6);
  border-radius: 50%;
  pointer-events: none;
  z-EMERALDex: 9998;
  animation: ${particleFade} 0.6s ease-out forwards;
  filter: blur(1px);
  will-change: transform, opacity;
`;

const ClickRipple = styled.div`
  position: fixed;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(249, 212, 35, 0.6);
  border-radius: 50%;
  pointer-events: none;
  z-EMERALDex: 9997;
  animation: ${rippleEffect} 0.6s ease-out forwards;
`;

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

const CursorEffects = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const [particleCounter, setParticleCounter] = useState(0);

  useEffect(() => {
    const addParticle = (x: number, y: number) => {
      const particle = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${particleCounter}`,
        x,
        y,
        opacity: 0.8,
      };
      setParticleCounter(prev => prev + 1);
      setParticles(prev => [...prev, particle]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== particle.id));
      }, 600);
    };

    const updateCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isNavElement = target.closest('nav, button, a');
      setIsHovering(!!isNavElement);
      setPosition({ x: e.clientX - 10, y: e.clientY - 10 });
      if (Math.random() > 0.7) {
        addParticle(e.clientX - 2, e.clientY - 2);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const clickEffect = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${particleCounter}`,
        x: e.clientX - 10,
        y: e.clientY - 10,
      };
      setParticleCounter(prev => prev + 1);
      setClickEffects(prev => [...prev, clickEffect]);
      setTimeout(() => {
        setClickEffects(prev => prev.filter(effect => effect.id !== clickEffect.id));
      }, 600);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, [role="button"], [data-clickable]')) {
        setIsHovering(true);
        target.style.cursor = 'none';
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      <Cursor
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        className={`${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
      />
      {particles.map(particle => (
        <CursorParticle
          key={particle.id}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
          }}
        />
      ))}
      {clickEffects.map(effect => (
        <ClickRipple
          key={effect.id}
          style={{
            left: `${effect.x}px`,
            top: `${effect.y}px`,
          }}
        />
      ))}
    </>
  );
};

export default CursorEffects;