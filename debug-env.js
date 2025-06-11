// Debug script to test environment variables
console.log('🔍 Environment Variables Debug');
console.log('===========================');

// Test Expo environment variables
console.log('EXPO_PUBLIC_APP_API_URL:', process.env.EXPO_PUBLIC_APP_API_URL);
console.log('EXPO_PUBLIC_STORAGE_KEY:', process.env.EXPO_PUBLIC_STORAGE_KEY);

// Fallback values
const API_URL = process.env.EXPO_PUBLIC_APP_API_URL || 'http://192.168.0.103:8080/api';
const STORAGE_KEY = process.env.EXPO_PUBLIC_STORAGE_KEY || '@ETRAINER_APP';

console.log('\n📋 Final Values (with fallback):');
console.log('API_URL:', API_URL);
console.log('STORAGE_KEY:', STORAGE_KEY);

// Test API connectivity
const http = require('http');
const url = require('url');

console.log('\n🌐 Testing API connectivity...');
const parsedUrl = url.parse(API_URL);
const hostname = parsedUrl.hostname;
const port = parsedUrl.port;

console.log('Hostname:', hostname);
console.log('Port:', port);

const options = {
     hostname: hostname,
     port: port,
     path: '/api/journeys/current',
     method: 'GET',
     timeout: 5000
};

const req = http.request(options, (res) => {
     console.log('✅ Connection successful! Status:', res.statusCode);
     if (res.statusCode === 401) {
          console.log('🔐 Server requires authentication (this is expected)');
     }
});

req.on('error', (e) => {
     console.error('❌ Connection failed:', e.message);
});

req.on('timeout', () => {
     console.error('⏰ Connection timeout');
     req.destroy();
});

req.end(); 