/**
 * Database Seed Script
 * Seeds the database with test user and mock college data
 * 
 * Usage: node backend/scripts/seed.js
 */

const bcrypt = require('bcrypt');
const { promisePool } = require('../config/database');
require('dotenv').config();

// Mock college data
const mockColleges = [
  // --- MUMBAI COLLEGES ---
  {
    college_name: 'Indian Institute of Technology Bombay (IITB)',
    college_code: 'IITB001',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Powai, Mumbai',
    pincode: '400076',
    phone: '022-25722545',
    email: 'pro@iitb.ac.in',
    website: 'www.iitb.ac.in',
    established_year: 1958,
    college_type: 'Government',
    affiliation: 'Autonomous',
    description: 'IIT Bombay is recognized worldwide as a leader in the field of engineering education and research.',
    average_rating: 4.9,
    total_reviews: 580,
    streams: [5, 6, 3], // Engineering, IT, Science
    courses: [
      { stream_id: 5, course_name: 'B.Tech Computer Science', course_code: 'BTCSE', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 130, fees_per_year: 225000.00 },
      { stream_id: 5, course_name: 'B.Tech Electrical Engineering', course_code: 'BTEE', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 100, fees_per_year: 225000.00 }
    ],
    facilities: [1, 2, 4, 3, 5, 6, 8, 10, 11]
  },
  {
    college_name: 'Institute of Chemical Technology (ICT)',
    college_code: 'ICT001',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Nathalal Parekh Marg, Matunga',
    pincode: '400019',
    phone: '022-33611111',
    email: 'admission@ictmumbai.edu.in',
    website: 'www.ictmumbai.edu.in',
    established_year: 1933,
    college_type: 'Government',
    affiliation: 'Deemed University',
    description: 'ICT Mumbai is a premier institute dedicated to chemical technology and engineering research.',
    average_rating: 4.7,
    total_reviews: 210,
    streams: [5, 3], // Engineering, Science
    courses: [
      { stream_id: 5, course_name: 'B.Chem.Engg', course_code: 'BCHEM', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 75, fees_per_year: 85000.00 },
      { stream_id: 5, course_name: 'B.Tech Food Engineering', course_code: 'BTFOOD', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 20, fees_per_year: 85000.00 }
    ],
    facilities: [1, 2, 11, 4, 6]
  },
  {
    college_name: 'St. Xavier\'s College, Mumbai',
    college_code: 'SXC001',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: '5, Mahapalika Marg, Dhobi Talao',
    pincode: '400001',
    phone: '022-22620661',
    email: 'webadmin@xaviers.edu',
    website: 'www.xaviers.edu',
    established_year: 1869,
    college_type: 'Autonomous',
    affiliation: 'University of Mumbai',
    description: 'A heritage institution known for its Arts and Science programs and vibrant campus culture.',
    average_rating: 4.6,
    total_reviews: 350,
    streams: [2, 3, 1],
    courses: [
      { stream_id: 2, course_name: 'Bachelor of Arts', course_code: 'BA', degree_type: 'Undergraduate', duration_years: 3.0, total_seats: 360, fees_per_year: 7000.00 },
      { stream_id: 3, course_name: 'B.Sc IT', course_code: 'BSCIT', degree_type: 'Undergraduate', duration_years: 3.0, total_seats: 60, fees_per_year: 45000.00 }
    ],
    facilities: [1, 5, 3, 6, 7]
  },
  {
    college_name: 'Veermata Jijabai Technological Institute (VJTI)',
    college_code: 'VJTI001',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'H R Mahajani Rd, Matunga',
    pincode: '400019',
    phone: '022-24198101',
    email: 'director@vjti.ac.in',
    website: 'www.vjti.ac.in',
    established_year: 1887,
    college_type: 'Government',
    affiliation: 'University of Mumbai',
    description: 'One of the oldest engineering colleges in Asia, known for its strong alumni network and placements.',
    average_rating: 4.5,
    total_reviews: 310,
    streams: [5, 6],
    courses: [
      { stream_id: 5, course_name: 'B.Tech Mechanical', course_code: 'BTMECH', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 60, fees_per_year: 84000.00 },
      { stream_id: 6, course_name: 'B.Tech IT', course_code: 'BTIT', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 60, fees_per_year: 84000.00 }
    ],
    facilities: [1, 2, 3, 4, 6, 10]
  },
  {
    college_name: 'Jai Hind College',
    college_code: 'JHC001',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'A Road, Churchgate',
    pincode: '400020',
    phone: '022-22041095',
    email: 'contactus@jaihindcollege.com',
    website: 'www.jaihindcollege.com',
    established_year: 1948,
    college_type: 'Autonomous',
    affiliation: 'University of Mumbai',
    description: 'Located in South Mumbai, offering excellent courses in Commerce, Science, and Management.',
    average_rating: 4.4,
    total_reviews: 180,
    streams: [1, 2, 3, 4],
    courses: [
      { stream_id: 4, course_name: 'Bachelor of Management Studies', course_code: 'BMS', degree_type: 'Undergraduate', duration_years: 3.0, total_seats: 120, fees_per_year: 35000.00 },
      { stream_id: 1, course_name: 'B.Com Accounting and Finance', course_code: 'BAF', degree_type: 'Undergraduate', duration_years: 3.0, total_seats: 60, fees_per_year: 40000.00 }
    ],
    facilities: [1, 2, 5, 6, 7]
  },
  {
    college_name: 'NMIMS (Deemed-to-be University)',
    college_code: 'NMIMS001',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'V. L. Mehta Road, Vile Parle West',
    pincode: '400056',
    phone: '022-42355555',
    email: 'enquiry@nmims.edu',
    website: 'www.nmims.edu',
    established_year: 1981,
    college_type: 'Private',
    affiliation: 'Deemed University',
    description: 'A top-ranked management institute also offering engineering, pharmacy, and architecture courses.',
    average_rating: 4.3,
    total_reviews: 400,
    streams: [4, 5, 8], // Management, Engineering, Law
    courses: [
      { stream_id: 4, course_name: 'MBA', course_code: 'MBA', degree_type: 'Postgraduate', duration_years: 2.0, total_seats: 600, fees_per_year: 1100000.00 },
      { stream_id: 5, course_name: 'B.Tech CS', course_code: 'BTCS', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 300, fees_per_year: 350000.00 }
    ],
    facilities: [1, 2, 4, 10, 8, 6]
  },
  {
    college_name: 'Sardar Patel Institute of Technology (SPIT)',
    college_code: 'SPIT001',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Munshi Nagar, Andheri West',
    pincode: '400058',
    phone: '022-26707440',
    email: 'principal@spit.ac.in',
    website: 'www.spit.ac.in',
    established_year: 2005,
    college_type: 'Autonomous',
    affiliation: 'University of Mumbai',
    description: 'Known for high academic standards and excellent placement records in computer and electronics fields.',
    average_rating: 4.5,
    total_reviews: 140,
    streams: [5, 6],
    courses: [
      { stream_id: 5, course_name: 'B.Tech Computer Engineering', course_code: 'BTCMP', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 60, fees_per_year: 170000.00 },
      { stream_id: 6, course_name: 'MCA', course_code: 'MCA', degree_type: 'Postgraduate', duration_years: 2.0, total_seats: 60, fees_per_year: 120000.00 }
    ],
    facilities: [1, 2, 3, 4, 6, 11]
  },
  {
    college_name: 'Mithibai College of Arts, Chauhan Institute of Science',
    college_code: 'MC001',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Vile Parle West',
    pincode: '400056',
    phone: '022-42339000',
    email: 'principal@mithibai.ac.in',
    website: 'www.mithibai.ac.in',
    established_year: 1961,
    college_type: 'Private',
    affiliation: 'University of Mumbai',
    description: 'A cultural hub in the suburbs, popular for mass media, arts, and commerce courses.',
    average_rating: 4.2,
    total_reviews: 250,
    streams: [1, 2, 3],
    courses: [
      { stream_id: 1, course_name: 'B.Com', course_code: 'BCOM', degree_type: 'Undergraduate', duration_years: 3.0, total_seats: 800, fees_per_year: 8000.00 },
      { stream_id: 2, course_name: 'Bachelor of Mass Media (BMM)', course_code: 'BMM', degree_type: 'Undergraduate', duration_years: 3.0, total_seats: 60, fees_per_year: 25000.00 }
    ],
    facilities: [1, 5, 2, 6, 7]
  },
  {
    college_name: 'H.R. College of Commerce and Economics',
    college_code: 'HRC001',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Churchgate, Mumbai',
    pincode: '400020',
    phone: '022-22042195',
    email: 'info@hrcollege.edu',
    website: 'www.hrcollege.edu',
    established_year: 1960,
    college_type: 'Private',
    affiliation: 'HSNC University',
    description: 'One of the best commerce colleges in Mumbai, with a focus on entrepreneurship and finance.',
    average_rating: 4.3,
    total_reviews: 200,
    streams: [1, 4],
    courses: [
      { stream_id: 1, course_name: 'B.Com', course_code: 'BCOM', degree_type: 'Undergraduate', duration_years: 3.0, total_seats: 960, fees_per_year: 15000.00 },
      { stream_id: 4, course_name: 'BMS', course_code: 'BMS', degree_type: 'Undergraduate', duration_years: 3.0, total_seats: 120, fees_per_year: 30000.00 }
    ],
    facilities: [1, 2, 6, 10]
  },
  {
    college_name: 'Lords Universal College',
    college_code: 'LUC001',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Topiwala Marg, Off Station Road, Goregaon West',
    pincode: '400104',
    phone: '022-28791111',
    email: 'info@lordsuniversal.edu.in',
    website: 'www.lordsuniversal.edu.in',
    established_year: 2003,
    college_type: 'Private',
    affiliation: 'University of Mumbai',
    description: 'A premier institution in Goregaon offering a wide range of courses in Commerce, Science, and Management with state-of-the-art infrastructure.',
    average_rating: 4.1,
    total_reviews: 95,
    streams: [1, 2, 3, 4], // Commerce, Arts, Science, Management
    courses: [
      { stream_id: 1, course_name: 'B.Com', course_code: 'BCOM', degree_type: 'Undergraduate', duration_years: 3.0, total_seats: 240, fees_per_year: 25000.00 },
      { stream_id: 3, course_name: 'B.Sc Computer Science', course_code: 'BSCCS', degree_type: 'Undergraduate', duration_years: 3.0, total_seats: 60, fees_per_year: 45000.00 },
      { stream_id: 4, course_name: 'BMS', course_code: 'BMS', degree_type: 'Undergraduate', duration_years: 3.0, total_seats: 120, fees_per_year: 35000.00 },
      { stream_id: 2, course_name: 'BMM', course_code: 'BMM', degree_type: 'Undergraduate', duration_years: 3.0, total_seats: 60, fees_per_year: 30000.00 }
    ],
    facilities: [1, 2, 6, 7, 5]
  },
  {
    college_name: 'Dwarkadas J. Sanghvi College of Engineering',
    college_code: 'DJSCE001',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Vile Parle West',
    pincode: '400056',
    phone: '022-42335000',
    email: 'info@djsce.ac.in',
    website: 'www.djsce.ac.in',
    established_year: 1994,
    college_type: 'Private',
    affiliation: 'University of Mumbai',
    description: 'A top engineering college in Mumbai known for its practical approach and industry tie-ups.',
    average_rating: 4.4,
    total_reviews: 160,
    streams: [5],
    courses: [
      { stream_id: 5, course_name: 'B.E. Computer Engineering', course_code: 'BECMP', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 120, fees_per_year: 195000.00 },
      { stream_id: 5, course_name: 'B.E. IT', course_code: 'BEIT', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 60, fees_per_year: 195000.00 }
    ],
    facilities: [1, 2, 3, 5, 6, 11]
  },

  // --- REST OF INDIA COLLEGES ---
  {
    college_name: 'Indian Institute of Technology Delhi (IITD)',
    college_code: 'IITD001',
    state: 'Delhi',
    city: 'New Delhi',
    address: 'Hauz Khas, New Delhi',
    pincode: '110016',
    phone: '011-26597135',
    email: 'webmaster@admin.iitd.ac.in',
    website: 'www.iitd.ac.in',
    established_year: 1961,
    college_type: 'Government',
    affiliation: 'Autonomous',
    description: 'A globally acclaimed institution for engineering and research in the capital of India.',
    average_rating: 4.8,
    total_reviews: 650,
    streams: [5, 3, 4],
    courses: [
      { stream_id: 5, course_name: 'B.Tech Computer Science', course_code: 'CSJD', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 100, fees_per_year: 200000.00 }
    ],
    facilities: [1, 2, 4, 3, 5, 6, 8, 10, 11]
  },
  {
    college_name: 'All India Institute of Medical Sciences (AIIMS)',
    college_code: 'AIIMS001',
    state: 'Delhi',
    city: 'New Delhi',
    address: 'Ansari Nagar, New Delhi',
    pincode: '110029',
    phone: '011-26588500',
    email: 'director@aiims.edu',
    website: 'www.aiims.edu',
    established_year: 1956,
    college_type: 'Government',
    affiliation: 'Autonomous',
    description: 'The most prestigious medical college and hospital in India.',
    average_rating: 4.9,
    total_reviews: 500,
    streams: [7, 3], // Medical
    courses: [
      { stream_id: 7, course_name: 'MBBS', course_code: 'MBBS', degree_type: 'Undergraduate', duration_years: 5.5, total_seats: 125, fees_per_year: 1628.00 }
    ],
    facilities: [1, 11, 4, 6]
  },
  {
    college_name: 'Indian Institute of Technology Madras (IITM)',
    college_code: 'IITM001',
    state: 'Tamil Nadu',
    city: 'Chennai',
    address: 'IIT P.O., Chennai',
    pincode: '600036',
    phone: '044-22578000',
    email: 'registrar@iitm.ac.in',
    website: 'www.iitm.ac.in',
    established_year: 1959,
    college_type: 'Government',
    affiliation: 'Autonomous',
    description: 'Consistently ranked #1 in NIRF rankings for engineering in India.',
    average_rating: 4.8,
    total_reviews: 420,
    streams: [5, 3],
    courses: [
      { stream_id: 5, course_name: 'B.Tech Aerospace Engineering', course_code: 'BTAERO', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 60, fees_per_year: 210000.00 }
    ],
    facilities: [1, 2, 4, 3, 5, 6, 11]
  },
  {
    college_name: 'Indian Institute of Science (IISc)',
    college_code: 'IISC001',
    state: 'Karnataka',
    city: 'Bangalore',
    address: 'CV Raman Road, Bangalore',
    pincode: '560012',
    phone: '080-22932004',
    email: 'registrar@iisc.ac.in',
    website: 'www.iisc.ac.in',
    established_year: 1909,
    college_type: 'Government',
    affiliation: 'Deemed University',
    description: 'India\'s premier institution for advanced scientific and technological research and education.',
    average_rating: 4.9,
    total_reviews: 300,
    streams: [3, 5],
    courses: [
      { stream_id: 3, course_name: 'Bachelor of Science (Research)', course_code: 'BSRES', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 120, fees_per_year: 30000.00 }
    ],
    facilities: [1, 11, 4, 6, 10]
  },
  {
    college_name: 'Indian Institute of Management Ahmedabad (IIMA)',
    college_code: 'IIMA001',
    state: 'Gujarat',
    city: 'Ahmedabad',
    address: 'Vastrapur, Ahmedabad',
    pincode: '380015',
    phone: '079-26308357',
    email: 'admission@iima.ac.in',
    website: 'www.iima.ac.in',
    established_year: 1961,
    college_type: 'Autonomous',
    affiliation: 'Autonomous',
    description: 'The top business school in India, known for its rigorous PGP program.',
    average_rating: 4.9,
    total_reviews: 250,
    streams: [4],
    courses: [
      { stream_id: 4, course_name: 'PGP', course_code: 'PGP', degree_type: 'Postgraduate', duration_years: 2.0, total_seats: 400, fees_per_year: 1200000.00 }
    ],
    facilities: [1, 2, 4, 8, 6, 10]
  },
  {
    college_name: 'BITS Pilani',
    college_code: 'BITS001',
    state: 'Rajasthan',
    city: 'Pilani',
    address: 'Vidya Vihar, Pilani',
    pincode: '333031',
    phone: '0159-6242205',
    email: 'admissions@bits-pilani.ac.in',
    website: 'www.bits-pilani.ac.in',
    established_year: 1964,
    college_type: 'Private',
    affiliation: 'Deemed University',
    description: 'A world-class private engineering institute known for its flexibility and zero-attendance policy.',
    average_rating: 4.7,
    total_reviews: 380,
    streams: [5, 3],
    courses: [
      { stream_id: 5, course_name: 'B.E. Computer Science', course_code: 'BECS', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 150, fees_per_year: 450000.00 }
    ],
    facilities: [1, 2, 4, 3, 6, 10]
  },
  {
    college_name: 'Vellore Institute of Technology (VIT)',
    college_code: 'VIT001',
    state: 'Tamil Nadu',
    city: 'Vellore',
    address: 'Vellore, Tamil Nadu',
    pincode: '632014',
    phone: '0416-2243091',
    email: 'info@vit.ac.in',
    website: 'www.vit.ac.in',
    established_year: 1984,
    college_type: 'Private',
    affiliation: 'Deemed University',
    description: 'A large private university known for strong placements and modern infrastructure.',
    average_rating: 4.4,
    total_reviews: 550,
    streams: [5],
    courses: [
      { stream_id: 5, course_name: 'B.Tech IT', course_code: 'BTIT', degree_type: 'Undergraduate', duration_years: 4.0, total_seats: 300, fees_per_year: 198000.00 }
    ],
    facilities: [1, 2, 4, 3, 5, 6, 11]
  }
];

const normalizeYear = (year) => {
  if (!year) return null;
  const minYear = 1901;
  const maxYear = 2155;
  if (year < minYear) return minYear;
  if (year > maxYear) return maxYear;
  return year;
};

const getDbName = () => process.env.DB_NAME || "edu_guide_mumbai";

const columnExists = async (table, column) => {
  const dbName = process.env.DB_NAME || "edu_guide_mumbai";
  const [rows] = await promisePool.query(
    `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?
    `,
    [dbName, table, column]
  );
  return rows.length > 0;
};

const indexExists = async (table, index) => {
  const dbName = getDbName();
  const [rows] = await promisePool.query(
    `
      SELECT INDEX_NAME
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?
    `,
    [dbName, table, index]
  );
  return rows.length > 0;
};

const ensureSchemaEnhancements = async () => {
  console.log("🔧 Ensuring schema prerequisites...");

  // Ensure email verification columns exist
  const emailVerifiedExists = await columnExists("users", "email_verified");
  if (!emailVerifiedExists) {
    await promisePool.query(`
      ALTER TABLE users 
        ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER email
    `);
    console.log("   ✅ Added users.email_verified column");
  }

  const tokenExists = await columnExists(
    "users",
    "email_verification_token"
  );
  if (!tokenExists) {
    await promisePool.query(`
      ALTER TABLE users 
        ADD COLUMN email_verification_token VARCHAR(255) NULL AFTER email_verified
    `);
    console.log("   ✅ Added users.email_verification_token column");
  }

  const tokenExpiryExists = await columnExists(
    "users",
    "email_verification_token_expires"
  );
  if (!tokenExpiryExists) {
    await promisePool.query(`
      ALTER TABLE users 
        ADD COLUMN email_verification_token_expires TIMESTAMP NULL AFTER email_verification_token
    `);
    console.log("   ✅ Added users.email_verification_token_expires column");
  }

  // Ensure index on verification token
  const hasVerificationIndex = await indexExists(
    "users",
    "idx_email_verification_token"
  );
  if (!hasVerificationIndex) {
    await promisePool.query(`
      CREATE INDEX idx_email_verification_token 
      ON users (email_verification_token)
    `);
    console.log("   ✅ Added idx_email_verification_token index");
  }

  // Ensure password_reset_tokens table exists
  await promisePool.query(`
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
    )
  `);
  console.log("   ✅ Verified password_reset_tokens table");
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...\n');

    // Ensure schema is up to date
    await ensureSchemaEnhancements();

    // 1. Create test user
    console.log('📝 Creating test user...');
    const testEmail = 'example@gmail.com';
    const testPassword = '123456789';

    // Check if user already exists
    const [existingUsers] = await promisePool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [testEmail]
    );

    if (existingUsers.length > 0) {
      console.log('   ⚠️  Test user already exists, updating password...');
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(testPassword, salt);
      await promisePool.query(
        'UPDATE users SET password_hash = ?, email_verified = TRUE WHERE email = ?',
        [password_hash, testEmail]
      );
      console.log('   ✅ Test user password updated');
    } else {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(testPassword, salt);
      await promisePool.query(
        'INSERT INTO users (full_name, email, password_hash, phone, role, email_verified) VALUES (?, ?, ?, ?, ?, ?)',
        ['Test User', testEmail, password_hash, '9876543210', 'student', true]
      );
      console.log('   ✅ Test user created');
    }
    console.log(`   📧 Email: ${testEmail}`);
    console.log(`   🔑 Password: ${testPassword}\n`);

    // 2. Seed colleges
    console.log('🏫 Seeding colleges...');
    let collegesCreated = 0;
    let collegesUpdated = 0;

    for (const college of mockColleges) {
      // Check if college exists
      const [existing] = await promisePool.query(
        'SELECT college_id FROM colleges WHERE college_code = ?',
        [college.college_code]
      );

      let collegeId;
      if (existing.length > 0) {
        collegeId = existing[0].college_id;
        // Update existing college
        await promisePool.query(
          `UPDATE colleges SET 
            college_name = ?, address = ?, pincode = ?, phone = ?, email = ?, 
            website = ?, established_year = ?, college_type = ?, affiliation = ?, 
            description = ?, average_rating = ?, total_reviews = ?, status = 'active'
           WHERE college_id = ?`,
          [
            college.college_name, college.address, college.pincode, college.phone,
            college.email, college.website, normalizeYear(college.established_year), college.college_type,
            college.affiliation, college.description, college.average_rating, college.total_reviews,
            collegeId
          ]
        );
        collegesUpdated++;
      } else {
        // Insert new college
        const [result] = await promisePool.query(
          `INSERT INTO colleges 
            (college_name, college_code, address, pincode, phone, email, website, 
             established_year, college_type, affiliation, description, average_rating, total_reviews, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
          [
            college.college_name, college.college_code, college.address, college.pincode,
            college.phone, college.email, college.website, normalizeYear(college.established_year),
            college.college_type, college.affiliation, college.description,
            college.average_rating, college.total_reviews
          ]
        );
        collegeId = result.insertId;
        collegesCreated++;
      }

      // Link streams
      await promisePool.query(
        'DELETE FROM college_streams WHERE college_id = ?',
        [collegeId]
      );
      for (const streamId of college.streams) {
        await promisePool.query(
          'INSERT IGNORE INTO college_streams (college_id, stream_id) VALUES (?, ?)',
          [collegeId, streamId]
        );
      }

      // Insert/Update courses
      await promisePool.query(
        'DELETE FROM courses WHERE college_id = ?',
        [collegeId]
      );
      for (const course of college.courses) {
        await promisePool.query(
          `INSERT INTO courses 
            (college_id, stream_id, course_name, course_code, degree_type, 
             duration_years, total_seats, fees_per_year, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
          [
            collegeId, course.stream_id, course.course_name, course.course_code,
            course.degree_type, course.duration_years, course.total_seats,
            course.fees_per_year
          ]
        );
      }

      // Link facilities
      await promisePool.query(
        'DELETE FROM college_facilities WHERE college_id = ?',
        [collegeId]
      );
      for (const facilityId of college.facilities) {
        await promisePool.query(
          'INSERT IGNORE INTO college_facilities (college_id, facility_id) VALUES (?, ?)',
          [collegeId, facilityId]
        );
      }

      console.log(`   ✅ ${college.college_name} (${college.college_code})`);
    }

    console.log(`\n   📊 Summary: ${collegesCreated} created, ${collegesUpdated} updated\n`);

    // 3. Add admission info for first college
    const [firstCollege] = await promisePool.query(
      'SELECT college_id FROM colleges WHERE college_code = ?',
      [mockColleges[0].college_code]
    );
    if (firstCollege.length > 0) {
      const collegeId = firstCollege[0].college_id;
      await promisePool.query(
        `INSERT INTO admission_info 
          (college_id, admission_process, entrance_exam, cutoff_info, important_dates, documents_required)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         admission_process = VALUES(admission_process),
         entrance_exam = VALUES(entrance_exam),
         cutoff_info = VALUES(cutoff_info),
         important_dates = VALUES(important_dates),
         documents_required = VALUES(documents_required)`,
        [
          collegeId,
          'Merit-based admission through centralized online portal. Selection based on HSC marks and entrance test scores.',
          'University entrance exam',
          'Previous year cutoff: Commerce - 92%, Science - 88%, Arts - 80%',
          'Application starts: June 1st, Admission closes: July 15th',
          'HSC marksheet, Transfer certificate, Migration certificate, Aadhar card, Passport photos'
        ]
      );
    }

    // 4. Add placement info for first college
    if (firstCollege.length > 0) {
      const collegeId = firstCollege[0].college_id;
      await promisePool.query(
        `INSERT INTO placements 
          (college_id, academic_year, total_students_placed, placement_percentage, 
           highest_package, average_package, top_recruiters)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         total_students_placed = VALUES(total_students_placed),
         placement_percentage = VALUES(placement_percentage),
         highest_package = VALUES(highest_package),
         average_package = VALUES(average_package),
         top_recruiters = VALUES(top_recruiters)`,
        [
          collegeId,
          '2024-25',
          210,
          87.50,
          1800000.00,
          650000.00,
          'Deloitte, KPMG, EY, HDFC Bank, ICICI Bank, TCS, Infosys'
        ]
      );
    }

    console.log('✅ Database seed completed successfully!\n');
    console.log('📋 Summary:');
    console.log('   - Test user created/updated');
    console.log(`   - ${mockColleges.length} colleges seeded`);
    console.log('   - Admission and placement info added\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await promisePool.end();
  }
};

// Run seed
seedDatabase();

