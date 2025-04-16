import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; 
import { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

export default function ExamListScreen() {
  const router = useRouter();
  const { partId } = useLocalSearchParams();
  const [exams, setExams] = useState<any[]>([]); // Danh sách bài thi

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get<{ id: string; title: string }[]>(`http://197.187.3.101:8080/api/exams/${partId}`);
        setExams(response.data);  // Lưu bài thi vào state
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
          <TouchableOpacity style={styles.examItem} onPress={() => handleExamPress(item.id)}>
            <Text style={styles.examTitle}>{item.title}</Text>
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
    marginBottom: 10,
    borderRadius: 8,
  },
  examTitle: {
    fontSize: 16,
  },
});
