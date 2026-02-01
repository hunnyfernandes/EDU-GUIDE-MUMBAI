-- Edu Guide Mumbai Database Schema

-- Create Database

USE edu_guide_mumbai;

-- Users Table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('student', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Colleges Table
CREATE TABLE colleges (
    college_id INT PRIMARY KEY AUTO_INCREMENT,
    college_name VARCHAR(255) NOT NULL,
    college_code VARCHAR(50) UNIQUE,
    address TEXT,
    city VARCHAR(100) DEFAULT 'Mumbai',
    pincode VARCHAR(10),
    phone VARCHAR(15),
    email VARCHAR(100),
    website VARCHAR(255),
    established_year YEAR,
    college_type ENUM('Government', 'Private', 'Aided', 'Autonomous') DEFAULT 'Private',
    affiliation VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(255),
    cover_image_url VARCHAR(255),
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_college_name (college_name),
    INDEX idx_college_type (college_type),
    INDEX idx_rating (average_rating),
    INDEX idx_status (status)
);

-- Streams Table
CREATE TABLE streams (
    stream_id INT PRIMARY KEY AUTO_INCREMENT,
    stream_name VARCHAR(100) UNIQUE NOT NULL,
    stream_code VARCHAR(20) UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Streams
INSERT INTO streams (stream_name, stream_code, description) VALUES
('Commerce', 'COM', 'Business, Accounting, Economics and related fields'),
('Arts', 'ARTS', 'Humanities, Social Sciences, Literature and Fine Arts'),
('Science', 'SCI', 'Physics, Chemistry, Biology, Mathematics and related sciences'),
('Management', 'MGT', 'MBA, BBA, and Management programs'),
('Engineering', 'ENG', 'Engineering and Technology programs'),
('Information Technology', 'IT', 'Computer Science, IT and related technology programs');

-- College Streams Junction Table
CREATE TABLE college_streams (
    college_stream_id INT PRIMARY KEY AUTO_INCREMENT,
    college_id INT NOT NULL,
    stream_id INT NOT NULL,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
    FOREIGN KEY (stream_id) REFERENCES streams(stream_id) ON DELETE CASCADE,
    UNIQUE KEY unique_college_stream (college_id, stream_id),
    INDEX idx_college (college_id),
    INDEX idx_stream (stream_id)
);

-- Courses Table
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    college_id INT NOT NULL,
    stream_id INT NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(50),
    degree_type ENUM('Undergraduate', 'Postgraduate', 'Diploma', 'Certificate') NOT NULL,
    duration_years DECIMAL(3,1),
    total_seats INT,
    fees_per_year DECIMAL(10,2),
    eligibility TEXT,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
    FOREIGN KEY (stream_id) REFERENCES streams(stream_id) ON DELETE CASCADE,
    INDEX idx_college_course (college_id),
    INDEX idx_stream_course (stream_id),
    INDEX idx_degree_type (degree_type),
    INDEX idx_fees (fees_per_year)
);

-- Facilities Table
CREATE TABLE facilities (
    facility_id INT PRIMARY KEY AUTO_INCREMENT,
    facility_name VARCHAR(100) UNIQUE NOT NULL,
    icon_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Common Facilities
INSERT INTO facilities (facility_name, icon_name) VALUES
('Library', 'book'),
('Computer Lab', 'computer'),
('Sports Complex', 'trophy'),
('Hostel', 'home'),
('Cafeteria', 'coffee'),
('Wi-Fi Campus', 'wifi'),
('Auditorium', 'music'),
('Gymnasium', 'activity'),
('Medical Facility', 'heart'),
('Placement Cell', 'briefcase'),
('Research Lab', 'flask'),
('Transportation', 'bus');

-- College Facilities Junction Table
CREATE TABLE college_facilities (
    college_facility_id INT PRIMARY KEY AUTO_INCREMENT,
    college_id INT NOT NULL,
    facility_id INT NOT NULL,
    details TEXT,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE CASCADE,
    UNIQUE KEY unique_college_facility (college_id, facility_id),
    INDEX idx_college_facility (college_id),
    INDEX idx_facility (facility_id)
);

-- Admission Info Table
CREATE TABLE admission_info (
    admission_id INT PRIMARY KEY AUTO_INCREMENT,
    college_id INT NOT NULL,
    admission_process TEXT,
    entrance_exam VARCHAR(255),
    cutoff_info TEXT,
    important_dates TEXT,
    documents_required TEXT,
    application_fee DECIMAL(10,2),
    admission_helpline VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
    INDEX idx_college_admission (college_id)
);

-- Placements Table
CREATE TABLE placements (
    placement_id INT PRIMARY KEY AUTO_INCREMENT,
    college_id INT NOT NULL,
    academic_year VARCHAR(20),
    total_students_placed INT,
    placement_percentage DECIMAL(5,2),
    highest_package DECIMAL(10,2),
    average_package DECIMAL(10,2),
    top_recruiters TEXT,
    placement_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
    INDEX idx_college_placement (college_id),
    INDEX idx_year (academic_year)
);

-- Reviews Table
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    college_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(200),
    review_text TEXT,
    course_studied VARCHAR(255),
    batch_year VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_college_review (college_id),
    INDEX idx_user_review (user_id),
    INDEX idx_rating (rating),
    INDEX idx_status (status)
);

-- Saved Colleges (User Bookmarks)
CREATE TABLE saved_colleges (
    saved_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    college_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_college (user_id, college_id),
    INDEX idx_user_saved (user_id),
    INDEX idx_college_saved (college_id)
);

-- College Comparisons (User Comparison History)
CREATE TABLE comparison_history (
    comparison_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    college_ids JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_comparison (user_id)
);

-- Search Log (Analytics)
CREATE TABLE search_log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    search_query VARCHAR(255),
    filters_applied JSON,
    results_count INT,
    search_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_search_query (search_query),
    INDEX idx_timestamp (search_timestamp)
);

-- View History (College Views Tracking)
CREATE TABLE view_history (
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

-- Create triggers to update college ratings
DELIMITER //

CREATE TRIGGER after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE colleges
    SET average_rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE college_id = NEW.college_id AND status = 'approved'
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM reviews
        WHERE college_id = NEW.college_id AND status = 'approved'
    )
    WHERE college_id = NEW.college_id;
END//

CREATE TRIGGER after_review_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    UPDATE colleges
    SET average_rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE college_id = NEW.college_id AND status = 'approved'
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM reviews
        WHERE college_id = NEW.college_id AND status = 'approved'
    )
    WHERE college_id = NEW.college_id;
END//

CREATE TRIGGER after_review_delete
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    UPDATE colleges
    SET average_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE college_id = OLD.college_id AND status = 'approved'
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM reviews
        WHERE college_id = OLD.college_id AND status = 'approved'
    )
    WHERE college_id = OLD.college_id;
END//

DELIMITER ;

-- Refresh Tokens Table (for secure token refresh mechanism)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    token_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at)
);

