const mysql = require('mysql2/promise');

async function testConnection() {
  const credentials = {
    user: '2ST8jsi8rqo9KYA.root', // Trying with .root suffix first as per TiDB requirements usually
    password: 'nmPYTeOZXv4gkfP0',
    database: 'test',
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  };

  const hosts = [
    'gateway01.eu-central-1.prod.aws.tidbcloud.com',
  ];

  console.log('Testing TiDB connections...');

  for (const host of hosts) {
    console.log(`\nTesting host: ${host}`);
    try {
      const connection = await mysql.createConnection({
        ...credentials,
        host: host
      });
      console.log(`✅ SUCCESS! Connected to ${host}`);
      await connection.end();
      return; // Stop after first success
    } catch (error) {
      console.log(`❌ Failed: ${error.message} (Code: ${error.code})`);
      
      // Explicitly try without .root suffix
      if (credentials.user.endsWith('.root')) {
         console.log(`   Retrying ${host} without .root suffix...`);
         try {
            const connection = await mysql.createConnection({
                ...credentials,
                user: '28Tj8jRq9PYA0ot',
                host: host
            });
            console.log(`✅ SUCCESS! Connected to ${host} (without .root suffix)`);
            await connection.end();
            return;
         } catch (err2) {
             console.log(`   ❌ Failed without suffix: ${err2.message} (Code: ${err2.code})`);
         }
      }
    }
  }
  console.log('\n❌ All connection attempts failed.');
}

testConnection();
