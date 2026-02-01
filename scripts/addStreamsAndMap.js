/**
 * Script to Add More Streams and Map to Colleges
 */

const { promisePool } = require('../config/database');
require('dotenv').config();

// Additional streams to add
const additionalStreams = [
  { stream_name: 'Pharmacy', stream_code: 'PHARM', description: 'Pharmacy, Healthcare, and Pharmaceutical sciences' },
  { stream_name: 'Law', stream_code: 'LAW', description: 'Law, Legal Studies, and Jurisprudence' },
  { stream_name: 'Finance', stream_code: 'FIN', description: 'Finance, Banking, Investment, and Accounting' },
  { stream_name: 'Economics', stream_code: 'ECON', description: 'Economics, Statistics, and Research' },
  { stream_name: 'Psychology', stream_code: 'PSY', description: 'Psychology, Behavioral Sciences, and Human Development' },
];

// College to Streams mapping
const collegeStreamMappings = {
  'IIT Bombay': ['Engineering', 'Science', 'Information Technology'],
  'VJTI - Veermata Jijabai Technological Institute': ['Engineering', 'Information Technology'],
  'K.J. Somaiya College of Engineering': ['Engineering', 'Information Technology', 'Management'],
  'HR College of Commerce and Economics': ['Commerce', 'Economics', 'Finance', 'Management'],
  'Mithibai College': ['Commerce', 'Arts', 'Science'],
  'Narsee Monjee College of Commerce and Economics': ['Commerce', 'Finance', 'Economics', 'Management'],
  'D.G. Ruparel College': ['Commerce', 'Arts', 'Science'],
  'Jai Hind College': ['Commerce', 'Arts', 'Science'],
  'Bombay College of Pharmacy': ['Pharmacy', 'Science'],
  'SNDT Women\'s University': ['Arts', 'Commerce', 'Science', 'Management'],
  'Sophia College': ['Arts', 'Commerce', 'Science'],
  'Wilson College': ['Arts', 'Commerce', 'Science'],
  'St. Xavier\'s College': ['Arts', 'Commerce', 'Science', 'Management'],
  'Fergusson College': ['Arts', 'Science', 'Management'],
  'Ramnarain Ruia College': ['Arts', 'Commerce', 'Science'],
  'Khalsa College': ['Arts', 'Commerce', 'Science'],
  'Goa Institute of Management': ['Management'],
  'Christ University': ['Engineering', 'Management', 'Science', 'Commerce'],
};

async function addStreamsAndMap() {
  console.log('📚 Adding streams and mapping to colleges...\n');
  
  let streamsAdded = 0;
  let streamsMapped = 0;

  // Add new streams
  for (const stream of additionalStreams) {
    try {
      await promisePool.query(
        'INSERT INTO streams (stream_name, stream_code, description) VALUES (?, ?, ?)',
        [stream.stream_name, stream.stream_code, stream.description]
      );
      console.log(`  ✅ Added stream: ${stream.stream_name}`);
      streamsAdded++;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`  ⚠️  Stream already exists: ${stream.stream_name}`);
      } else {
        console.error(`  ❌ Error adding ${stream.stream_name}:`, error.message);
      }
    }
  }

  console.log(`\n✅ New streams added: ${streamsAdded}\n`);

  // Map colleges to streams
  console.log('🔗 Mapping colleges to streams...\n');
  
  for (const [collegeName, streams] of Object.entries(collegeStreamMappings)) {
    try {
      // Get college ID
      const [collegeResult] = await promisePool.query(
        'SELECT college_id FROM colleges WHERE college_name = ?',
        [collegeName]
      );

      if (collegeResult.length === 0) {
        console.log(`  ⚠️  College not found: ${collegeName}`);
        continue;
      }

      const collegeId = collegeResult[0].college_id;

      // Clear existing mappings for this college
      await promisePool.query(
        'DELETE FROM college_streams WHERE college_id = ?',
        [collegeId]
      );

      // Add new mappings
      for (const streamName of streams) {
        try {
          const [streamResult] = await promisePool.query(
            'SELECT stream_id FROM streams WHERE stream_name = ?',
            [streamName]
          );

          if (streamResult.length === 0) {
            console.log(`  ⚠️  Stream not found: ${streamName}`);
            continue;
          }

          const streamId = streamResult[0].stream_id;

          await promisePool.query(
            'INSERT INTO college_streams (college_id, stream_id) VALUES (?, ?)',
            [collegeId, streamId]
          );

          streamsMapped++;
        } catch (error) {
          if (error.code !== 'ER_DUP_ENTRY') {
            console.error(`  ❌ Error mapping ${collegeName} to ${streamName}:`, error.message);
          }
        }
      }

      console.log(`  ✅ Mapped ${collegeName} to ${streams.length} streams`);
    } catch (error) {
      console.error(`  ❌ Error processing ${collegeName}:`, error.message);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  ✅ Streams added: ${streamsAdded}`);
  console.log(`  ✅ Stream mappings created: ${streamsMapped}`);
  console.log(`\n✅ Streams and mappings added successfully!`);
  
  process.exit(0);
}

// Run the script
addStreamsAndMap().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
