import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; 
import { FontAwesome } from '@expo/vector-icons'; 

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
          { id: '1', title: 'Photographs 01', progress: '6/6', isLocked: false, format: '2024 Format' },
          { id: '2', title: 'Photographs 02', progress: '5/6', isLocked: false, format: '2024 Format' },
          { id: '3', title: 'Photographs 03', progress: 'Chưa làm', isLocked: false, format: '2024 Format' },
          { id: '4', title: 'Photographs 04', progress: 'Chưa làm', isLocked: false, format: '2024 Format' },
          { id: '5', title: 'Photographs 05', progress: 'Chưa làm', isLocked: false, format: '2024 Format' },
          { id: '6', title: 'Photographs 06', progress: 'Chưa làm', isLocked: true, format: '2024 Format' },
          { id: '7', title: 'Photographs 07', progress: 'Chưa làm', isLocked: true, format: '2024 Format' },
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}> {partId}</Text>
      </View>
      <FlatList
        data={exams}  // Dữ liệu bài thi
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.examItem, item.isLocked && styles.lockedTest]} 
            onPress={() => !item.isLocked && handleExamPress(item.id)}  // Điều hướng khi nhấn vào toàn bộ mục
            disabled={item.isLocked}  // Vô hiệu hóa nếu bài kiểm tra bị khóa
          >
            <View style={styles.row}>
              <Text style={styles.examTitle}>{item.title}</Text>
              {item.isLocked && (
                <Image 
                  source={require('../../../assets/images/cup.png')} 
                  style={styles.crownIcon} 
                />
              )}
            </View>
            <View style={styles.row}>
              <View style={styles.formatLabel}>
                <Text style={styles.formatText}>
                  {item.format || 'Default Format'} {/* Hiển thị format từ CSDL hoặc giá trị mặc định */}
                </Text>
              </View>
              <Text style={styles.examProgress}>{item.progress}</Text>
            </View>
            {item.isLocked && <Text style={styles.lockedText}>Locked</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#00BFAE',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  examItem: {
    padding: 25,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 20,
    position: 'relative',
  },
  lockedTest: {
    backgroundColor: '#d3d3d3',  
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formatLabel: {
    backgroundColor: '#CCFFFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  formatText: {
    color: '#00BFAE',
    fontWeight: 'bold',
    fontSize: 12,
  },
  crownIcon: {
    width: 20,
    height: 20,
    marginLeft: 45,
  },
});
