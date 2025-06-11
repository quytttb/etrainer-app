import React, { useState, useEffect } from "react";
import { View, StyleSheet, BackHandler, Alert, ScrollView } from "react-native";
import TestHeader from "./TestHeader";
import QuestionNavigation from "./QuestionNavigation";
import SubmitConfirm from "./SubmitConfirm";
import QuestionRenderer from "../QuestionRenderer/QuestionRenderer";
import { Question } from "../../types/question";
import useAudioCleanup from "../../hooks/useAudioCleanup";

interface TestInterfaceProps {
     testData: any;
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

     const { stopAudioOnAction } = useAudioCleanup({
          stopOnUnmount: true,
          stopOnNavigateAway: true,
          stopOnSubmit: true
     });

     // Initialize test data
     useEffect(() => {
          if (testData?.finalTestInfo) {
               setTimeRemaining(testData.finalTestInfo.duration * 60);
               setQuestions(testData.finalTestInfo.questions || []);

               if (testData.finalTestStatus?.started && !testData.finalTestStatus?.completed) {
                    setTestStarted(true);
                    setIsPaused(false);
               }
          }
     }, [testData]);

     // Timer effect
     useEffect(() => {
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
          setUserAnswers(prev => ({
               ...prev,
               [questionId]: answers
          }));
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
          await stopAudioOnAction('final-test-submit');

          const timeSpent = Math.floor((Date.now() - startTime) / 1000);
          const questionAnswers = questions.map((question) => ({
               questionId: question._id || question.id || '',
               userAnswer: userAnswers[question._id || question.id || ''] || [],
               isCorrect: false,
               type: question.type
          }));

          const results: TestResults = {
               answers: userAnswers,
               timeSpent,
               completedAt: new Date().toISOString(),
          };

          onSubmit({ questionAnswers, ...results });
     };

     const getAnsweredCount = (): number => {
          return questions.filter(question => {
               const questionId = question._id || question.id;
               return questionId && userAnswers[questionId] && userAnswers[questionId].length > 0;
          }).length;
     };

     const currentQuestion = questions[currentQuestionIndex];

     if (!testStarted) {
          return (
               <View style={styles.startScreen}>
                    {/* Start screen UI here */}
               </View>
          );
     }

     if (!currentQuestion) {
          return <View style={styles.loadingContainer} />;
     }

     return (
          <View style={styles.container}>
               <TestHeader
                    timeRemaining={timeRemaining}
                    isPaused={isPaused}
                    onPause={handlePause}
                    onShowNavigation={() => setShowNavigation(true)}
                    onExit={handleExit}
                    currentQuestionIndex={currentQuestionIndex}
                    totalQuestions={questions.length}
               />

               <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <QuestionRenderer
                         question={currentQuestion}
                         onAnswer={(answers) => {
                              const questionId = currentQuestion._id || currentQuestion.id || '';
                              handleAnswerChange(questionId, Array.isArray(answers) ? answers : [answers]);
                         }}
                         userAnswer={userAnswers[currentQuestion._id || currentQuestion.id || '']}
                         isReview={false}
                    />
               </ScrollView>

               <QuestionNavigation
                    visible={showNavigation}
                    onClose={() => setShowNavigation(false)}
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    userAnswers={userAnswers}
                    onQuestionSelect={setCurrentQuestionIndex}
               />

               <SubmitConfirm
                    visible={showSubmitConfirm}
                    onClose={() => setShowSubmitConfirm(false)}
                    onConfirm={handleFinalSubmit}
                    answeredCount={getAnsweredCount()}
                    totalQuestions={questions.length}
                    timeRemaining={timeRemaining}
               />
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#fff',
     },
     content: {
          flex: 1,
     },
     startScreen: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
     },
     loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
     },
});

export default TestInterface;