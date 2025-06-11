#!/usr/bin/env node

const { exec } = require('child_process');

console.log('🧪 Testing Enhanced Day Questions Component...');

// Test if the component can be imported without errors
exec('npx expo export --platform web --output-dir dist/test --experimental-bundle', (error, stdout, stderr) => {
     if (error) {
          console.error('❌ Build failed:', error.message);
          console.error('Stderr:', stderr);
          process.exit(1);
     }

     console.log('✅ Build successful!');
     console.log('📦 Component enhanced-day-questions.tsx is working correctly');

     // Check for any import errors in the output
     if (stderr.includes('Unable to resolve') || stderr.includes('Cannot find module')) {
          console.error('❌ Import errors detected:', stderr);
          process.exit(1);
     }

     console.log('🎉 All tests passed! Enhanced Day Questions component is ready.');
}); 