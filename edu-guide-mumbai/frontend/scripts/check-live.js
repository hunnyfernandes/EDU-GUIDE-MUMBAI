const https = require('https');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'check-result.txt');

const checkUrl = (url) => {
  console.log(`Checking ${url}...`);
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      const result = `Status: ${res.statusCode}\nBody: ${data}`;
      console.log(result);
      fs.writeFileSync(logFile, result);
    });
  }).on('error', (e) => {
    const err = `Error: ${e.message}`;
    console.error(err);
    fs.writeFileSync(logFile, err);
  });
};

checkUrl('https://frontend-edu-guide.vercel.app/api/debug-db-full');
