/**
 * Script to verify colleges and interests data in database
 */

const { promisePool } = require('../config/database');
require('dotenv').config();

async function verifyData() {
  try {
    console.log('🔍 Verifying database data...\n');

    // Count colleges
    const [collegesResult] = await promisePool.query('SELECT COUNT(*) as count FROM colleges');
    console.log(`📍 Total Colleges: ${collegesResult[0].count}`);

    // Count interests
    const [interestsResult] = await promisePool.query('SELECT COUNT(*) as count FROM interests');
    console.log(`🎯 Total Interests: ${interestsResult[0].count}`);

    // Count college-interest links
    const [linksResult] = await promisePool.query('SELECT COUNT(*) as count FROM college_interests');
    console.log(`🔗 Total College-Interest Links: ${linksResult[0].count}`);

    // Sample colleges
    const [colleges] = await promisePool.query(`
      SELECT college_id, college_name, college_type, average_rating
      FROM colleges
      LIMIT 5
    `);
    console.log(`\n📚 Sample Colleges:`);
    colleges.forEach(c => {
      console.log(`  - ${c.college_name} (${c.college_type}) - Rating: ${c.average_rating || 'N/A'}`);
    });

    // Sample interests
    const [interests] = await promisePool.query(`
      SELECT interest_id, interest_name, category
      FROM interests
      LIMIT 5
    `);
    console.log(`\n🎯 Sample Interests:`);
    interests.forEach(i => {
      console.log(`  - ${i.interest_name} (${i.category})`);
    });

    // College with interests
    const [collegeWithInterests] = await promisePool.query(`
      SELECT c.college_id, c.college_name, 
             GROUP_CONCAT(i.interest_name SEPARATOR ', ') as interests
      FROM colleges c
      LEFT JOIN college_interests ci ON c.college_id = ci.college_id
      LEFT JOIN interests i ON ci.interest_id = i.interest_id
      WHERE c.college_id = (SELECT college_id FROM colleges LIMIT 1)
      GROUP BY c.college_id
    `);
    
    if (collegeWithInterests.length > 0) {
      const c = collegeWithInterests[0];
      console.log(`\n🏫 College with Interests Example:`);
      console.log(`  College: ${c.college_name}`);
      console.log(`  Interests: ${c.interests}`);
    }

    console.log('\n✅ Verification complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyData();
