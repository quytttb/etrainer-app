import React, { useMemo } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, ScrollView } from 'react-native';
import { QuestionSessionProps, createSessionConfig, SessionResult } from './types';
import { useQuestionSession } from './hooks';
import useAudioCleanup from '../../hooks/useAudioCleanup';

// Import existing shared components
import QuestionRenderer from '../QuestionRenderer/QuestionRenderer';

// Import new sub-components
import {
     SessionHeader,
     Navigation,
     SubmitButton,
     QuestionOverview
} from './components';

/**
 * QuestionSession Enhanced Component
 * Full-featured unified component với tất cả sub-components
 * Production-ready version with complete feature set
 */
const QuestionSessionEnhanced: React.FC<QuestionSessionProps> = ({
     config,
     style,
     testId
}) => {
     // ============================================================================
     // HOOKS & STATE MANAGEMENT
     // ============================================================================

     // Main session hook với complete state management
     const {
          currentQuestion,
          currentIndex,
          userAnswers,
          sessionState,
          progress,

          // Actions
          goToQuestion,
          goNext,
          goPrevious,
          saveAnswer,
          submitSession,
          pauseSession,
          resumeSession,
          exitSession,

          // Computed values
          canGoNext,
          canGoPrevious,
          isLastQuestion,
          questionStatuses,
          isSessionComplete
     } = useQuestionSession(config);

     // ✅ FIX: Audio cleanup hook
     const { stopAudioOnAction } = useAudioCleanup({
          stopOnUnmount: true,
          stopOnNavigateAway: true,
          stopOnSubmit: true
     });

     // ============================================================================
     // DERIVED STATE & COMPUTED VALUES
     // ============================================================================

     // Check xem có đang loading không
     const isLoading = useMemo(() => {
          return sessionState.state === 'NOT_STARTED' || !currentQuestion;
     }, [sessionState.state, currentQuestion]);

     // Check xem session có bị pause không
     const isPaused = useMemo(() => {
          return sessionState.state === 'PAUSED';
     }, [sessionState.state]);

     // Check xem có đang trong process submit không
     const isSubmitting = useMemo(() => {
          return sessionState.state === 'SUBMITTED';
     }, [sessionState.state]);

     // Check xem có show question overview không
     const [showOverview, setShowOverview] = React.useState(false);

     // State để hiển thị kết quả trong lesson mode
     const [showAnswerResult, setShowAnswerResult] = React.useState(false);

     // Current user answer cho question hiện tại
     const currentUserAnswer = useMemo(() => {
          return currentQuestion ? userAnswers[currentQuestion._id] : undefined;
     }, [currentQuestion, userAnswers]);

     // Reset answer result khi chuyển câu
     React.useEffect(() => {
          setShowAnswerResult(false);
     }, [currentIndex]);

     // ============================================================================
     // EVENT HANDLERS
     // ============================================================================

     // Handle answer change từ QuestionRenderer
     const handleAnswer = React.useCallback((answer: any) => {
          if (currentQuestion) {
               saveAnswer(answer);

               // ✅ FIX: Only show result when lesson is truly complete for multi-questions
               if (config.mode === 'LESSON') {
                    // Check if this answer completes the question
                    const isQuestionComplete = checkQuestionComplete(currentQuestion, answer);
                    if (isQuestionComplete) {
                         setShowAnswerResult(true);
                    }
               }
          }
     }, [currentQuestion, saveAnswer, config.mode]);

     // ✅ FIX: Helper function to check if question is complete
     const checkQuestionComplete = (question: any, userAnswer: any): boolean => {
          switch (question.type) {
               case 'CONVERSATION_PIECE':
               case 'READ_AND_UNDERSTAND':
                    if (question.questions && question.questions.length > 0) {
                         // For multi-question types: check all sub-questions are answered
                         const answeredQuestions = question.questions.filter((subQ: any) =>
                              userAnswer && userAnswer[subQ._id]
                         ).length;
                         const requiredQuestions = question.questions.length;
                         console.log(`🔍 Question completion check: ${answeredQuestions}/${requiredQuestions} answered`);
                         return answeredQuestions === requiredQuestions;
                    }
                    return !!userAnswer;

               default:
                    // For single-answer questions: any answer completes it
                    return !!userAnswer;
          }
     };

     // Handle submit session
     const handleSubmit = React.useCallback(async () => {
          try {
               // ✅ FIX: Stop audio trước khi submit
               await stopAudioOnAction('submit');

               // ✅ FIX: Also stop audio directly via AudioManager for safety
               try {
                    if (typeof (global as any).AudioManager?.stopAllAudio === 'function') {
                         console.log('🎵 Stopping all audio via AudioManager before submit...');
                         (global as any).AudioManager.stopAllAudio();
                    }
               } catch (error) {
                    console.warn('⚠️ Failed to stop audio via AudioManager:', error);
               }

               // Lesson mode: next nếu không phải câu cuối, submit nếu là câu cuối
               if (config.mode === 'LESSON') {
                    if (isLastQuestion) {
                         // Câu cuối: hoàn thành bài học
                         const result = await submitSession();
                         handleSessionComplete(result);
                    } else {
                         // Không phải câu cuối: chuyển câu tiếp theo
                         await goNext();
                    }
                    return;
               }

               // Test mode: Show confirmation nếu cần
               if (config.mode === 'FINAL_TEST' && config.requireSubmitConfirmation) {
                    Alert.alert(
                         'Xác nhận nộp bài',
                         'Bạn có chắc chắn muốn nộp bài? Sau khi nộp sẽ không thể thay đổi đáp án.',
                         [
                              { text: 'Hủy', style: 'cancel' },
                              {
                                   text: 'Nộp bài',
                                   style: 'destructive',
                                   onPress: async () => {
                                        const result = await submitSession();
                                        handleSessionComplete(result);
                                   }
                              }
                         ]
                    );
               } else {
                    const result = await submitSession();
                    handleSessionComplete(result);
               }
          } catch (error) {
               console.error('❌ Error submitting session:', error);
               Alert.alert(
                    'Lỗi',
                    'Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.',
                    [{ text: 'OK' }]
               );
          }
     }, [config.mode, config.requireSubmitConfirmation, submitSession, isLastQuestion, goNext, stopAudioOnAction]);

     // Handle session completion
     const handleSessionComplete = React.useCallback((result: SessionResult) => {
          console.log('✅ Session completed:', result);
          config.onComplete?.(result);
     }, [config]);

     // Handle pause/resume
     const handlePause = React.useCallback(() => {
          pauseSession();
          config.onPause?.();
     }, [pauseSession, config]);

     const handleResume = React.useCallback(() => {
          resumeSession();
          config.onResume?.();
     }, [resumeSession, config]);

     // Handle exit với confirmation
     const handleExit = React.useCallback(() => {
          Alert.alert(
               'Xác nhận thoát',
               'Bạn có chắc chắn muốn thoát? Tiến độ hiện tại sẽ được lưu.',
               [
                    { text: 'Hủy', style: 'cancel' },
                    {
                         text: 'Thoát',
                         style: 'destructive',
                         onPress: () => {
                              exitSession();
                              config.onExit?.();
                         }
                    }
               ]
          );
     }, [exitSession, config]);

     // Handle question overview
     const handleShowOverview = React.useCallback(() => {
          setShowOverview(true);
     }, []);

     const handleCloseOverview = React.useCallback(() => {
          setShowOverview(false);
     }, []);

     const handleQuestionSelect = React.useCallback((index: number) => {
          goToQuestion(index);
          setShowOverview(false);
     }, [goToQuestion]);

     // ============================================================================
     // RENDER HELPERS
     // ============================================================================

     // Render loading state
     if (isLoading) {
          return (
               <View style={[styles.container, styles.centerContent, style]} testID={testId}>
                    <Text>Đang tải...</Text>
               </View>
          );
     }

     // Render error state nếu không có question
     if (!currentQuestion) {
          return (
               <View style={[styles.container, styles.centerContent, style]} testID={testId}>
                    <Text>Không tìm thấy câu hỏi. Vui lòng thử lại.</Text>
               </View>
          );
     }

     // ============================================================================
     // MAIN RENDER
     // ============================================================================

     return (
          <View style={[styles.container, style]} testID={testId}>
               {/* Enhanced Header với timer và submit button */}
               <SessionHeader
                    mode={config.mode}
                    showTimer={config.showTimer || false}
                    timeRemaining={sessionState.timerState?.timeRemaining || 0}
                    isPaused={isPaused}
                    progress={progress}
                    onPause={config.enablePause ? handlePause : undefined}
                    onResume={config.enablePause ? handleResume : undefined}
                    onSubmit={config.mode === 'FINAL_TEST' ? handleSubmit : undefined}
                    onExit={handleExit}
               />

               {/* Main content area - Scrollable */}
               <ScrollView
                    style={styles.contentContainer}
                    contentContainerStyle={styles.contentScrollContent}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
               >
                    {/* Question Renderer - reuse existing component */}
                    <QuestionRenderer
                         question={currentQuestion}
                         userAnswer={currentUserAnswer?.answer}
                         onAnswer={handleAnswer}
                         isReview={config.mode === 'LESSON' ? showAnswerResult : false}
                    />
               </ScrollView>

               {/* Navigation controls dưới cùng */}
               <View style={styles.controlsContainer}>
                    <Navigation
                         currentIndex={currentIndex}
                         totalQuestions={config.questions.length}
                         allowJumpNavigation={config.allowJumpNavigation || false}
                         showQuestionOverview={config.showQuestionOverview || false}
                         questionStatuses={questionStatuses}
                         canGoPrevious={canGoPrevious}
                         canGoNext={canGoNext}
                         onPrevious={goPrevious}
                         onNext={goNext}
                         onJumpTo={goToQuestion}
                         onShowOverview={handleShowOverview}
                    />
               </View>

               {/* Question Overview Modal cho test mode */}
               {showOverview && config.showQuestionOverview && (
                    <QuestionOverview
                         questions={config.questions}
                         currentIndex={currentIndex}
                         questionStatuses={questionStatuses}
                         onQuestionSelect={handleQuestionSelect}
                         onClose={handleCloseOverview}
                    />
               )}

               {/* Pause overlay */}
               {isPaused && (
                    <TouchableOpacity
                         style={styles.pauseOverlay}
                         onPress={handleResume}
                         activeOpacity={1}
                    >
                         <View style={styles.pauseContent}>
                              <Text style={styles.pauseText}>
                                   {config.mode === 'LESSON' ? 'Bài học đã tạm dừng' : 'Bài thi đã tạm dừng'}
                              </Text>
                              <Text style={styles.pauseSubtext}>
                                   Chạm để tiếp tục
                              </Text>
                         </View>
                    </TouchableOpacity>
               )}
          </View>
     );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#ffffff',
     },

     centerContent: {
          justifyContent: 'center',
          alignItems: 'center',
     },

     contentContainer: {
          flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 8,
     },

     contentScrollContent: {
          flexGrow: 1,
          paddingBottom: 20,
     },

     controlsContainer: {
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          backgroundColor: '#f8f9fa',
     },

     pauseOverlay: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
     },

     pauseContent: {
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 32,
          alignItems: 'center',
          minWidth: 200,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
     },

     pauseText: {
          fontSize: 20,
          fontWeight: '700',
          marginBottom: 8,
          textAlign: 'center',
          color: '#333',
     },

     pauseSubtext: {
          fontSize: 14,
          color: '#666',
          textAlign: 'center',
     },
});

// ============================================================================
// EXPORTS
// ============================================================================

export default QuestionSessionEnhanced;

// Export with default config helpers (enhanced versions)
export const LessonSessionEnhanced: React.FC<Omit<QuestionSessionProps, 'config'> & {
     questions: any[],
     overrides?: Partial<any>
}> = ({ questions, overrides, ...props }) => {
     const config = useMemo(() =>
          createSessionConfig('LESSON', questions, overrides),
          [questions, overrides]
     );

     return <QuestionSessionEnhanced config={config} {...props} />;
};

export const TestSessionEnhanced: React.FC<Omit<QuestionSessionProps, 'config'> & {
     questions: any[],
     timeLimit: number,
     overrides?: Partial<any>
}> = ({ questions, timeLimit, overrides, ...props }) => {
     const config = useMemo(() =>
          createSessionConfig('FINAL_TEST', questions, { timeLimit, ...overrides }),
          [questions, timeLimit, overrides]
     );

     return <QuestionSessionEnhanced config={config} {...props} />;
}; 