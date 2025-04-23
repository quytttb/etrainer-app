import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import HeaderCard from '../../../components/HeaderTest';
import QuestionCard from '../../../components/QuestionCard';
import AudioControls from '../../../components/AudioControls';
import NavigationButtons from '../../../components/NavigationButtons';
import axios from 'axios';

const ExamDetailScreen = () => {
  const { examId } = useLocalSearchParams(); 
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(120); // Set initial time in seconds (2 minutes)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // Lưu câu trả lời
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]); // Dữ liệu câu hỏi

  const mockData = [
    {
      id: '1',
      image: 'https://via.placeholder.com/200', 
      options: ['A', 'B', 'C'],
      correctAnswer: 'A',
      audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      id: '2',
      question: 'Where is the meeting happening?', 
      options: ['A', 'B', 'C'],
      correctAnswer: 'B',
      audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
  ];

  useEffect(() => {
    setQuestions(mockData); // Use mock data instead of API call
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          openSubmitModal(); // Show submit modal when time reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));

    // Show the submit modal if it's the last question
    if (isLastQuestion) {
      openSubmitModal();
    }
  };

  const handleSubmit = () => {
    setExamCompleted(true);
    const correctCount = questions.filter(
      (item) => selectedAnswers[item.id] === item.correctAnswer
    ).length;
    setCorrectAnswersCount(correctCount);

    closeSubmitModal();
    closeModal();

    router.push({
      pathname: `learningPath/resutlEvoluate/${examId}`,
      params: {
        correctAnswers: correctCount,
        totalQuestions: questions.length,
      },
    });
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const openSubmitModal = () => setIsSubmitModalVisible(true);
  const closeSubmitModal = () => setIsSubmitModalVisible(false);

  const getOptionStyle = (questionId: string, option: string) => {
    if (selectedAnswers[questionId] === option) {
      return { backgroundColor: '#0099CC', color: '#fff' };
    }
    return { backgroundColor: '#f2f2f2', color: '#000' };
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <View style={styles.container}>
      <HeaderCard onBackPress={() => {}} onMenuPress={openModal} />

      {/* Countdown Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Thời gian còn lại: {formatTime(timeLeft)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {currentQuestion && currentQuestion.image && (
          <View style={[styles.pictureSection, styles.sectionBorder]}>
            <Text style={styles.sectionTitle}>Picture</Text>
            <Image source={{ uri: currentQuestion.image }} style={styles.questionImage} />
          </View>
        )}

        {currentQuestion && !currentQuestion.image && (
          <View style={[styles.textSection, styles.sectionBorder]}>
            <Text style={styles.sectionTitle}>Question</Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>
        )}

        <QuestionCard
          question={currentQuestion?.question || ''}
          options={currentQuestion?.options || []}
          selectedAnswer={selectedAnswers[currentQuestion?.id || '']}
          onSelectAnswer={(answer: string) => handleAnswerSelect(currentQuestion?.id || '', answer)}
        />
      </ScrollView>

      {currentQuestion && currentQuestion.audio && (
        <AudioControls audioUri={currentQuestion.audio} />
      )}

      <NavigationButtons
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onPrevious={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))} 
        onNext={() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1); 
          } else {
            openSubmitModal(); 
          }
        }}
        isPrevDisabled={currentQuestionIndex === 0}
        isNextDisabled={currentQuestionIndex === questions.length - 1}
        isLastQuestion={isLastQuestion}
        // Removed renderPrevButton and renderNextButton as they are not part of NavigationButtonsProps
      />

      {/* Modal cho câu hỏi */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bảng câu hỏi</Text>
            <ScrollView style={styles.modalScrollView}>
              {questions.map((item, index) => (
                <View key={index} style={styles.questionItem}>
                  <Text style={styles.questionItem}>{`Câu ${index + 1}: ${item.question}`}</Text>
                  <View style={styles.optionContainer}>
                    {item.options.map((option: string, optionIndex: number) => (
                      <TouchableOpacity
                        key={optionIndex}
                        style={[styles.optionButton, getOptionStyle(item.id, option)]}
                        onPress={() => handleAnswerSelect(item.id, option)}
                      >
                        <Text style={[styles.optionText, { color: getOptionStyle(item.id, option).color }]}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.closeButtonContainer}>
              <TouchableOpacity onPress={closeModal} style={styles.buttonCancel}>
                <Text style={styles.closeText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openSubmitModal} style={styles.buttonSubmit}>
                <Text style={styles.closeSubmitText}>Nộp bài</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal xác nhận nộp bài */}
      <Modal visible={isSubmitModalVisible} transparent={true} animationType="slide" onRequestClose={closeSubmitModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.submitModalTitle}>Thời gian đã hết! Bạn có muốn nộp bài không?</Text>
            <View style={styles.submitModalButtons}>
              <TouchableOpacity onPress={closeSubmitModal} style={styles.buttonCancel}>
                <Text style={styles.closeText}>Không</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} style={styles.buttonSubmit}>
                <Text style={styles.closeSubmitText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 20 },
  resultContainer: { 
    padding: 20, 
    alignItems: 'center' 
  },
  resultTitle: { 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  sectionBorder: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    borderRadius: 8 
  },
  closeButtonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 20 
  },
  optionContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginVertical: 10 
  },
  questionItem: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc' 
  },
  pictureSection: { 
    marginVertical: 10, 
    alignItems: 'center'
  },
  submitModalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20 
  },
  questionImage: { 
    width: 200, 
    height: 200, 
    resizeMode: 'contain', 
    marginVertical: 10 
  },
  resultText: { 
    fontSize: 18,
     marginVertical: 5 
    },
  scrollView: { 
    flexGrow: 1, 
    marginVertical: 10 
  },
  resultSubtitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 15 
  },
  continueButton: { 
    marginTop: 20, 
    backgroundColor: '#0099CC', 
    padding: 10, 
    borderRadius: 8, 
    width: '100%',
    alignItems: 'center' 
  },
  continueText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  modalBackground: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalContent: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 10, 
    width: '80%' 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  submitModalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center', 
    color: '#000' 
  },
  buttonCancel: { 
    backgroundColor: 'white', 
    borderColor: '#0099CC', 
    borderWidth: 2, padding: 10, 
    borderRadius: 8, 
    flex: 1, 
    marginHorizontal: 5, 
    alignItems: 'center',
  },
  buttonSubmit: { 
    backgroundColor: '#0099CC', 
    alignItems: 'center',
    padding: 10, 
    borderRadius: 8, 
    flex: 1, 
    marginHorizontal: 5 
  },
  closeText: { 
    color: '#0099CC', 
    fontWeight: 'bold' 
  },
  closeSubmitText: { 
    color: '#fff', 
    fontWeight: 'bold' },
  optionButton: { 
    padding: 10, 
    backgroundColor: '#0099CC', 
    margin: 5, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#ccc' },
  optionText: { 
    fontSize: 14, 
    color: '#000' 
  },
  modalScrollView: { 
    marginBottom: 20 
  },
  textSection: { 
    marginVertical: 10 
  },
  questionText: {
     fontSize: 16, 
     color: '#000', 
     marginBottom: 10 },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF0000', // Red color for urgency
  },
});

export default ExamDetailScreen;
