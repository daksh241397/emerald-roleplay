import axios from 'axios';

const MAILEROO_API_URL = 'https://maileroo.com/api/send-email';
const SENDING_KEY = '1ad2a873e8773896cef832ece47ba674ec40831d5bbe12394527ddb9d6dd1270';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const sendEmailViaMaileroo = async (payload: EmailPayload): Promise<void> => {
  try {
    const response = await axios.post(MAILEROO_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${SENDING_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending email via Maileroo:', error);
    throw error;
  }
};