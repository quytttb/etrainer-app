import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';

const PlanScreen: React.FC = () => {
  const router = useRouter(); // Khởi tạo router để điều hướng
  const [selectedScore, setSelectedScore] = useState<string | null>(null); // State lưu trữ lựa chọn của người dùng

  const handlePathPrepare = (score: '500' | '700' | '900') => {
    setSelectedScore(score);  // Cập nhật lựa chọn
    router.push(`/plan-study/${score}` as any); // Điều hướng đến trang PathPrepareScreen với tham số score trong URL
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hình ảnh minh họa */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/llustration8.png')} // Chèn ảnh minh họa
          style={styles.image}
        />
      </View>

      {/* Tiêu đề lộ trình */}
      <Text style={styles.subTitle}>Chọn lộ trình học Toeic phù hợp</Text>

      {/* Các lựa chọn lộ trình */}
      <View style={styles.options}>
        <TouchableOpacity
          style={[styles.optionButton, selectedScore === '500' && styles.selectedOption]}  // Thêm điều kiện thay đổi màu khi chọn
          onPress={() => handlePathPrepare('500')} // Truyền tham số điểm 500
        >
          <Text style={styles.optionText}>500 Toeic</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, selectedScore === '700' && styles.selectedOption]}  // Thêm điều kiện thay đổi màu khi chọn
          onPress={() => handlePathPrepare('700')} // Truyền tham số điểm 700
        >
          <Text style={styles.optionText}>700 Toeic</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, selectedScore === '900' && styles.selectedOption]}  // Thêm điều kiện thay đổi màu khi chọn
          onPress={() => handlePathPrepare('900')} // Truyền tham số điểm 900
        >
          <Text style={styles.optionText}>900 Toeic</Text>
        </TouchableOpacity>
      </View>
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
  subTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  options: {
    width: '100%',
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',  // Màu khi chọn
    color: '#fff',
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
  },
});

export default PlanScreen;
