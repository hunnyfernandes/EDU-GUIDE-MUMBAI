const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const config = {
    host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    user: '2ST8jsi8rqo9KYA.root',
    password: 'nmPYTeOZXv4gkfP0',
    database: 'test',
    port: 4000,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
};

const logFile = path.join(__dirname, 'init-db.log');
const log = (msg) => {
  console.log(msg);
  fs.appendFileSync(logFile, msg + '\n');
};

async function initDB() {
    fs.writeFileSync(logFile, '');
    log('🔍 Connecting to TiDB Cloud...');
    let connection;

    try {
        connection = await mysql.createConnection(config);
        log('  ✅ Connected successfully!');
    } catch (error) {
        log(`  ❌ Failed to connect: ${error.message}`);
        return;
    }

    try {
        // Read schema file
        const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
        log('📖 Reading schema from: ' + schemaPath);
        
        const schema = fs.readFileSync(schemaPath, 'utf8');
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        log(`🚀 Executing ${statements.length} SQL statements...`);

        for (const statement of statements) {
            if (statement.toUpperCase().startsWith('USE ')) continue;
            
            try {
                await connection.query(statement);
                log('  ✅ Executed statement');
            } catch (err) {
                if (err.code === 'ER_TABLE_EXISTS_ERROR') {
                     log('  ⚠️ Table already exists (skipping)');
                } else {
                     log('  ❌ Error executing statement: ' + err.message);
                }
            }
        }
        log('\n✨ Database initialization complete!');

    } catch (err) {
        log('❌ Failed to read/execute schema: ' + err.message);
    } finally {
        if (connection) await connection.end();
    }
}

initDB();
