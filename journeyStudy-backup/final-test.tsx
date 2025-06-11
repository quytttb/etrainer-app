import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
     View,
     Text,
     StyleSheet,
     TouchableOpacity,
     ActivityIndicator,
     Alert,
     ScrollView,
     SafeAreaView,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getStageFinalTestService, completeStageFinalTestService } from "./service";
import { FinalTest } from "@/types/journey";

// Import practice components same as exam
import PracticeType1_Exam from "@/components/Exam/PracticeType1_Exam";
import PracticeType2_Exam from "@/components/Exam/PracticeType2_Exam";
import PracticeType3_Exam from "@/components/Exam/PracticeType3_Exam";
import PracticeType4_Exam from "@/components/Exam/PracticeType4_Exam";
import PracticeType5_Exam from "@/components/Exam/PracticeType5_Exam";
import PracticeType6_Exam from "@/components/Exam/PracticeType6_Exam";
import { LESSON_TYPE, LESSON_TYPE_MAPPING } from "@/constants/lesson-types";

// Helper function to get practice component
const getPracticeComponent = (type: string) => {
     switch (type) {
          case "IMAGE_DESCRIPTION":
               return PracticeType1_Exam;
          case "ASK_AND_ANSWER":
               return PracticeType2_Exam;
          case "CONVERSATION_PIECE":
          case "SHORT_TALK":
               return PracticeType3_Exam;
          case "FILL_IN_THE_BLANK_QUESTION":
               return PracticeType4_Exam;
          case "FILL_IN_THE_PARAGRAPH":
               return PracticeType5_Exam;
          case "READ_AND_UNDERSTAND":
               return PracticeType6_Exam;
          default:
               return null;
     }
};

export default function FinalTestScreen() {
     const router = useRouter();
     const params = useLocalSearchParams();
     const stageIndex = Number(params.stageIndex);

     const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
     const [showIntro, setShowIntro] = useState(true);
     const [sectionResults, setSectionResults] = useState<{ [type: string]: any[] }>({});
     const [timeLeft, setTimeLeft] = useState(60 * 30); // 30 minutes in seconds
     const examRef = useRef<any>(null);
     const timerRef = useRef<NodeJS.Timeout | null>(null);

     const {
          data: finalTestResponse,
          isLoading,
          error,
          refetch,
     } = useQuery({
          queryKey: ["stageFinalTest", stageIndex],
          queryFn: () => getStageFinalTestService(stageIndex),
          retry: 1,
     });

     // Map backend response to expected format
     const finalTest = finalTestResponse ? {
          ...finalTestResponse.finalTestInfo,
          ...finalTestResponse.finalTestStatus,
     } : null;

     // Group questions by type to create sections (similar to exam)
     const sections = useMemo(() => {
          if (!finalTest?.questions) return [];

          const questionsByType: { [type: string]: any[] } = {};
          finalTest.questions.forEach((question: any) => {
               const type = question.type;
               if (!questionsByType[type]) {
                    questionsByType[type] = [];
               }
               questionsByType[type].push(question);
          });

          return Object.keys(questionsByType).map(type => ({
               type,
               questions: questionsByType[type],
               name: LESSON_TYPE_MAPPING[type] || type,
          }));
     }, [finalTest?.questions]);

     const currentSection = sections[currentSectionIndex];
     const totalQuestions = finalTest?.questions?.length || 0;

     // Memoize initialValues to prevent infinite re-renders
     const practiceInitialValues = useMemo(() =>
          sectionResults[currentSection?.type || ''],
          [sectionResults, currentSection?.type]
     );

     const completeFinalTestMutation = useMutation({
          mutationFn: ({ stageIndex, sections }: { stageIndex: number; sections: any }) =>
               completeStageFinalTestService(stageIndex, { sections }),
          onSuccess: () => {
               if (timerRef.current) {
                    clearInterval(timerRef.current);
               }

               Alert.alert("Hoàn thành!", "Bạn đã hoàn thành bài thi cuối giai đoạn", [
                    {
                         text: "OK",
                         onPress: () => router.back(),
                    },
               ]);
          },
          onError: (error) => {
               console.error("Error completing final test:", error);
               Alert.alert("Lỗi", "Không thể nộp bài thi. Vui lòng thử lại sau.");
          },
     });

     const handleSubmitTest = async () => {
          if (examRef.current) {
               await examRef.current?.reset();
          }

          // Convert section results to the format expected by backend
          const allAnswers = sections.map(section => ({
               ...section,
               questions: sectionResults[section.type] || section.questions.map((q: any) => ({
                    ...q,
                    isNotAnswer: true,
                    isCorrect: false,
                    userAnswer: "",
               })),
          }));

          completeFinalTestMutation.mutate({ stageIndex, sections: allAnswers });
     };

     // Timer implementation same as exam component
     useEffect(() => {
          timerRef.current = setInterval(() => {
               setTimeLeft((prev) => {
                    if (prev <= 1) {
                         clearInterval(timerRef.current!);
                         handleSubmitTest();
                         return 0;
                    }
                    return prev - 1;
               });
          }, 1000);

          return () => {
               if (timerRef.current) clearInterval(timerRef.current);
          };
     }, []);

     const formatTime = (seconds: number) => {
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;
          return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
               .toString()
               .padStart(2, "0")}`;
     };

     // Section navigation handlers (similar to exam)
     const handleNext = () => {
          setShowIntro(false);
          setCurrentQuestionIndex(0);
     };

     const handleBack = () => {
          setShowIntro(true);
          setCurrentQuestionIndex(0);
     };

     const handleSectionSubmit = () => {
          if (currentSectionIndex < sections.length - 1) {
               setCurrentSectionIndex(currentSectionIndex + 1);
               setShowIntro(true);
               setCurrentQuestionIndex(0);
          } else {
               handleSubmitTest();
          }
     };

     const handleValuesChange = useCallback((questionAnswers: any[]) => {
          setSectionResults((prev) => {
               const currentAnswers = prev[currentSection?.type || ''];

               if (
                    !currentAnswers ||
                    JSON.stringify(currentAnswers) !== JSON.stringify(questionAnswers)
               ) {
                    return {
                         ...prev,
                         [currentSection?.type || '']: questionAnswers,
                    };
               }

               return prev;
          });
     }, [currentSection?.type]);

     if (isLoading) {
          return (
               <SafeAreaView style={styles.container}>
                    <Stack.Screen
                         options={{
                              title: "Bài thi cuối giai đoạn",
                              headerBackVisible: false,
                         }}
                    />
                    <View style={styles.loadingContainer}>
                         <ActivityIndicator size="large" color="#0099CC" />
                         <Text style={styles.loadingText}>Đang tải bài thi...</Text>
                    </View>
               </SafeAreaView>
          );
     }

     if (error || !finalTest || !finalTest.questions || sections.length === 0) {
          return (
               <SafeAreaView style={styles.container}>
                    <Stack.Screen
                         options={{
                              title: "Bài thi cuối giai đoạn",
                              headerBackVisible: false,
                         }}
                    />
                    <View style={styles.errorContainer}>
                         <FontAwesome5 name="exclamation-circle" size={50} color="#FF3B30" />
                         <Text style={styles.errorText}>
                              {!finalTest?.questions ? "Chưa bắt đầu bài thi" : "Không thể tải bài thi"}
                         </Text>
                         <TouchableOpacity
                              style={styles.retryButton}
                              onPress={() => router.back()}
                         >
                              <Text style={styles.retryButtonText}>Quay lại</Text>
                         </TouchableOpacity>
                    </View>
               </SafeAreaView>
          );
     }

     // Header component
     const renderHeader = () => (
          <View style={styles.header}>
               <Text style={styles.headerTitle}>
                    {showIntro ? currentSection?.name || "Bài thi" : `Phần ${currentSectionIndex + 1}/${sections.length}`}
               </Text>
               <View>
                    <TouchableOpacity onPress={handleSubmitTest}>
                         <Text style={styles.submitExamTxt}>Nộp bài</Text>
                    </TouchableOpacity>
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
               </View>
          </View>
     );

     // Content
     let content = null;
     if (showIntro) {
          content = (
               <View style={styles.container}>
                    <Text style={styles.sectionTitle}>
                         PHẦN {currentSectionIndex + 1}. {currentSection?.name}
                    </Text>
                    <Text style={styles.sectionType}>
                         {currentSection?.questions?.length || 0} câu hỏi
                    </Text>

                    <View style={styles.buttonGroup}>
                         {currentSectionIndex > 0 && (
                              <TouchableOpacity style={styles.button} onPress={() => {
                                   setCurrentSectionIndex(currentSectionIndex - 1);
                                   setShowIntro(true);
                              }}>
                                   <Text style={styles.buttonText}>Quay lại</Text>
                              </TouchableOpacity>
                         )}

                         <TouchableOpacity style={styles.button} onPress={handleNext}>
                              <Text style={styles.buttonText}>Tiếp tục</Text>
                         </TouchableOpacity>
                    </View>
               </View>
          );
     } else {
          const PracticeComponent = getPracticeComponent(currentSection?.type || '');

          content = PracticeComponent ? (
               <PracticeComponent
                    questions={currentSection?.questions || []}
                    onSubmit={handleSectionSubmit}
                    initialQuestionIndex={currentQuestionIndex}
                    onQuestionIndexChange={setCurrentQuestionIndex}
                    onBack={handleBack}
                    initialValues={practiceInitialValues}
                    onValuesChange={handleValuesChange}
                    examRef={examRef}
               />
          ) : (
               <View style={styles.container}>
                    <Text>Không hỗ trợ loại câu hỏi này: {currentSection?.type}</Text>
                    <TouchableOpacity style={styles.button} onPress={handleSectionSubmit}>
                         <Text style={styles.buttonText}>Phần tiếp theo</Text>
                    </TouchableOpacity>
               </View>
          );
     }

     return (
          <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
               <Stack.Screen
                    options={{
                         title: `Bài thi giai đoạn ${stageIndex + 1}`,
                         headerBackVisible: false,
                    }}
               />
               {renderHeader()}
               <View style={{ flex: 1 }}>{content}</View>
          </SafeAreaView>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#fff",
          padding: 12,
     },
     loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
     },
     loadingText: {
          marginTop: 10,
          fontSize: 16,
          color: "#666",
     },
     errorContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
     },
     errorText: {
          fontSize: 18,
          color: "#FF3B30",
          textAlign: "center",
          marginVertical: 10,
     },
     retryButton: {
          backgroundColor: "#0099CC",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 8,
          marginTop: 10,
     },
     retryButtonText: {
          color: "#fff",
          fontWeight: "600",
          fontSize: 16,
     },
     header: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#0099CC",
          paddingHorizontal: 15,
          justifyContent: "space-between",
          height: 60,
     },
     headerTitle: {
          fontSize: 20,
          fontWeight: "600",
          color: "white",
     },
     timerText: {
          color: "yellow",
          letterSpacing: 1,
          textAlign: "right",
     },
     submitExamTxt: {
          color: "#fff",
          textDecorationLine: "underline",
          fontSize: 16,
          marginBottom: 1,
     },
     sectionTitle: {
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 16,
          textAlign: "left",
     },
     sectionType: {
          fontSize: 16,
          color: "#333",
          marginBottom: 32,
          lineHeight: 26,
     },
     button: {
          backgroundColor: "#0099CC",
          paddingHorizontal: 32,
          paddingVertical: 14,
          borderRadius: 10,
     },
     buttonText: {
          color: "#fff",
          fontWeight: "bold",
          fontSize: 16,
          textAlign: "center",
     },
     buttonGroup: {
          flexDirection: "row",
          justifyContent: "center",
          marginBlock: 20,
          columnGap: 10,
     },
}); 