const axios = require('axios');

// const BASE_URL = 'https://frontend-edu-guide.vercel.app/api';
const BASE_URL = 'http://localhost:5003/api';

async function check() {
  console.log(`Checking deployment status at ${BASE_URL}...`);
  
  // 1. Check Health
  try {
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('\n[HEALTH] Success:', JSON.stringify(health.data, null, 2));
  } catch (err) {
    console.log('\n[HEALTH] Failed:', err.message);
  }

  // 2. Check Auth Login (expecting 400 or 401, not 404)
  try {
    const login = await axios.post(`${BASE_URL}/auth/login`, { email: 'test', password: 'test' });
    console.log('\n[LOGIN] Success (unexpected):', login.data);
  } catch (err) {
    console.log('\n[LOGIN] Failed:', err.message, err.response?.status, err.response?.data);
  }

  // 3. Check Test Route
  try {
    const test = await axios.get(`${BASE_URL}/auth/test`);
    console.log('\n[AUTH TEST] Success:', test.data);
  } catch (err) {
    console.log('\n[AUTH TEST] Failed:', err.message, err.response?.status, err.response?.data);
  }
}

check();
