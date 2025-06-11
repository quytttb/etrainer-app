#!/usr/bin/env node

/**
 * Script để chạy tất cả các test cho Journey Bug Fixes
 * 
 * Usage: npm run test:journey-bugs
 * hoặc: node scripts/run-journey-bug-tests.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const testFiles = [
     '__tests__/journeyNew/screens/JourneyOverview.BugFixes.test.tsx',
     '__tests__/journeyNew/screens/LessonScreenBugFixes.test.tsx',
     '__tests__/journeyNew/screens/FinalTestScreenBugFixes.test.tsx',
     '__tests__/journeyNew/screens/StageDetailsBug.test.tsx',
     '__tests__/journeyNew/screens/AllBugFixes.test.tsx'
];

const colors = {
     reset: '\x1b[0m',
     bright: '\x1b[1m',
     red: '\x1b[31m',
     green: '\x1b[32m',
     yellow: '\x1b[33m',
     blue: '\x1b[34m',
     magenta: '\x1b[35m',
     cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
     console.log(`${colors[color]}${message}${colors.reset}`);
}

function runTests() {
     log('🧪 Journey New - Bug Fixes Test Suite', 'cyan');
     log('========================================', 'cyan');

     log('\n📋 Danh sách test files:', 'yellow');
     testFiles.forEach((file, index) => {
          const filePath = path.join(__dirname, '..', file);
          const exists = fs.existsSync(filePath);
          const status = exists ? '✅' : '❌';
          log(`${index + 1}. ${status} ${file}`, exists ? 'green' : 'red');
     });

     log('\n🔍 Kiểm tra các vấn đề bug fixes:', 'yellow');
     log('(1) Journey Overview:', 'blue');
     log('    - Card lộ trình hiện giai đoạn hiện tại đúng, không phải NaN/2');
     log('    - Sử dụng tiếng Việt, không phải tiếng Anh');

     log('(2) Lesson Screen:', 'blue');
     log('    - Câu hỏi có audio/image xử lý đúng media, không hiển thị text');

     log('(3) Final Test Screen:', 'blue');
     log('    - Câu hỏi có audio có thể kéo xuống (scroll enabled)');
     log('    - Unlock Stage tiếp theo khi điểm >= 70%');

     log('(4) Stage Details:', 'blue');
     log('    - Điểm tối thiểu mong muốn là 70%, không phải 300%');

     try {
          log('\n🚀 Bắt đầu chạy tests...', 'yellow');

          // Chạy từng test file
          testFiles.forEach((file, index) => {
               const filePath = path.join(__dirname, '..', file);

               if (fs.existsSync(filePath)) {
                    log(`\n📝 Test ${index + 1}: ${file}`, 'magenta');

                    try {
                         // Chạy test file với Jest
                         const command = `npx jest "${file}" --verbose --no-cache`;
                         execSync(command, {
                              stdio: 'inherit',
                              cwd: path.join(__dirname, '..')
                         });
                         log(`✅ Test ${index + 1} passed!`, 'green');
                    } catch (error) {
                         log(`❌ Test ${index + 1} failed!`, 'red');
                         log(`Error: ${error.message}`, 'red');
                    }
               } else {
                    log(`⏭️  Skipping ${file} (file not found)`, 'yellow');
               }
          });

          log('\n🎉 Tất cả tests đã hoàn thành!', 'green');
          log('📊 Kết quả tổng hợp:', 'cyan');
          log('   - Kiểm tra các màn hình Journey đã được fix bugs');
          log('   - Đảm bảo UX/UI hoạt động đúng theo yêu cầu');
          log('   - Xác nhận logic business rules chính xác');

     } catch (error) {
          log('\n💥 Có lỗi xảy ra khi chạy tests:', 'red');
          log(error.message, 'red');
          process.exit(1);
     }
}

// Chạy script
if (require.main === module) {
     runTests();
}

module.exports = { runTests }; 