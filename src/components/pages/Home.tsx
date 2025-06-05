import styled from '@emotion/styled';
import { Container, Typography, Box } from '@mui/material';
import '@splinetool/viewer';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': any;
    }
  }
}

const PageContainer = styled(Box)`
  min-height: 100vh;
  background: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const HeroSection = styled.div`
  min-height: calc(100vh - 64px);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: transparent;
  padding: 2rem 0;

  spline-viewer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
  }

  .content {
    position: relative;
    z-index: 2;
    background: rgba(18, 18, 18, 0.5);
    padding: 3rem;
    border-radius: 1.5rem;
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    transform: translateY(-120px);
  }
`;

const GradientText = styled(Typography)`
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Home = () => {
  return (
    <PageContainer>
      <HeroSection>
        <div className="content">
          <Container>
            <GradientText variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, mb: 2 }}>
              𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐭𝐨 𝐄𝐌𝐄𝐑𝐀𝐋𝐃 𝐑𝐏
            </GradientText>
            <Typography variant="h5" color="white" sx={{ mb: 4 }}>
              𝓔𝔁𝓹𝓮𝓻𝓲𝓮𝓷𝓬𝓮 𝓽𝓱𝓮 𝓷𝓮𝔁𝓽 𝓵𝓮𝓿𝓮𝓵 𝓸𝓯 𝓡𝓸𝓵𝓮𝓹𝓵𝓪𝔂
            </Typography>
            <Typography variant="body1" color="white" sx={{ mb: 4, maxWidth: '800px', margin: '0 auto' }}>
              Welcome to Emerald Roleplay – Access is exclusive. Submit your whitelist application below to become a part of our Best RP experience.
              Only the best make it in.
            </Typography>
          </Container>
        </div>
      </HeroSection>
    </PageContainer>
  );
};

export default Home;