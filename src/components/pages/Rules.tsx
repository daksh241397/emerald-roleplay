import styled from '@emotion/styled';
import { Container, Typography, Paper, Box } from '@mui/material';

const GradientText = styled(Typography)`
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 3rem;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3.5rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(249, 212, 35, 0.2);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(45deg, #f9d423, #ff4e50);
    border-radius: 2px;
  }

  @media (max-width: 600px) {
    font-size: 2.5rem;
  }
`;

const RuleSection = styled(Paper)`
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(12px);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const RuleTitle = styled(Typography)`
  color: #f9d423;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const RuleText = styled(Typography)`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  line-height: 1.6;
`;

const Rules = () => {
  const rules = [
    {
      title: "Serious RP Is Mandatory",
      text: "Whitelisted players must always maintain serious and immersive roleplay. Troll or casual RP is not allowed."
    },
    {
      title: "Violation of Server Rules = Whitelist Removal",
      text: "If you break any key RP rules (RDM, VDM, Meta Gaming, Powergaming, etc.), your whitelist will be revoked without warning."
    },
    {
      title: "Inactivity Can Lead to Removal",
      text: "Long inactivity (7 to 15 days) without informing staff may result in removal from the whitelist."
    },
    {
      title: "Respect Staff & Other Players",
      text: "Disrespecting staff or community members can lead to instant blacklist from whitelist."
    },
    {
      title: "Alt Accounts Are Strictly Prohibited",
      text: "Only one account is allowed. Alternate accounts will lead to disqualification and bans."
    },
    {
      title: "Do Not Share Whitelist Access",
      text: "Sharing your account or whitelist access with others is strictly forbidden."
    },
    {
      title: "RP Quality Will Be Monitored",
      text: "If your roleplay is consistently unrealistic or low quality, your whitelist may be removed."
    },
    {
      title: "Whitelist is a Privilege, Not a Right",
      text: "Staff reserves full right to revoke whitelist access at any time without needing to justify."
    },
    {
      title: "Stay Active on Discord",
      text: "Reading announcements and staying active on our Discord is mandatory for whitelisted players."
    },
    {
      title: "Report Rule-Breakers Immediately",
      text: "As a whitelisted player, you are expected to report anyone breaking rules to help maintain RP standards."
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <GradientText variant="h1">
        Whitelist Rules – Emerald Roleplay
      </GradientText>
      
      <Box>
        {rules.map((rule, index) => (
          <RuleSection key={index} elevation={1}>
            <RuleTitle variant="h5">
              {rule.title}
            </RuleTitle>
            <RuleText variant="body1">
              {rule.text}
            </RuleText>
          </RuleSection>
        ))}
      </Box>
    </Container>
  );
};

export default Rules;