import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';  // Import useRouter từ expo-router

const PrepareTestScreen = () => {
  const { id, type } = useLocalSearchParams();  // Lấy cả id và loại bài kiểm tra (fulltest/mini test)
  const testId = Number(id);
  const router = useRouter();  // Sử dụng router để điều hướng

  // Dữ liệu mô phỏng cho bài kiểm tra (Fulltest)
  const testData: Record<string, { name: string; year: string; time: string; questions: string }> = {
    "1": { name: "Test 1", year: "ETS 2024", time: "120 phút", questions: "200 câu" },
    "2": { name: "Test 2", year: "ETS 2024", time: "120 phút", questions: "200 câu" },
    "3": { name: "Test 3", year: "ETS 2024", time: "120 phút", questions: "200 câu" },
    // Thêm các bài kiểm tra khác nếu cần
  };

  // Dữ liệu mô phỏng cho mini test
  const miniTestData: Record<string, { name: string; time: string; questions: string }> = {
    "1": { name: "Test 1", time: "30 phút", questions: "50 câu" },
    "2": { name: "Test 2", time: "30 phút", questions: "50 câu" },
    "3": { name: "Test 3", time: "30 phút", questions: "50 câu" },
    // Thêm các mini test khác nếu cần
  };

  // Lấy thông tin bài kiểm tra hiện tại dựa trên testId và type (Fulltest hay Minitest)
  const currentTest = type === 'mini' ? miniTestData[testId] : testData[testId];

   // Hàm xử lý khi nhấn nút "Bắt đầu nào"
   const handleStartTest = () => {
    console.log(`Bắt đầu bài kiểm tra với ID: ${testId}`);
    // Điều hướng đến trang exam/detail/[examId].tsx với testId làm tham số
    router.push(`/exam/detail/${testId}`);
  };

  // Hàm xử lý khi nhấn nút "Back" để quay lại trang smock test
  const handleBackPress = () => {
    router.push('/mock-test'); // Điều hướng quay lại trang danh sách bài kiểm tra
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      {/* Hiển thị tên bài kiểm tra */}
      {currentTest ? (
        <>
          <Text style={styles.title}>
            {currentTest.name} {type !== 'mini' && 'year' in currentTest && currentTest.year ? ` ${currentTest.year}` : ''}
          </Text>

          {/* Thông tin thời gian và số câu hỏi */}
          <View style={styles.testInfoContainer}>
            <Text style={styles.testInfo}>Thời gian: {currentTest.time}</Text>
            <Text style={styles.testInfo}>Số câu hỏi: {currentTest.questions}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>Không có bài kiểm tra này.</Text>
      )}

      {/* Nút "Bắt đầu nào" */}
      <View style={styles.startButtonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartTest}>
          <Text style={styles.startButtonText}>Bắt đầu nào</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingTop: 80,
    marginBottom: 20,
    color: '#000',
  },
  testInfoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  testInfo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  startButtonContainer: {
    marginTop: 'auto', 
    marginBottom: 50, 
    width: '100%',
    alignItems: 'center', 
  },
  startButton: {
    backgroundColor: '#0099CC', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 18,
    color: '#f00',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 2,
    backgroundColor: 'transparent',
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#00BFAE',
    fontWeight: 'bold',
  },
});

export default PrepareTestScreen;
