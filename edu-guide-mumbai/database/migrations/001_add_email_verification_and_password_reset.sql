-- Migration: Add Email Verification and Password Reset
-- Date: 2024
-- Description: Adds email verification and password reset functionality

USE edu_guide_mumbai;

-- Add email_verified column to users table
ALTER TABLE users 
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER email,
ADD COLUMN email_verification_token VARCHAR(255) NULL AFTER email_verified,
ADD COLUMN email_verification_token_expires TIMESTAMP NULL AFTER email_verification_token,
ADD INDEX idx_email_verification_token (email_verification_token);

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- Update existing users to have email_verified = TRUE (for backward compatibility)
-- In production, you may want to set this to FALSE and require re-verification
UPDATE users SET email_verified = TRUE WHERE email_verified IS NULL;











