const mysql = require('mysql2/promise');

async function checkTables() {
  const config = {
    host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    user: '2ST8jsi8rqo9KYA.root',
    password: 'nmPYTeOZXv4gkfP0',
    database: 'test',
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    },
    connectTimeout: 10000 // 10s timeout
  };

  console.log('Connecting to database...');
  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected!');

    console.log('Fetching tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    
    if (tables.length === 0) {
        console.log('⚠️ NO TABLES FOUND! The database is empty.');
        console.log('   You need to run the initialization script to create tables.');
    } else {
        console.log(`✅ Found ${tables.length} tables:`);
        tables.forEach(row => {
            const tableName = Object.values(row)[0];
            console.log(`   - ${tableName}`);
        });

        // Check if users table has data
        const usersTable = tables.find(t => Object.values(t)[0] === 'users');
        if (usersTable) {
            const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
            console.log(`   📊 Users count: ${rows[0].count}`);
        }
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTables();