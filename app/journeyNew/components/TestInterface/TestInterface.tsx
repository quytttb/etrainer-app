import React, { useState, useEffect } from "react";
import { View, StyleSheet, BackHandler, Alert, Text, TouchableOpacity, ScrollView } from "react-native";
import TestTimer from "./TestTimer";
// import QuestionNavigation from "./QuestionNavigation";
// import SubmitConfirm from "./SubmitConfirm";
import QuestionRenderer from "../QuestionRenderer/QuestionRenderer";
import { Question } from "../../types/question";
import useAudioCleanup from "../../hooks/useAudioCleanup";

interface TestInterfaceProps {
     testData: any; // From API: { finalTestInfo, finalTestStatus, minScore, targetScore, canTakeTest }
     testType: "practice" | "final";
     onStartTest: () => void;
     onSubmit: (results: any) => void;
     onExit: () => void;
}

interface TestResults {
     answers: Record<string, any[]>;
     timeSpent: number;
     completedAt: string;
     score?: number;
     passed?: boolean;
}

// Backend request format for final test
interface BackendTestRequest {
     startTime: string;
     endTime: string;
     questionAnswers: any[];
}

const TestInterface: React.FC<TestInterfaceProps> = ({
     testData,
     testType,
     onStartTest,
     onSubmit,
     onExit,
}) => {
     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
     const [userAnswers, setUserAnswers] = useState<Record<string, any[]>>({});
     const [timeRemaining, setTimeRemaining] = useState(0);
     const [isPaused, setIsPaused] = useState(false);
     const [showNavigation, setShowNavigation] = useState(false);
     const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
     const [startTime] = useState(Date.now());
     const [testStarted, setTestStarted] = useState(false);
     const [questions, setQuestions] = useState<Question[]>([]);

     // ✅ FIX: Audio cleanup hook cho final test
     const { stopAudioOnAction } = useAudioCleanup({
          stopOnUnmount: true,
          stopOnNavigateAway: true,
          stopOnSubmit: true
     });

     // Initialize test data
     useEffect(() => {
          console.log(`🔍 [TestInterface] Props received:`, {
               hasTestData: !!testData,
               testType,
               finalTestInfo: !!testData?.finalTestInfo,
               questionsLength: testData?.finalTestInfo?.questions?.length || 0,
               finalTestStatus: testData?.finalTestStatus
          });

          if (testData?.finalTestInfo) {
               setTimeRemaining(testData.finalTestInfo.duration * 60); // Convert minutes to seconds
               setQuestions(testData.finalTestInfo.questions || []);

               console.log(`🔍 Test data loaded:`, {
                    questionsCount: testData.finalTestInfo.questions?.length || 0,
                    duration: testData.finalTestInfo.duration,
                    hasQuestions: !!testData.finalTestInfo.questions,
                    firstQuestion: testData.finalTestInfo.questions?.[0]?._id,
                    firstQuestionType: testData.finalTestInfo.questions?.[0]?.type
               });

               // ✅ DEBUG: Log all questions with their index
               console.log(`📝 Questions array debug:`,
                    testData.finalTestInfo.questions?.map((q: any, index: number) => ({
                         index,
                         id: q._id,
                         type: q.type,
                         questionText: q.question?.substring(0, 50) + '...'
                    }))
               );

               // If test already started, mark as started
               if (testData.finalTestStatus?.started && !testData.finalTestStatus?.completed) {
                    setTestStarted(true);
                    setIsPaused(false);
                    console.log(`✅ Auto-started test - questions available: ${testData.finalTestInfo.questions?.length || 0}`);
               }
          }
     }, [testData]);

     // Timer effect
     useEffect(() => {
          console.log(`⏰ Timer effect: testStarted=${testStarted}, isPaused=${isPaused}, timeRemaining=${timeRemaining}`);
          if (!testStarted || isPaused || timeRemaining <= 0) return;

          const timer = setInterval(() => {
               setTimeRemaining(prev => {
                    if (prev <= 1) {
                         handleAutoSubmit();
                         return 0;
                    }
                    return prev - 1;
               });
          }, 1000);

          return () => clearInterval(timer);
     }, [testStarted, isPaused, timeRemaining]);

     // Handle back button
     useEffect(() => {
          const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
               handleExit();
               return true;
          });
          return () => backHandler.remove();
     }, []);

     const handleStartTest = async () => {
          try {
               await onStartTest();
               setTestStarted(true);
               console.log("✅ Test started successfully");
          } catch (error) {
               console.error("❌ Error starting test:", error);
          }
     };

     const handleAutoSubmit = () => {
          Alert.alert(
               "Hết giờ!",
               "Thời gian làm bài đã kết thúc. Bài thi sẽ được nộp tự động.",
               [{ text: "OK", onPress: handleFinalSubmit }]
          );
     };

     const handleAnswerChange = (questionId: string, answers: any[]) => {
          console.log(`💾 Answer saved:`, {
               questionId,
               answers,
               currentIndex: currentQuestionIndex
          });
          setUserAnswers(prev => ({
               ...prev,
               [questionId]: answers
          }));
     };

     const handleQuestionChange = (index: number) => {
          setCurrentQuestionIndex(index);
          setShowNavigation(false);
     };

     const handlePause = () => {
          setIsPaused(!isPaused);
     };

     const handleExit = () => {
          Alert.alert(
               "Thoát bài thi",
               "Bạn có chắc chắn muốn thoát? Tiến độ sẽ không được lưu.",
               [
                    { text: "Hủy", style: "cancel" },
                    { text: "Thoát", style: "destructive", onPress: onExit }
               ]
          );
     };

     const handleShowSubmit = () => {
          setShowSubmitConfirm(true);
     };

     const handleFinalSubmit = async () => {
          // ✅ FIX: Stop audio trước khi submit final test
          await stopAudioOnAction('final-test-submit');

          const timeSpent = Math.floor((Date.now() - startTime) / 1000);

          // Transform userAnswers to questionAnswers format expected by backend
          const questionAnswers = questions.map((question, index) => {
               const userAnswer = userAnswers[question._id] || [];

               // For now, assume simple format - này cần customize based on question type
               return {
                    questionId: question._id,
                    userAnswer: userAnswer,
                    isCorrect: false, // This should be calculated based on correct answers
                    type: question.type
               };
          });

          const results: TestResults = {
               answers: userAnswers, // Keep original for internal use
               timeSpent,
               completedAt: new Date().toISOString(),
               score: calculateScore(),
               passed: false // Will be calculated by backend
          };

          // Create the request body that backend expects
          const requestBody: BackendTestRequest = {
               startTime: new Date(startTime).toISOString(),
               endTime: new Date().toISOString(),
               questionAnswers: questionAnswers.map(answer => answer.userAnswer)
          };

          console.log("📤 Submitting with backend format:", requestBody);
          onSubmit(requestBody);
     };

     const calculateScore = (): number => {
          // Simple scoring logic - replace with actual scoring algorithm
          const answeredCount = getAnsweredCount();
          return Math.floor((answeredCount / questions.length) * 100);
     };

     const getQuestionStatus = (index: number): "answered" | "current" | "unanswered" => {
          if (index === currentQuestionIndex) return "current";
          const questionId = questions[index]?._id;
          if (userAnswers[questionId] && userAnswers[questionId].length > 0) {
               return "answered";
          }
          return "unanswered";
     };

     const getAnsweredCount = (): number => {
          return Object.keys(userAnswers).filter(questionId =>
               userAnswers[questionId] && userAnswers[questionId].length > 0
          ).length;
     };

     // Show start screen before test begins
     if (!testStarted && testData?.finalTestStatus && !testData.finalTestStatus.started) {
          return (
               <View style={styles.container}>
                    <View style={styles.startContainer}>
                         <Text style={styles.testTitle}>{testData.finalTestInfo?.name || "Final Test"}</Text>
                         <Text style={styles.testInfo}>
                              Thời gian: {testData.finalTestInfo?.duration} phút
                         </Text>
                         <Text style={styles.testInfo}>
                              Số câu hỏi: {testData.finalTestInfo?.totalQuestions}
                         </Text>
                         <Text style={styles.testInfo}>
                              Điểm tối thiểu: {testData.minScore}
                         </Text>
                         <Text style={styles.testInfo}>
                              Điểm mục tiêu: {testData.targetScore}
                         </Text>

                         <TouchableOpacity
                              style={styles.startButton}
                              onPress={handleStartTest}
                              disabled={!testData.canTakeTest}
                         >
                              <Text style={styles.startButtonText}>Bắt đầu bài thi</Text>
                         </TouchableOpacity>

                         <TouchableOpacity style={styles.exitButton} onPress={onExit}>
                              <Text style={styles.exitButtonText}>Thoát</Text>
                         </TouchableOpacity>
                    </View>
               </View>
          );
     }

     const currentQuestion = questions[currentQuestionIndex];
     const answeredCount = getAnsweredCount();

     // ✅ DEBUG: Log current question mapping
     console.log(`🎯 Current question mapping:`, {
          currentQuestionIndex,
          questionsLength: questions.length,
          currentQuestionId: currentQuestion?._id,
          currentQuestionType: currentQuestion?.type,
          questionsIds: questions.map((q: Question) => q._id)
     });

     console.log(`🔍 TestInterface render state:`, {
          testStarted,
          questionsLength: questions.length,
          currentQuestionIndex,
          hasCurrentQuestion: !!currentQuestion,
          currentQuestionId: currentQuestion?._id,
          currentQuestionType: currentQuestion?.type,
          finalTestStarted: testData?.finalTestStatus?.started,
          finalTestCompleted: testData?.finalTestStatus?.completed,
          showStartScreen: !testStarted && testData?.finalTestStatus && !testData.finalTestStatus.started
     });

     return (
          <View style={styles.container}>
               {/* Header: Timer, Pause, Submit, Exit */}
               <View style={styles.header}>
                    <TestTimer
                         timeRemaining={timeRemaining}
                         totalTime={testData?.finalTestInfo?.duration * 60 || 3600}
                         isPaused={isPaused}
                         onPause={handlePause}
                         testType={testType}
                         questionsAnswered={answeredCount}
                         totalQuestions={questions.length}
                         onShowNavigation={() => console.log("Navigation disabled temporarily")}
                         onSubmit={() => handleFinalSubmit()}
                    />
                    <TouchableOpacity
                         style={styles.submitButton}
                         onPress={handleFinalSubmit}
                    >
                         <Text style={styles.submitButtonText}>Nộp bài thi</Text>
                    </TouchableOpacity>
               </View>

               {/* Question Content - Scrollable */}
               <ScrollView
                    style={styles.questionContainer}
                    contentContainerStyle={styles.questionContent}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
               >
                    {currentQuestion ? (
                         <QuestionRenderer
                              question={currentQuestion}
                              onAnswer={(answers) => handleAnswerChange(currentQuestion._id, Array.isArray(answers) ? answers : [answers])}
                              userAnswer={userAnswers[currentQuestion._id] || []}
                              isReview={false}
                         />
                    ) : (
                         <View style={styles.noQuestionContainer}>
                              <Text style={styles.noQuestionText}>
                                   Không tìm thấy câu hỏi {currentQuestionIndex + 1}
                              </Text>
                              <Text style={styles.debugText}>
                                   Debug: questions.length = {questions.length}, currentIndex = {currentQuestionIndex}
                              </Text>
                         </View>
                    )}
               </ScrollView>

               {/* Navigation Buttons dưới cùng */}
               {questions.length > 1 && (
                    <View style={styles.navigationContainerBottom}>
                         <TouchableOpacity
                              style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
                              onPress={() => {
                                   if (currentQuestionIndex > 0) {
                                        setCurrentQuestionIndex(currentQuestionIndex - 1);
                                   }
                              }}
                              disabled={currentQuestionIndex === 0}
                         >
                              <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.navButtonTextDisabled]}>Câu trước</Text>
                         </TouchableOpacity>
                         <TouchableOpacity
                              style={[styles.navButton, currentQuestionIndex === questions.length - 1 && styles.navButtonDisabled]}
                              onPress={() => {
                                   if (currentQuestionIndex < questions.length - 1) {
                                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                                   }
                              }}
                              disabled={currentQuestionIndex === questions.length - 1}
                         >
                              <Text style={[styles.navButtonText, currentQuestionIndex === questions.length - 1 && styles.navButtonTextDisabled]}>Câu sau</Text>
                         </TouchableOpacity>
                    </View>
               )}

               {/* Question Navigation Modal */}
               {/*showNavigation && (
                    <QuestionNavigation
                         questions={questions}
                         currentQuestionIndex={currentQuestionIndex}
                         getQuestionStatus={getQuestionStatus}
                         onQuestionSelect={handleQuestionChange}
                         onClose={() => setShowNavigation(false)}
                         answeredCount={answeredCount}
                    />
               )*/}

               {/* Submit Confirmation Modal */}
               {/*showSubmitConfirm && (
                    <SubmitConfirm
                         questions={questions}
                         userAnswers={userAnswers}
                         timeSpent={Math.floor((Date.now() - startTime) / 1000)}
                         testType={testType}
                         onConfirm={handleFinalSubmit}
                         onCancel={() => setShowSubmitConfirm(false)}
                         onReviewQuestion={(index) => {
                              setCurrentQuestionIndex(index);
                              setShowSubmitConfirm(false);
                         }}
                    />
               )*/}
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#f8f9fa",
     },
     startContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
     },
     testTitle: {
          fontSize: 24,
          fontWeight: "bold",
          color: "#1a1a1a",
          marginBottom: 20,
          textAlign: "center",
     },
     testInfo: {
          fontSize: 16,
          color: "#666",
          marginBottom: 10,
          textAlign: "center",
     },
     startButton: {
          backgroundColor: "#007AFF",
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 10,
          marginTop: 30,
          marginBottom: 15,
     },
     startButtonText: {
          color: "#fff",
          fontSize: 18,
          fontWeight: "600",
     },
     exitButton: {
          backgroundColor: "#ff3b30",
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 10,
     },
     exitButtonText: {
          color: "#fff",
          fontSize: 16,
          fontWeight: "600",
     },
     questionContainer: {
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 16,
     },
     questionContent: {
          flexGrow: 1,
          paddingBottom: 20,
     },
     header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: 16,
          backgroundColor: "#f8f9fa",
     },
     submitButton: {
          backgroundColor: "#4CAF50",
          paddingHorizontal: 18,
          paddingVertical: 10,
          borderRadius: 8,
          marginLeft: 10,
     },
     submitButtonText: {
          color: "#fff",
          fontSize: 16,
          fontWeight: "600",
     },
     navigationContainerBottom: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
     },
     navButton: {
          backgroundColor: "#007AFF",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 8,
          minWidth: 80,
     },
     navButtonDisabled: {
          backgroundColor: "#ccc",
     },
     navButtonText: {
          color: "#fff",
          fontSize: 16,
          fontWeight: "600",
          textAlign: "center",
     },
     navButtonTextDisabled: {
          color: "#999",
     },
     noQuestionContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
     },
     noQuestionText: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
          marginBottom: 10,
     },
     debugText: {
          fontSize: 14,
          color: "#666",
     },
});

export default TestInterface;