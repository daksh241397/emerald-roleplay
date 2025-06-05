import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface UpdateUserData {
  username?: string;
  email?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export class UserUpdateApi {
  static async updateUserProfile(userId: string, data: UpdateUserData, token: string): Promise<any> {
    try {
      // Get the JWT token from user object in localStorage instead of using session token
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const jwtToken = user?.token || token;
      
      const response = await axios.put(`${API_URL}/users/${userId}`, data, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'X-CSRF-Token': localStorage.getItem('csrfToken') || ''
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error in updateUserProfile:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to update user profile');
      }
      throw new Error('Failed to update user profile: Network or server error');
    }
  }

  static async updatePassword(userId: string, data: UpdatePasswordData, token: string): Promise<any> {
    try {
      // Get the JWT token from user object in localStorage instead of using session token
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const jwtToken = user?.token || token;
      
      const response = await axios.put(`${API_URL}/users/${userId}/password`, data, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'X-CSRF-Token': localStorage.getItem('csrfToken') || ''
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error in updatePassword:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to update password');
      }
      throw new Error('Failed to update password: Network or server error');
    }
  }

  static async validateCurrentPassword(userId: string, password: string, token: string): Promise<boolean> {
    try {
      // Get the JWT token from user object in localStorage instead of using session token
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const jwtToken = user?.token || token;
      
      const response = await axios.post(`${API_URL}/users/${userId}/validate-password`, { password }, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'X-CSRF-Token': localStorage.getItem('csrfToken') || ''
        }
      });
      return response.data.valid;
    } catch (error: any) {
      console.error('Error in validateCurrentPassword:', error);
      return false;
    }
  }
}