const https = require('https');

const checkUrl = (url) => {
  return new Promise((resolve, reject) => {
    console.log(`Checking ${url}...`);
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        try {
            const json = JSON.parse(data);
            console.log('Body:', JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('Body:', data.substring(0, 200));
        }
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error: ${err.message}`);
      resolve();
    });
  });
};

async function check() {
  await checkUrl('https://frontend-edu-guide.vercel.app/api/health');
  await checkUrl('https://frontend-edu-guide.vercel.app/api/debug/db');
}

check();