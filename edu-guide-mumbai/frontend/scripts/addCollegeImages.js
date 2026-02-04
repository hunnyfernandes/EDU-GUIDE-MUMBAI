/**
 * Script to Add College Background Images from Unsplash
 * These are free, high-quality, diverse images for college backgrounds
 */

const { promisePool } = require('../config/database');
require('dotenv').config();

// College images mapping - Diverse, high-quality Unsplash URLs for ALL colleges
const collegeImages = {
  // Main Sample Data Colleges
  'St. Xavier\'s College': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=85',
  'HR College of Commerce and Economics': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=85',
  'Jai Hind College': 'https://images.unsplash.com/photo-1569163139394-de4798aa62b3?w=800&q=85',
  'KC College': 'https://images.unsplash.com/photo-1523050487297-f5b0661a01fb?w=800&q=85',
  'Mithibai College': 'https://images.unsplash.com/photo-1560264357-8d9766a55cfe?w=800&q=85',
  'VJTI - Veermata Jijabai Technological Institute': 'https://images.unsplash.com/photo-1577720643272-265e434d3b35?w=800&q=85',
  'Narsee Monjee Institute of Management Studies': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=85',
  'K.J. Somaiya College of Engineering': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=85',
  'Wilson College': 'https://images.unsplash.com/photo-1502910917128-1aa500764cbd?w=800&q=85',
  'Ramnarain Ruia Autonomous College': 'https://images.unsplash.com/photo-1516321318423-f06f70674ce0?w=800&q=85',
  
  // Additional colleges that might be in database
  'IIT Bombay': 'https://images.unsplash.com/photo-1553531088-d3012dc7e59f?w=800&q=85',
  'Narsee Monjee College of Commerce and Economics': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=85',
  'D.G. Ruparel College': 'https://images.unsplash.com/photo-1523050487297-f5b0661a01fb?w=800&q=85',
  'Bombay College of Pharmacy': 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=800&q=85',
  'SNDT Women\'s University': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=85',
  'Sophia College': 'https://images.unsplash.com/photo-1516534775068-bb57845a1533?w=800&q=85',
  'Fergusson College': 'https://images.unsplash.com/photo-1427504494785-cdaeb4b3af2d?w=800&q=85',
  'Khalsa College': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=85',
  'Goa Institute of Management': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=85',
  'Christ University': 'https://images.unsplash.com/photo-1571260899db-ab967c9e1c13?w=800&q=85'
};

// Default images by college type (fallback for colleges not in mapping)
const defaultImagesByType = {
  'Government': 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=85',
  'Private': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=85',
  'Aided': 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&q=85',
  'Autonomous': 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=85'
};

async function addCollegeImages() {
  try {
    console.log('🖼️ Adding college background images...\n');

    let updatedCount = 0;
    let skippedCount = 0;

    // First, update colleges that have specific images mapped
    for (const [collegeName, imageUrl] of Object.entries(collegeImages)) {
      try {
        // Find college by name
        const [colleges] = await promisePool.query(
          'SELECT college_id FROM colleges WHERE college_name = ? LIMIT 1',
          [collegeName]
        );

        if (!colleges || colleges.length === 0) {
          console.log(`  ⚠️  College not found: ${collegeName}`);
          skippedCount++;
          continue;
        }

        const collegeId = colleges[0].college_id;

        // Update college with image URL
        await promisePool.query(
          'UPDATE colleges SET cover_image_url = ? WHERE college_id = ?',
          [imageUrl, collegeId]
        );

        console.log(`  ✅ Added image: ${collegeName}`);
        updatedCount++;
      } catch (error) {
        console.error(`  ❌ Error for ${collegeName}:`, error.message);
      }
    }

    // Then, update colleges without images using type-based defaults
    console.log('\n🔄 Updating remaining colleges with type-based images...\n');
    
    const [remainingColleges] = await promisePool.query(
      'SELECT college_id, college_name, college_type FROM colleges WHERE cover_image_url IS NULL OR cover_image_url = ""'
    );

    for (const college of remainingColleges) {
      try {
        const imageUrl = defaultImagesByType[college.college_type] || defaultImagesByType['Private'];
        
        await promisePool.query(
          'UPDATE colleges SET cover_image_url = ? WHERE college_id = ?',
          [imageUrl, college.college_id]
        );

        console.log(`  ✅ Added default image for: ${college.college_name} (${college.college_type})`);
        updatedCount++;
      } catch (error) {
        console.error(`  ❌ Error for ${college.college_name}:`, error.message);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`  ✅ Updated: ${updatedCount}`);
    console.log(`  ⚠️  Skipped: ${skippedCount}`);
    console.log(`\n✅ College images added successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addCollegeImages();
