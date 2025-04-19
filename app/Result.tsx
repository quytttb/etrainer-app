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

      {/* Bordered container for incorrect questions */}
      <View style={styles.incorrectContainer}>
        <ScrollView style={styles.incorrectList}>
          <Text style={styles.incorrectTitle}>Danh sách câu hỏi làm sai:</Text>
          {parsedQuestionData.map((item, index) => {
            if (parsedSelectedAnswers[item.id] !== item.correctAnswer) {
              return (
                <TouchableOpacity
                  //key={item.id}
                  //style={styles.incorrectItem}
                  //onPress={() => router.push(`/question/detail/${item.id}`)} 
                >
                  <Text style={styles.questionText}>Câu {index + 1}</Text>
                  <Text style={styles.correctAnswerText}>Đáp án đúng: {item.correctAnswer}</Text>
                </TouchableOpacity>
              );
            }
            return null;
          })}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={() => router.push(`/exam/list/${partId}`)}>
        <Text style={styles.continueText}>Tiếp tục</Text>
      </TouchableOpacity>
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
    height: '40%',
    marginHorizontal: '5%',
    marginBottom: 20,      
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
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
    marginTop: 10,
  },
  incorrectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
    color: '#FF6F00',
  },
  incorrectItem: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  questionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  correctAnswerText: {
    fontSize: 14,
    color: '#FF0000',
  },
  continueButton: {
    backgroundColor: '#00BFAE',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 90,
  },
  continueText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerFallback: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#000',
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ResultScreen;
