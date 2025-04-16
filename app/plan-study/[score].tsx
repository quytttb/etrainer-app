import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Lấy tham số từ URL

const PathPrepareScreen: React.FC = () => {
  const { score } = useLocalSearchParams(); // Lấy tham số 'score' từ URL

   // Hàm điều hướng tới trang thi
   const router = useRouter(); // Sử dụng useRouter để điều hướng
   const handleStartTest = () => {
    router.push(`/exam/detail/examId?score=${score}` as any); // Điều hướng tới trang thi với tham số score
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hình ảnh minh họa */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/llustration8.png')}
          style={styles.image}
        />
      </View>
      <Text style={styles.title}>Lộ trình Etrainer</Text>
      <Text style={styles.subTitle}>Cùng Etrainer chinh phục {score} điểm Toeic</Text>
      <Text style={styles.description}>
        Để bắt đầu, hãy làm một bài kiểm tra đánh giá để có được lộ trình học tập phù hợp.
      </Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailsText}>Thời gian: 6 phút 20 giây</Text>
        <Text style={styles.detailsText}>Số câu hỏi: 15</Text>
      </View>
      <TouchableOpacity style={styles.startButton} onPress={handleStartTest}>
        <Text style={styles.startButtonText}>Bắt đầu nào</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 20,
  },
  detailsContainer: {
    marginBottom: 30,
  },
  detailsText: {
    fontSize: 16,
    color: '#333',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  startButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PathPrepareScreen;
