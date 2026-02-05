const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const hostsToTry = [
    'gateway01.us-east-1.prod.aws.tidbcloud.com',
    'gateway01.us-west-2.prod.aws.tidbcloud.com',
    'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    'gateway01.us-west-1.prod.aws.tidbcloud.com'
];

const configBase = {
    port: 4000,
    password: 'nmPYTeOZXv4gkfP0',
    database: 'test',
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
};

const usersToTry = [
    '28Tj8jRq9PYA0ot',
    '28Tj8jRq9PYA0ot.root'
];

async function initDB() {
    console.log('🔍 Attempting to find correct TiDB Cloud host and user...');
    
    let connection;
    let validHost = null;
    let validUser = null;

    for (const host of hostsToTry) {
        for (const user of usersToTry) {
            console.log(`\n👉 Trying host: ${host} with user: ${user}`);
            try {
                connection = await mysql.createConnection({
                    ...configBase,
                    host: host,
                    user: user
                });
                console.log('  ✅ Connected successfully!');
                validHost = host;
                validUser = user;
                break;
            } catch (error) {
                console.log(`  ❌ Failed: ${error.code} - ${error.syscall || error.message}`);
            }
        }
        if (validHost) break;
    }

    if (!validHost) {
        console.error('\n❌ Could not connect. Please check credentials.');
        return;
    }

    console.log(`\n🎉 SUCCESS! Use these credentials:`);
    console.log(`DB_HOST=${validHost}`);
    console.log(`DB_USER=${validUser}`);
    
    // Continue with schema init...
    console.log('----------------------------------------');

    try {
        // Read schema file
        const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
        console.log('📖 Reading schema from:', schemaPath);
        
        const schema = fs.readFileSync(schemaPath, 'utf8');
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`🚀 Executing ${statements.length} SQL statements...`);

        for (const statement of statements) {
            if (statement.toUpperCase().startsWith('USE ')) continue;
            
            try {
                await connection.query(statement);
                console.log('  ✅ Executed statement');
            } catch (err) {
                if (err.code === 'ER_TABLE_EXISTS_ERROR') {
                     console.log('  ⚠️ Table already exists (skipping)');
                } else {
                     console.error('  ❌ Error executing statement:', err.message);
                }
            }
        }
        console.log('\n✨ Database initialization complete!');
        console.log(`\n⚠️ IMPORTANT: Use this HOST in Vercel: ${validHost}`);

    } catch (err) {
        console.error('❌ Failed to read/execute schema:', err.message);
    } finally {
        if (connection) await connection.end();
    }
}

initDB();