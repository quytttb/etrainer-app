import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; 

import { RouteProp } from '@react-navigation/native';

type ResultScreenRouteProp = RouteProp<{ params: { selectedAnswers?: string; questionData?: string; partId?: string } }, 'params'>;

type QuestionDataItem = {
  id: string;
  question: string;
  correctAnswer: string;
};

const ResultScreen = ({ route }: { route: ResultScreenRouteProp }) => {
  const { selectedAnswers = '{}', questionData = '[]', partId } = route?.params || {}; // Lấy partId từ params

  // Chuyển chuỗi JSON thành đối tượng JavaScript
  const parsedSelectedAnswers: Record<string, string> = JSON.parse(selectedAnswers);
  const parsedQuestionData: QuestionDataItem[] = JSON.parse(questionData);

  // Tính số câu trả lời đúng
  const correctAnswersCount = parsedQuestionData.filter(
    (item) => parsedSelectedAnswers[item.id] === item.correctAnswer
  ).length;

  const totalQuestions = parsedQuestionData.length;
  const percentage = totalQuestions > 0 ? ((correctAnswersCount / totalQuestions) * 100).toFixed(2) : '0';

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.resultTitle}>Kết quả bài thi</Text>
      <Text style={styles.resultText}>Số câu trả lời đúng: {correctAnswersCount}/{totalQuestions}</Text>
      <Text style={styles.resultText}>Tỷ lệ đúng: {percentage}%</Text>

      <View style={styles.incorrectList}>
        <Text style={styles.resultSubtitle}>Các câu trả lời sai:</Text>
        <ScrollView style={styles.incorrectItems}>
          {parsedQuestionData.map((item, index) => {
            // Kiểm tra nếu câu trả lời không đúng
            if (parsedSelectedAnswers[item.id] !== item.correctAnswer) {
              return (
                <View key={item.id} style={styles.incorrectItem}>
                  <Text>{`Câu ${index + 1}: ${item.question}`}</Text>
                  <Text>Đáp án đúng: {item.correctAnswer}</Text>
                  <Text>Bạn chọn: {parsedSelectedAnswers[item.id]}</Text>
                </View>
              );
            }
            return null; // Nếu không có câu sai, không hiển thị gì
          })}
        </ScrollView>
      </View>
      
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={() => router.push(`/exam/list/${partId}`)} 
      >
        <FontAwesome name="times" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Option to navigate to home */}
      <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/home')}>
        <Text style={styles.homeText}>Về Trang Chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  resultText: {
    fontSize: 18,
    marginVertical: 10,
  },
  resultSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  incorrectList: {
    marginBottom: 20,
    width: '100%',
  },
  incorrectItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 10,
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  homeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  homeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  incorrectItems: {
    width: '100%',
  },
  // Style for the close (X) button
  closeButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 50,
    elevation: 5,  // Gives a shadow effect
  },
});

export default ResultScreen;
