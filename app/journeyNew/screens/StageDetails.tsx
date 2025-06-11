import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import StageDetail from "../components/StageDetail";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import ErrorMessage from "../components/Common/ErrorMessage";
import useBackHandler from "../../../hooks/useBackHandler";
import { JourneyNewService } from "../service";

interface StageDetailsScreenProps {
     navigation?: any;
     route?: any;
}

const StageDetailsScreen: React.FC<StageDetailsScreenProps> = ({
     navigation,
     route,
}) => {
     const router = useRouter();
     const params = useLocalSearchParams();
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [stageData, setStageData] = useState<any>(null);
     const [refreshProcessed, setRefreshProcessed] = useState(false);

     // Get params from expo-router or legacy route
     const stageId = params.stageId || route?.params?.stageId || "2";
     const journeyId = params.journeyId || route?.params?.journeyId || "1";
     const journeyTitle = params.journeyTitle || route?.params?.journeyTitle || "TOEIC Journey";

     // Handle back button using the new hook
     useBackHandler({
          onBackPress: () => {
               console.log("🔙 StageDetails: Back button pressed");
               handleGoBack();
               return true; // Prevent default back behavior
          }
     });

     useEffect(() => {
          loadStageData();
     }, [stageId]);

     // ✅ FIXED: Handle refresh parameter from navigation (only once)
     useEffect(() => {
          const shouldRefresh = params.refresh === "true";
          if (shouldRefresh && !loading && !refreshProcessed) {
               console.log("🔄 Stage refresh requested from navigation params");
               setRefreshProcessed(true);

               // ✅ FIX: Don't call router.replace - just load data with force refresh
               loadStageData(true);
          }
     }, [params.refresh, loading, refreshProcessed]);

     // ✅ FIXED: Reset refresh processed flag when stageId changes
     useEffect(() => {
          setRefreshProcessed(false);
     }, [stageId]);

     // Add focus listener to refresh data when returning to this screen
     useFocusEffect(
          React.useCallback(() => {
               loadStageData();
          }, [stageId])
     );

     const loadStageData = async (forceRefresh: boolean = false) => {
          try {
               setLoading(true);
               setError(null);

               // ✅ Check if forced refresh is requested
               const shouldForceRefresh = forceRefresh;

               console.log(`🔄 Loading stage data - Force refresh: ${shouldForceRefresh}`);

               // ✅ REAL API CALL: Get current journey to find stage data with force refresh if needed
               const journeyData = await JourneyNewService.getJourneyOverview(shouldForceRefresh);
               const stagesData = await JourneyNewService.getJourneyStages(shouldForceRefresh);

               // Also get final test data for accurate question count with force refresh
               let finalTestData = null;
               try {
                    const stageIndex = (journeyData as any).stages?.findIndex((stage: any) => stage.stageId === stageId);
                    if (stageIndex >= 0) {
                         // Force fresh data to get updated scores and question count
                         finalTestData = await JourneyNewService.getStageFinalTest(stageIndex, true);
                         console.log("✅ Final test data loaded:", {
                              stageIndex,
                              totalQuestions: finalTestData?.finalTestInfo?.questions?.length || 0,
                              finalTestUnlocked: finalTestData?.finalTestUnlocked,
                              finalTestCompleted: finalTestData?.finalTestCompleted,
                              canTakeTest: finalTestData?.canTakeTest
                         });
                    }
               } catch (error) {
                    console.log("Could not fetch final test data:", error);
               }

               // ✅ FIXED: Find the stage in user's journey by stageId (not index)
               // stageId is the ObjectId of the stage template, need to find it in user's journey stages
               const userStage = (journeyData as any).stages?.find((stage: any) => stage.stageId === stageId);
               const stageTemplate = stagesData.find((s: any) => s.id === stageId);

               // Also find the stage index for display purposes
               const stageIndex = (journeyData as any).stages?.findIndex((stage: any) => stage.stageId === stageId);

               if (!userStage || !stageTemplate) {
                    console.error('Debug - Stage lookup failed:', {
                         stageId,
                         userStageFound: !!userStage,
                         stageTemplateFound: !!stageTemplate,
                         availableUserStages: (journeyData as any).stages?.map((s: any) => s.stageId),
                         availableStageTemplates: stagesData.map((s: any) => s.id)
                    });
                    throw new Error(`Stage ${stageId} not found in user journey or stage templates`);
               }

               // ✅ NEW: Calculate real progress from completed days
               const totalDays = userStage.days?.length || 0;
               const completedDays = userStage.days?.filter((day: any) => day.completed)?.length || 0;
               const realProgress = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

               console.log("📊 Progress calculation:", {
                    stageId,
                    totalDays,
                    completedDays,
                    realProgress,
                    userStageProgress: userStage.progress
               });

               setStageData({
                    id: userStage.stageId,
                    title: `Giai đoạn ${stageIndex + 1}: ${stageTemplate.minScore}-${stageTemplate.targetScore} điểm`,
                    description: `Nâng cao kỹ năng TOEIC từ ${stageTemplate.minScore} lên ${stageTemplate.targetScore} điểm`,
                    progress: realProgress, // ✅ Use calculated progress instead of userStage.progress
                    minScore: stageTemplate.minScore,
                    targetScore: stageTemplate.targetScore,
                    status: userStage.status || userStage.state,
                    journeyId,
                    journeyTitle,
                    stageIndex,
                    days: userStage.days || [],
                    finalTest: userStage.finalTest || {},
                    finalTestData: finalTestData || {},
                    lessons: userStage.lessons || [],
                    stageNumber: stageIndex + 1, // For display purposes
               });

          } catch (err) {
               console.error("Error loading stage data:", err);
               setError("Không thể tải dữ liệu giai đoạn. Vui lòng thử lại.");
          } finally {
               setLoading(false);
          }
     };

     const getStageInfo = (stageId: string) => {
          const stageMap: Record<string, any> = {
               "1": {
                    title: "Giai đoạn 1: Cơ bản (0-300)",
                    description: "Làm quen với format TOEIC cơ bản",
                    progress: 100,
                    minScore: 0,
                    targetScore: 300,
                    status: "COMPLETED",
               },
               "2": {
                    title: "Giai đoạn 2: Trung cấp (300-450)",
                    description: "Nâng cao kỹ năng nghe và từ vựng cơ bản cho TOEIC",
                    progress: 65,
                    minScore: 300,
                    targetScore: 450,
                    status: "IN_PROGRESS",
               },
               "3": {
                    title: "Giai đoạn 3: Nâng cao (450-650)",
                    description: "Phát triển kỹ năng đọc hiểu và ngữ pháp nâng cao",
                    progress: 0,
                    minScore: 450,
                    targetScore: 650,
                    status: "LOCKED",
               },
               "4": {
                    title: "Giai đoạn 4: Thành thạo (650+)",
                    description: "Hoàn thiện kỹ năng cho mức điểm cao nhất",
                    progress: 0,
                    minScore: 650,
                    targetScore: 900,
                    status: "LOCKED",
               },
          };

          return stageMap[stageId] || stageMap["2"]; // Default to stage 2
     };

     const handleSelectDay = (dayId: string) => {
          console.log("📅 Selected day:", dayId, "in stage:", stageId);

          // Find the day data to get questions
          const selectedDay = stageData?.days?.find((day: any) => day._id === dayId);

          if (!selectedDay) {
               console.error("Day not found:", dayId);
               return;
          }

          // ✅ FIXED: Allow access to completed days for review
          // Only check if day is unlocked (started, completed, or first day)
          if (!selectedDay.started && !selectedDay.completed && selectedDay.dayNumber !== 1) {
               console.log("Day is locked:", dayId);
               Alert.alert("Ngày học chưa mở khóa", "Hãy hoàn thành các ngày học trước đó.");
               return;
          }

          if (!selectedDay.questions || selectedDay.questions.length === 0) {
               console.log("No questions found for day:", dayId);
               Alert.alert("Không có câu hỏi", "Ngày học này chưa có câu hỏi.");
               return;
          }

          // ✅ FIX: Extract only _id from question objects
          const questionIds = selectedDay.questions.map((q: any) =>
               typeof q === 'string' ? q : q._id
          );

          console.log("🔍 Extracted question IDs:", questionIds);

          // Navigate to LessonScreen with questions
          router.push({
               pathname: "/journeyNew/screens/LessonScreen" as any,
               params: {
                    questionIds: JSON.stringify(questionIds),
                    dayNumber: selectedDay.dayNumber.toString(),
                    stageIndex: stageData?.stageIndex?.toString() || "0",
                    journeyId: journeyId,
                    stageId: stageId,
                    isReview: selectedDay.completed ? "true" : "false", // ✅ ADD: Mark as review if completed
               }
          });
     };

     const handleSelectLesson = (lessonId: string, lessonTitle?: string) => {
          console.log("📚 Navigating to lesson:", lessonId);

          // Navigate to LessonContent screen
          router.push({
               pathname: "/journeyNew/screens/LessonContent" as any,
               params: {
                    lessonId: lessonId,
                    stageId: stageId,
                    journeyId: journeyId,
                    lessonTitle: lessonTitle || `Bài học ${lessonId}`,
                    stageTitle: stageData?.title || "Giai đoạn"
               }
          });
     };

     const handleSelectTest = (testId: string, testType?: string) => {
          console.log("📝 Navigating to test:", testId, "type:", testType);

          // TODO: Navigate to TestScreen when implemented
          // For now, navigate to LessonContent with test mode
          router.push({
               pathname: "/journeyNew/screens/LessonContent" as any,
               params: {
                    lessonId: testId,
                    stageId: stageId,
                    journeyId: journeyId,
                    lessonTitle: `${testType === 'practice' ? 'Luyện tập' : 'Kiểm tra'} ${testId}`,
                    stageTitle: stageData?.title || "Giai đoạn",
                    isTest: "true"
               }
          });
     };

     const handleStartFinalExam = () => {
          console.log("🎓 Starting final exam for stage:", stageId);

          // Get stageIndex from stageData
          const currentStageIndex = stageData?.stageIndex;

          // ✅ ADD: Validation for stage index
          if (currentStageIndex === undefined || currentStageIndex === -1) {
               console.error("❌ Invalid stage index:", currentStageIndex, "for stageId:", stageId);
               Alert.alert("Lỗi", "Không thể xác định chỉ số giai đoạn. Vui lòng thử lại.");
               return;
          }

          console.log("✅ Valid stage index:", currentStageIndex, "for final exam");

          // Navigate to TestScreen with proper parameters
          router.push({
               pathname: "/journeyNew/screens/TestScreen" as any,
               params: {
                    testType: "final",
                    stageIndex: currentStageIndex.toString(),
                    stageId: stageId,
                    stageTitle: stageData?.title || "Giai đoạn",
                    journeyId: journeyId
               }
          });
     };

     const handleGoBack = () => {
          console.log("🔙 Going back to journey overview");

          // ✅ FIXED: Navigate to journey overview explicitly instead of relying on router.back()
          // to prevent going to home screen when navigation stack is inconsistent
          router.replace({
               pathname: "/journeyNew/screens/JourneyOverview" as any,
               params: {
                    journeyId: journeyId,
                    journeyTitle: journeyTitle
               }
          });
     };

     if (loading) {
          return (
               <SafeAreaView style={styles.container}>
                    <LoadingSpinner
                         fullScreen
                         text="Đang tải thông tin giai đoạn..."
                    />
               </SafeAreaView>
          );
     }

     if (error) {
          return (
               <SafeAreaView style={styles.container}>
                    <ErrorMessage
                         fullScreen
                         message={error}
                         onRetry={loadStageData}
                    />
               </SafeAreaView>
          );
     }

     return (
          <SafeAreaView style={styles.container}>
               <StageDetail
                    stageData={stageData}
                    onSelectDay={handleSelectDay}
                    onSelectLesson={handleSelectLesson}
                    onSelectTest={handleSelectTest}
                    onStartFinalExam={handleStartFinalExam}
               />
          </SafeAreaView>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#f8f9fa",
     },
});

export default StageDetailsScreen; 