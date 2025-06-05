import { UserApi } from './userApi';

export interface UserData {
  id: string;
  username: string;
  email: string;
  created_at: Date;
  last_login: Date;
}

export interface CharacterData {
  id: string;
  user_id: string;
  character_name: string;
  discord_id: string;
  created_at: Date;
}

export const createUser = async (username: string, email: string, password: string): Promise<UserData> => {
  return UserApi.createUser(username, email, password);
};

export const createCharacter = async (userId: string, characterName: string, discordId: string): Promise<CharacterData> => {
  return UserApi.createCharacter(userId, characterName, discordId);
};