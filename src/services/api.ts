import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  email: string;
}

export interface WhitelistApplication {
  name: string;
  discordId: string;
  gamingId: string;
  age: string;
  rpExperience: string;
  motivation: string;
}

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
}

export const login = async (credentials: LoginCredentials) => {
  try {
    if (!credentials.username || !credentials.password) {
      throw new Error('Username and password are required');
    }
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data.message || 'Invalid credentials';
      if (error.response.status === 401) {
        throw new Error('Invalid username or password');
      } else if (error.response.status === 400) {
        throw new Error(errorMessage);
      }
      throw new Error('Login failed. Please try again.');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const register = async (data: RegisterData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const sendWhitelistApplication = async (data: WhitelistApplication) => {
  try {
    const response = await axios.post(`${API_URL}/whitelist/apply`, data);
    return response.data;
  } catch (error) {
    console.error('Error submitting whitelist application:', error);
    throw error;
  }
};

export const handleDiscordCallback = async (code: string): Promise<DiscordUser> => {
  try {
    const response = await axios.post(`${API_URL}/auth/discord/callback`, { code });
    return response.data;
  } catch (error) {
    console.error('Error handling Discord callback:', error);
    throw error;
  }
};