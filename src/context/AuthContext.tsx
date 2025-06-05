import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { sessionManager } from '../utils/session';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  sessionExpiring: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiring, setSessionExpiring] = useState(false);
  const navigate = useNavigate();

  const checkSession = () => {
    const token = localStorage.getItem('sessionToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!token) return false;

    const session = sessionManager.validateSession(token);
    if (!session) {
      handleSessionExpired();
      return false;
    }

    setSessionExpiring(sessionManager.isSessionExpiring(token));
    sessionManager.refreshSession(token, refreshToken || undefined);
    return true;
  };

  const handleSessionExpired = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const isValidSession = checkSession();

    if (storedUser && isValidSession) {
      setUser(JSON.parse(storedUser));
    } else if (storedUser) {
      handleSessionExpired();
    }
    setLoading(false);

    const sessionCheckInterval = setInterval(checkSession, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(sessionCheckInterval);
  }, [navigate]);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiLogin({ username, password });
      if (response && response.token) {
        const decodedToken = jwtDecode(response.token) as { id: number; email: string };
        const user = {
          id: decodedToken.id,
          username: response.username || username,
          email: response.email || decodedToken.email,
          token: response.token
        };
        const deviceInfo = {
          userAgent: navigator.userAgent,
          ip: await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip)
        };
        const session = sessionManager.createSession(user.id, deviceInfo);
        localStorage.setItem('sessionToken', session.token);
        localStorage.setItem('refreshToken', session.refreshToken || '');
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    const token = localStorage.getItem('sessionToken');
    if (token) {
      sessionManager.invalidateSession(token);
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('sessionToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
        sessionExpiring
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};