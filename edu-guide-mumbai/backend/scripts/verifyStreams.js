const { promisePool } = require('../config/database');

async function verifyStreams() {
  try {
    const [streams] = await promisePool.query('SELECT * FROM streams ORDER BY stream_id');
    console.log('\n📚 ALL STREAMS IN DATABASE:\n');
    console.log(`Total: ${streams.length} streams\n`);
    streams.forEach((s, i) => {
      console.log(`${i + 1}. ${s.stream_name} (${s.stream_code})`);
    });
    
    console.log('\n✅ Verification complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyStreams();
