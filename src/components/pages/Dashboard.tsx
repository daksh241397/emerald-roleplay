import styled from '@emotion/styled';
import { useState } from 'react';
import { Box, Container, Paper, Typography, Tabs, Tab, Avatar, Badge } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Person, Settings, AdminPanelSettings, Forum as ForumIcon } from '@mui/icons-material';
import AccountSettings from './dashboard/AccountSettings';
import Forum from './dashboard/Forum';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 0.8; transform: scale(1); }
`;

const PageContainer = styled(Box)`
  padding-top: 84px;
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-y: auto;
`;

const DashboardHeader = styled(Paper)`
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(18, 18, 18, 0.8) 100%);
  backdrop-filter: blur(5px);
  padding: 2rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(249, 212, 35, 0.1);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled(Typography)`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.5rem;
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(249, 212, 35, 0.3);
  animation: ${pulse} 3s infinite ease-in-out;
`;

const UserInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatusBadge = styled(Badge)`
  .MuiBadge-badge {
    background-color: #4caf50;
    box-shadow: 0 0 0 2px #121212;
  }
`;

const StyledTabs = styled(Tabs)`
  .MuiTabs-EMERALDicator {
    background: linear-gradient(45deg, #f9d423, #ff4e50);
  }
`;

const StyledTab = styled(Tab)`
  color: rgba(255, 255, 255, 0.7);
  
  &.Mui-selected {
    color: #f9d423;
  }
  
  &:hover {
    color: #f9d423;
    text-shadow: 0 0 8px rgba(249, 212, 35, 0.5);
  }
`;

const ContentSection = styled(Paper)`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  padding: 2rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(249, 212, 35, 0.1);
  min-height: 500px;
`;

interface TabPanelProps {
  children?: React.ReactNode;
  EMERALDex: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, EMERALDex, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== EMERALDex}
      id={`dashboard-tabpanel-${EMERALDex}`}
      aria-labelledby={`dashboard-tab-${EMERALDex}`}
      {...other}
    >
      {value === EMERALDex && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(EMERALDex: number) {
  return {
    id: `dashboard-tab-${EMERALDex}`,
    'aria-controls': `dashboard-tabpanel-${EMERALDex}`,
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <PageContainer>
      <Container maxWidth="xl">
        <DashboardHeader>
          <Title variant="h1">DASHBOARD</Title>
          <UserInfo>
            <StatusBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  border: '2px solid #f9d423',
                  backgroundColor: 'rgba(249, 212, 35, 0.1)',
                }}
              >
                <Person sx={{ fontSize: 32 }} />
              </Avatar>
            </StatusBadge>
            <Box>
              <Typography variant="h6" sx={{ color: '#f9d423' }}>
                {user?.username || 'Guest'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Online
              </Typography>
            </Box>
          </UserInfo>
        </DashboardHeader>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <StyledTabs
              value={value}
              onChange={handleChange}
              aria-label="dashboard navigation"
              variant="scrollable"
              scrollButtons="auto"
            >
              <StyledTab icon={<ForumIcon />} label="Forum" {...a11yProps(0)} />
              <StyledTab icon={<Settings />} label="Account" {...a11yProps(1)} />
              <StyledTab icon={<AdminPanelSettings />} label="Admin" {...a11yProps(2)} />
            </StyledTabs>
          </Box>

          <ContentSection>
            <TabPanel value={value} EMERALDex={0}>
              <Forum />
            </TabPanel>
            <TabPanel value={value} EMERALDex={1}>
              <AccountSettings />
            </TabPanel>
            <TabPanel value={value} EMERALDex={2}>
              <Box sx={{ p: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                Moderation tools and user management coming soon...
              </Box>
            </TabPanel>
          </ContentSection>
        </Box>
      </Container>
    </PageContainer>
  );
};

export default Dashboard;