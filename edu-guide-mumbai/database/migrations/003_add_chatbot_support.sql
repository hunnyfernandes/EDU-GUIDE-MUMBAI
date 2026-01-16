-- Migration: Add Chatbot Support
-- Description: Creates chat_logs table for optional chatbot analytics

USE edu_guide_mumbai;

-- Chat Logs Table (Optional - for analytics)
-- This table is optional and only used if LOG_CHAT_ENABLED=true in environment variables
CREATE TABLE IF NOT EXISTS chat_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL, -- Nullable for anonymous users
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    context_used JSON NULL, -- Store the context that was used
    suggested_pages JSON NULL, -- Store suggested pages
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- Note: This migration is optional. The chatbot will work without this table.
-- If you want to enable chat logging, set LOG_CHAT_ENABLED=true in your .env file.
-- The table will only be used if the environment variable is set.
