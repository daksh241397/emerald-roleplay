import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration
export const emailConfig: SMTPTransport.Options = {
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '8986c3001@smtp-brevo.com',
    pass: process.env.SMTP_PASS || 'GYhsZMNJQtDC0Ejr'
  },
  tls: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },

};

// Create transporter for sending emails
export const transporter: Transporter = nodemailer.createTransport(emailConfig);

// Email templates
export const emailTemplates = {
  passwordReset: {
    subject: 'Password Reset Request - EMERALD RP',
    html: (code: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f9d423;">Password Reset Request</h2>
        <p>You have requested to reset your password. Use the following verification code:</p>
        <div style="background: #2a2a2a; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #f9d423; text-align: center; margin: 0;">${code}</h3>
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you did not request this password reset, please ignore this email.</p>
      </div>
    `
  }
};

// Test email connection
export const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('Email service is ready');
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
};
export default transporter;