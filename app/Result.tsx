import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';  

type ResultScreenRouteProp = {
  params: { selectedAnswers?: string; questionData?: string; partId?: string };
};

type QuestionDataItem = {
  id: string;
  question: string;
  correctAnswer: string;
};

const ResultScreen = ({ route }: { route: ResultScreenRouteProp }) => {
  const { selectedAnswers = '{}', questionData = '[]', partId } = route?.params || {};

  // Map partId to part names
  const partNames: Record<string, string> = {
    '1': 'Mô Tả Hình Ảnh',
    '2': 'Hỏi Đáp',
    '3': 'Đoạn Hội Thoại',
    '4': 'Bài Nói Chuyện',
    // Add more parts as needed
  };

  const partName = partNames[partId || ''] || 'Không Xác Định';

  // Add error handling for JSON parsing
  let parsedSelectedAnswers: Record<string, string> = {};
  let parsedQuestionData: QuestionDataItem[] = [];
  try {
    parsedSelectedAnswers = JSON.parse(selectedAnswers);
    parsedQuestionData = JSON.parse(questionData);
  } catch (error) {
    console.error('Error parsing JSON data:', error);
  }

  const correctAnswersCount = parsedQuestionData.filter(
    (item) => parsedSelectedAnswers[item.id] === item.correctAnswer
  ).length;

  const totalQuestions = parsedQuestionData.length;
  const percentage = totalQuestions > 0 ? ((correctAnswersCount / totalQuestions) * 100).toFixed(2) : '0.00';

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerFallback}>
        <Header
          title="Kết quả"
          onBackPress={() => router.push('/home')} 
        />
      </View>

      <View style={styles.resultSummary}>
        <View style={styles.borderedContainer}>
          <View style={styles.imageAndTextContainer}>
            <Image source={require('../assets/images/headphones.png')} style={styles.ninjaImage} />
            <View>
              <Text style={styles.practiceType}>{partName}</Text>
              <Text style={styles.encouragement}>Chúc bạn may mắn lần sau</Text>
            </View>
          </View>
        </View>
        {/* Bordered container for result summary */}
        <View style={styles.resultContainer}>
          <Text style={styles.resultScore}>
            Kết quả: {correctAnswersCount}/{totalQuestions} câu
          </Text>
          <Text style={styles.resultPercentage}>
            Tỉ lệ đúng trung bình: {percentage}%
          </Text>
        </View>
      </View>

      {/* Bordered container for incorrect questions and view all answers button */}
      <View style={styles.incorrectContainer}>
        <Text style={styles.incorrectTitle}>Danh sách câu hỏi làm sai:</Text>
        <ScrollView style={styles.incorrectList}>
          {parsedQuestionData.map((item, index) => {
            if (parsedSelectedAnswers[item.id] !== item.correctAnswer) {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.incorrectRow}
                  onPress={() => router.push(`/question/detail/${item.id}`)} 
                >
                  <Text style={styles.questionText}>Câu {index + 1}</Text>
                  <Text style={styles.correctAnswerText}>Đáp án đúng: {item.correctAnswer}</Text>
                  <Text style={styles.arrowIcon}>›</Text>
                </TouchableOpacity>
              );
            }
            return null;
          })}
        </ScrollView>

        {/* Button to view all answers */}
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push('/question/index')} 
        >
          <Text style={styles.viewAllButtonText}>Xem toàn bộ đáp án</Text>
        </TouchableOpacity>
      </View>

      {partId === 'lộ trình' && ( // Only show the button for "lộ trình" part
        <TouchableOpacity style={styles.continueButton} onPress={() => router.push(`/exam/list/${partId}`)}>
          <Text style={styles.continueText}>Tiếp tục</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultSummary: {
    alignItems: 'center',
    marginBottom: 20,
  },
  borderedContainer: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    width: '90%',
    height: '40%',
    marginBottom: 20,
    marginTop: 70,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  imageAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ninjaImage: {
    width: 90,
    height: 90,
    margin: 20,
  },
  practiceType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  encouragement: {
    fontSize: 16,
    color: '#666',
  },
  resultContainer: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    width: '90%',
    padding: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: -160, 
  },
  incorrectContainer: { 
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    width: '90%',
    marginHorizontal: '5%',
    marginBottom: 20,      
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },   
    shadowOpacity: 0.1,
    shadowRadius: 5,      
    elevation: 5,  
    padding: 10, // Added padding for spacing
  },
  resultScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  resultPercentage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  incorrectList: {
    flex: 1,
    marginBottom: 10, // Space between the list and the button
  },
  incorrectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
    color: '#FF6F00',
  },
  incorrectItem: {
    paddingVertical: 10, 
    marginBottom: 10, 
  },
  incorrectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  correctAnswerText: {
    fontSize: 16,
    color: '#FF6F00',
    flex: 2,
    textAlign: 'center',
  },
  arrowIcon: {
    fontSize: 18,
    color: '#CCC',
  },
  detailButton: {
    backgroundColor: '#0099CC',
    padding: 12, // Increased padding for better visibility
    borderRadius: 8, // Slightly larger border radius
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000', // Added shadow for elevation
    shadowOpacity: 0.3, // Increased shadow opacity
    shadowOffset: { width: 0, height: 4 }, // Adjusted shadow offset
    shadowRadius: 6, // Increased shadow radius for a softer effect
    elevation: 6, // For Android shadow
  },
  detailButtonText: {
    color: '#FFF',
    fontSize: 18, // Increased font size
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase', // Make text uppercase for emphasis
    textShadowColor: '#000', // Added text shadow
    textShadowOffset: { width: 1, height: 1 }, // Offset for text shadow
    textShadowRadius: 2, // Blur radius for text shadow
  },
  continueButton: {
    backgroundColor: '#0099CC',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 90,
  },
  continueText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllButton: {
    backgroundColor: '#0099CC',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10, // Space above the button
  },
  viewAllButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerFallback: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default ResultScreen;
