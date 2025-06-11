import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ExistingIntegration } from "../components/QuestionSession";
import { JourneyNewService } from "../service";

const TestScreen = () => {
     const router = useRouter();
     const params = useLocalSearchParams();
     const { testType, stageIndex, stageId, stageTitle, journeyId } = params;

     const [testData, setTestData] = useState<any>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");

     useEffect(() => {
          const loadTest = async () => {
               try {
                    setLoading(true);

                    if (testType === "final") {
                         // Get final test data from API
                         const response = await JourneyNewService.getStageFinalTest(parseInt(stageIndex as string));
                         setTestData(response);
                    }
               } catch (error) {
                    console.error("❌ Error loading test:", error);
                    setError("Không thể tải bài thi. Vui lòng thử lại.");
               } finally {
                    setLoading(false);
               }
          };

          loadTest();
     }, [testType, stageIndex]);

     const handleStartTest = async () => {
          try {
               if (testType === "final") {
                    await JourneyNewService.startStageFinalTest(parseInt(stageIndex as string));
                    console.log("✅ Final test started");

                    // Reload test data to get questions after starting - FORCE FRESH
                    console.log("🔄 Reloading test data after start...");
                    const response = await JourneyNewService.getStageFinalTest(parseInt(stageIndex as string), true);
                    setTestData(response);
                    console.log("✅ Test started successfully, questions loaded:", response?.finalTestInfo?.questions?.length || 0);
               }
          } catch (error) {
               console.error("❌ Error starting test:", error);
               Alert.alert("Lỗi", "Không thể bắt đầu bài thi. Vui lòng thử lại.");
          }
     };

     const handleSubmit = async (results: any) => {
          try {
               console.log("📤 Submitting test results:", results);

               let backendResponse: any;
               if (testType === "final") {
                    backendResponse = await JourneyNewService.completeStageFinalTest(
                         parseInt(stageIndex as string),
                         results  // Pass the backend format directly
                    );
                    console.log("✅ Final test completed:", backendResponse);

                    // 🔥 CRITICAL FIX: Force refresh journey data immediately after test completion
                    // This ensures that subsequent navigation shows updated stage status
                    try {
                         console.log("🔄 Force refreshing journey data after test completion...");

                         // Force refresh both overview and stages data to invalidate cache
                         await Promise.all([
                              JourneyNewService.getJourneyOverview(true),  // Force refresh overview
                              JourneyNewService.getJourneyStages(true),    // Force refresh stages
                         ]);

                         console.log("✅ Journey data force refreshed successfully");
                    } catch (refreshError) {
                         console.warn("⚠️ Force refresh failed, but continuing with navigation:", refreshError);
                         // Don't block navigation if refresh fails, but log warning
                    }
               }

               // ✅ FIXED: Ensure passed status is calculated correctly based on 70% threshold
               const score = backendResponse?.score || 0;
               const minScore = backendResponse?.minScore || 70;

               // Calculate passed status: use backend value if provided, otherwise calculate based on score >= minScore (70%)
               const passed = backendResponse?.passed !== undefined
                    ? backendResponse.passed
                    : score >= minScore;

               console.log(`🎯 Score: ${score}, MinScore: ${minScore}, Passed: ${passed}`);

               // ✅ Map backend response to navigation params
               const testResults = {
                    score: score,
                    passed: passed,
                    correctAnswers: backendResponse?.correctAnswers || 0,
                    totalQuestions: backendResponse?.totalQuestions || 0,
                    timeSpent: results.endTime && results.startTime ?
                         Math.floor((new Date(results.endTime).getTime() - new Date(results.startTime).getTime()) / 1000) : 0,
                    message: backendResponse?.message || "",
                    minScore: minScore
               };

               // Navigate to results screen
               router.push({
                    pathname: "/journeyNew/screens/TestResults" as any,
                    params: {
                         testType: testType as string,
                         stageIndex: stageIndex as string,
                         stageId: stageId as string,
                         journeyId: journeyId as string,
                         score: testResults.score.toString(),
                         passed: testResults.passed.toString(),
                         correctAnswers: testResults.correctAnswers.toString(),
                         totalQuestions: testResults.totalQuestions.toString(),
                         timeSpent: testResults.timeSpent.toString(),
                         message: testResults.message,
                         minScore: testResults.minScore.toString(),
                         results: JSON.stringify(testResults)
                    }
               });
          } catch (error) {
               console.error("❌ Error submitting test:", error);
               Alert.alert("Lỗi", "Không thể nộp bài thi. Vui lòng thử lại.");
          }
     };

     const handleExit = () => {
          Alert.alert(
               "Thoát bài thi",
               "Bạn có chắc chắn muốn thoát? Tiến độ sẽ không được lưu.",
               [
                    { text: "Hủy", style: "cancel" },
                    {
                         text: "Thoát",
                         style: "destructive",
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
     };

     if (loading) {
          return (
               <View style={[styles.container, styles.centered]}>
                    <ActivityIndicator size="large" color="#007AFF" />
               </View>
          );
     }

     if (error) {
          return (
               <View style={[styles.container, styles.centered]}>
                    <Text style={styles.errorText}>{error}</Text>
               </View>
          );
     }

     return (
          <View style={styles.container}>
               <ExistingIntegration
                    examData={{
                         name: testData?.finalTestInfo?.name || "Final Test",
                         duration: testData?.finalTestInfo?.duration || 30,
                         sections: [{
                              type: "STAGE_FINAL_TEST",
                              questions: testData?.finalTestInfo?.questions || []
                         }]
                    }}
                    navigation={{
                         goBack: () => {
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
                         },
                         push: (route: string, params?: any) => router.push({ pathname: route as any, params })
                    }}
                    route={{
                         params: {
                              ...params,
                              stageIndex: stageIndex, // Ensure stage index is passed
                              onComplete: handleSubmit,
                              onExit: handleExit
                         }
                    }}
               />
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#f8f9fa",
     },
     centered: {
          justifyContent: "center",
          alignItems: "center",
     },
     errorText: {
          fontSize: 16,
          color: "#ff3b30",
          textAlign: "center",
          marginHorizontal: 20,
     },
});

export default TestScreen; 