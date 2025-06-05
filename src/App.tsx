import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Background from './components/Background';
import Layout, { MainContent } from './components/layout/Layout';
import Navigation from './components/layout/Navigation';
import CursorEffects from './components/CursorEffects';
import Home from './components/pages/Home';
import Rules from './components/pages/Rules';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import { AuthProvider } from './context/AuthContext';
import { ForumProvider } from './context/ForumContext';
import Dashboard from './components/pages/Dashboard';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme';
import ForgotPassword from './components/pages/ForgotPassword';
import { useEffect } from 'react';
import { addBlurBehaviorToContainer } from './utils/cursorUtils';
import DiscordCallback from './components/pages/DiscordCallback';
import { CssBaseline } from '@mui/material';
import WhitelistForm from './components/pages/WhitelistForm';

function AppContent() {
  useEffect(() => {
    // Apply blur behavior to the entire document
    addBlurBehaviorToContainer(document.body);
  }, []);

  return (
    <Layout>
      {/* <CursorEffects /> */}
      <Navigation />
      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/discord/callback" element={<DiscordCallback />} />
          <Route path="/whitelist" element={<WhitelistForm />} />
        </Routes>
      </MainContent>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <ForumProvider>
            <Background />
            <AppContent />
          </ForumProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App
