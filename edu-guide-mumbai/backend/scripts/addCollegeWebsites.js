/**
 * Script to Add Official College Website URLs
 * Updates college records with their official website URLs
 */

const { promisePool } = require('../config/database');
require('dotenv').config();

// College website URLs mapping
const collegeWebsites = {
  'IIT Bombay': 'https://www.iitb.ac.in',
  'VJTI - Veermata Jijabai Technological Institute': 'https://www.vjti.ac.in',
  'K.J. Somaiya College of Engineering': 'https://www.kjsce.ac.in',
  'HR College of Commerce and Economics': 'https://www.hrcollege.edu.in',
  'Mithibai College': 'https://www.mithibai.ac.in',
  'Narsee Monjee College of Commerce and Economics': 'https://www.nm-cc.com',
  'D.G. Ruparel College': 'https://www.ruparel.ac.in',
  'Jai Hind College': 'https://www.jaihindcollege.ac.in',
  'Bombay College of Pharmacy': 'https://www.bombaycollegepharmacy.edu.in',
  'SNDT Women\'s University': 'https://www.sndt.ac.in',
  'Sophia College': 'https://www.sophiacollege.edu.in',
  'Wilson College': 'https://www.wilsoncollege.edu.in',
  'St. Xavier\'s College': 'https://www.xaviers.ac.in',
  'Fergusson College': 'https://www.fergusson.edu.in',
  'Ramnarain Ruia College': 'https://www.ruia.ac.in',
  'Khalsa College': 'https://www.khalsa.edu.in',
  'Goa Institute of Management': 'https://www.gim.ac.in',
  'Christ University': 'https://www.christuniversity.in'
};

async function addCollegeWebsites() {
  console.log('🌐 Adding college website URLs...\n');
  
  let added = 0;
  let skipped = 0;

  for (const [collegeName, website] of Object.entries(collegeWebsites)) {
    try {
      const [result] = await promisePool.query(
        'UPDATE colleges SET website = ? WHERE college_name = ?',
        [website, collegeName]
      );

      if (result.affectedRows > 0) {
        console.log(`  ✅ Added website: ${collegeName}`);
        added++;
      } else {
        console.log(`  ⚠️  Not found: ${collegeName}`);
        skipped++;
      }
    } catch (error) {
      console.error(`  ❌ Error for ${collegeName}:`, error.message);
      skipped++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  ✅ Updated: ${added}`);
  console.log(`  ⚠️  Skipped: ${skipped}`);
  console.log(`\n✅ College websites added successfully!`);
  
  process.exit(0);
}

// Run the script
addCollegeWebsites().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
