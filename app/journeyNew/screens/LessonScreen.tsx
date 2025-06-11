import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JourneyNewService } from "../service";
import AudioManager from "../utils/AudioManager";
// Simple wrapper component để test lesson logic
const QuestionSession = ({ questions, onComplete }: { questions: any[], onComplete: (result: any) => void }) => {
     const [currentIndex, setCurrentIndex] = useState(0);
     const [answers, setAnswers] = useState<Record<string, any>>({});
     const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set());

     const currentQuestion = questions[currentIndex];
     const isCurrentChecked = checkedQuestions.has(currentQuestion?._id || '');
     const allChecked = questions.every(q => checkedQuestions.has(q._id));

     const handleAnswer = (answer: any) => {
          if (currentQuestion) {
               setAnswers(prev => ({
                    ...prev,
                    [currentQuestion._id]: answer
               }));
               console.log('💾 Answer saved for question:', currentQuestion._id, answer);
          }
     };

     const handleCheck = async () => {
          if (currentQuestion) {
               // ✅ FIX: Pause audio khi bấm nút Kiểm tra theo đề xuất của user
               try {
                    await AudioManager.pauseAllAudio();
                    console.log('🎵 Audio paused when checking answer');
               } catch (error) {
                    console.error('❌ Error pausing audio:', error);
               }

               setCheckedQuestions(prev => new Set([...prev, currentQuestion._id]));
               console.log('✅ Question checked:', currentQuestion._id);
          }
     };

     const goNext = () => {
          if (currentIndex < questions.length - 1) {
               setCurrentIndex(currentIndex + 1);
          }
     };

     const goPrevious = () => {
          if (currentIndex > 0) {
               setCurrentIndex(currentIndex - 1);
          }
     };

     const handleSubmit = () => {
          console.log('🎯 Lesson completed!');

          // ✅ REAL CALCULATION: Calculate actual score based on answers
          let totalCorrect = 0;
          const totalQuestions = questions.length;

          questions.forEach((question, index) => {
               const userAnswer = answers[question._id];

               console.log(`🔍 Checking question ${index + 1}/${totalQuestions}:`, {
                    questionId: question._id,
                    type: question.type,
                    hasAnswer: !!userAnswer,
                    userAnswer
               });

               if (!userAnswer) {
                    console.log(`❌ No answer provided for question ${index + 1}`);
                    return; // No answer provided
               }

               // Single answer questions (ASK_AND_ANSWER, IMAGE_DESCRIPTION, etc.)
               if (question.answers && question.answers.length > 0) {
                    const correctAnswer = question.answers.find((ans: any) => ans.isCorrect);
                    const isCorrect = correctAnswer && userAnswer === correctAnswer.answer;

                    console.log(`📝 Single answer question ${index + 1}:`, {
                         correctAnswer: correctAnswer?.answer,
                         userAnswer,
                         isCorrect
                    });

                    if (isCorrect) {
                         totalCorrect++;
                    }
               }

               // Multi sub-questions (SHORT_TALK, CONVERSATION_PIECE, READ_AND_UNDERSTAND)
               else if (question.questions && question.questions.length > 0) {
                    let subCorrect = 0;
                    const subTotal = question.questions.length;

                    question.questions.forEach((subQuestion: any, subIndex: number) => {
                         const userSubAnswer = userAnswer[subQuestion._id];
                         const correctSubAnswer = subQuestion.answers.find((ans: any) => ans.isCorrect);
                         const isSubCorrect = correctSubAnswer && userSubAnswer === correctSubAnswer.answer;

                         console.log(`📝 Sub-question ${subIndex + 1}/${subTotal}:`, {
                              subQuestionId: subQuestion._id,
                              correctAnswer: correctSubAnswer?.answer,
                              userAnswer: userSubAnswer,
                              isCorrect: isSubCorrect
                         });

                         if (isSubCorrect) {
                              subCorrect++;
                         }
                    });

                    const allSubCorrect = subCorrect === subTotal;
                    console.log(`📊 Multi-question ${index + 1} result:`, {
                         subCorrect,
                         subTotal,
                         allSubCorrect,
                         percentage: ((subCorrect / subTotal) * 100).toFixed(1) + '%'
                    });

                    // Count as correct if all sub-questions are correct
                    if (allSubCorrect) {
                         totalCorrect++;
                    }
               }
          });

          const score = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

          console.log('📊 Final lesson score calculation:', {
               totalQuestions,
               totalCorrect,
               score,
               answers: Object.keys(answers).length
          });

          onComplete({
               score: score,
               totalQuestions: totalQuestions,
               correctAnswers: totalCorrect
          });
     };

     if (!currentQuestion) {
          return <Text>Loading...</Text>;
     }

     return (
          <View style={{ flex: 1 }}>
               {/* Fixed Header */}
               <View style={{ padding: 16, backgroundColor: '#f8f9fa', borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>
                         Bài học - Câu {currentIndex + 1}/{questions.length}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#666' }}>
                         Đã kiểm tra: {checkedQuestions.size}/{questions.length} câu
                    </Text>
               </View>

               {/* Scrollable Question Content */}
               <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
                    {/* Main question/instruction */}
                    {currentQuestion.question && (
                         <View style={{
                              marginBottom: 16,
                              padding: 16,
                              backgroundColor: '#e3f2fd',
                              borderRadius: 8,
                              borderLeftWidth: 4,
                              borderLeftColor: '#2196f3'
                         }}>
                              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1976d2', lineHeight: 22 }}>
                                   📢 {currentQuestion.question}
                              </Text>
                         </View>
                    )}

                    {/* Audio player for audio questions */}
                    {currentQuestion.audio?.url && (
                         <View style={{
                              backgroundColor: '#f0f8ff',
                              padding: 16,
                              borderRadius: 8,
                              marginBottom: 16,
                              borderWidth: 1,
                              borderColor: '#2196f3'
                         }}>
                              <Text style={{ fontSize: 14, color: '#2196f3', fontWeight: '600', marginBottom: 8 }}>
                                   🎵 Audio Content
                              </Text>
                              <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                                   Name: {currentQuestion.audio.name}
                              </Text>
                              <Text style={{ fontSize: 10, color: '#999' }}>
                                   URL: {currentQuestion.audio.url.substring(0, 50)}...
                              </Text>
                         </View>
                    )}

                    {/* Subtitle/Transcript (for SHORT_TALK, etc.) */}
                    {currentQuestion.subtitle && (
                         <View style={{
                              backgroundColor: '#f5f5f5',
                              padding: 16,
                              borderRadius: 8,
                              marginBottom: 16,
                              borderWidth: 1,
                              borderColor: '#ddd'
                         }}>
                              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
                                   📝 Transcript:
                              </Text>
                              <Text style={{ fontSize: 14, color: '#666', lineHeight: 20, fontStyle: 'italic' }}>
                                   {currentQuestion.subtitle}
                              </Text>
                         </View>
                    )}

                    {/* Image for image questions */}
                    {currentQuestion.imageUrl && (
                         <View style={{ backgroundColor: '#f0f8ff', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                              <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>🖼️ Image Content</Text>
                              <Text style={{ fontSize: 12, color: '#999' }}>Image URL: {currentQuestion.imageUrl}</Text>
                         </View>
                    )}

                    {/* DEBUG: Show question structure */}
                    <View style={{ backgroundColor: '#fff3cd', padding: 8, borderRadius: 4, marginBottom: 16 }}>
                         <Text style={{ fontSize: 12, color: '#856404' }}>
                              DEBUG - Type: {currentQuestion.type}
                         </Text>
                         <Text style={{ fontSize: 12, color: '#856404' }}>
                              Has answers: {currentQuestion.answers ? 'Yes (' + currentQuestion.answers.length + ')' : 'No'}
                         </Text>
                         <Text style={{ fontSize: 12, color: '#856404' }}>
                              Has sub-questions: {currentQuestion.questions ? 'Yes (' + currentQuestion.questions.length + ')' : 'No'}
                         </Text>
                    </View>

                    {/* Single answers (ASK_AND_ANSWER, IMAGE_DESCRIPTION, etc.) */}
                    {currentQuestion.answers && currentQuestion.answers.length > 0 && (
                         <View>
                              <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Chọn đáp án:</Text>
                              {currentQuestion.answers.map((answer: any, index: number) => (
                                   <TouchableOpacity
                                        key={answer._id}
                                        style={{
                                             padding: 12,
                                             marginBottom: 8,
                                             borderRadius: 8,
                                             backgroundColor: answers[currentQuestion._id] === answer.answer ? '#e3f2fd' : '#f5f5f5',
                                             borderWidth: 1,
                                             borderColor: isCurrentChecked && answer.isCorrect ? '#4caf50' :
                                                  isCurrentChecked && answers[currentQuestion._id] === answer.answer && !answer.isCorrect ? '#f44336' : '#ddd'
                                        }}
                                        onPress={() => handleAnswer(answer.answer)}
                                        disabled={isCurrentChecked}
                                   >
                                        <Text style={{
                                             color: isCurrentChecked && answer.isCorrect ? '#4caf50' :
                                                  isCurrentChecked && answers[currentQuestion._id] === answer.answer && !answer.isCorrect ? '#f44336' : '#333'
                                        }}>
                                             {answer.answer}
                                        </Text>
                                   </TouchableOpacity>
                              ))}
                         </View>
                    )}

                    {/* Multi sub-questions (SHORT_TALK, CONVERSATION_PIECE, READ_AND_UNDERSTAND) */}
                    {currentQuestion.questions && currentQuestion.questions.length > 0 && (
                         <View>
                              <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 16, color: '#2196f3' }}>
                                   📝 Trả lời các câu hỏi:
                              </Text>
                              {currentQuestion.questions.map((subQuestion: any, qIndex: number) => (
                                   <View key={subQuestion._id} style={{
                                        marginBottom: 24,
                                        backgroundColor: '#ffffff',
                                        padding: 16,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: '#e0e0e0',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 2,
                                        elevation: 2
                                   }}>
                                        <Text style={{
                                             fontSize: 12,
                                             fontWeight: '600',
                                             color: '#2196f3',
                                             marginBottom: 4,
                                             textTransform: 'uppercase'
                                        }}>
                                             Question {qIndex + 1}
                                        </Text>
                                        <Text style={{
                                             fontSize: 16,
                                             fontWeight: '500',
                                             color: '#333',
                                             marginBottom: 12,
                                             lineHeight: 22
                                        }}>
                                             {subQuestion.question}
                                        </Text>

                                        <View style={{ gap: 8 }}>
                                             {subQuestion.answers.map((answer: any, aIndex: number) => {
                                                  const isSelected = answers[currentQuestion._id]?.[subQuestion._id] === answer.answer;
                                                  const isCorrect = answer.isCorrect;
                                                  const showResult = isCurrentChecked && isSelected;

                                                  return (
                                                       <TouchableOpacity
                                                            key={answer._id}
                                                            style={{
                                                                 padding: 12,
                                                                 borderRadius: 8,
                                                                 backgroundColor: isSelected ? '#e3f2fd' : '#f9f9f9',
                                                                 borderWidth: 1,
                                                                 borderColor: showResult ? (isCorrect ? '#4caf50' : '#f44336') :
                                                                      isCurrentChecked && isCorrect ? '#4caf50' :
                                                                           isSelected ? '#2196f3' : '#ddd',
                                                                 flexDirection: 'row',
                                                                 alignItems: 'center',
                                                                 justifyContent: 'space-between'
                                                            }}
                                                            onPress={() => {
                                                                 const newAnswer = {
                                                                      ...answers[currentQuestion._id],
                                                                      [subQuestion._id]: answer.answer
                                                                 };
                                                                 handleAnswer(newAnswer);
                                                            }}
                                                            disabled={isCurrentChecked}
                                                       >
                                                            <Text style={{
                                                                 flex: 1,
                                                                 fontSize: 14,
                                                                 color: showResult ? (isCorrect ? '#4caf50' : '#f44336') :
                                                                      isCurrentChecked && isCorrect ? '#4caf50' :
                                                                           isSelected ? '#2196f3' : '#333',
                                                                 fontWeight: isSelected ? '600' : 'normal'
                                                            }}>
                                                                 {String.fromCharCode(65 + aIndex)}. {answer.answer}
                                                            </Text>
                                                            {/* Show correct/incorrect icons in review mode */}
                                                            {isCurrentChecked && isCorrect && (
                                                                 <Text style={{
                                                                      fontSize: 16,
                                                                      marginLeft: 8,
                                                                      color: '#4caf50',
                                                                      fontWeight: 'bold'
                                                                 }}>
                                                                      ✓
                                                                 </Text>
                                                            )}
                                                            {showResult && !isCorrect && (
                                                                 <Text style={{
                                                                      fontSize: 16,
                                                                      marginLeft: 8,
                                                                      color: '#f44336',
                                                                      fontWeight: 'bold'
                                                                 }}>
                                                                      ✗
                                                                 </Text>
                                                            )}
                                                       </TouchableOpacity>
                                                  );
                                             })}
                                        </View>
                                   </View>
                              ))}
                         </View>
                    )}

                    {/* Fallback if no answers or sub-questions */}
                    {!currentQuestion.answers && !currentQuestion.questions && (
                         <View style={{ backgroundColor: '#ffebee', padding: 16, borderRadius: 8 }}>
                              <Text style={{ color: '#c62828', textAlign: 'center' }}>
                                   ⚠️ Loại câu hỏi này chưa được hỗ trợ: {currentQuestion.type}
                              </Text>
                         </View>
                    )}

                    {/* Bottom padding for scrolling */}
                    <View style={{ height: 100 }} />
               </ScrollView>

               {/* Fixed Controls at Bottom */}
               <View style={{ borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16, paddingHorizontal: 16, backgroundColor: '#fff' }}>
                    {!isCurrentChecked ? (
                         <TouchableOpacity
                              style={{
                                   backgroundColor: '#4CAF50',
                                   padding: 14,
                                   borderRadius: 8,
                                   alignItems: 'center',
                                   opacity: (() => {
                                        // Check if can check current question
                                        if (!answers[currentQuestion._id]) return 0.5;

                                        // For single answer questions
                                        if (currentQuestion.answers && currentQuestion.answers.length > 0) {
                                             return 1;
                                        }

                                        // For multi sub-questions
                                        if (currentQuestion.questions && currentQuestion.questions.length > 0) {
                                             const totalSubQuestions = currentQuestion.questions.length;
                                             const answeredSubQuestions = Object.keys(answers[currentQuestion._id] || {}).length;
                                             return answeredSubQuestions === totalSubQuestions ? 1 : 0.5;
                                        }

                                        return 0.5;
                                   })()
                              }}
                              onPress={handleCheck}
                              disabled={(() => {
                                   // Check if can check current question
                                   if (!answers[currentQuestion._id]) return true;

                                   // For single answer questions
                                   if (currentQuestion.answers && currentQuestion.answers.length > 0) {
                                        return false;
                                   }

                                   // For multi sub-questions
                                   if (currentQuestion.questions && currentQuestion.questions.length > 0) {
                                        const totalSubQuestions = currentQuestion.questions.length;
                                        const answeredSubQuestions = Object.keys(answers[currentQuestion._id] || {}).length;
                                        return answeredSubQuestions !== totalSubQuestions;
                                   }

                                   return true;
                              })()}
                         >
                              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                   Kiểm tra
                              </Text>
                         </TouchableOpacity>
                    ) : (
                         <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                              <TouchableOpacity
                                   style={{
                                        backgroundColor: '#007AFF',
                                        padding: 12,
                                        borderRadius: 8,
                                        minWidth: 100,
                                        alignItems: 'center',
                                        opacity: currentIndex > 0 ? 1 : 0.5
                                   }}
                                   onPress={goPrevious}
                                   disabled={currentIndex === 0}
                              >
                                   <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                        ← Trước
                                   </Text>
                              </TouchableOpacity>

                              {allChecked ? (
                                   <TouchableOpacity
                                        style={{
                                             backgroundColor: '#28a745',
                                             padding: 12,
                                             borderRadius: 8,
                                             alignItems: 'center'
                                        }}
                                        onPress={handleSubmit}
                                   >
                                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                             Hoàn thành bài học
                                        </Text>
                                   </TouchableOpacity>
                              ) : (
                                   <TouchableOpacity
                                        style={{
                                             backgroundColor: '#007AFF',
                                             padding: 12,
                                             borderRadius: 8,
                                             minWidth: 100,
                                             alignItems: 'center',
                                             opacity: currentIndex < questions.length - 1 ? 1 : 0.5
                                        }}
                                        onPress={goNext}
                                        disabled={currentIndex === questions.length - 1}
                                   >
                                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                             Tiếp →
                                        </Text>
                                   </TouchableOpacity>
                              )}
                         </View>
                    )}
               </View>
          </View >
     );
};
import LoadingSpinner from "../components/Common/LoadingSpinner";
import ErrorMessage from "../components/Common/ErrorMessage";
import useBackHandler from "../../../hooks/useBackHandler";

interface Question {
     _id: string;
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

const LessonScreen = () => {
     const router = useRouter();
     const params = useLocalSearchParams();
     const { questionIds, dayNumber, stageIndex, journeyId, stageId } = params;

     // Parse questionIds từ string array - useMemo để tránh re-create
     const questionIdArray = useMemo(() => {
          return Array.isArray(questionIds) ? questionIds :
               typeof questionIds === 'string' ? JSON.parse(questionIds) : [];
     }, [questionIds]);

     // State để load real questions từ API
     const [questions, setQuestions] = useState<Question[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     // Load questions từ API
     useEffect(() => {
          const loadQuestions = async () => {
               try {
                    console.log('🎓 Fetching lesson questions for day:', dayNumber);
                    console.log('🔍 Question IDs to load:', questionIdArray);

                    // Fetch real questions từ API - sử dụng service method
                    const questionPromises = questionIdArray.map(async (id: string) => {
                         console.log(`🔍 Fetching question: ${id}`);

                         // Sử dụng fetch trực tiếp với auth token
                         const token = await AsyncStorage.getItem(process.env.EXPO_PUBLIC_STORAGE_KEY ?? '@ETRAINER_APP');

                         const baseURL = process.env.EXPO_PUBLIC_APP_API_URL || 'http://192.168.0.103:8080/api';
                         const response = await fetch(`${baseURL}/question/${id}`, {
                              headers: {
                                   'Authorization': `Bearer ${token}`,
                                   'Content-Type': 'application/json'
                              }
                         });

                         if (!response.ok) {
                              throw new Error(`Failed to fetch question ${id}: ${response.status}`);
                         }

                         const questionData = await response.json();
                         console.log(`✅ Question ${id} loaded: ${questionData.type}`);
                         return questionData;
                    });

                    const loadedQuestions = await Promise.all(questionPromises);
                    setQuestions(loadedQuestions);
                    console.log('✅ Real questions loaded:', loadedQuestions.length);
               } catch (err: any) {
                    console.error('❌ Error loading questions:', err);
                    setError('Không thể tải câu hỏi. Vui lòng thử lại.');
               } finally {
                    setLoading(false);
               }
          };

          if (questionIdArray.length > 0) {
               loadQuestions();
          } else {
               setLoading(false);
          }
     }, [questionIdArray, dayNumber]);

     // Handle back button with confirmation
     useBackHandler({
          onBackPress: () => {
               Alert.alert(
                    'Thoát bài học?',
                    'Tiến độ hiện tại sẽ được lưu.',
                    [
                         { text: 'Hủy', style: 'cancel' },
                         {
                              text: 'Thoát',
                              style: 'destructive',
                              onPress: () => {
                                   // Pop về màn hình trước (StageDetails)
                                   if (router.canGoBack?.()) {
                                        router.back();
                                   } else {
                                        router.push({
                                             pathname: "/journeyNew/screens/StageDetails" as any,
                                             params: {
                                                  stageId: stageId,
                                                  journeyId: journeyId,
                                                  journeyTitle: "Lộ trình TOEIC"
                                             }
                                        });
                                   }
                              }
                         }
                    ]
               );
               return true; // Prevent default behavior
          }
     });

     // Handle lesson completion
     const handleLessonComplete = async (results: any) => {
          try {
               console.log('✅ Lesson completed:', results);

               const score = results.score || 0;
               const totalQuestions = results.totalQuestions || 1;
               const correctAnswers = results.correctAnswers || 0;

               // ✅ FIXED: Pass score data to backend and handle response
               const response = await JourneyNewService.updateLessonProgress(
                    parseInt(stageIndex as string),
                    parseInt(dayNumber as string),
                    {
                         score: score,
                         totalQuestions: totalQuestions,
                         correctAnswers: correctAnswers
                    }
               );

               // Use response data from backend
               const passed = response.dayPassed;
               const nextDayUnlocked = response.nextDayUnlocked;
               const message = response.message;
               const warning = response.warning;

               // ✅ ENHANCED: Show warning if API had issues
               const alertTitle = warning ? '⚠️ Bài học hoàn thành (Lưu ý)' : '🎉 Bài học hoàn thành!';
               const alertMessage = warning ? `${message}\n\n⚠️ ${warning}` : message;

               Alert.alert(
                    alertTitle,
                    alertMessage,
                    [
                         {
                              text: 'OK',
                              onPress: () => {
                                   // Pop về màn hình trước (StageDetails)
                                   if (router.canGoBack?.()) {
                                        router.back();
                                   } else {
                                        router.push({
                                             pathname: "/journeyNew/screens/StageDetails" as any,
                                             params: {
                                                  stageId: stageId,
                                                  journeyId: journeyId,
                                                  journeyTitle: "Lộ trình TOEIC"
                                             }
                                        });
                                   }
                              }
                         }
                    ]
               );
          } catch (err: any) {
               console.error('❌ Error completing lesson:', err);
               Alert.alert('Lỗi', 'Không thể lưu tiến độ. Vui lòng thử lại.');
          }
     };

     // Render loading state
     if (loading) {
          return (
               <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <LoadingSpinner />
                    <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
                         Đang tải câu hỏi...
                    </Text>
               </View>
          );
     }

     // Render error state
     if (error) {
          return (
               <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                    <ErrorMessage message={error} />
                    <TouchableOpacity
                         style={{
                              backgroundColor: '#007AFF',
                              padding: 12,
                              borderRadius: 8,
                              marginTop: 16
                         }}
                         onPress={() => {
                              setError(null);
                              setLoading(true);
                              // Re-trigger useEffect để reload questions
                         }}
                    >
                         <Text style={{ color: 'white', fontSize: 16 }}>Thử lại</Text>
                    </TouchableOpacity>
               </View>
          );
     }

     // Render main lesson
     return (
          <View style={styles.container}>
               <QuestionSession
                    questions={questions}
                    onComplete={handleLessonComplete}
               />
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#f8f9fa",
     },
});

export default LessonScreen; 