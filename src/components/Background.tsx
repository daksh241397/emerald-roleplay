import styled from '@emotion/styled';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-EMERALDex: -1;
  background:
    /* EMERALD background image */
    url('/assets/EMERALDbg.png') center center / cover no-repeat fixed,
    /* fallback gradient */
    radial-gradient(circle at center, #0a0a0f 0%, #000000 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      /* Grid pattern */
      linear-gradient(rgba(255, 140, 0, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 140, 0, 0.03) 1px, transparent 1px),
      /* Noise texture */
      url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"),
      /* Diagonal lines */
      repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.01) 0px, rgba(255, 140, 0, 0.01) 1px, transparent 1px, transparent 10px);
    background-size: 50px 50px, 50px 50px, 200px 200px, 100px 100px;
    background-position: center center;
    background-attachment: fixed;
    opacity: 0.7;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 200px;
    background-image: 
      /* Light dots */
      radial-gradient(circle at 50% 50%, rgba(255, 140, 0, 0.15) 0%, transparent 0.5%),
      radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.1) 0%, transparent 0.8%),
      radial-gradient(circle at 20% 70%, rgba(255, 140, 0, 0.12) 0%, transparent 0.6%);
    background-size: 3px 3px, 100px 100px, 150px 150px;
    background-position: center center, center center, center center;
    background-repeat: repeat, no-repeat, no-repeat;
    opacity: 0.8;
  }

  /* Vignette effect */
  box-shadow: inset 0 0 150px rgba(0, 0, 0, 0.8);
`;

const Background = () => {
  return <BackgroundContainer />;
};

export default Background;