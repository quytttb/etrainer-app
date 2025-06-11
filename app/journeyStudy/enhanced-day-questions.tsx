import React, { useState, useEffect, useRef } from "react";
import {
     View,
     Text,
     TouchableOpacity,
     Alert,
     ActivityIndicator,
     Animated,
     ScrollView,
     StyleSheet,
     Dimensions,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { LESSON_TYPE } from "@/constants/lesson-types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCurrentJourneyService, completeDayService } from "./service";
import { Journey, Day } from "@/types/journey";
import { PracticeType1 } from "@/components/Practice/PracticeType1/PracticeType1";
import { PracticeType2 } from "@/components/Practice/PracticeType2/PracticeType2";
import { PracticeType3 } from "@/components/Practice/PracticeType3/PracticeType3";
import { PracticeType4 } from "@/components/Practice/PracticeType4/PracticeType4";
import { PracticeType5 } from "@/components/Practice/PracticeType5/PracticeType5";
import { PracticeType6 } from "@/components/Practice/PracticeType6/PracticeType6";

// ====================================
// ENHANCED DAY QUESTIONS WITH SCORING
// ====================================
// This enhanced version includes:
// ✅ Score tracking per practice type
// ✅ Updated completeDayService with payload
// ✅ Comprehensive analytics
// ✅ Better completion flow

interface ScoreData {
     score: number;
     totalQuestions: number;
     correctAnswers: number;
}

interface CompletedTypeData {
     [key: string]: boolean;
}

interface ScoreTrackingData {
     [key: string]: ScoreData;
}

export default function EnhancedDayQuestionsScreen() {
     const router = useRouter();
     const audioRef = useRef(null);
     const { stageIndex, dayNumber } = useLocalSearchParams<{
          stageIndex: string;
          dayNumber: string;
     }>();

     // State management
     const [completedTypes, setCompletedTypes] = useState<CompletedTypeData>({});
     const [scoreTracking, setScoreTracking] = useState<ScoreTrackingData>({});
     const [activeType, setActiveType] = useState<LESSON_TYPE | null>(null);
     const [allCompleted, setAllCompleted] = useState(false);
     const [showExplanation, setShowExplanation] = useState(false);
     const [explanationData, setExplanationData] = useState<{
          subtitle: string;
          explanation: string;
     } | null>(null);

     // Animation for explanation modal
     const translateYAnim = useRef(new Animated.Value(500)).current;

     // State for current day data
     const [currentDay, setCurrentDay] = useState<Day | null>(null);

     // Data fetching
     const {
          data: journeyData,
          isLoading,
          error,
     } = useQuery({
          queryKey: ["DAY_QUESTIONS", stageIndex, dayNumber],
          queryFn: getCurrentJourneyService,
          enabled: !!stageIndex && !!dayNumber,
     });

     // Extract current day from journey data
     useEffect(() => {
          if (journeyData && journeyData.stages && journeyData.stages[Number(stageIndex)]) {
               const stage = journeyData.stages[Number(stageIndex)];
               const day = stage.days.find((d: Day) => d.dayNumber === Number(dayNumber));
               if (day) {
                    setCurrentDay(day);
               }
          }
     }, [journeyData, stageIndex, dayNumber]);

     // Group questions by type
     const questionsByType = React.useMemo(() => {
          if (!currentDay?.questions) return {};

          return currentDay.questions.reduce((acc: any, question: any) => {
               const type = question.type;
               if (!acc[type]) {
                    acc[type] = [];
               }
               acc[type].push(question);
               return acc;
          }, {});
     }, [currentDay]);

     // Initialize active type
     useEffect(() => {
          if (Object.keys(questionsByType).length > 0 && !activeType) {
               const firstType = Object.keys(questionsByType)[0] as LESSON_TYPE;
               setActiveType(firstType);
          }
     }, [questionsByType, activeType]);

     // Check completion status
     useEffect(() => {
          if (Object.keys(questionsByType).length > 0) {
               const allTypesCompleted = Object.keys(questionsByType).every(
                    type => completedTypes[type]
               );
               setAllCompleted(allTypesCompleted);

               if (allTypesCompleted && Object.keys(scoreTracking).length > 0) {
                    // Calculate overall score and complete day
                    const overallStats = calculateOverallScore();
                    completeDayMutation.mutate(overallStats);
               }
          }
     }, [completedTypes, scoreTracking]);

     // ===============================
     // SCORE CALCULATION FUNCTIONS
     // ===============================

     const calculateOverallScore = (): ScoreData => {
          const scores = Object.values(scoreTracking);
          if (scores.length === 0) {
               return { score: 0, totalQuestions: 0, correctAnswers: 0 };
          }

          const totalQuestions = scores.reduce((sum, score) => sum + score.totalQuestions, 0);
          const totalCorrect = scores.reduce((sum, score) => sum + score.correctAnswers, 0);
          const overallScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

          return {
               score: overallScore,
               totalQuestions,
               correctAnswers: totalCorrect
          };
     };

     // ===============================
     // COMPLETION HANDLERS
     // ===============================

     const completeDayMutation = useMutation({
          mutationKey: ["COMPLETE_DAY"],
          mutationFn: (scoreData: ScoreData) =>
               completeDayService(Number(stageIndex), Number(dayNumber), scoreData),
          onSuccess: (data, scoreData) => {
               Alert.alert(
                    "🎉 Hoàn thành!",
                    `Bạn đã hoàn thành ngày ${dayNumber} với ${scoreData.score}% điểm số!\n\n` +
                    `Đúng: ${scoreData.correctAnswers}/${scoreData.totalQuestions} câu`,
                    [
                         {
                              text: "Tiếp tục",
                              onPress: () => router.push("/journeyStudy")
                         }
                    ]
               );
          },
          onError: (error) => {
               Alert.alert(
                    "Lỗi",
                    "Không thể hoàn thành ngày học. Vui lòng thử lại sau."
               );
               console.error("Error completing day:", error);
          },
     });

     const handleCompleteType = (type: LESSON_TYPE, scoreData: ScoreData) => {
          console.log(`✅ Completed type ${type} with score:`, scoreData);

          // Update completion status
          setCompletedTypes((prev) => ({
               ...prev,
               [type]: true,
          }));

          // Track score data
          setScoreTracking((prev) => ({
               ...prev,
               [type]: scoreData
          }));

          // Move to next uncompleted type
          const types = Object.keys(questionsByType) as LESSON_TYPE[];
          const nextNonCompletedType = types.find(
               (t) => !completedTypes[t] && t !== type
          );

          if (nextNonCompletedType) {
               setActiveType(nextNonCompletedType);
          }
     };

     // Function to toggle explanation modal
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

     // ===============================
     // RENDER FUNCTIONS
     // ===============================

     if (isLoading || !currentDay) {
          return (
               <View style={styles.loadingContainer}>
                    <Stack.Screen
                         options={{
                              title: `Ngày ${dayNumber}`,
                              headerStyle: { backgroundColor: "#0099CC" },
                              headerTintColor: "#fff",
                              headerTitleStyle: { fontWeight: "bold" },
                         }}
                    />
                    <ActivityIndicator size="large" color="#0099CC" />
                    <Text style={styles.loadingText}>Đang tải câu hỏi...</Text>
               </View>
          );
     }

     if (Object.keys(questionsByType).length === 0) {
          return (
               <View style={styles.emptyContainer}>
                    <Stack.Screen
                         options={{
                              title: `Ngày ${dayNumber}`,
                              headerStyle: { backgroundColor: "#0099CC" },
                              headerTintColor: "#fff",
                              headerTitleStyle: { fontWeight: "bold" },
                         }}
                    />
                    <FontAwesome5 name="question-circle" size={50} color="#999" />
                    <Text style={styles.emptyText}>Không có câu hỏi nào cho ngày này</Text>
                    <TouchableOpacity
                         style={styles.backButton}
                         onPress={() => router.back()}
                    >
                         <Text style={styles.backButtonText}>Quay lại</Text>
                    </TouchableOpacity>
               </View>
          );
     }

     const renderPracticeComponent = () => {
          if (!activeType || !questionsByType[activeType]) return null;

          const questions = questionsByType[activeType];
          const props: any = {
               questions: questions,
               onSubmit: (scoreData: ScoreData) => handleCompleteType(activeType, scoreData),
               onBack: () => router.back(),
               toggleExplanation: toggleExplanation,
          };

          if (
               [
                    LESSON_TYPE.IMAGE_DESCRIPTION,
                    LESSON_TYPE.ASK_AND_ANSWER,
                    LESSON_TYPE.CONVERSATION_PIECE,
                    LESSON_TYPE.SHORT_TALK,
               ].includes(activeType)
          ) {
               props.ref = audioRef;
          }

          switch (activeType) {
               case LESSON_TYPE.IMAGE_DESCRIPTION:
                    return <PracticeType1 {...props} />;
               case LESSON_TYPE.ASK_AND_ANSWER:
                    return <PracticeType2 {...props} />;
               case LESSON_TYPE.CONVERSATION_PIECE:
               case LESSON_TYPE.SHORT_TALK:
                    return <PracticeType3 {...props} />;
               case LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION:
                    return <PracticeType4 {...props} />;
               case LESSON_TYPE.FILL_IN_THE_PARAGRAPH:
                    return <PracticeType5 {...props} />;
               case LESSON_TYPE.READ_AND_UNDERSTAND:
                    return <PracticeType6 {...props} />;
               default:
                    return (
                         <View style={styles.unsupportedContainer}>
                              <Text style={styles.emptyText}>
                                   Không hỗ trợ loại câu hỏi này: {activeType}
                              </Text>
                              <TouchableOpacity
                                   style={styles.backButton}
                                   onPress={() => router.back()}
                              >
                                   <Text style={styles.backButtonText}>Quay lại</Text>
                              </TouchableOpacity>
                         </View>
                    );
          }
     };

     // Render completion screen with detailed analytics
     if (allCompleted) {
          const overallStats = calculateOverallScore();
          const typeCount = Object.keys(questionsByType).length;

          return (
               <View style={styles.completionContainer}>
                    <Stack.Screen
                         options={{
                              title: `Ngày ${dayNumber}`,
                              headerStyle: { backgroundColor: "#0099CC" },
                              headerTintColor: "#fff",
                              headerTitleStyle: { fontWeight: "bold" },
                         }}
                    />
                    <FontAwesome5 name="trophy" size={60} color="#FFD700" />
                    <Text style={styles.completionTitle}>Chúc mừng!</Text>
                    <Text style={styles.completionText}>
                         Bạn đã hoàn thành tất cả {typeCount} loại câu hỏi cho ngày {dayNumber}.
                    </Text>

                    {/* Score Analytics */}
                    <View style={styles.scoreAnalytics}>
                         <Text style={styles.scoreTitle}>📊 Kết quả chi tiết:</Text>
                         <Text style={styles.scoreDetail}>
                              🎯 Điểm tổng: {overallStats.score}%
                         </Text>
                         <Text style={styles.scoreDetail}>
                              ✅ Đúng: {overallStats.correctAnswers}/{overallStats.totalQuestions} câu
                         </Text>
                         <Text style={styles.scoreDetail}>
                              📝 Hoàn thành: {typeCount} loại bài tập
                         </Text>
                    </View>

                    {/* Individual Type Scores */}
                    <ScrollView style={styles.detailScoreContainer}>
                         {Object.entries(scoreTracking).map(([type, score]) => (
                              <View key={type} style={styles.typeScoreItem}>
                                   <Text style={styles.typeScoreName}>{type}</Text>
                                   <Text style={styles.typeScoreValue}>
                                        {Math.round((score.correctAnswers / score.totalQuestions) * 100)}%
                                   </Text>
                              </View>
                         ))}
                    </ScrollView>

                    <TouchableOpacity
                         style={styles.continueButton}
                         onPress={() => router.push("/journeyStudy")}
                    >
                         <Text style={styles.continueButtonText}>Tiếp tục</Text>
                    </TouchableOpacity>
               </View>
          );
     }

     // Loading state
     if (isLoading || !currentDay) {
          return (
               <View style={styles.loadingContainer}>
                    <Stack.Screen
                         options={{
                              title: `Ngày ${dayNumber}`,
                              headerStyle: { backgroundColor: "#0099CC" },
                              headerTintColor: "#fff",
                              headerTitleStyle: { fontWeight: "bold" },
                         }}
                    />
                    <ActivityIndicator size="large" color="#0099CC" />
                    <Text style={styles.loadingText}>Đang tải câu hỏi...</Text>
               </View>
          );
     }

     // Empty state
     if (Object.keys(questionsByType).length === 0) {
          return (
               <View style={styles.emptyContainer}>
                    <Stack.Screen
                         options={{
                              title: `Ngày ${dayNumber}`,
                              headerStyle: { backgroundColor: "#0099CC" },
                              headerTintColor: "#fff",
                              headerTitleStyle: { fontWeight: "bold" },
                         }}
                    />
                    <FontAwesome5 name="book-open" size={60} color="#ccc" />
                    <Text style={styles.emptyText}>
                         Không có câu hỏi nào cho ngày này.
                    </Text>
                    <TouchableOpacity
                         style={styles.backButton}
                         onPress={() => router.back()}
                    >
                         <Text style={styles.backButtonText}>Quay lại</Text>
                    </TouchableOpacity>
               </View>
          );
     }

     // Render main practice interface
     return (
          <View style={styles.container}>
               <Stack.Screen
                    options={{
                         title: `Ngày ${dayNumber}`,
                         headerStyle: { backgroundColor: "#0099CC" },
                         headerTintColor: "#fff",
                         headerTitleStyle: { fontWeight: "bold" },
                    }}
               />

               {/* Progress Header */}
               <View style={styles.progressHeader}>
                    <Text style={styles.progressText}>
                         Loại {Object.keys(completedTypes).filter(key => completedTypes[key]).length + 1}/
                         {Object.keys(questionsByType).length}: {activeType}
                    </Text>
                    <View style={styles.progressBar}>
                         <View
                              style={[
                                   styles.progressFill,
                                   { width: `${(Object.keys(completedTypes).filter(key => completedTypes[key]).length / Object.keys(questionsByType).length) * 100}%` }
                              ]}
                         />
                    </View>
               </View>

               {/* Practice Component */}
               {renderPracticeComponent()}

               {/* Type Selection */}
               <View style={styles.typeSelector}>
                    {Object.keys(questionsByType).map((type) => (
                         <TouchableOpacity
                              key={type}
                              style={[
                                   styles.typeButton,
                                   activeType === type && styles.activeTypeButton,
                                   completedTypes[type] && styles.completedTypeButton,
                              ]}
                              onPress={() => setActiveType(type as LESSON_TYPE)}
                         >
                              <Text
                                   style={[
                                        styles.typeButtonText,
                                        activeType === type && styles.activeTypeButtonText,
                                        completedTypes[type] && styles.completedTypeButtonText,
                                   ]}
                              >
                                   {type}
                              </Text>
                              {completedTypes[type] && (
                                   <FontAwesome5 name="check" size={12} color="#fff" />
                              )}
                         </TouchableOpacity>
                    ))}
               </View>

               {/* Explanation Modal */}
               {showExplanation && explanationData && (
                    <Animated.View
                         style={[
                              styles.explanationContainer,
                              { transform: [{ translateY: translateYAnim }] },
                         ]}
                    >
                         <View style={styles.explanationHeader}>
                              <Text style={styles.explanationTitle}>Giải thích</Text>
                              <TouchableOpacity onPress={() => toggleExplanation()}>
                                   <FontAwesome5 name="times" size={20} color="#666" />
                              </TouchableOpacity>
                         </View>
                         <ScrollView style={styles.explanationContent}>
                              <Text style={styles.explanationText}>{explanationData.explanation}</Text>
                              {explanationData.subtitle && (
                                   <View style={styles.subtitleContainer}>
                                        <Text style={styles.subtitleTitle}>Phụ đề:</Text>
                                        <Text style={styles.subtitleText}>{explanationData.subtitle}</Text>
                                   </View>
                              )}
                         </ScrollView>
                    </Animated.View>
               )}
          </View>
     );
}

// ===============================
// STYLES
// ===============================

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#fff",
     },
     loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
     },
     loadingText: {
          marginTop: 16,
          fontSize: 16,
          color: "#666",
     },
     emptyContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: 20,
     },
     emptyText: {
          marginTop: 16,
          fontSize: 16,
          color: "#666",
          textAlign: "center",
     },
     backButton: {
          marginTop: 20,
          backgroundColor: "#0099CC",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 20,
     },
     backButtonText: {
          color: "#fff",
          fontWeight: "bold",
     },
     unsupportedContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
     },

     // Progress Header Styles
     progressHeader: {
          backgroundColor: "#f8f9fa",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#e9ecef",
     },
     progressText: {
          fontSize: 16,
          fontWeight: "600",
          color: "#333",
          marginBottom: 8,
     },
     progressBar: {
          height: 8,
          backgroundColor: "#e9ecef",
          borderRadius: 4,
          overflow: "hidden",
     },
     progressFill: {
          height: "100%",
          backgroundColor: "#0099CC",
          borderRadius: 4,
     },

     // Type Selector Styles
     typeSelector: {
          backgroundColor: "#f8f8f8",
          paddingVertical: 12,
          paddingHorizontal: 8,
          borderTopWidth: 1,
          borderTopColor: "#eee",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
     },
     typeButton: {
          paddingVertical: 8,
          paddingHorizontal: 12,
          marginHorizontal: 4,
          marginVertical: 4,
          borderRadius: 20,
          backgroundColor: "#EEEEEE",
          flexDirection: "row",
          alignItems: "center",
     },
     activeTypeButton: {
          backgroundColor: "#0099CC",
     },
     completedTypeButton: {
          backgroundColor: "#E8F5E9",
     },
     typeButtonText: {
          fontSize: 12,
          color: "#666",
          marginRight: 4,
     },
     activeTypeButtonText: {
          color: "#fff",
          fontWeight: "bold",
     },
     completedTypeButtonText: {
          color: "#4CAF50",
     },

     // Completion Screen Styles
     completionContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: "#fff",
     },
     completionTitle: {
          fontSize: 28,
          fontWeight: "bold",
          color: "#333",
          marginTop: 16,
          marginBottom: 8,
     },
     completionText: {
          fontSize: 16,
          color: "#666",
          textAlign: "center",
          marginBottom: 24,
     },
     scoreAnalytics: {
          backgroundColor: "#f8f9fa",
          padding: 16,
          borderRadius: 12,
          marginBottom: 16,
          width: "100%",
          alignItems: "center",
     },
     scoreTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
          marginBottom: 12,
     },
     scoreDetail: {
          fontSize: 16,
          color: "#555",
          marginBottom: 4,
     },
     detailScoreContainer: {
          maxHeight: 150,
          width: "100%",
          marginBottom: 16,
     },
     typeScoreItem: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 12,
          backgroundColor: "#fff",
          marginVertical: 2,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e9ecef",
     },
     typeScoreName: {
          fontSize: 14,
          color: "#666",
          flex: 1,
     },
     typeScoreValue: {
          fontSize: 14,
          fontWeight: "bold",
          color: "#0099CC",
     },
     continueButton: {
          backgroundColor: "#4CAF50",
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 25,
          marginTop: 16,
     },
     continueButtonText: {
          color: "#fff",
          fontSize: 18,
          fontWeight: "bold",
     },

     // Explanation Modal Styles
     explanationContainer: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          minHeight: "40%",
          maxHeight: "70%",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.25,
          shadowRadius: 5,
          elevation: 5,
          paddingBottom: 30,
          zIndex: 2,
     },
     explanationHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
     },
     explanationTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
     },
     explanationContent: {
          padding: 16,
          maxHeight: Dimensions.get("window").height * 0.5,
     },
     explanationText: {
          fontSize: 16,
          lineHeight: 24,
          color: "#333",
          marginBottom: 12,
     },
     subtitleContainer: {
          backgroundColor: "#f8f9fa",
          padding: 12,
          borderRadius: 8,
          marginTop: 8,
     },
     subtitleTitle: {
          fontSize: 14,
          fontWeight: "bold",
          color: "#666",
          marginBottom: 4,
     },
     subtitleText: {
          fontSize: 14,
          color: "#555",
          fontStyle: "italic",
     },
}); 