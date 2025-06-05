import { UserUpdateApi, UpdateUserData, UpdatePasswordData } from './userUpdateApi';

export interface ValidationErrors {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const updateUserProfile = async (userId: string, data: UpdateUserData, token: string): Promise<any> => {
  return UserUpdateApi.updateUserProfile(userId, data, token);
};

export const updatePassword = async (userId: string, data: UpdatePasswordData, token: string): Promise<any> => {
  return UserUpdateApi.updatePassword(userId, data, token);
};

export const validateCurrentPassword = async (userId: string, password: string, token: string): Promise<boolean> => {
  return UserUpdateApi.validateCurrentPassword(userId, password, token);
};

export const validateUserData = (data: {
  username: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  // Validate username
  if (!data.username) {
    errors.username = 'Username is required';
  } else if (data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  // Validate email
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Validate password fields only if user is trying to change password
  if (data.currentPassword || data.newPassword || data.confirmPassword) {
    if (!data.currentPassword) {
      errors.currentPassword = 'Current password is required to change password';
    }
    
    if (!data.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (data.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters';
    }
    
    if (!data.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (data.newPassword !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }
  
  return errors;
};