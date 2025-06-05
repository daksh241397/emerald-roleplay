import { register, login } from '../services/api';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: Date;
  last_login: Date;
}

export interface Character {
  id: string;
  user_id: string;
  character_name: string;
  discord_id: string;
  created_at: Date;
}

export interface UserSettings {
  user_id: string;
  remember_me: boolean;
  theme: string;
}

export const createUser = async (username: string, email: string, password: string): Promise<User> => {
  try {
    // Validate input
    if (!username || !email || !password) {
      throw new Error('All fields are required');
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      throw new Error('Invalid email format');
    }

    // Register user through API
    const response = await register({ username, email, password });
    return response.user;
  } catch (error) {
    throw error instanceof Error ? error : new Error('An unexpected error occurred during user creation');
  }
};

export const validateUser = async (username: string, password: string): Promise<User | null> => {
  try {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    const response = await login({ username, password });
    return response.user;
  } catch (error) {
    throw error instanceof Error ? error : new Error('An unexpected error occurred during validation');
  }
};

export const createCharacter = async (userId: string, name: string, discordId: string): Promise<Character> => {
  try {
    if (!userId || !name || !discordId) {
      throw new Error('All character fields are required');
    }

    const response = await axios.post(`${API_URL}/characters`, { userId, name, discordId });
    return response.data.character;
  } catch (error) {
    throw error instanceof Error ? error : new Error('An unexpected error occurred while creating character');
  }
};

export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/settings`);
    return response.data.settings || null;
  } catch (error) {
    throw error instanceof Error ? error : new Error('An unexpected error occurred while fetching user settings');
  }
};

export const updateUserSettings = async (userId: string, settings: Partial<UserSettings>): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/users/${userId}/settings`, settings);
  } catch (error) {
    throw error instanceof Error ? error : new Error('An unexpected error occurred while updating user settings');
  }
};