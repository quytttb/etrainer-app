const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Enhanced Day Questions Import...');

try {
     // Check if the enhanced-day-questions.tsx file exists
     const filePath = path.join(__dirname, 'app/journeyStudy/enhanced-day-questions.tsx');

     if (!fs.existsSync(filePath)) {
          throw new Error('File not found: enhanced-day-questions.tsx');
     }

     // Read file content
     const content = fs.readFileSync(filePath, 'utf8');

     // Check for import statement issues
     if (content.includes('import { styles } from "./styles"')) {
          throw new Error('Found old styles import - should be removed');
     }

     // Check if StyleSheet is imported
     if (!content.includes('import {\n     View,\n     Text,\n     TouchableOpacity,\n     Alert,\n     ActivityIndicator,\n     Animated,\n     ScrollView,\n     StyleSheet,')) {
          throw new Error('StyleSheet import not found');
     }

     // Check if styles are defined
     if (!content.includes('const styles = StyleSheet.create({')) {
          throw new Error('StyleSheet.create not found');
     }

     console.log('✅ Enhanced Day Questions component structure is valid');
     console.log('✅ StyleSheet properly imported and defined');
     console.log('✅ Old styles import removed');
     console.log('🎉 Component ready for use!');

} catch (error) {
     console.error('❌ Test failed:', error.message);
     process.exit(1);
} 