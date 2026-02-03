/**
 * Script to create missing interests tables
 */

const { promisePool } = require('../config/database');
require('dotenv').config();

async function createTables() {
  try {
    console.log('🚀 Creating interests tables...');

    // Create interests table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS interests (
        interest_id INT PRIMARY KEY AUTO_INCREMENT,
        interest_name VARCHAR(100) NOT NULL UNIQUE,
        category VARCHAR(50),
        icon_name VARCHAR(50),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ interests table created');

    // Create college_interests junction table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS college_interests (
        college_interest_id INT PRIMARY KEY AUTO_INCREMENT,
        college_id INT NOT NULL,
        interest_id INT NOT NULL,
        FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
        FOREIGN KEY (interest_id) REFERENCES interests(interest_id) ON DELETE CASCADE,
        UNIQUE KEY unique_college_interest (college_id, interest_id),
        INDEX idx_college (college_id),
        INDEX idx_interest (interest_id)
      )
    `);
    console.log('✅ college_interests table created');

    // Create annual_fees table if it doesn't exist
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS annual_fees (
        fee_id INT PRIMARY KEY AUTO_INCREMENT,
        college_id INT NOT NULL,
        stream_id INT,
        annual_fees DECIMAL(10,2),
        FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
        FOREIGN KEY (stream_id) REFERENCES streams(stream_id) ON DELETE SET NULL
      )
    `);
    console.log('✅ annual_fees table created');

    console.log('✅ All tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTables();
