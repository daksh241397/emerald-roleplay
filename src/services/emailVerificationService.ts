import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
  verificationId?: string;
}

export class EmailVerificationService {
  static async sendVerificationCodes(currentEmail: string, newEmail: string, token: string): Promise<EmailVerificationResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/email-verification/send-codes`,
        { currentEmail, newEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-CSRF-Token': localStorage.getItem('csrfToken') || ''
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error in sendVerificationCodes:', error);
      throw new Error(error.response?.data?.message || 'Failed to send verification codes');
    }
  }

  static async verifyEmailCodes(
    verificationId: string,
    currentEmailCode: string,
    newEmailCode: string,
    token: string
  ): Promise<EmailVerificationResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/email-verification/verify-codes`,
        { verificationId, currentEmailCode, newEmailCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-CSRF-Token': localStorage.getItem('csrfToken') || ''
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error in verifyEmailCodes:', error);
      throw new Error(error.response?.data?.message || 'Failed to verify codes');
    }
  }
}