import React, { useEffect, useState, useRef } from "react";
import {
     View,
     Text,
     StyleSheet,
     TouchableOpacity,
     ActivityIndicator,
     Alert,
     ScrollView,
     SafeAreaView,
     Animated,
     Dimensions,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";

// ✅ Import modern state management from journeyNew
import { useAnswerContext } from '../context/AnswerContext';
import { useProgressContext } from '../context/ProgressContext';

// ✅ Import types from merged journey
import { JourneyNewQuestion, UserAnswer } from '../types';

// ✅ Import question rendering components (modern approach)
import QuestionRenderer from '../components/QuestionRenderer/QuestionRenderer';

// ✅ Constants for question types (will be used for rendering)
const LESSON_TYPE = {
     TYPE1: 'IMAGE_DESCRIPTION',
     TYPE2: 'ASK_AND_ANSWER',
     TYPE3: 'CONVERSATION_PIECE',
     TYPE4: 'SHORT_TALK',
     TYPE5: 'FILL_IN_THE_BLANK_QUESTION',
     TYPE6: 'FILL_IN_THE_PARAGRAPH',
} as const;

type LESSON_TYPE = typeof LESSON_TYPE[keyof typeof LESSON_TYPE];

// ✅ Legacy service import (to be refactored later)
import { getCurrentJourneyService } from "../../study-schedule/service";
import { completeDayService } from "../../journeyStudy/service";

interface MergedDayQuestionsProps {
     dayId?: string;
     stageIndex?: number;
     dayNumber?: number;
}

export default function DayQuestionsScreen() {
     const router = useRouter();
     const params = useLocalSearchParams();
     const dayId = params.dayId as string;
     const stageIndex = Number(params.stageIndex);
     const dayNumber = Number(params.dayNumber);

     // ✅ Modern state management
     const { state: answerState, addAnswer, getAnswer, calculateScore } = useAnswerContext();
     const { state: progressState, completeLesson } = useProgressContext();

     // ✅ Local UI state (keeping from original)
     const [currentDay, setCurrentDay] = useState<any | null>(null);
     const [questionsByType, setQuestionsByType] = useState<Record<string, JourneyNewQuestion[]>>({});
     const [activeType, setActiveType] = useState<LESSON_TYPE | null>(null);
     const [completedTypes, setCompletedTypes] = useState<Record<string, boolean>>({});
     const [allCompleted, setAllCompleted] = useState<boolean>(false);

     // ✅ UI animation state (keeping from original)
     const audioRef = useRef<any>(null);
     const [showExplanation, setShowExplanation] = useState(false);
     const [activeTab, setActiveTab] = useState("explanation");
     const translateYAnim = useRef(new Animated.Value(500)).current;
     const [explanationData, setExplanationData] = useState({
          subtitle: "",
          explanation: "",
     });

     // ✅ Data fetching (keeping original query structure)
     const { data: journeyData, isLoading } = useQuery({
          queryKey: ["DAY_QUESTIONS", dayId],
          queryFn: getCurrentJourneyService,
     });

     // ✅ Process journey data and group questions by type
     useEffect(() => {
          if (journeyData && journeyData.stages && journeyData.stages[stageIndex]) {
               const day = journeyData.stages[stageIndex].days.find(
                    (d: any) => d._id === dayId
               );

               if (day) {
                    setCurrentDay(day);

                    if (day.questions.length > 0) {
                         const grouped: Record<string, JourneyNewQuestion[]> = {};

                         day.questions.forEach((question: any) => {
                              const type = question.type;
                              if (!grouped[type]) {
                                   grouped[type] = [];
                              }
                              // ✅ Convert legacy question to JourneyNewQuestion format
                              const convertedQuestion: JourneyNewQuestion = {
                                   id: question._id || question.id,
                                   questionNumber: question.questionNumber,
                                   type: question.type,
                                   question: question.question,
                                   audio: question.audio,
                                   imageUrl: question.imageUrl,
                                   answers: question.answers,
                                   questions: question.questions,
                                   subtitle: question.subtitle,
                                   options: question.options,
                                   correctAnswer: question.correctAnswer,
                                   explanation: question.explanation,
                                   audioUrl: question.audioUrl,
                              };
                              grouped[type].push(convertedQuestion);
                         });

                         Object.keys(grouped).forEach((type) => {
                              grouped[type].sort((a, b) => a.questionNumber - b.questionNumber);
                         });

                         setQuestionsByType(grouped);

                         const initialCompletedTypes: Record<string, boolean> = {};
                         Object.keys(grouped).forEach((type) => {
                              initialCompletedTypes[type] = false;
                         });
                         setCompletedTypes(initialCompletedTypes);

                         if (Object.keys(grouped).length > 0) {
                              setActiveType(Object.keys(grouped)[0] as LESSON_TYPE);
                         }
                    }
               }
          }
     }, [journeyData, dayId, stageIndex]);

     // ✅ Check completion status
     useEffect(() => {
          if (Object.keys(completedTypes).length > 0) {
               const allTypesCompleted = Object.values(completedTypes).every(
                    (value) => value
               );
               setAllCompleted(allTypesCompleted);

               if (allTypesCompleted) {
                    completeDayMutation.mutate();
               }
          }
     }, [completedTypes]);

     // ✅ Day completion mutation
     const completeDayMutation = useMutation({
          mutationKey: ["COMPLETE_DAY"],
          mutationFn: () => completeDayService(stageIndex, dayNumber),
          onSuccess: () => {
               // ✅ Update progress using modern context
               completeLesson(stageIndex.toString(), dayId, 100, 0);
               Alert.alert("Thành công", "Bạn đã hoàn thành ngày học!");
               router.back();
          },
          onError: (error) => {
               Alert.alert(
                    "Lỗi",
                    "Không thể hoàn thành ngày học. Vui lòng thử lại sau."
               );
               console.error("Error completing day:", error);
          },
     });

     // ✅ Handle answer submission (modern approach)
     const handleAnswerSubmit = (questionId: string, answer: string | string[]) => {
          const userAnswer: UserAnswer = {
               questionId,
               answer,
               value: answer,
               timestamp: new Date().toISOString(),
          };

          addAnswer(userAnswer);

          // Check if this type is now complete
          const currentTypeQuestions = questionsByType[activeType!] || [];
          const answeredInType = currentTypeQuestions.filter(q => getAnswer(q.id)).length;

          if (answeredInType === currentTypeQuestions.length) {
               handleCompleteType(activeType!);
          }
     };

     // ✅ Handle type completion
     const handleCompleteType = (type: LESSON_TYPE) => {
          setCompletedTypes((prev) => ({
               ...prev,
               [type]: true,
          }));

          const types = Object.keys(questionsByType) as LESSON_TYPE[];
          const nextNonCompletedType = types.find(
               (t) => !completedTypes[t] && t !== type
          );

          if (nextNonCompletedType) {
               setActiveType(nextNonCompletedType);
          }
     };

     // ✅ Toggle explanation modal
     const toggleExplanation = (data?: {
          subtitle: string;
          explanation: string;
     }) => {
          const toValue = showExplanation ? 500 : 0;

          Animated.spring(translateYAnim, {
               toValue,
               useNativeDriver: true,
               friction: 8,
               tension: 40,
          }).start();

          setShowExplanation(!showExplanation);
          if (data) {
               setExplanationData(data);
          }
     };

     // ✅ Loading state
     if (isLoading || !currentDay) {
          return (
               <SafeAreaView style={styles.container}>
                    <Stack.Screen
                         options={{
                              title: `Ngày ${dayNumber}`,
                              headerStyle: {
                                   backgroundColor: "#0099CC",
                              },
                              headerTintColor: "#fff",
                              headerTitleStyle: {
                                   fontWeight: "bold",
                              },
                         }}
                    />
                    <View style={styles.loadingContainer}>
                         <ActivityIndicator size="large" color="#0099CC" />
                         <Text style={styles.loadingText}>Đang tải câu hỏi...</Text>
                    </View>
               </SafeAreaView>
          );
     }

     // ✅ Empty state
     if (Object.keys(questionsByType).length === 0) {
          return (
               <SafeAreaView style={styles.container}>
                    <Stack.Screen
                         options={{
                              title: `Ngày ${dayNumber}`,
                              headerStyle: {
                                   backgroundColor: "#0099CC",
                              },
                              headerTintColor: "#fff",
                              headerTitleStyle: {
                                   fontWeight: "bold",
                              },
                         }}
                    />
                    <View style={styles.emptyContainer}>
                         <FontAwesome5 name="question-circle" size={64} color="#ccc" />
                         <Text style={styles.emptyText}>Không có câu hỏi nào cho ngày này</Text>
                         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                              <Text style={styles.backButtonText}>Quay lại</Text>
                         </TouchableOpacity>
                    </View>
               </SafeAreaView>
          );
     }

     // ✅ Render type tabs
     const renderTypeTabs = () => {
          const types = Object.keys(questionsByType);

          return (
               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
                    {types.map((type) => (
                         <TouchableOpacity
                              key={type}
                              style={[
                                   styles.tab,
                                   activeType === type && styles.activeTab,
                                   completedTypes[type] && styles.completedTab,
                              ]}
                              onPress={() => setActiveType(type as LESSON_TYPE)}
                         >
                              <Text
                                   style={[
                                        styles.tabText,
                                        activeType === type && styles.activeTabText,
                                        completedTypes[type] && styles.completedTabText,
                                   ]}
                              >
                                   {getTypeLabel(type)}
                              </Text>
                              {completedTypes[type] && (
                                   <FontAwesome5 name="check-circle" size={16} color="#4CAF50" style={styles.checkIcon} />
                              )}
                         </TouchableOpacity>
                    ))}
               </ScrollView>
          );
     };

     // ✅ Get type label for display
     const getTypeLabel = (type: string): string => {
          const labels: Record<string, string> = {
               'IMAGE_DESCRIPTION': 'Mô tả hình ảnh',
               'ASK_AND_ANSWER': 'Hỏi và trả lời',
               'CONVERSATION_PIECE': 'Đoạn hội thoại',
               'SHORT_TALK': 'Đoạn nói ngắn',
               'FILL_IN_THE_BLANK_QUESTION': 'Điền vào chỗ trống',
               'FILL_IN_THE_PARAGRAPH': 'Điền đoạn văn',
          };
          return labels[type] || type;
     };

     // ✅ Render questions for active type
     const renderQuestions = () => {
          if (!activeType || !questionsByType[activeType]) {
               return null;
          }

          const questions = questionsByType[activeType];

          return (
               <ScrollView style={styles.questionsContainer}>
                    {questions.map((question, index) => (
                         <View key={question.id} style={styles.questionWrapper}>
                              <Text style={styles.questionNumber}>
                                   Câu {question.questionNumber}
                              </Text>
                              <QuestionRenderer
                                   question={question}
                                   userAnswer={getAnswer(question.id)?.value}
                                   onAnswer={(answer: string | string[]) => handleAnswerSubmit(question.id, answer)}
                                   isReview={false}
                              />
                         </View>
                    ))}
               </ScrollView>
          );
     };

     // ✅ Main render
     return (
          <SafeAreaView style={styles.container}>
               <Stack.Screen
                    options={{
                         title: `Ngày ${dayNumber}`,
                         headerStyle: {
                              backgroundColor: "#0099CC",
                         },
                         headerTintColor: "#fff",
                         headerTitleStyle: {
                              fontWeight: "bold",
                         },
                    }}
               />

               {/* ✅ Header with progress */}
               <View style={styles.header}>
                    <Text style={styles.dayTitle}>Ngày {dayNumber}</Text>
                    <Text style={styles.progressText}>
                         {Object.values(completedTypes).filter(Boolean).length} / {Object.keys(completedTypes).length} hoàn thành
                    </Text>
               </View>

               {/* ✅ Type tabs */}
               {renderTypeTabs()}

               {/* ✅ Questions */}
               {renderQuestions()}

               {/* ✅ Complete button */}
               {allCompleted && (
                    <View style={styles.completeContainer}>
                         <TouchableOpacity
                              style={styles.completeButton}
                              onPress={() => router.back()}
                         >
                              <FontAwesome5 name="check" size={20} color="#fff" style={styles.completeIcon} />
                              <Text style={styles.completeButtonText}>Hoàn thành ngày học</Text>
                         </TouchableOpacity>
                    </View>
               )}
          </SafeAreaView>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#f5f5f5',
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
     emptyContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
     },
     emptyText: {
          fontSize: 18,
          color: '#666',
          marginTop: 16,
          textAlign: 'center',
     },
     backButton: {
          backgroundColor: '#0099CC',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
          marginTop: 20,
     },
     backButtonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: '600',
     },
     header: {
          backgroundColor: '#fff',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
     },
     dayTitle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',
     },
     progressText: {
          fontSize: 14,
          color: '#666',
          marginTop: 4,
     },
     tabContainer: {
          backgroundColor: '#fff',
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
     },
     tab: {
          paddingHorizontal: 16,
          paddingVertical: 8,
          marginHorizontal: 4,
          borderRadius: 20,
          backgroundColor: '#f0f0f0',
          flexDirection: 'row',
          alignItems: 'center',
     },
     activeTab: {
          backgroundColor: '#0099CC',
     },
     completedTab: {
          backgroundColor: '#E8F5E8',
     },
     tabText: {
          fontSize: 14,
          color: '#666',
     },
     activeTabText: {
          color: '#fff',
          fontWeight: '600',
     },
     completedTabText: {
          color: '#4CAF50',
          fontWeight: '600',
     },
     checkIcon: {
          marginLeft: 4,
     },
     questionsContainer: {
          flex: 1,
          padding: 16,
     },
     questionWrapper: {
          backgroundColor: '#fff',
          marginBottom: 16,
          borderRadius: 8,
          padding: 16,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
     },
     questionNumber: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#0099CC',
          marginBottom: 8,
     },
     completeContainer: {
          padding: 16,
          backgroundColor: '#fff',
     },
     completeButton: {
          backgroundColor: '#4CAF50',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          borderRadius: 8,
     },
     completeIcon: {
          marginRight: 8,
     },
     completeButtonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: '600',
     },
});
