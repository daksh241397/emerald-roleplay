import axios from 'axios';
import { UserData, CharacterData } from './userService';

const API_URL = 'http://localhost:3000/api';

export class UserApi {
  static async createUser(username: string, email: string, password: string): Promise<UserData> {
    try {
      const response = await axios.post(`${API_URL}/users`, {
        username,
        email,
        password
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to create user');
      }
      throw error;
    }
  }

  static async createCharacter(userId: string, characterName: string, discordId: string): Promise<CharacterData> {
    try {
      const response = await axios.post(`${API_URL}/users/${userId}/characters`, {
        characterName,
        discordId
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to create character');
      }
      throw error;
    }
  }
}