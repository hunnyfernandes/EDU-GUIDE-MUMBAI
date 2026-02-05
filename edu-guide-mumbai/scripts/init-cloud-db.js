const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const config = {
  host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '2ST8jsi8rqo9KYA.root',
  password: 'nmPYTeOZXv4gkfP0',
  database: 'test',
  ssl: {
    rejectUnauthorized: false
  }
};

async function initDB() {
  console.log('🔌 Connecting to TiDB Cloud...');
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Connected successfully!');

    // Read schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const sampleDataPath = path.join(__dirname, '../database/sample_data.sql');
    
    console.log('📄 Reading schema file...');
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Remove "USE test;" or similar if present, as we are already connected to 'test'
    // Also split by semicolon to run statements one by one
    // But TiDB/MySQL usually supports multiple statements if configured
    // Let's use simple splitting
    
    // Clean up SQL: remove "USE test;" line 4
    schemaSql = schemaSql.replace(/USE test;/g, '');
    schemaSql = schemaSql.replace(/ALTER TABLE colleges MODIFY established_year INT;/g, ''); // Remove this if table doesn't exist yet

    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`🚀 Executing ${statements.length} schema statements...`);
    
    for (const stmt of statements) {
      try {
        await connection.query(stmt);
      } catch (err) {
        // Ignore "Table already exists" errors
        if (err.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log(`   ⚠️  Table already exists (skipping)`);
        } else {
          console.log(`   ⚠️  Error executing statement: ${stmt.substring(0, 50)}...`);
          console.log(`      Error: ${err.message}`);
        }
      }
    }
    
    console.log('✅ Schema initialized!');

    // Check if we need to seed data
    const [rows] = await connection.query('SELECT count(*) as count FROM colleges');
    if (rows[0].count === 0) {
        console.log('🌱 Seeding sample data...');
        let seedSql = fs.readFileSync(sampleDataPath, 'utf8');
        seedSql = seedSql.replace(/USE test;/g, '');
        
        const seedStatements = seedSql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);
            
        for (const stmt of seedStatements) {
            try {
                await connection.query(stmt);
            } catch (err) {
                 console.log(`   ⚠️  Error seeding: ${err.message}`);
            }
        }
        console.log('✅ Data seeded!');
    } else {
        console.log('ℹ️  Data already exists, skipping seed.');
    }

  } catch (error) {
    console.error('❌ Fatal Error:', error);
  } finally {
    if (connection) await connection.end();
  }
}

initDB();
