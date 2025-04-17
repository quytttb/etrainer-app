import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; 


export default function ExamListScreen() {
  const router = useRouter();
  const { partId } = useLocalSearchParams();
  const [exams, setExams] = useState<any[]>([]); // Danh sách bài thi

  useEffect(() => {
    // Tạo dữ liệu ảo
    const fetchExams = async () => {
      try {
        // Dữ liệu ảo
        const mockData = [
          { id: '1', title: 'Photographs 01', progress: '6/6', isLocked: false },
          { id: '2', title: 'Photographs 02', progress: '5/6', isLocked: false },
          { id: '3', title: 'Photographs 03', progress: 'Chưa làm', isLocked: false },
          { id: '4', title: 'Photographs 04', progress: 'Chưa làm', isLocked: false },
          { id: '5', title: 'Photographs 05', progress: 'Chưa làm', isLocked: false },
          { id: '6', title: 'Photographs 06', progress: 'Chưa làm', isLocked: true },
          { id: '7', title: 'Photographs 07', progress: 'Chưa làm', isLocked: true },
        ];

        setExams(mockData);  // Lưu bài thi vào state
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };
    
    fetchExams();  // Gọi API lấy bài thi khi component được render
  }, [partId]);

  const handleExamPress = (examId: string) => {
    router.push(`/exam/detail/${examId}`);  // Điều hướng tới chi tiết bài thi
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{partId}</Text>
      <FlatList
        data={exams}  // Dữ liệu bài thi
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.examItem, item.isLocked && styles.lockedTest]} 
            onPress={() => !item.isLocked && handleExamPress(item.id)}  // Kiểm tra xem bài kiểm tra có bị khóa không trước khi xử lý nhấn
            disabled={item.isLocked}  // Vô hiệu hóa nút nếu bài kiểm tra bị khóa
          >
            <Text style={styles.examTitle}>{item.title}</Text>
            <Text style={styles.examProgress}>{item.progress}</Text>
            {item.isLocked && <Text style={styles.lockedText}>Locked</Text>}
            <TouchableOpacity style={styles.continueButton}>
              <Text style={styles.continueText}>Tiếp tục làm</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  examItem: {
    padding: 15,
    backgroundColor: '#f2f2f2',
    marginBottom: 15,
    borderRadius: 10,
    position: 'relative',
  },
  lockedTest: {
    backgroundColor: '#d3d3d3',  // Gray color for locked tests
  },
  examTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  examProgress: {
    fontSize: 14,
    marginTop: 5,
  },
  lockedText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  continueButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  continueText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
