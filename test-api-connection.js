const http = require('http');

const API_BASE = 'http://192.168.0.103:8080/api';

console.log('🧪 Testing API Connection...');
console.log('📡 Base URL:', API_BASE);

// Test basic connectivity
const options = {
     hostname: '192.168.0.103',
     port: 8080,
     path: '/api/journeys/current',
     method: 'GET',
     headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
     }
};

const req = http.request(options, (res) => {
     console.log(`✅ Status: ${res.statusCode}`);
     console.log(`📋 Headers:`, res.headers);

     let data = '';
     res.on('data', (chunk) => {
          data += chunk;
     });

     res.on('end', () => {
          console.log('📦 Response length:', data.length);
          if (res.statusCode === 401) {
               console.log('🔐 API requires authentication (expected)');
          } else if (res.statusCode === 200) {
               console.log('🎉 API connection successful!');
          } else {
               console.log('⚠️ Unexpected status code');
          }
     });
});

req.on('error', (e) => {
     console.error('❌ Connection failed:', e.message);
     console.log('💡 Please check:');
     console.log('  - Backend server is running on port 8080');
     console.log('  - Network connection');
     console.log('  - IP address 192.168.0.103 is correct');
});

req.end();

setTimeout(() => {
     console.log('⏱️ Test completed');
}, 5000); 