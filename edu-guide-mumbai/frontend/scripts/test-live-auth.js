const https = require('https');
const fs = require('fs');
const path = require('path');

// Use absolute path for log file
const logFile = path.join(__dirname, 'test-output.txt');

const log = (msg) => {
  console.log(msg); // Print to console
  try {
    fs.appendFileSync(logFile, msg + '\n');
  } catch (e) {
    console.error('Failed to write to log file:', e);
  }
};

const request = (path, method, data = null) => {
  const options = {
    hostname: 'frontend-edu-guide.vercel.app',
    port: 443,
    path: '/api' + path,
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 15000 // Set request timeout to 15s
  };

  if (data) {
    const dataString = JSON.stringify(data);
    options.headers['Content-Length'] = dataString.length;
  }

  return new Promise((resolve, reject) => {
    log(`   DEBUG: Starting ${method} request to https://` + options.hostname + options.path);
    
    const req = https.request(options, (res) => {
      log(`   DEBUG: Received response headers: ${res.statusCode}`);
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        log('   DEBUG: Response ended');
        resolve({statusCode: res.statusCode, headers: res.headers, body: body});
      });
    });

    req.on('timeout', () => {
        log('   ERROR: Request timed out after 15s');
        req.destroy();
        reject(new Error('Request timeout'));
    });

    req.on('error', (e) => {
      log('   DEBUG: Request error: ' + e.message);
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
    log('   DEBUG: Request sent, waiting for response...');
  });
};

const runTest = async () => {
  try {
    fs.writeFileSync(logFile, 'STARTING TEST\n');
  } catch (e) {
    console.error('Failed to initialize log file:', e);
    return;
  }
  
  const timestamp = Date.now();
  const testUser = {
    full_name: "Live Test User",
    email: `livetest${timestamp}@example.com`,
    password: "Password123", // Strong password
    confirmPassword: "Password123"
  };

  log('0. Testing Minimal Function (/api/test)...');
  try {
    const testRes = await request('/test', 'GET');
   log(`   Status: ${testRes.statusCode}`);
    log(`   Response: ${testRes.body}`);
  } catch (e) {
    log('   ERROR: ' + e.message);
  }

  // Simple route test
  log('0.1. Testing Simple Route (/api/test-simple)...');
  try {
    const simpleRes = await request('/test-simple', 'GET');
    log(`   Status: ${simpleRes.statusCode}`);
    log(`   Response: ${simpleRes.body}`);
  } catch (e) {
    log('   ERROR: ' + e.message);
  }

  // Health check test
  log('\n0. Testing Health Check (/api/health)...');
  try {
    const healthRes = await request('/health', 'GET');
    log(`   Status: ${healthRes.statusCode}`);
    log(`   Response: ${healthRes.body}`);
  } catch (e) {
    log('   ERROR: ' + e.message);
  }

  // Auth test route
  log('0.2. Testing Auth Route (/api/auth/test)...');
  try {
    const authTestRes = await request('/auth/test', 'GET');
    log(`   Status: ${authTestRes.statusCode}`);
    log(`   Response: ${authTestRes.body}`);
  } catch (e) {
    log('   ERROR: ' + e.message);
  }

  log('\n0.5. Testing Database Connection (/api/debug/db)...');
  try {
    const dbRes = await request('/debug/db', 'GET');
    log(`   Status: ${dbRes.statusCode}`);
    log(`   Response: ${dbRes.body}`);
  } catch (e) {
    log('   ERROR: ' + e.message);
  }

  log('\n1. Testing Registration...');
  log(`   User: ${testUser.email}`);
  
  try {
    const regRes = await request('/auth/register', 'POST', testUser);
    log(`   Status: ${regRes.statusCode}`);
    log(`   Response: ${regRes.body.substring(0, 200)}`);

    if (regRes.statusCode === 201 || regRes.statusCode === 200) {
      log('\n2. Testing Login...');
      const loginRes = await request('/auth/login', 'POST', {
        email: testUser.email,
        password: testUser.password
      });
      log(`   Status: ${loginRes.statusCode}`);
      log(`   Response: ${loginRes.body.substring(0, 200)}`);
      
      if (loginRes.statusCode === 200) {
        log('✅ Login successful!');
      } else {
        log('❌ Login failed');
      }
    } else {
      log('❌ Registration failed');
    }
  } catch (error) {
    log('ERROR: ' + error.message);
  }
};

runTest();
