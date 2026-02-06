const axios = require('axios');

async function testRegister() {
    try {
        const url = 'http://localhost:5002/api/auth/register';
        const data = {
            full_name: "Test User Local",
            email: `test_local_${Date.now()}@example.com`,
            password: "Password123"
        };
        
        console.log(`Sending POST to ${url}...`);
        const response = await axios.post(url, data);
        
        console.log('✅ Registration Successful!');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    } catch (error) {
        console.error('❌ Registration Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testRegister();