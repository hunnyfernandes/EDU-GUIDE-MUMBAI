-- Migration: Add View History Table
-- Date: 2024
-- Description: Adds view_history table to track college detail page views

USE edu_guide_mumbai;

-- Create view_history table
CREATE TABLE IF NOT EXISTS view_history (
    view_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    college_id INT NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_viewed_at (viewed_at)
);
