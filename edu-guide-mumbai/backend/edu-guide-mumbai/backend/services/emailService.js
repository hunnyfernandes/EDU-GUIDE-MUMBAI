const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

/**
 * Email service for sending emails (verification, password reset, etc.)
 */

// Create transporter based on environment
const createTransporter = () => {
  // If SMTP is configured, use it (both in development and production)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    console.log('📧 Using SMTP for emails');
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Fallback: Use console transport for development (no SMTP configured)
  console.log('⚠️  No SMTP configured - using console transport');
  return {
    sendMail: async (options) => {
      logger.info('Email would be sent:', {
        to: options.to,
        subject: options.subject,
        preview: options.text?.substring(0, 100) + '...',
      });
      console.log('\n📧 Email Preview (Console Mode):');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Body:', options.text || options.html);
      console.log('---\n');
      return { messageId: 'dev-' + Date.now() };
    },
  };
};

const transporter = createTransporter();

/**
 * Send email verification email
 * @param {string} email - User email address
 * @param {string} verificationToken - Verification token
 * @param {string} fullName - User's full name
 */
const sendVerificationEmail = async (email, verificationToken, fullName) => {
  try {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const verificationUrl = `${clientUrl}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || `"Edu Guide Mumbai" <noreply@eduguide.com>`,
      to: email,
      subject: 'Verify Your Email Address - Edu Guide Mumbai',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Edu Guide Mumbai!</h1>
            </div>
            <div class="content">
              <p>Hi ${fullName},</p>
              <p>Thank you for registering with Edu Guide Mumbai. Please verify your email address by clicking the button below:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Edu Guide Mumbai. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Edu Guide Mumbai!
        
        Hi ${fullName},
        
        Thank you for registering with Edu Guide Mumbai. Please verify your email address by visiting the following link:
        
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create an account, please ignore this email.
        
        © ${new Date().getFullYear()} Edu Guide Mumbai. All rights reserved.
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info('Verification email sent', { email });
  } catch (error) {
    logger.error('Failed to send verification email', { email, error: error.message });
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} email - User email address
 * @param {string} resetToken - Password reset token
 * @param {string} fullName - User's full name
 */
const sendPasswordResetEmail = async (email, resetToken, fullName) => {
  try {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;
    
    // Extract first name from full name
    const userFirstName = fullName.split(' ')[0] || 'User';

    const mailOptions = {
      from: process.env.SMTP_FROM || `"Edu Guide Mumbai" <noreply@eduguide.com>`,
      to: email,
      subject: 'Reset Your Password - Edu Guide Mumbai',
      html: `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
    }
    .container {
      background-color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
      padding: 40px 0;
    }
    .email-wrapper {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      max-width: 580px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .header-title {
      font-size: 24px;
      font-weight: bold;
      color: #111827;
      margin: 0 0 8px 0;
    }
    .header-subtitle {
      font-size: 16px;
      color: #4b5563;
      margin: 0;
    }
    .content {
      margin-bottom: 32px;
    }
    .content-text {
      font-size: 16px;
      color: #374151;
      margin-bottom: 16px;
      line-height: 24px;
    }
    .greeting {
      font-size: 16px;
      color: #111827;
      margin-bottom: 16px;
      line-height: 24px;
      font-weight: 500;
    }
    .button-wrapper {
      text-align: center;
      margin: 32px 0;
    }
    .reset-button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff;
      padding: 16px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 16px;
      font-weight: 600;
      border: none;
      cursor: pointer;
    }
    .reset-button:hover {
      background-color: #1d4ed8;
    }
    .link-text {
      font-size: 14px;
      color: #4b5563;
      margin-bottom: 24px;
      line-height: 20px;
    }
    .reset-url {
      font-size: 14px;
      color: #2563eb;
      margin-bottom: 24px;
      word-break: break-all;
      padding: 12px;
      background-color: #f0f9ff;
      border-radius: 4px;
    }
    .reset-url a {
      color: #2563eb;
      text-decoration: none;
    }
    .security-notice {
      background-color: #fef3c7;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 32px;
      border-left: 4px solid #f59e0b;
    }
    .security-notice-title {
      font-size: 16px;
      font-weight: 600;
      color: #92400e;
      margin: 0 0 8px 0;
    }
    .security-notice-text {
      font-size: 14px;
      color: #b45309;
      margin: 0;
      line-height: 20px;
    }
    .support {
      margin-bottom: 32px;
    }
    .support-text {
      font-size: 14px;
      color: #4b5563;
      line-height: 20px;
    }
    .support-text a {
      color: #2563eb;
      text-decoration: underline;
    }
    .footer {
      border-top: 1px solid #e5e7eb;
      padding-top: 24px;
    }
    .footer-text {
      font-size: 12px;
      color: #6b7280;
      line-height: 16px;
      margin: 0 0 8px 0;
    }
    .footer-text a {
      color: #6b7280;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <!-- Header -->
      <div class="header">
        <div class="header-title">Password Reset Request</div>
        <div class="header-subtitle">We received a request to reset your password</div>
      </div>

      <!-- Main Content -->
      <div class="content">
        <div class="greeting">Hello ${userFirstName},</div>
        
        <div class="content-text">
          We received a request to reset the password for your account. If you made this request, 
          click the button below to reset your password. This link will expire in 1 hour for security reasons.
        </div>

        <!-- Reset Button -->
        <div class="button-wrapper">
          <a href="${resetUrl}" class="reset-button">Reset Password</a>
        </div>

        <div class="link-text">
          If the button above doesn't work, you can copy and paste the following link into your browser:
        </div>
        
        <div class="reset-url">
          <a href="${resetUrl}">${resetUrl}</a>
        </div>
      </div>

      <!-- Security Notice -->
      <div class="security-notice">
        <div class="security-notice-title">⚠️ Security Notice</div>
        <div class="security-notice-text">
          If you didn't request this password reset, please ignore this email. Your password will remain unchanged. 
          For additional security, consider enabling two-factor authentication on your account.
        </div>
      </div>

      <!-- Support -->
      <div class="support">
        <div class="support-text">
          Need help? Contact our support team at 
          <a href="mailto:support@eduguide.com">support@eduguide.com</a>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-text">
          This email was sent to ${email}
        </div>
        <div class="footer-text">
          Edu Guide Mumbai, Mumbai, India
        </div>
        <div class="footer-text">
          © ${new Date().getFullYear()} Edu Guide Mumbai. All rights reserved. |
          <a href="#">Unsubscribe</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
      `,
      text: `
Password Reset Request

Hello ${userFirstName},

We received a request to reset the password for your account. If you made this request, 
visit the following link to reset your password. This link will expire in 1 hour.

${resetUrl}

If the link above doesn't work, copy and paste the following URL into your browser:
${resetUrl}

SECURITY NOTICE:
If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

© ${new Date().getFullYear()} Edu Guide Mumbai. All rights reserved.
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info('Password reset email sent', { email });
  } catch (error) {
    logger.error('Failed to send password reset email', { email, error: error.message });
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};











