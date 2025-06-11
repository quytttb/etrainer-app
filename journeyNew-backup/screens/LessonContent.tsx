import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ExistingIntegration } from "../components/QuestionSession";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import ErrorMessage from "../components/Common/ErrorMessage";
import ConfirmModal from "../components/Common/ConfirmModal";
import useBackHandler from "../../../hooks/useBackHandler";

interface LessonParams {
     lessonId: string;
     stageId: string;
     dayId: string;
     lessonTitle: string;
}

const LessonContentScreen: React.FC = () => {
     const router = useRouter();
     const params = useLocalSearchParams() as unknown as LessonParams;

     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [showExitModal, setShowExitModal] = useState(false);
     const [lessonData, setLessonData] = useState<any>(null);

     // Handle back button
     useBackHandler({
          onBackPress: () => {
               setShowExitModal(true);
               return true; // Prevent default back action
          }
     });

     // Load lesson data
     useEffect(() => {
          loadLessonData();
     }, [params.lessonId]);

     const loadLessonData = async () => {
          try {
               setLoading(true);
               setError(null);

               // TODO: Replace with actual API call
               // const response = await lessonAPI.getLessonContent(params.lessonId);
               // setLessonData(response.data);

               // Simulate API loading
               await new Promise(resolve => setTimeout(resolve, 1000));

               // Mock lesson data based on lesson type and ID
               const mockLessonData = {
                    id: params.lessonId,
                    title: params.lessonTitle || "Bài học mới",
                    type: "LISTENING", // This would come from API
                    questions: [
                         // This data structure would come from your backend
                    ],
                    duration: 25,
               };

               setLessonData(mockLessonData);
               setLoading(false);
          } catch (err) {
               console.error('Error loading lesson:', err);
               setError('Không thể tải bài học. Vui lòng thử lại.');
               setLoading(false);
          }
     };

     const handleAnswer = (questionId: string, answer: any) => {
          console.log('Answer submitted:', { questionId, answer });
          // TODO: Save answer to local storage or send to API
          // await lessonAPI.saveAnswer(params.lessonId, questionId, answer);
     };

     const handleLessonComplete = (results: any) => {
          console.log('Lesson completed:', results);

          // TODO: Send results to API
          // await lessonAPI.submitLessonResults(results);

          // Calculate score and show results
          const mockScore = Math.floor(Math.random() * 40) + 60; // 60-100 points

          Alert.alert(
               "🎉 Hoàn thành bài học!",
               `Bạn đã đạt ${mockScore} điểm.\n\nThời gian: ${Math.floor(results.timeSpent / 60)} phút ${results.timeSpent % 60} giây`,
               [
                    {
                         text: "Xem kết quả chi tiết",
                         onPress: () => {
                              router.push({
                                   pathname: "/journeyNew/screens/LessonResults" as any,
                                   params: {
                                        lessonId: params.lessonId,
                                        score: mockScore,
                                        timeSpent: results.timeSpent,
                                        results: JSON.stringify(results),
                                   }
                              });
                         }
                    },
                    {
                         text: "Quay về",
                         style: "cancel",
                         onPress: () => {
                              router.back();
                         }
                    }
               ]
          );
     };

     const handleExitLesson = () => {
          setShowExitModal(false);
          router.back();
     };

     const handleContinueLesson = () => {
          setShowExitModal(false);
     };

     const handleRetry = () => {
          loadLessonData();
     };

     if (loading) {
          return (
               <LoadingSpinner
                    fullScreen
                    text="Đang tải bài học..."
               />
          );
     }

     if (error) {
          return (
               <ErrorMessage
                    message={error}
                    onRetry={handleRetry}
               />
          );
     }

     return (
          <View style={styles.container}>
               <ExistingIntegration
                    dayData={{
                         dayNumber: 1, // Would come from params
                         questions: ['q1', 'q2'], // Would come from lessonData
                         started: true,
                         completed: false
                    }}
                    navigation={{
                         goBack: () => router.back(),
                         push: (route: string, params?: any) => router.push({ pathname: route as any, params })
                    }}
                    route={{ params }}
               />

               {/* Exit Confirmation Modal */}
               <ConfirmModal
                    visible={showExitModal}
                    title="Thoát bài học?"
                    message="Bạn có chắc muốn thoát? Tiến độ hiện tại sẽ không được lưu."
                    confirmText="Thoát"
                    cancelText="Tiếp tục học"
                    onConfirm={handleExitLesson}
                    onCancel={handleContinueLesson}
                    confirmColor="#e74c3c"
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

export default LessonContentScreen; 