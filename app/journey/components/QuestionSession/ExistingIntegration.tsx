import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { LessonSessionEnhanced, TestSessionEnhanced } from './QuestionSessionEnhanced';
import { Question, LESSON_TYPE } from './types';
import { JourneyApiService } from '../../../../../src/services/api/journey';

// Create service instance
const journeyService = new JourneyApiService();

/**
 * Existing Integration Component
 * Test integration với existing screens và real backend data
 * Mimic current LessonContent & TestInterface usage patterns
 */

interface ExistingIntegrationProps {
     // Mimic existing props from LessonContent
     dayData?: {
          dayNumber: number;
          questions: string[]; // ObjectId strings
          started: boolean;
          completed: boolean;
     };

     // Mimic existing props from TestInterface  
     examData?: {
          name: string;
          duration: number; // minutes
          sections: Array<{
               type: string;
               questions: string[]; // ObjectId strings
          }>;
     };

     // Navigation props
     navigation?: any;
     route?: any;
}

const ExistingIntegration: React.FC<ExistingIntegrationProps> = ({
     dayData,
     examData,
     navigation,
     route
}) => {
     // ============================================================================
     // STATE MANAGEMENT
     // ============================================================================

     const [questions, setQuestions] = useState<Question[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     // Determine mode from props (similar to existing logic)
     const isTestMode = !!examData;
     const isLessonMode = !!dayData;

     // ============================================================================
     // DATA FETCHING (Simulated)
     // ============================================================================

     useEffect(() => {
          fetchQuestions();
     }, [dayData, examData]);

     const fetchQuestions = async () => {
          try {
               setLoading(true);
               setError(null);

               let questionData: Question[] = [];

               if (isLessonMode && dayData) {
                    // Simulate fetching day questions from backend
                    console.log('🎓 Fetching lesson questions for day:', dayData.dayNumber);

                    // Transform existing ObjectId strings to Question objects
                    questionData = await fetchLessonQuestions(dayData.questions);

               } else if (isTestMode && examData) {
                    // Simulate fetching exam questions from backend
                    console.log('📝 Fetching exam questions for:', examData.name);

                    // Transform existing exam structure to Question objects
                    questionData = await fetchExamQuestions(examData.sections);
               }

               setQuestions(questionData);
               setLoading(false);

          } catch (err) {
               console.error('❌ Error fetching questions:', err);
               setError('Failed to load questions');
               setLoading(false);
          }
     };

     // ============================================================================
     // API SIMULATION (Replace with real API calls)
     // ============================================================================

     const fetchLessonQuestions = async (questionIds: string[]): Promise<Question[]> => {
          console.log('🎓 Fetching lesson questions for day:', dayData?.dayNumber);

          // Use real API call: journeyService.getDayQuestions  
          const response = await journeyService.getDayQuestions('stageId', dayData?.dayNumber || 1);
          const questionsData = response.data || [];

          // Transform backend data to our Question format (already compatible)
          return questionsData
               .filter((q: any) => q !== null)
               .map((q: any) => ({
                    ...q,
                    _id: q.id || q._id, // Ensure _id compatibility
               }));
     };

     const fetchExamQuestions = async (sections: any[]): Promise<Question[]> => {
          console.log('📝 Fetching exam questions for:', examData?.name);

          try {
               // Get stage index from route params (like TestScreen)
               const stageIndex = route?.params?.stageIndex;
               if (stageIndex === undefined) {
                    throw new Error('Missing stage index for exam');
               }

               // ✅ SIMPLIFIED: Backend now returns questions directly when test is unlocked
               const testResponse = await journeyService.getStageFinalTest(parseInt(stageIndex));
               const testQuestions = testResponse.data || [];
               console.log('📝 Test data loaded:', {
                    questionsCount: testQuestions.length,
                    stageIndex: stageIndex
               });

               // Use questions directly from API response
               const examQuestions = testQuestions;

               if (examQuestions.length === 0) {
                    console.warn('⚠️ No questions available for this final test');
                    return [];
               }

               // Transform questions to our format (already compatible)
               return examQuestions
                    .filter((q: any) => q !== null)
                    .map((q: any, index: number) => ({
                         ...q,
                         _id: q.id || q._id, // Ensure _id compatibility
                         questionNumber: index + 1, // Ensure sequential numbering
                    }));

          } catch (err) {
               console.error('❌ Error fetching exam questions:', err);
               throw err;
          }
     };

     // ============================================================================
     // EVENT HANDLERS (Compatible with existing navigation)
     // ============================================================================

     const handleLessonComplete = async (results: any) => {
          console.log('🎓 Lesson completed with results:', results);

          try {
               const score = results.score || 0;
               const totalQuestions = results.totalQuestions || 1;
               const correctAnswers = results.correctAnswers || 0;

               // ✅ FIXED: Pass score data to backend and handle response
               if (dayData?.dayNumber && route?.params?.stageIndex !== undefined) {
                    const response = await journeyService.completeDay(
                         parseInt(route.params.stageIndex),
                         dayData.dayNumber
                    );

                    // Use response data from backend
                    const passed = (response.data as any)?.dayPassed;
                    const nextDayUnlocked = (response.data as any)?.nextDayUnlocked;
                    const message = response.data.message;

                    // Show completion message with unlock logic
                    Alert.alert(
                         '🎉 Bài học hoàn thành!',
                         message,
                         [
                              {
                                   text: 'OK',
                                   onPress: () => {
                                        // Go back to stage details để refresh unlock status
                                        navigation?.goBack();
                                   }
                              }
                         ]
                    );
               }
          } catch (err: any) {
               console.error('❌ Error completing lesson:', err);
               Alert.alert('Lỗi', 'Không thể lưu tiến độ. Vui lòng thử lại.');
          }
     };

     const handleTestComplete = async (results: any) => {
          console.log('📝 Test completed with results:', results);

          try {
               // Check if this is a final test
               const stageIndex = route?.params?.stageIndex;
               const onComplete = route?.params?.onComplete;

               if (stageIndex !== undefined && examData?.sections?.[0]?.type === "STAGE_FINAL_TEST") {
                    // ✅ CRITICAL FIX: Call backend API for final test completion
                    console.log("🔥 Final test detected - calling backend API...");

                    // Call the TestScreen's handleSubmit if provided
                    if (onComplete && typeof onComplete === 'function') {
                         console.log("✅ Calling TestScreen handleSubmit with results...");
                         await onComplete(results);
                         return; // TestScreen handles navigation
                    }

                    // ✅ FALLBACK: Direct backend call if no onComplete handler
                    const backendResponse = await journeyService.submitStageFinalTest(
                         parseInt(stageIndex),
                         results.answers || []
                    );
                    console.log("✅ Final test completed:", backendResponse);

                    // 🔥 CRITICAL FIX: Force refresh journey data immediately after test completion
                    try {
                         console.log("🔄 Force refreshing journey data after test completion...");

                         await Promise.all([
                              journeyService.getCurrentJourney(),  // Force refresh overview
                              journeyService.getJourneyStages(undefined, true),    // Force refresh stages
                         ]);

                         console.log("✅ Journey data force refreshed successfully");
                    } catch (refreshError) {
                         console.warn("⚠️ Force refresh failed, but continuing with navigation:", refreshError);
                    }

                    // Calculate passed status
                    const score = backendResponse?.data?.score || 0;
                    const minScore = backendResponse?.data?.minScore || 70;
                    const passed = backendResponse?.data?.passed !== undefined ? backendResponse.data.passed : score >= minScore;

                    // Show completion message
                    Alert.alert(
                         passed ? '🎉 Chúc mừng!' : '📚 Cần cải thiện',
                         passed
                              ? `Bạn đã vượt qua bài test tổng kết với điểm ${score}%!`
                              : `Điểm của bạn là ${score}%. Cần tối thiểu ${minScore}% để qua giai đoạn.`,
                         [
                              {
                                   text: 'OK',
                                   onPress: () => {
                                        // Navigate back với refresh parameter để trigger data refresh
                                        if (navigation?.goBack) {
                                             navigation.goBack();
                                        }
                                   }
                              }
                         ]
                    );
               } else {
                    // ✅ Non-final test - original logic
                    Alert.alert(
                         'Bài thi hoàn thành!',
                         `Điểm: ${results.score || 0}%`,
                         [
                              {
                                   text: 'Hoàn thành',
                                   onPress: () => {
                                        navigation?.goBack();
                                   }
                              }
                         ]
                    );
               }
          } catch (error: any) {
               console.error('❌ Error completing test:', error);
               Alert.alert('Lỗi', 'Không thể hoàn thành bài thi. Vui lòng thử lại.');
          }
     };

     const handleExit = () => {
          console.log('🚪 User exited session');
          // Exit handler disabled - handled by parent screen (LessonScreen/TestScreen)
          // to prevent multiple confirmation dialogs
          navigation?.goBack();
     };

     // ============================================================================
     // RENDER STATES
     // ============================================================================

     if (loading) {
          return (
               <View style={styles.centerContainer}>
                    <Text style={styles.loadingText}>
                         {isLessonMode ? 'Đang tải bài học...' : 'Đang tải bài thi...'}
                    </Text>
               </View>
          );
     }

     if (error) {
          return (
               <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchQuestions}>
                         <Text style={styles.retryButtonText}>Thử lại</Text>
                    </TouchableOpacity>
               </View>
          );
     }

     if (questions.length === 0) {
          return (
               <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>Không có câu hỏi nào.</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
                         <Text style={styles.backButtonText}>Quay lại</Text>
                    </TouchableOpacity>
               </View>
          );
     }

     // ============================================================================
     // MAIN RENDER - UNIFIED SESSIONS
     // ============================================================================

     // Lesson Mode - Replace existing LessonContent
     if (isLessonMode && dayData) {
          return (
               <LessonSessionEnhanced
                    questions={questions}
                    overrides={{
                         // Lesson-specific configuration
                         autoSaveProgress: true,
                         showProgress: true,
                         enablePrevious: true,
                         showExplanations: false, // Maybe show after completion

                         // Callbacks compatible với existing flow
                         onComplete: handleLessonComplete,
                         onExit: handleExit,

                         // Question change tracking (for analytics)
                         onQuestionChange: (index: number, question: any) => {
                              console.log(`📊 Question ${index + 1} viewed:`, question.type);
                         },

                         // Answer tracking (for progress saving)
                         onAnswer: (questionId: string, answer: any) => {
                              console.log(`💾 Answer saved for ${questionId}:`, answer);
                              // Here would save to backend như existing implementation
                         }
                    }}
               />
          );
     }

     // Test Mode - Replace existing TestInterface  
     if (isTestMode && examData) {
          return (
               <TestSessionEnhanced
                    questions={questions}
                    timeLimit={examData.duration * 60 * 1000} // Convert minutes to milliseconds
                    overrides={{
                         // Test-specific configuration
                         showTimer: true,
                         allowJumpNavigation: true,
                         showQuestionOverview: true,
                         requireSubmitConfirmation: true,
                         enablePause: true,
                         autoSubmitOnTimeout: true,

                         // Timer warnings
                         warningThresholds: [5 * 60 * 1000, 2 * 60 * 1000, 1 * 60 * 1000],

                         // Callbacks compatible với existing flow
                         onComplete: handleTestComplete,
                         onExit: handleExit,

                         // Timer warnings
                         onTimeWarning: (remainingTime: number) => {
                              const minutes = Math.floor(remainingTime / (60 * 1000));
                              if (minutes <= 5 && minutes > 0) {
                                   Alert.alert(
                                        '⚠️ Cảnh báo thời gian',
                                        `Còn ${minutes} phút để hoàn thành bài thi!`
                                   );
                              }
                         },

                         // Pause/Resume tracking
                         onPause: () => {
                              console.log('⏸️ Test paused');
                         },
                         onResume: () => {
                              console.log('▶️ Test resumed');
                         }
                    }}
               />
          );
     }

     // Fallback - shouldn't reach here
     return (
          <View style={styles.centerContainer}>
               <Text style={styles.errorText}>Invalid session configuration</Text>
               <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
                    <Text style={styles.backButtonText}>Quay lại</Text>
               </TouchableOpacity>
          </View>
     );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
     centerContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#ffffff',
     },

     loadingText: {
          fontSize: 16,
          color: '#666',
          textAlign: 'center',
     },

     errorText: {
          fontSize: 16,
          color: '#dc3545',
          textAlign: 'center',
          marginBottom: 20,
     },

     emptyText: {
          fontSize: 16,
          color: '#666',
          textAlign: 'center',
          marginBottom: 20,
     },

     retryButton: {
          backgroundColor: '#007AFF',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 8,
     },

     retryButtonText: {
          color: 'white',
          fontSize: 14,
          fontWeight: '600',
     },

     backButton: {
          backgroundColor: '#6c757d',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 8,
     },

     backButtonText: {
          color: 'white',
          fontSize: 14,
          fontWeight: '600',
     },
});

// ============================================================================
// USAGE EXAMPLES FOR EXISTING SCREENS
// ============================================================================

/*
// Example: Replace LessonContent in existing screen
// OLD:
import LessonContent from '../components/LessonContent';
<LessonContent 
  dayData={dayData} 
  navigation={navigation}
  route={route}
/>

// NEW:
import ExistingIntegration from '../components/QuestionSession/ExistingIntegration';
<ExistingIntegration 
  dayData={dayData} 
  navigation={navigation}
  route={route}
/>

// Example: Replace TestInterface in existing screen  
// OLD:
import TestInterface from '../components/TestInterface';
<TestInterface 
  examData={examData}
  navigation={navigation}
  route={route}
/>

// NEW:
import ExistingIntegration from '../components/QuestionSession/ExistingIntegration';
<ExistingIntegration 
  examData={examData}
  navigation={navigation}
  route={route}
/>
*/

export default ExistingIntegration; 