import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useRouter } from 'expo-router'; 

export default function TestScreen() {
  const router = useRouter(); 

  const fulltests: Array<{ id: number; name: string; isLocked: boolean; year: string; type: 'full' }> = [
    { id: 1, name: 'Test 1', isLocked: false, year: 'ETS 2024', type: 'full' },
    { id: 2, name: 'Test 2', isLocked: false, year: 'ETS 2024', type: 'full' },
    { id: 3, name: 'Test 3', isLocked: false, year: 'ETS 2024', type: 'full' },
    { id: 4, name: 'Test 4', isLocked: false, year: 'ETS 2024', type: 'full' },
    { id: 5, name: 'Test 5', isLocked: false, year: 'ETS 2024', type: 'full' },
    { id: 6, name: 'Test 6', isLocked: true, year: 'ETS 2024', type: 'full' },
    { id: 7, name: 'Test 7', isLocked: true, year: 'ETS 2024', type: 'full' },
    { id: 8, name: 'Test 8', isLocked: true, year: 'ETS 2024', type: 'full' },
  ];

  const minitests: Array<{ id: number; name: string; isLocked: boolean; type: 'mini' }> = [
    { id: 1, name: 'Test 1', isLocked: false, type: 'mini' },
    { id: 2, name: 'Test 2', isLocked: false, type: 'mini' },
    { id: 3, name: 'Test 3', isLocked: true, type: 'mini' },
    { id: 4, name: 'Test 4', isLocked: true, type: 'mini' },
    { id: 5, name: 'Test 5', isLocked: true, type: 'mini' },
  ];

  // Function to handle test selection and navigate to the correct page
  interface Test {
    id: number;
    name: string;
    isLocked: boolean;
    type: 'mini' | 'full';
    year?: string; // Optional for mini tests
  }

  const handleTestSelect = (testId: number, testType: 'mini' | 'full'): void => {
    if (testType === 'mini') {
      // Navigate to the mini test page
      router.push(`/exam/prepare/${testId}?type=mini`);
    } else {
      // Navigate to the full test page
      router.push(`/exam/prepare/${testId}?type=full`);
    }
  };

  // Hàm kiểm tra có bài kiểm tra hợp lệ không (không bị khóa)
  const hasValidTest = fulltests.some(test => !test.isLocked) || minitests.some(test => !test.isLocked);

  return (
    <ScrollView style={styles.container}>
      {/* Fulltests */}
      {fulltests.length > 0 && (
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>TOEIC Listening & Reading Fulltest | {fulltests.length}</Text>
          <Text style={styles.categoryLink}>Xem thêm</Text>
        </View>
      )}
      <View style={styles.testList}>
        {fulltests.map((test) => (
          <TouchableOpacity 
            key={test.id} 
            style={[styles.testCard, test.isLocked && styles.lockedTest]} 
            onPress={() => !test.isLocked && handleTestSelect(test.id, test.type)}  // Kiểm tra xem bài kiểm tra có bị khóa không trước khi xử lý nhấn
            disabled={test.isLocked}  // Vô hiệu hóa nút nếu bài kiểm tra bị khóa
          >
            <Image
              source={require('../../assets/images/test.png')}
              style={styles.test}
            />
            {test.isLocked && (
              <Fontisto name="locked" size={10} color="black" style={styles.lockIcon} />
            )}
            <Text style={styles.testText}>{test.name}</Text>
            <Text style={styles.yearText}>{test.year}</Text> {/* Hiển thị năm */}
          </TouchableOpacity>
        ))}
      </View>

      {/* Minitests */}
      {minitests.length > 0 && (
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>TOEIC Listening & Reading Minitests | {minitests.length}</Text>
          <Text style={styles.categoryLink}>Xem thêm</Text>
        </View>
      )}
      <View style={styles.testList}>
        {minitests.map((test) => (
          <TouchableOpacity 
            key={test.id} 
            style={[styles.testCard, test.isLocked && styles.lockedTest]} 
            onPress={() => !test.isLocked && handleTestSelect(test.id, test.type)}  // Kiểm tra xem bài kiểm tra có bị khóa không trước khi xử lý nhấn
            disabled={test.isLocked}  // Vô hiệu hóa nút nếu bài kiểm tra bị khóa
          >
            <Image
              source={require('../../assets/images/test.png')}
              style={styles.test}
            />
            {test.isLocked && (
              <Fontisto name="locked" size={10} color="black" style={styles.lockIcon} />
            )}
            <Text style={styles.testText}>{test.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nút Bắt đầu nào */}
      {hasValidTest && (
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Bắt đầu nào</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
  },

  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },

  category: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  categoryLink: {
    fontSize: 14,
    color: '#FF8C00',
  },

  testList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 20,
  },

  testCard: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '22%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative',
  },

  lockedTest: {
    backgroundColor: '#D3D3D3', // Màu nền xám cho bài kiểm tra bị khóa
  },

  test: {
    width: 45,
    height: 45,
    marginBottom: 10,
  },

  lockIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },

  testText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',
    top: 85,
    left: '150%',
    transform: [{ translateX: -50 }],
    color: '#000000',
  },

  yearText: {
    marginTop: 5,
    fontSize: 14,
    position: 'absolute',
    top: 100,
    left: '100%',
    transform: [{ translateX: -50 }],
    color: '#000000',
    width: '180%',
    textAlign: 'center',
  },

  startButton: {
    backgroundColor: '#00BFAE',
    paddingVertical: 15,
    marginHorizontal: 50,
    borderRadius: 30,
    marginTop: 30,
    alignItems: 'center',
  },

  startButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
