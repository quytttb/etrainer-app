import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import QuestionRenderer from "./QuestionRenderer";
import AudioPlayer from "./AudioPlayer";
import ImageViewer from "./ImageViewer";
import AnswerInput from "./AnswerInput";
import LoadingSpinner from "../Common/LoadingSpinner";
import ErrorMessage from "../Common/ErrorMessage";

interface Question {
     id: string;
     questionNumber: number;
     type: string;
     question?: string;
     audio?: {
          name: string;
          url: string;
     };
     imageUrl?: string;
     answers?: Array<{
          answer: string;
          isCorrect: boolean;
          _id: string;
     }>;
     questions?: Array<{
          question: string;
          answers: Array<{
               answer: string;
               isCorrect: boolean;
               _id: string;
          }>;
          _id: string;
     }>;
     subtitle?: string;
     explanation?: string;
}

interface LessonData {
     id: string;
     title: string;
     type: string;
     questions: Question[];
     duration: number;
}

interface LessonContentProps {
     lessonData?: LessonData;
     onAnswer?: (questionId: string, answer: any) => void;
     onComplete?: (results: any) => void;
     onExit?: () => void;
}

const LessonContent: React.FC<LessonContentProps> = ({
     lessonData,
     onAnswer,
     onComplete,
     onExit,
}) => {
     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
     const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
     const [loading, setLoading] = useState(false);
     const [timeStarted, setTimeStarted] = useState<Date>(new Date());

     // Mock lesson data
     const mockLessonData: LessonData = {
          id: "lesson1",
          title: "Lesson 1: Basic Grammar and Vocabulary",
          type: "LISTENING",
          duration: 25,
          questions: [
               {
                    id: "q1",
                    questionNumber: 1,
                    type: "ASK_AND_ANSWER",
                    question: "How are you feeling today?",
                    audio: {
                         name: "ask_answer_1.mp3",
                         url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_700KB.mp3"
                    },
                    answers: [
                         { answer: "I'm feeling great, thank you!", isCorrect: true, _id: "aa1" },
                         { answer: "I'm tired today", isCorrect: false, _id: "aa2" },
                         { answer: "I don't understand", isCorrect: false, _id: "aa3" },
                         { answer: "Can you repeat that?", isCorrect: false, _id: "aa4" },
                    ]
               },
               {
                    id: "q2",
                    questionNumber: 2,
                    type: "CONVERSATION_PIECE",
                    audio: {
                         name: "conversation_1.mp3",
                         url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_1MG.mp3"
                    },
                    subtitle: "A: Where are you going? B: I'm going to the library to study.",
                    questions: [
                         {
                              question: "Where is person B going?",
                              answers: [
                                   { answer: "To the library", isCorrect: true, _id: "c1a1" },
                                   { answer: "To the store", isCorrect: false, _id: "c1a2" },
                                   { answer: "To work", isCorrect: false, _id: "c1a3" },
                                   { answer: "Home", isCorrect: false, _id: "c1a4" },
                              ],
                              _id: "cq1"
                         },
                         {
                              question: "What is person B going to do?",
                              answers: [
                                   { answer: "Study", isCorrect: true, _id: "c2a1" },
                                   { answer: "Work", isCorrect: false, _id: "c2a2" },
                                   { answer: "Shop", isCorrect: false, _id: "c2a3" },
                                   { answer: "Sleep", isCorrect: false, _id: "c2a4" },
                              ],
                              _id: "cq2"
                         }
                    ]
               },
               {
                    id: "q3",
                    questionNumber: 3,
                    type: "FILL_IN_THE_BLANK_QUESTION",
                    question: "Its ............... into Brazil has given Darrow Textiles Ltd. an advantage over much of its competition.",
                    answers: [
                         { answer: "A. expansion", isCorrect: true, _id: "fib1" },
                         { answer: "B. process", isCorrect: false, _id: "fib2" },
                         { answer: "C. creation", isCorrect: false, _id: "fib3" },
                         { answer: "D. action", isCorrect: false, _id: "fib4" },
                    ],
                    explanation: "Đáp án A 'expansion' (sự mở rộng) là đúng vì câu nói về việc công ty mở rộng hoạt động kinh doanh vào Brazil, điều này mang lại lợi thế cạnh tranh. 'Expansion into' là cụm từ cố định có nghĩa là 'mở rộng vào'."
               },
               {
                    id: "q4",
                    questionNumber: 4,
                    type: "FILL_IN_THE_PARAGRAPH",
                    question: "A long time ago, this part of the town used to be a place where people came to relax and get away from their stress. Although this was ....(41)... a shelter for people to escape, it has now become a chaotic and noisy market area. Up until a few years ago, it wasn't as bad as it is now. Although it is true that some people in the neighborhood supported the expansion of the market a few years ago, now most of them....(42)... that it has gotten out of control and created many serious problems for the area.",
                    explanation: "Đây là bài tập điền từ vào đoạn văn về sự thay đổi của một khu vực từ nơi nghỉ ngơi thành khu chợ ồn ào. Cần chú ý đến ngữ cảnh và mối liên hệ logic giữa các câu để chọn từ phù hợp.",
                    questions: [
                         {
                              question: "Select the best option for blank (41).",
                              answers: [
                                   { answer: "(A) just", isCorrect: false, _id: "p1a1" },
                                   { answer: "(B) once", isCorrect: true, _id: "p1a2" },
                                   { answer: "(C) such", isCorrect: false, _id: "p1a3" },
                                   { answer: "(D) likely", isCorrect: false, _id: "p1a4" },
                              ],
                              _id: "pq1"
                         },
                         {
                              question: "Select the best option for blank (42).",
                              answers: [
                                   { answer: "(A) would have agreed", isCorrect: false, _id: "p2a1" },
                                   { answer: "(B) would agree", isCorrect: true, _id: "p2a2" },
                                   { answer: "(C) has agree", isCorrect: false, _id: "p2a3" },
                                   { answer: "(D) were agreeing", isCorrect: false, _id: "p2a4" },
                              ],
                              _id: "pq2"
                         }
                    ]
               },
               {
                    id: "q5",
                    questionNumber: 5,
                    type: "SHORT_TALK",
                    question: "You will hear an announcement about office building maintenance.",
                    audio: {
                         name: "short_talk_1.mp3",
                         url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_1MG.mp3"
                    },
                    subtitle: "Attention all building tenants. Please be advised that elevator maintenance will be conducted this Saturday from 9 AM to 4 PM. During this time, elevators will be out of service. We recommend using the stairs or planning your visits accordingly. The building management apologizes for any inconvenience this may cause. Emergency contacts will be available at the front desk throughout the maintenance period.",
                    questions: [
                         {
                              question: "What time will the maintenance be conducted?",
                              answers: [
                                   { answer: "A. 9 AM to 4 PM", isCorrect: true, _id: "st1a1" },
                                   { answer: "B. 8 AM to 5 PM", isCorrect: false, _id: "st1a2" },
                                   { answer: "C. 10 AM to 3 PM", isCorrect: false, _id: "st1a3" },
                                   { answer: "D. All day", isCorrect: false, _id: "st1a4" },
                              ],
                              _id: "stq1"
                         },
                         {
                              question: "What should tenants do during maintenance?",
                              answers: [
                                   { answer: "A. Use the stairs", isCorrect: true, _id: "st2a1" },
                                   { answer: "B. Stay home", isCorrect: false, _id: "st2a2" },
                                   { answer: "C. Call the office", isCorrect: false, _id: "st2a3" },
                                   { answer: "D. Wait for instructions", isCorrect: false, _id: "st2a4" },
                              ],
                              _id: "stq2"
                         },
                         {
                              question: "Where will emergency contacts be available?",
                              answers: [
                                   { answer: "A. At the front desk", isCorrect: true, _id: "st3a1" },
                                   { answer: "B. In the elevator", isCorrect: false, _id: "st3a2" },
                                   { answer: "C. On each floor", isCorrect: false, _id: "st3a3" },
                                   { answer: "D. Via phone only", isCorrect: false, _id: "st3a4" },
                              ],
                              _id: "stq3"
                         }
                    ],
                    explanation: "Đây là thông báo về việc bảo trì thang máy. Cần nghe kỹ thời gian, hướng dẫn cho cư dân và nơi có thể tìm kiếm hỗ trợ khẩn cấp."
               },
               {
                    id: "q6",
                    questionNumber: 6,
                    type: "IMAGE_DESCRIPTION",
                    question: "Describe what you see in the office scene.",
                    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
                    answers: [
                         { answer: "People working at computers", isCorrect: true, _id: "ia1" },
                         { answer: "Empty conference room", isCorrect: false, _id: "ia2" },
                         { answer: "Kitchen area", isCorrect: false, _id: "ia3" },
                         { answer: "Reception desk", isCorrect: false, _id: "ia4" },
                    ]
               }
          ],
     };

     const currentQuestion = mockLessonData.questions[currentQuestionIndex];
     const totalQuestions = mockLessonData.questions.length;
     const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

     useEffect(() => {
          setTimeStarted(new Date());
     }, []);

     const handleAnswerChange = (answer: any) => {
          if (!currentQuestion) return;

          const newAnswers = {
               ...userAnswers,
               [currentQuestion.id]: answer,
          };
          setUserAnswers(newAnswers);
          onAnswer?.(currentQuestion.id, answer);
     };

     const handleNext = () => {
          if (isLastQuestion) {
               handleCompleteLesson();
          } else {
               setCurrentQuestionIndex(prev => prev + 1);
          }
     };

     const handlePrevious = () => {
          if (currentQuestionIndex > 0) {
               setCurrentQuestionIndex(prev => prev - 1);
          }
     };

     const handleCompleteLesson = () => {
          const timeCompleted = new Date();
          const timeSpent = Math.round((timeCompleted.getTime() - timeStarted.getTime()) / 1000);

          const results = {
               lessonId: mockLessonData.id,
               userAnswers,
               timeSpent,
               completedAt: timeCompleted.toISOString(),
               totalQuestions,
          };

          onComplete?.(results);
     };

     const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

     if (loading) {
          return (
               <LoadingSpinner
                    fullScreen
                    text="Đang tải bài học..."
               />
          );
     }

     return (
          <SafeAreaView style={styles.container}>
               {/* Header with progress */}
               <View style={styles.header}>
                    <View style={styles.progressSection}>
                         <Text style={styles.lessonTitle}>{mockLessonData.title}</Text>
                         <View style={styles.progressInfo}>
                              <Text style={styles.progressText}>
                                   Câu {currentQuestionIndex + 1} / {totalQuestions}
                              </Text>
                              <View style={styles.progressBar}>
                                   <View
                                        style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                                   />
                              </View>
                         </View>
                    </View>
               </View>

               {/* Main Content */}
               <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
               >
                    {/* Question Renderer */}
                    <QuestionRenderer
                         question={currentQuestion}
                         questionIndex={currentQuestionIndex}
                         userAnswer={userAnswers[currentQuestion?.id]}
                         onAnswerChange={handleAnswerChange}
                    />

                    {/* Audio Player (if question has audio) */}
                    {currentQuestion?.audio && (
                         <AudioPlayer
                              audioUrl={currentQuestion.audio.url}
                              title={currentQuestion.audio.name}
                         />
                    )}

                    {/* Image Viewer (if question has image) */}
                    {currentQuestion?.imageUrl && (
                         <ImageViewer
                              imageUrl={currentQuestion.imageUrl}
                              title="Question Image"
                         />
                    )}

                    {/* Answer Input */}
                    <AnswerInput
                         question={currentQuestion}
                         userAnswer={userAnswers[currentQuestion?.id]}
                         onAnswerChange={handleAnswerChange}
                         onNext={handleNext}
                         onPrevious={handlePrevious}
                         showPrevious={currentQuestionIndex > 0}
                         nextButtonText={isLastQuestion ? "Hoàn thành" : "Tiếp theo"}
                    />
               </ScrollView>
          </SafeAreaView>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#f8f9fa",
     },
     header: {
          backgroundColor: "#fff",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#e9ecef",
     },
     progressSection: {
          flex: 1,
     },
     lessonTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: 8,
     },
     progressInfo: {
          flexDirection: "row",
          alignItems: "center",
     },
     progressText: {
          fontSize: 14,
          color: "#7f8c8d",
          marginRight: 12,
          minWidth: 80,
     },
     progressBar: {
          flex: 1,
          height: 6,
          backgroundColor: "#ecf0f1",
          borderRadius: 3,
          overflow: "hidden",
     },
     progressFill: {
          height: "100%",
          backgroundColor: "#3498db",
          borderRadius: 3,
     },
     content: {
          flex: 1,
     },
     contentContainer: {
          paddingBottom: 100, // Space for bottom navigation
     },
});

export default LessonContent; 