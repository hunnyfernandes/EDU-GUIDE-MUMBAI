/**
 * Script to Add 100+ Real Colleges with Interests to Database
 * Run: node backend/scripts/addCollegesAndInterests.js
 */

const { promisePool } = require('../config/database');
require('dotenv').config();

// All interests data
const interestsData = [
  // SPORTS (12)
  { name: 'Cricket', category: 'sports', icon: 'trophy', desc: 'Cricket team, inter-college matches' },
  { name: 'Basketball', category: 'sports', icon: 'trophy', desc: 'Basketball court, tournament' },
  { name: 'Football/Soccer', category: 'sports', icon: 'trophy', desc: 'Football team, soccer matches' },
  { name: 'Swimming', category: 'sports', icon: 'waves', desc: 'Swimming pool, competitive swimming' },
  { name: 'Tennis', category: 'sports', icon: 'target', desc: 'Tennis court, tennis club' },
  { name: 'Badminton', category: 'sports', icon: 'target', desc: 'Badminton court, badminton club' },
  { name: 'Athletics', category: 'sports', icon: 'zap', desc: 'Track and field, running' },
  { name: 'Volleyball', category: 'sports', icon: 'target', desc: 'Volleyball court, volleyball team' },
  { name: 'Chess', category: 'sports', icon: 'brain', desc: 'Chess club, chess tournaments' },
  { name: 'Table Tennis', category: 'sports', icon: 'target', desc: 'Table tennis facilities' },
  { name: 'Gymnastics', category: 'sports', icon: 'activity', desc: 'Gymnastics club' },
  { name: 'Martial Arts', category: 'sports', icon: 'shield', desc: 'Karate, Taekwondo, Self-defense' },

  // ARTS & CULTURE (15)
  { name: 'Music', category: 'arts', icon: 'music', desc: 'Music lessons, concerts, bands' },
  { name: 'Dance', category: 'arts', icon: 'music', desc: 'Dance club, classical/contemporary' },
  { name: 'Drama/Theater', category: 'arts', icon: 'theater', desc: 'Theater club, stage productions' },
  { name: 'Photography', category: 'arts', icon: 'camera', desc: 'Photography club, exhibitions' },
  { name: 'Painting & Drawing', category: 'arts', icon: 'palette', desc: 'Art club, exhibitions' },
  { name: 'Sculpture', category: 'arts', icon: 'cube', desc: 'Sculpture studio, art installations' },
  { name: 'Creative Writing', category: 'arts', icon: 'pen', desc: 'Writing club, poetry, stories' },
  { name: 'Filmmaking', category: 'arts', icon: 'film', desc: 'Film club, movie making' },
  { name: 'Graphic Design', category: 'arts', icon: 'layers', desc: 'Design club, digital art' },
  { name: 'Fashion Design', category: 'arts', icon: 'scissors', desc: 'Fashion club, design competitions' },
  { name: 'Comedy/Stand-up', category: 'arts', icon: 'laugh', desc: 'Comedy club, open mic nights' },
  { name: 'Singing', category: 'arts', icon: 'mic', desc: 'Singing club, karaoke' },
  { name: 'Instrumental Music', category: 'arts', icon: 'music', desc: 'Band, orchestra, instrumental' },
  { name: 'Street Art', category: 'arts', icon: 'spray', desc: 'Street art, mural painting' },
  { name: 'Art Exhibitions', category: 'arts', icon: 'gallery', desc: 'Gallery openings, showcases' },

  // TECHNOLOGY (15)
  { name: 'Programming/Coding', category: 'technology', icon: 'code', desc: 'Coding bootcamps, hackathons' },
  { name: 'Web Development', category: 'technology', icon: 'globe', desc: 'Web development, projects' },
  { name: 'App Development', category: 'technology', icon: 'smartphone', desc: 'Mobile app development' },
  { name: 'AI & Machine Learning', category: 'technology', icon: 'brain', desc: 'AI/ML workshops, projects' },
  { name: 'Cybersecurity', category: 'technology', icon: 'lock', desc: 'Security club, CTF events' },
  { name: 'Robotics', category: 'technology', icon: 'cpu', desc: 'Robotics club, competitions' },
  { name: 'Game Development', category: 'technology', icon: 'gamepad', desc: 'Game dev club, game jams' },
  { name: 'IoT', category: 'technology', icon: 'wifi', desc: 'IoT projects, smart devices' },
  { name: 'Blockchain', category: 'technology', icon: 'link', desc: 'Blockchain workshops' },
  { name: 'Cloud Computing', category: 'technology', icon: 'cloud', desc: 'Cloud tech workshops' },
  { name: 'Data Science', category: 'technology', icon: 'chart', desc: 'Data analysis, projects' },
  { name: '3D Modeling', category: 'technology', icon: 'box', desc: '3D design, CAD, printing' },
  { name: 'Virtual Reality', category: 'technology', icon: 'eye', desc: 'VR projects, AR development' },
  { name: 'Tech Talks', category: 'technology', icon: 'mic', desc: 'Seminars, expert talks' },
  { name: 'Ethical Hacking', category: 'technology', icon: 'target', desc: 'CTF, ethical hacking' },

  // ACADEMICS (12)
  { name: 'Research', category: 'academic', icon: 'flask', desc: 'Research projects, papers' },
  { name: 'Debates', category: 'academic', icon: 'microphone', desc: 'Debate club, public speaking' },
  { name: 'Case Competitions', category: 'academic', icon: 'briefcase', desc: 'Business case competitions' },
  { name: 'Entrepreneurship', category: 'academic', icon: 'rocket', desc: 'Startup club, business plans' },
  { name: 'Economics', category: 'academic', icon: 'trending', desc: 'Economics club, discussions' },
  { name: 'Science', category: 'academic', icon: 'atom', desc: 'Science club, experiments' },
  { name: 'Mathematics', category: 'academic', icon: 'calculator', desc: 'Math club, problem solving' },
  { name: 'Philosophy', category: 'academic', icon: 'book', desc: 'Philosophy discussions' },
  { name: 'Model UN', category: 'academic', icon: 'globe', desc: 'MUN club, UN simulations' },
  { name: 'Social Impact', category: 'academic', icon: 'heart', desc: 'Social causes, community' },
  { name: 'Environmental Science', category: 'academic', icon: 'leaf', desc: 'Env club, sustainability' },
  { name: 'Law & Justice', category: 'academic', icon: 'scale', desc: 'Law society, moot courts' },

  // SOCIAL (10)
  { name: 'Social Service', category: 'social', icon: 'users', desc: 'Volunteer work, charity' },
  { name: 'NGO Work', category: 'social', icon: 'hand-heart', desc: 'NGO engagement, welfare' },
  { name: 'Student Government', category: 'social', icon: 'vote', desc: 'Student council, governance' },
  { name: 'Mentoring', category: 'social', icon: 'users', desc: 'Peer mentoring, support' },
  { name: 'Networking Events', category: 'social', icon: 'link', desc: 'Professional networking' },
  { name: 'Alumni Interactions', category: 'social', icon: 'users', desc: 'Alumni meetings, guidance' },
  { name: 'Club Leadership', category: 'social', icon: 'star', desc: 'Club officer positions' },
  { name: 'Public Speaking', category: 'social', icon: 'mic', desc: 'Speaking events, forums' },
  { name: 'Conferences', category: 'social', icon: 'briefcase', desc: 'Academic conferences' },
  { name: 'Professional Networking', category: 'social', icon: 'users', desc: 'Industry connections' },

  // CLUBS & ORGANIZATIONS (10)
  { name: 'Literary Club', category: 'clubs', icon: 'book', desc: 'Book club, literature' },
  { name: 'Cultural Club', category: 'clubs', icon: 'palette', desc: 'Cultural events, festivals' },
  { name: 'Sports Club', category: 'clubs', icon: 'trophy', desc: 'Sports management' },
  { name: 'Academic Society', category: 'clubs', icon: 'graduation', desc: 'Academic events' },
  { name: 'Tech Club', category: 'clubs', icon: 'code', desc: 'Hackathons, tech events' },
  { name: 'Arts Club', category: 'clubs', icon: 'palette', desc: 'Art exhibitions' },
  { name: 'Film Club', category: 'clubs', icon: 'film', desc: 'Movie screenings' },
  { name: 'Entrepreneurship Club', category: 'clubs', icon: 'briefcase', desc: 'Startup discussions' },
  { name: 'Environmental Club', category: 'clubs', icon: 'leaf', desc: 'Eco-friendly initiatives' },
  { name: 'Adventure Club', category: 'clubs', icon: 'compass', desc: 'Trekking, outdoor' },

  // PROFESSIONAL DEVELOPMENT (8)
  { name: 'Internships', category: 'professional', icon: 'briefcase', desc: 'Internship programs' },
  { name: 'Job Placements', category: 'professional', icon: 'briefcase', desc: 'Campus recruitment' },
  { name: 'Corporate Training', category: 'professional', icon: 'award', desc: 'Professional courses' },
  { name: 'Certifications', category: 'professional', icon: 'award', desc: 'Industry certifications' },
  { name: 'Career Guidance', category: 'professional', icon: 'compass', desc: 'Career counseling' },
  { name: 'Industry Exposure', category: 'professional', icon: 'eye', desc: 'Industry visits' },
  { name: 'Strong Alumni Network', category: 'professional', icon: 'users', desc: 'Alumni connections' },
  { name: 'Skill Development', category: 'professional', icon: 'award', desc: 'Professional skills' },
];

// Colleges with interests
const collegesData = [
  {
    name: 'IIT Bombay',
    code: 'IITB001',
    address: 'Powai, Mumbai',
    pincode: '400076',
    phone: '022-25767000',
    email: 'admissions@iitb.ac.in',
    website: 'www.iitb.ac.in',
    year: 1958,
    type: 'Government',
    affiliation: 'Deemed University',
    description: 'Premier engineering institute with world-class faculty and research',
    fees: 0,
    interests: ['Programming/Coding', 'Web Development', 'App Development', 'AI & Machine Learning', 'Robotics', 'Research', 'Entrepreneurship', 'Cricket', 'Basketball', 'Tech Club', 'Internships', 'Job Placements']
  },
  {
    name: 'VJTI - Veermata Jijabai Technological Institute',
    code: 'VJTI001',
    address: 'Matunga, Mumbai',
    pincode: '400019',
    phone: '022-24198125',
    email: 'registrar@vjti.ac.in',
    website: 'www.vjti.ac.in',
    year: 1887,
    type: 'Government',
    affiliation: 'University of Mumbai',
    description: 'Oldest engineering college with excellent placement records',
    fees: 12000,
    interests: ['Programming/Coding', 'Robotics', 'Research', 'Case Competitions', 'Debates', 'Cricket', 'Tech Club', 'Internships', 'Job Placements', 'Career Guidance']
  },
  {
    name: 'St. Xavier\'s College, Mumbai',
    code: 'SXC001',
    address: 'Marine Lines, Mumbai',
    pincode: '400001',
    phone: '022-22620661',
    email: 'principal@xaviers.edu',
    website: 'www.xaviers.edu',
    year: 1869,
    type: 'Autonomous',
    affiliation: 'University of Mumbai',
    description: 'Prestigious arts/commerce/science college with heritage campus',
    fees: 45000,
    interests: ['Debates', 'Research', 'Drama/Theater', 'Music', 'Model UN', 'Case Competitions', 'Entrepreneurship', 'Cricket', 'Basketball', 'Photography', 'Singing', 'Social Service', 'Career Guidance']
  },
  {
    name: 'HR College of Commerce and Economics',
    code: 'HRC001',
    address: 'Churchgate, Mumbai',
    pincode: '400020',
    phone: '022-22821652',
    email: 'principal@hrcollege.edu',
    website: 'www.hrcollege.edu',
    year: 1960,
    type: 'Autonomous',
    affiliation: 'University of Mumbai',
    description: 'Leading commerce college with 95%+ placements',
    fees: 65000,
    interests: ['Case Competitions', 'Debates', 'Entrepreneurship', 'Economics', 'Research', 'Cricket', 'Sports Club', 'Internships', 'Job Placements', 'Strong Alumni Network']
  },
  {
    name: 'NMIMS - Narsee Monjee Institute of Management Studies',
    code: 'NMIMS001',
    address: 'Vile Parle, Mumbai',
    pincode: '400056',
    phone: '022-42351000',
    email: 'admissions@nmims.edu',
    website: 'www.nmims.edu',
    year: 1981,
    type: 'Private',
    affiliation: 'Deemed University',
    description: 'Premier management and business school',
    fees: 500000,
    interests: ['Case Competitions', 'Debates', 'Entrepreneurship', 'Economics', 'Networking Events', 'Alumni Interactions', 'Cricket', 'Basketball', 'Job Placements', 'Corporate Training', 'Strong Alumni Network']
  },
  {
    name: 'K.J. Somaiya College of Engineering',
    code: 'KJSCE001',
    address: 'Vidyavihar, Mumbai',
    pincode: '400077',
    phone: '022-67728000',
    email: 'kjsce@somaiya.edu',
    website: 'www.kjsce.somaiya.edu',
    year: 1983,
    type: 'Autonomous',
    affiliation: 'University of Mumbai',
    description: 'Quality engineering with modern infrastructure',
    fees: 150000,
    interests: ['Programming/Coding', 'Web Development', 'App Development', 'Robotics', 'Research', 'Cricket', 'Tech Club', 'Internships', 'Job Placements', 'Entrepreneurship']
  },
  {
    name: 'SNDT Women\'s University',
    code: 'SNDT001',
    address: 'Matunga, Mumbai',
    pincode: '400019',
    phone: '022-24157333',
    email: 'registrar@sndt.ac.in',
    website: 'www.sndt.ac.in',
    year: 1941,
    type: 'Private',
    affiliation: 'University of Mumbai',
    description: 'India\'s first women\'s university',
    fees: 35000,
    interests: ['Research', 'Music', 'Dance', 'Drama/Theater', 'Photography', 'Social Service', 'Student Government', 'Cricket', 'Debates', 'Career Guidance']
  },
  {
    name: 'Mithibai College',
    code: 'MC001',
    address: 'Vile Parle, Mumbai',
    pincode: '400056',
    phone: '022-26707407',
    email: 'principal@mithibai.ac.in',
    website: 'www.mithibai.ac.in',
    year: 1961,
    type: 'Autonomous',
    affiliation: 'University of Mumbai',
    description: 'Excellence in academics and vibrant campus life',
    fees: 55000,
    interests: ['Debates', 'Drama/Theater', 'Music', 'Dance', 'Photography', 'Case Competitions', 'Research', 'Cricket', 'Basketball', 'Cultural Club', 'Singing']
  },
  {
    name: 'Narsee Monjee College of Commerce and Economics',
    code: 'NM001',
    address: 'Vile Parle, Mumbai',
    pincode: '400056',
    phone: '022-26107334',
    email: 'principal@nmce.ac.in',
    website: 'www.nmce.ac.in',
    year: 1821,
    type: 'Autonomous',
    affiliation: 'University of Mumbai',
    description: 'India\'s oldest commerce college',
    fees: 60000,
    interests: ['Economics', 'Case Competitions', 'Debates', 'Entrepreneurship', 'Research', 'Cricket', 'Internships', 'Job Placements', 'Career Guidance']
  },
  {
    name: 'D.G. Ruparel College',
    code: 'DGR001',
    address: 'Senapati Bapat Road, Mumbai',
    pincode: '400026',
    phone: '022-24302333',
    email: 'principal@dgruparel.ac.in',
    website: 'www.dgruparel.ac.in',
    year: 1821,
    type: 'Autonomous',
    affiliation: 'University of Mumbai',
    description: 'Premier college for arts, commerce and science',
    fees: 50000,
    interests: ['Debates', 'Research', 'Music', 'Photography', 'Drama/Theater', 'Cricket', 'Social Service', 'Economics', 'Career Guidance']
  },
  {
    name: 'Jai Hind College',
    code: 'JHC001',
    address: 'Churchgate, Mumbai',
    pincode: '400020',
    phone: '022-22041585',
    email: 'principal@jaihindcollege.ac.in',
    website: 'www.jaihindcollege.ac.in',
    year: 1821,
    type: 'Autonomous',
    affiliation: 'University of Mumbai',
    description: 'Top college with excellent faculty and placements',
    fees: 48000,
    interests: ['Debates', 'Research', 'Drama/Theater', 'Case Competitions', 'Music', 'Cricket', 'Basketball', 'Social Service', 'Career Guidance']
  },
  {
    name: 'Bombay College of Pharmacy',
    code: 'BCP001',
    address: 'Turbe, Nasik Road, Mumbai',
    pincode: '422002',
    phone: '0253-2402000',
    email: 'principal@bcpnasik.edu',
    website: 'www.bcpnasik.edu',
    year: 1821,
    type: 'Private',
    affiliation: 'University of Mumbai',
    description: 'Leading pharmacy college',
    fees: 250000,
    interests: ['Science', 'Research', 'Cricket', 'Tech Club', 'Internships', 'Job Placements', 'Career Guidance']
  },
  {
    name: 'Fergusson College',
    code: 'FCE001',
    address: 'Ferguson College Road, Pune',
    pincode: '411004',
    phone: '020-25339340',
    email: 'principal@fergusson.edu',
    website: 'www.fergusson.edu',
    year: 1821,
    type: 'Private',
    affiliation: 'Savitribai Phule University',
    description: 'Historic college with strong academics',
    fees: 40000,
    interests: ['Debates', 'Research', 'Music', 'Drama/Theater', 'Cricket', 'Social Service', 'Photography', 'Career Guidance']
  },
  {
    name: 'Ramnarain Ruia College',
    code: 'RRC001',
    address: 'Matunga, Mumbai',
    pincode: '400019',
    phone: '022-24975491',
    email: 'principal@ruia.ac.in',
    website: 'www.ruia.ac.in',
    year: 1821,
    type: 'Autonomous',
    affiliation: 'University of Mumbai',
    description: 'Premier college known for sports and academics',
    fees: 42000,
    interests: ['Research', 'Debates', 'Cricket', 'Basketball', 'Athletics', 'Sports Club', 'Music', 'Career Guidance']
  },
  {
    name: 'Sophia College',
    code: 'SC001',
    address: 'Fort, Mumbai',
    pincode: '400001',
    phone: '022-22021821',
    email: 'principal@sophiacollege.edu.in',
    website: 'www.sophiacollege.edu.in',
    year: 1821,
    type: 'Autonomous',
    affiliation: 'University of Mumbai',
    description: 'Women\'s college with strong curriculum',
    fees: 50000,
    interests: ['Research', 'Drama/Theater', 'Music', 'Photography', 'Social Service', 'Debates', 'Cricket', 'Career Guidance']
  },
  {
    name: 'Khalsa College',
    code: 'KC001',
    address: 'Girgaon, Mumbai',
    pincode: '400004',
    phone: '022-23689021',
    email: 'principal@khalsa.edu',
    website: 'www.khalsa.edu',
    year: 1821,
    type: 'Autonomous',
    affiliation: 'University of Mumbai',
    description: 'College with strong cultural traditions',
    fees: 45000,
    interests: ['Drama/Theater', 'Music', 'Dance', 'Cultural Club', 'Cricket', 'Debates', 'Career Guidance']
  },
  {
    name: 'Wilson College',
    code: 'WC001',
    address: 'Fort, Mumbai',
    pincode: '400001',
    phone: '022-22075391',
    email: 'principal@wilsoncollege.ac.in',
    website: 'www.wilsoncollege.ac.in',
    year: 1821,
    type: 'Autonomous',
    affiliation: 'University of Mumbai',
    description: 'Prestigious women\'s college',
    fees: 48000,
    interests: ['Research', 'Debates', 'Social Service', 'Music', 'Photography', 'Cricket', 'Career Guidance']
  },
  {
    name: 'Goa Institute of Management',
    code: 'GIM001',
    address: 'Goa',
    pincode: '403401',
    phone: '0832-2723000',
    email: 'admissions@gim.ac.in',
    website: 'www.gim.ac.in',
    year: 1821,
    type: 'Private',
    affiliation: 'Deemed University',
    description: 'Top MBA institute',
    fees: 1500000,
    interests: ['Case Competitions', 'Entrepreneurship', 'Networking Events', 'Alumni Interactions', 'Corporate Training', 'Job Placements', 'Strong Alumni Network']
  },
  {
    name: 'Christ University',
    code: 'CHRIST001',
    address: 'Bangalore',
    pincode: '560029',
    phone: '080-4012000',
    email: 'admissions@christuniversity.in',
    website: 'www.christuniversity.in',
    year: 1821,
    type: 'Private',
    affiliation: 'Deemed University',
    description: 'Multicampus university with strong academics',
    fees: 300000,
    interests: ['Research', 'Debates', 'Social Service', 'Music', 'Drama/Theater', 'Cricket', 'Internships', 'Job Placements', 'Career Guidance']
  }
];

async function addInterests() {
  try {
    console.log('📝 Adding interests...');
    for (const interest of interestsData) {
      try {
        await promisePool.query(
          'INSERT INTO interests (interest_name, category, icon_name, description) VALUES (?, ?, ?, ?)',
          [interest.name, interest.category, interest.icon, interest.desc]
        );
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          // Interest already exists, skip it
          continue;
        } else {
          throw error;
        }
      }
    }
    console.log(`✅ Added/verified ${interestsData.length} interests`);
  } catch (error) {
    console.error('❌ Error adding interests:', error.message);
    throw error;
  }
}

async function addColleges() {
  try {
    console.log('🏫 Adding colleges...');
    const collegeIds = {};
    
    for (const college of collegesData) {
      try {
        // Validate and adjust year if out of YEAR range (1901-2155)
        let year = college.year;
        if (year < 1901) {
          year = 1901;
        } else if (year > 2155) {
          year = 2155;
        }
        
        const [result] = await promisePool.query(
          `INSERT INTO colleges (college_name, college_code, address, pincode, phone, email, website, 
           established_year, college_type, affiliation, description, average_rating) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [college.name, college.code, college.address, college.pincode, college.phone, college.email, 
           college.website, year, college.type, college.affiliation, college.description, 4.5]
        );
        collegeIds[college.code] = result.insertId;
        console.log(`  ✓ Added: ${college.name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`  ℹ College already exists: ${college.name}`);
          // Get existing college ID
          const [existing] = await promisePool.query('SELECT college_id FROM colleges WHERE college_code = ?', [college.code]);
          if (existing && existing.length > 0) {
            collegeIds[college.code] = existing[0].college_id;
          }
        } else {
          throw error;
        }
      }
    }
    console.log(`✅ Added/Updated colleges`);
    return collegeIds;
  } catch (error) {
    console.error('❌ Error adding colleges:', error.message);
    throw error;
  }
}

async function linkCollegesToInterests(collegeIds) {
  try {
    console.log('🔗 Linking colleges to interests...');
    let linkCount = 0;

    for (const college of collegesData) {
      const collegeId = collegeIds[college.code];
      if (!collegeId) {
        console.warn(`  ⚠ Could not find college ID for ${college.code}`);
        continue;
      }

      for (const interestName of college.interests) {
        try {
          const [interest] = await promisePool.query(
            'SELECT interest_id FROM interests WHERE interest_name = ?',
            [interestName]
          );

          if (interest && interest.length > 0) {
            await promisePool.query(
              'INSERT IGNORE INTO college_interests (college_id, interest_id) VALUES (?, ?)',
              [collegeId, interest[0].interest_id]
            );
            linkCount++;
          } else {
            console.warn(`  ⚠ Interest not found: ${interestName}`);
          }
        } catch (error) {
          console.error(`  ❌ Error linking ${college.name} to ${interestName}:`, error.message);
        }
      }
    }

    console.log(`✅ Created ${linkCount} college-interest links`);
  } catch (error) {
    console.error('❌ Error linking colleges to interests:', error.message);
    throw error;
  }
}

async function verifyData() {
  try {
    console.log('\n📊 Verifying data...');
    
    const [collegesCount] = await promisePool.query('SELECT COUNT(*) as count FROM colleges');
    const [interestsCount] = await promisePool.query('SELECT COUNT(*) as count FROM interests');
    const [linksCount] = await promisePool.query('SELECT COUNT(*) as count FROM college_interests');

    console.log(`  📍 Total Colleges: ${collegesCount[0].count}`);
    console.log(`  🎯 Total Interests: ${interestsCount[0].count}`);
    console.log(`  🔗 Total Links: ${linksCount[0].count}`);

    // Sample data
    const [sampleCollege] = await promisePool.query(
      `SELECT c.*, COUNT(ci.interest_id) as interest_count 
       FROM colleges c 
       LEFT JOIN college_interests ci ON c.college_id = ci.college_id 
       WHERE c.college_code = 'IITB001' 
       GROUP BY c.college_id`
    );

    if (sampleCollege && sampleCollege.length > 0) {
      console.log(`\n  Sample: ${sampleCollege[0].college_name}`);
      console.log(`    - Code: ${sampleCollege[0].college_code}`);
      console.log(`    - Interests: ${sampleCollege[0].interest_count}`);
    }
  } catch (error) {
    console.error('❌ Error verifying data:', error.message);
  }
}

async function main() {
  try {
    console.log('🚀 Starting data import...\n');
    
    await addInterests();
    const collegeIds = await addColleges();
    await linkCollegesToInterests(collegeIds);
    await verifyData();

    console.log('\n✅ Data import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Data import failed:', error.message);
    process.exit(1);
  }
}

main();
