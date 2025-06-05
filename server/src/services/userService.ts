import { RowDataPacket } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from './database';

export interface UserData extends RowDataPacket {
  id: string;
  username: string;
  email: string;
  created_at: Date;
  last_login: Date;
}

export interface CharacterData extends RowDataPacket {
  id: string;
  user_id: string;
  character_name: string;
  discord_id: string;
  created_at: Date;
}

export const createUser = async (username: string, email: string, password: string): Promise<UserData> => {
  try {
    // Check if username exists
    const existingUser = await db.executeQuery<UserData[]>('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUser.length > 0) {
      throw new Error('Username or email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate UUID for user
    const userId = uuidv4();

    // Insert user
    await db.executeQuery(
      'INSERT INTO users (id, username, email, password_hash, created_at, last_login) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [userId, username, email, passwordHash]
    );

    // Fetch and return created user
    const [user] = await db.executeQuery<UserData[]>('SELECT id, username, email, created_at, last_login FROM users WHERE id = ?', [userId]);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const createCharacter = async (userId: string, characterName: string, discordId: string): Promise<CharacterData> => {
  try {
    const characterId = uuidv4();
    
    await db.executeQuery(
      'INSERT INTO characters (id, user_id, character_name, discord_id, created_at) VALUES (?, ?, ?, ?, NOW())',
      [characterId, userId, characterName, discordId]
    );

    const [character] = await db.executeQuery<CharacterData[]>(
      'SELECT id, user_id, character_name, discord_id, created_at FROM characters WHERE id = ?',
      [characterId]
    );

    return character;
  } catch (error) {
    console.error('Error creating character:', error);
    throw error;
  }
};

export const validateUser = async (username: string, password: string): Promise<UserData | null> => {
  try {
    const [user] = await db.executeQuery<UserData[]>('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error validating user:', error);
    throw error;
  }
};