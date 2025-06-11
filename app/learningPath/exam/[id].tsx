import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getStageFinalTestService, startStageFinalTestService, completeStageFinalTestService } from '../../journeyStudy/service';

const LearningPathTestScreen = () => {
  const { id } = useLocalSearchParams(); // This is stageIndex
  const router = useRouter();
  const stageIndex = parseInt(id as string) || 0;

  // Component states
  const [isLoading, setIsLoading] = useState(true);
  const [finalTestData, setFinalTestData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load final test data
  useEffect(() => {
    loadFinalTestData();
  }, [stageIndex]);

  // Timer effect
  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [testStarted, timeLeft]);

  const loadFinalTestData = async () => {
    try {
      setIsLoading(true);
      console.log('Loading final test data for stage:', stageIndex);
      const response = await getStageFinalTestService(stageIndex);
      console.log('Final test response:', JSON.stringify(response, null, 2));

      if (response?.finalTestInfo) {
        setFinalTestData(response.finalTestInfo);
        console.log('Final test data set:', response.finalTestInfo);

        // If test is already started and has questions, load them
        if (response.finalTestInfo.questions && response.finalTestInfo.questions.length > 0) {
          console.log('Questions found:', response.finalTestInfo.questions.length);

          // Transform API data structure to component-expected structure
          const transformedQuestions = response.finalTestInfo.questions.flatMap((item: any, itemIndex: number) => {
            if (item.type === 'CONVERSATION_PIECE' && item.questions) {
              // For CONVERSATION_PIECE, each item can have multiple questions
              return item.questions.map((subQuestion: any, subIndex: number) => ({
                _id: `${item._id}_${subIndex}`,
                question: subQuestion.question,
                type: 'single_choice',
                answers: subQuestion.answers || [],
                audio: item.audio,
                subtitle: item.subtitle,
                explanation: item.explanation
              }));
            } else {
              // For other types, use the item directly
              return [{
                _id: item._id,
                question: item.question,
                type: item.type || 'single_choice',
                answers: item.answers || [],
                audio: item.audio,
                subtitle: item.subtitle,
                explanation: item.explanation
              }];
            }
          });

          console.log('Transformed questions:', transformedQuestions.length);
          setQuestions(transformedQuestions);
          setTestStarted(true);
          // Set timer based on duration
          const duration = response.finalTestInfo.duration || 30; // Default 30 minutes
          setTimeLeft(duration * 60); // Convert to seconds
        } else {
          console.log('No questions in finalTestInfo');
        }
      } else {
        console.log('No finalTestInfo in response');
        // Try to use mock data for testing if API fails
        const mockQuestions = [
          {
            _id: '1',
            question: 'Câu hỏi test - Bạn có hiểu nội dung giai đoạn này không?',
            type: 'single_choice',
            answers: [
              { _id: 'a1', answer: 'Có, tôi hiểu rất rõ', isCorrect: true },
              { _id: 'a2', answer: 'Hiểu một phần', isCorrect: false },
              { _id: 'a3', answer: 'Chưa hiểu lắm', isCorrect: false },
              { _id: 'a4', answer: 'Không hiểu', isCorrect: false }
            ]
          },
          {
            _id: '2',
            question: 'Câu hỏi test 2 - Bạn có thể áp dụng kiến thức vào thực tế không?',
            type: 'single_choice',
            answers: [
              { _id: 'b1', answer: 'Có thể áp dụng tốt', isCorrect: true },
              { _id: 'b2', answer: 'Áp dụng được một phần', isCorrect: false },
              { _id: 'b3', answer: 'Khó áp dụng', isCorrect: false },
              { _id: 'b4', answer: 'Không thể áp dụng', isCorrect: false }
            ]
          }
        ];
        setQuestions(mockQuestions);
        setFinalTestData({
          totalQuestions: mockQuestions.length,
          duration: 10, // 10 minutes for testing
          stage: stageIndex
        });
        console.log('Using mock data for testing');
      }
    } catch (error) {
      console.error('Error loading final test:', error);
      // Use mock data when API fails
      const mockQuestions = [
        {
          _id: '1',
          question: 'Câu hỏi test - Bạn có hiểu nội dung giai đoạn này không?',
          type: 'single_choice',
          answers: [
            { _id: 'a1', answer: 'Có, tôi hiểu rất rõ', isCorrect: true },
            { _id: 'a2', answer: 'Hiểu một phần', isCorrect: false },
            { _id: 'a3', answer: 'Chưa hiểu lắm', isCorrect: false },
            { _id: 'a4', answer: 'Không hiểu', isCorrect: false }
          ]
        },
        {
          _id: '2',
          question: 'Câu hỏi test 2 - Bạn có thể áp dụng kiến thức vào thực tế không?',
          type: 'single_choice',
          answers: [
            { _id: 'b1', answer: 'Có thể áp dụng tốt', isCorrect: true },
            { _id: 'b2', answer: 'Áp dụng được một phần', isCorrect: false },
            { _id: 'b3', answer: 'Khó áp dụng', isCorrect: false },
            { _id: 'b4', answer: 'Không thể áp dụng', isCorrect: false }
          ]
        }
      ];
      setQuestions(mockQuestions);
      setFinalTestData({
        totalQuestions: mockQuestions.length,
        duration: 10, // 10 minutes for testing
        stage: stageIndex
      });
      console.log('Using mock data due to API error');
      Alert.alert('Thông báo', 'Đang sử dụng dữ liệu test. API hiện tại chưa sẵn sàng.');
    } finally {
      setIsLoading(false);
    }
  };

  const startTest = async () => {
    try {
      setIsLoading(true);
      console.log('Starting test for stage:', stageIndex);
      const response = await startStageFinalTestService(stageIndex);
      console.log('Start test response:', JSON.stringify(response, null, 2));

      if (response?.finalTest?.questions && response.finalTest.questions.length > 0) {
        console.log('Questions received from API:', response.finalTest.questions.length);

        // Transform API data structure to component-expected structure
        const transformedQuestions = response.finalTest.questions.flatMap((item: any, itemIndex: number) => {
          if (item.type === 'CONVERSATION_PIECE' && item.questions) {
            // For CONVERSATION_PIECE, each item can have multiple questions
            return item.questions.map((subQuestion: any, subIndex: number) => ({
              _id: `${item._id}_${subIndex}`,
              question: subQuestion.question,
              type: 'single_choice',
              answers: subQuestion.answers || [],
              audio: item.audio,
              subtitle: item.subtitle,
              explanation: item.explanation
            }));
          } else {
            // For other types, use the item directly
            return [{
              _id: item._id,
              question: item.question,
              type: item.type || 'single_choice',
              answers: item.answers || [],
              audio: item.audio,
              subtitle: item.subtitle,
              explanation: item.explanation
            }];
          }
        });

        console.log('Transformed questions in startTest:', transformedQuestions.length);
        setQuestions(transformedQuestions);
        setTestStarted(true);
        // Set timer
        const duration = response.finalTest.duration || 30;
        setTimeLeft(duration * 60);

        Alert.alert('Bắt đầu', 'Bài test đã được bắt đầu. Chúc bạn làm bài tốt!');
      } else {
        console.log('No questions in API response, using mock data');
        // Use mock data for testing
        const mockQuestions = [
          {
            _id: '1',
            question: 'Câu hỏi test - Bạn có hiểu nội dung giai đoạn này không?',
            type: 'single_choice',
            answers: [
              { _id: 'a1', answer: 'Có, tôi hiểu rất rõ', isCorrect: true },
              { _id: 'a2', answer: 'Hiểu một phần', isCorrect: false },
              { _id: 'a3', answer: 'Chưa hiểu lắm', isCorrect: false },
              { _id: 'a4', answer: 'Không hiểu', isCorrect: false }
            ]
          },
          {
            _id: '2',
            question: 'Câu hỏi test 2 - Bạn có thể áp dụng kiến thức vào thực tế không?',
            type: 'single_choice',
            answers: [
              { _id: 'b1', answer: 'Có thể áp dụng tốt', isCorrect: true },
              { _id: 'b2', answer: 'Áp dụng được một phần', isCorrect: false },
              { _id: 'b3', answer: 'Khó áp dụng', isCorrect: false },
              { _id: 'b4', answer: 'Không thể áp dụng', isCorrect: false }
            ]
          }
        ];
        setQuestions(mockQuestions);
        setTestStarted(true);
        setTimeLeft(10 * 60); // 10 minutes for testing

        Alert.alert('Bắt đầu', 'Bài test đã được bắt đầu với dữ liệu test. Chúc bạn làm bài tốt!');
      }
    } catch (error) {
      console.error('Error starting test:', error);
      // Use mock data when API fails
      const mockQuestions = [
        {
          _id: '1',
          question: 'Câu hỏi test - Bạn có hiểu nội dung giai đoạn này không?',
          type: 'single_choice',
          answers: [
            { _id: 'a1', answer: 'Có, tôi hiểu rất rõ', isCorrect: true },
            { _id: 'a2', answer: 'Hiểu một phần', isCorrect: false },
            { _id: 'a3', answer: 'Chưa hiểu lắm', isCorrect: false },
            { _id: 'a4', answer: 'Không hiểu', isCorrect: false }
          ]
        },
        {
          _id: '2',
          question: 'Câu hỏi test 2 - Bạn có thể áp dụng kiến thức vào thực tế không?',
          type: 'single_choice',
          answers: [
            { _id: 'b1', answer: 'Có thể áp dụng tốt', isCorrect: true },
            { _id: 'b2', answer: 'Áp dụng được một phần', isCorrect: false },
            { _id: 'b3', answer: 'Khó áp dụng', isCorrect: false },
            { _id: 'b4', answer: 'Không thể áp dụng', isCorrect: false }
          ]
        }
      ];
      setQuestions(mockQuestions);
      setTestStarted(true);
      setTimeLeft(10 * 60); // 10 minutes for testing

      Alert.alert('Bắt đầu', 'Bài test đã được bắt đầu với dữ liệu test do lỗi API. Chúc bạn làm bài tốt!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitTest = async () => {
    if (isSubmitting) return;

    Alert.alert(
      'Xác nhận nộp bài',
      'Bạn có chắc chắn muốn nộp bài? Bạn sẽ không thể thay đổi câu trả lời sau khi nộp.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Nộp bài', onPress: submitTest }
      ]
    );
  };

  const handleAutoSubmit = () => {
    Alert.alert('Hết thời gian', 'Thời gian làm bài đã kết thúc. Bài thi sẽ được nộp tự động.');
    submitTest();
  };

  const submitTest = async () => {
    try {
      setIsSubmitting(true);

      // Convert answers to the format backend expects
      const questionAnswers = questions.map(question => {
        const userAnswer = selectedAnswers[question._id];
        const correctAnswer = question.answers?.find((ans: any) => ans.isCorrect)?.answer;

        return {
          questionId: question._id,
          userAnswer: userAnswer || '',
          isCorrect: userAnswer === correctAnswer,
          isNotAnswer: !userAnswer,
          type: question.type
        };
      });

      const submitData = {
        startTime: new Date(Date.now() - (finalTestData?.duration || 30) * 60 * 1000).toISOString(),
        endTime: new Date().toISOString(),
        questionAnswers: questionAnswers
      };

      console.log('Submitting test data:', submitData);

      try {
        const response = await completeStageFinalTestService(stageIndex, submitData);
        console.log('Submit response:', response);

        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        // Navigate to result page with API response data
        router.push({
          pathname: `/learningPath/result/${id}`,
          params: {
            score: response.score || 0,
            correctAnswers: response.correctAnswers || 0,
            totalQuestions: response.totalQuestions || questions.length,
            passed: String(response.passed || false)
          }
        });
      } catch (apiError) {
        console.error('API submit error, using local calculation:', apiError);

        // Calculate local results when API fails
        const correctCount = questionAnswers.filter(q => q.isCorrect).length;
        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= 60; // Assuming 60% is passing

        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        // Navigate to result page with local calculation
        router.push({
          pathname: `/learningPath/result/${id}`,
          params: {
            score: score,
            correctAnswers: correctCount,
            totalQuestions: questions.length,
            passed: String(passed)
          }
        });
      }

    } catch (error) {
      console.error('Error submitting test:', error);
      Alert.alert('Lỗi', 'Không thể nộp bài. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0099CC" />
          <Text style={styles.loadingText}>Đang tải bài test...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show start screen if test hasn't started
  if (!testStarted || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.startContainer}>
          <Text style={styles.startTitle}>Bài Test Tổng Kết Giai Đoạn {stageIndex + 1}</Text>

          {finalTestData && (
            <View style={styles.testInfo}>
              <Text style={styles.infoText}>📝 Tổng số câu hỏi: {finalTestData.totalQuestions}</Text>
              <Text style={styles.infoText}>⏱️ Thời gian: {finalTestData.duration} phút</Text>
              <Text style={styles.infoText}>🎯 Yêu cầu: Đạt điểm tối thiểu để qua giai đoạn</Text>
            </View>
          )}

          <Text style={styles.instructions}>
            • Đọc kỹ câu hỏi trước khi trả lời{'\n'}
            • Bạn có thể xem lại và thay đổi câu trả lời{'\n'}
            • Thời gian sẽ tự động kết thúc khi hết giờ{'\n'}
            • Chúc bạn làm bài tốt!
          </Text>

          <TouchableOpacity
            style={styles.startButton}
            onPress={startTest}
            disabled={isLoading}
          >
            <Text style={styles.startButtonText}>
              {isLoading ? 'Đang tải...' : 'Bắt đầu làm bài'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with timer and progress */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Câu {currentQuestionIndex + 1}/{questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.timerContainer}>
          <Text style={[styles.timerText, timeLeft < 300 && styles.timerWarning]}>
            ⏱️ {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      {/* Question content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentQuestion && (
          <View style={styles.questionContainer}>
            {/* Show subtitle/conversation for CONVERSATION_PIECE questions */}
            {currentQuestion.subtitle && (
              <View style={styles.subtitleContainer}>
                <Text style={styles.subtitleLabel}>🎧 Đoạn hội thoại:</Text>
                <Text style={styles.subtitleText}>
                  {currentQuestion.subtitle}
                </Text>
              </View>
            )}

            <Text style={styles.questionText}>
              {currentQuestion.question}
            </Text>

            {/* Answer options */}
            <View style={styles.answersContainer}>
              {currentQuestion.answers?.map((answer: any, index: number) => (
                <TouchableOpacity
                  key={answer._id}
                  style={[
                    styles.answerOption,
                    selectedAnswers[currentQuestion._id] === answer.answer && styles.selectedAnswer
                  ]}
                  onPress={() => handleAnswerSelect(currentQuestion._id, answer.answer)}
                >
                  <View style={styles.answerContent}>
                    <Text style={styles.answerLabel}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                    <Text style={[
                      styles.answerText,
                      selectedAnswers[currentQuestion._id] === answer.answer && styles.selectedAnswerText
                    ]}>
                      {answer.answer}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
          onPress={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.disabledButtonText]}>
            ← Câu trước
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitTest}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === questions.length - 1 && styles.disabledButton]}
          onPress={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          <Text style={[styles.navButtonText, currentQuestionIndex === questions.length - 1 && styles.disabledButtonText]}>
            Câu sau →
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  startContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  startTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  testInfo: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  instructions: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  startButton: {
    backgroundColor: '#0099CC',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  progressContainer: {
    flex: 1,
    marginRight: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0099CC',
    borderRadius: 2,
  },
  timerContainer: {
    alignItems: 'flex-end',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timerWarning: {
    color: '#ff4444',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
    color: '#333',
    marginBottom: 20,
    fontWeight: '500',
  },
  subtitleContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#0099CC',
  },
  subtitleLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0099CC',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  answersContainer: {
    gap: 12,
  },
  answerOption: {
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
  },
  selectedAnswer: {
    borderColor: '#0099CC',
    backgroundColor: '#f0f8ff',
  },
  answerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0099CC',
    marginRight: 12,
    minWidth: 20,
  },
  answerText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectedAnswerText: {
    color: '#0099CC',
    fontWeight: '500',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    minWidth: 80,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    color: '#666',
  },
  disabledButtonText: {
    color: '#ccc',
  },
  submitButton: {
    backgroundColor: '#0099CC',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LearningPathTestScreen;
