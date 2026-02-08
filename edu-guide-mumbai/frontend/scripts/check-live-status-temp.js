const axios = require('axios');

const BASE_URL = 'https://frontend-edu-guide.vercel.app/api';
// const BASE_URL = 'http://localhost:5003/api';

async function check() {
  console.log(`Checking deployment status at ${BASE_URL}...`);
  
  // 1. Check Health
  try {
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('\n[HEALTH] Success:', JSON.stringify(health.data, null, 2));
    
    if (health.data.message.includes("Diagnostic")) {
        console.log("\n✅ NEW DEPLOYMENT DETECTED!");
        
        // Check Auth only if new deployment
        try {
            const test = await axios.get(`${BASE_URL}/auth/test`);
            console.log('\n[AUTH TEST] Success:', test.data);
        } catch (err) {
            console.log('\n[AUTH TEST] Failed:', err.message);
        }
        
        return true; // Done
    }
  } catch (err) {
    console.log('\n[HEALTH] Failed:', err.message);
  }
  return false; // Not updated yet
}

async function loop() {
    for (let i = 0; i < 6; i++) {
        console.log(`\nAttempt ${i+1}/6...`);
        const done = await check();
        if (done) break;
        await new Promise(r => setTimeout(r, 10000)); // Wait 10s
    }
}

loop();
