import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { QuestionSessionProps, createSessionConfig, SessionResult } from './types';
import { useQuestionSession } from './hooks';

// Import existing shared components
import QuestionRenderer from '../QuestionRenderer/QuestionRenderer';
// Note: LoadingSpinner và ErrorMessage sẽ được import sau khi tạo
// import LoadingSpinner from '../Common/LoadingSpinner';
// import ErrorMessage from '../Common/ErrorMessage';

// Import new components (sẽ tạo sau)
// import SessionHeader from './components/SessionHeader';
// import Navigation from './components/Navigation';
// import SubmitButton from './components/SubmitButton';
// import QuestionOverview from './components/QuestionOverview';

/**
 * Main QuestionSession Component - Simplified Version
 * Unified component thay thế cho cả LessonContent và TestInterface
 */
const QuestionSession: React.FC<QuestionSessionProps> = ({
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
          goNext,
          goPrevious,
          saveAnswer,
          submitSession,

          // Computed values
          canGoNext,
          canGoPrevious,
          isLastQuestion
     } = useQuestionSession(config);

     // ✅ NEW: State để track câu hỏi đã được check hay chưa (cho lesson mode)
     const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set());

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

     // Current user answer cho question hiện tại
     const currentUserAnswer = useMemo(() => {
          return currentQuestion ? userAnswers[currentQuestion._id] : undefined;
     }, [currentQuestion, userAnswers]);

     // ✅ NEW: Check xem câu hỏi hiện tại đã được check hay chưa
     const isCurrentQuestionChecked = useMemo(() => {
          const checked = currentQuestion ? checkedQuestions.has(currentQuestion._id) : false;
          console.log('🔍 isCurrentQuestionChecked:', {
               checked,
               questionId: currentQuestion?._id,
               checkedQuestionsSize: checkedQuestions.size
          });
          return checked;
     }, [currentQuestion, checkedQuestions]);

     // ✅ NEW: Check xem có answer để có thể check hay không
     const canCheckCurrentQuestion = useMemo(() => {
          if (!currentQuestion || !currentUserAnswer) {
               console.log('🔍 canCheckCurrentQuestion: false - missing question or answer', {
                    hasQuestion: !!currentQuestion,
                    hasUserAnswer: !!currentUserAnswer
               });
               return false;
          }

          const answer = currentUserAnswer.answer;

          // Single answer questions
          if (currentQuestion.answers && currentQuestion.answers.length > 0) {
               const canCheck = !!answer;
               console.log('🔍 canCheckCurrentQuestion (single): ', {
                    canCheck,
                    hasAnswer: !!answer,
                    questionType: currentQuestion.type
               });
               return canCheck;
          }

          // Multi sub-questions (CONVERSATION_PIECE, READ_AND_UNDERSTAND)
          if (currentQuestion.questions && currentQuestion.questions.length > 0) {
               if (!answer || typeof answer !== 'object') {
                    console.log('🔍 canCheckCurrentQuestion (multi): false - no answer object');
                    return false;
               }
               const requiredCount = currentQuestion.questions.length;
               const answeredCount = Object.keys(answer).length;
               const canCheck = answeredCount === requiredCount;
               console.log('🔍 canCheckCurrentQuestion (multi): ', {
                    canCheck,
                    requiredCount,
                    answeredCount,
                    questionType: currentQuestion.type
               });
               return canCheck;
          }

          console.log('🔍 canCheckCurrentQuestion: false - unknown question structure');
          return false;
     }, [currentQuestion, currentUserAnswer]);

     // ✅ NEW: Check xem đã check hết tất cả câu hỏi chưa
     const allQuestionsChecked = useMemo(() => {
          return config.questions.every(question => checkedQuestions.has(question._id));
     }, [config.questions, checkedQuestions]);

     // ✅ NEW: Override canGoNext for lesson mode
     const lessonCanGoNext = useMemo(() => {
          if (config.mode !== 'LESSON') return canGoNext;

          // Lesson mode: cần check trước khi next
          if (isLastQuestion) return false;
          if (!currentQuestion) return false;

          return isCurrentQuestionChecked;
     }, [config.mode, canGoNext, isLastQuestion, currentQuestion, isCurrentQuestionChecked]);

     // ============================================================================
     // EVENT HANDLERS
     // ============================================================================

     // Handle answer từ QuestionRenderer
     const handleAnswer = React.useCallback((answer: any) => {
          if (currentQuestion) {
               saveAnswer(answer);
          }
     }, [currentQuestion, saveAnswer]);

     // ✅ NEW: Handle check câu trả lời cho lesson mode
     const handleCheckAnswer = React.useCallback(() => {
          if (!currentQuestion || !canCheckCurrentQuestion || config.mode !== 'LESSON') {
               return;
          }

          // Mark question as checked
          setCheckedQuestions(prev => new Set([...prev, currentQuestion._id]));

          console.log('✅ Question checked:', currentQuestion._id);
     }, [currentQuestion, canCheckCurrentQuestion, config.mode]);

     // Handle submit session
     const handleSubmit = React.useCallback(async () => {
          try {
               const result = await submitSession();
               console.log('✅ Session completed:', result);
               config.onComplete?.(result);
          } catch (error) {
               console.error('❌ Error submitting session:', error);
               Alert.alert('Lỗi', 'Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
          }
     }, [submitSession, config]);

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
               {/* Simple Header */}
               <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>
                         {config.mode === 'LESSON' ? 'Bài học' : 'Bài thi'} -
                         Câu {currentIndex + 1}/{config.questions.length}
                    </Text>
                    <Text style={styles.progressText}>
                         Tiến độ: {Math.round(progress.percentage)}%
                    </Text>
               </View>

               {/* Main content area */}
               <View style={styles.contentContainer}>
                    {/* ✅ NEW: Progress indicator for lesson */}
                    {config.mode === 'LESSON' && (
                         <View style={styles.progressIndicator}>
                              <Text style={styles.progressText}>
                                   Đã kiểm tra: {checkedQuestions.size}/{config.questions.length} câu
                              </Text>
                              {checkedQuestions.size < config.questions.length && (
                                   <Text style={styles.remainingText}>
                                        Còn {config.questions.length - checkedQuestions.size} câu chưa kiểm tra
                                   </Text>
                              )}
                         </View>
                    )}

                    {/* Question Renderer - reuse existing component */}
                    <QuestionRenderer
                         question={currentQuestion}
                         userAnswer={currentUserAnswer?.answer}
                         onAnswer={handleAnswer}
                         isReview={config.mode === 'LESSON' ? isCurrentQuestionChecked : false}
                    />
               </View>

               {/* Navigation Controls */}
               <View style={styles.controlsContainer}>
                    {/* ✅ NEW: Lesson mode - Show check button or navigate buttons */}
                    {config.mode === 'LESSON' ? (
                         <View style={styles.lessonControlsContainer}>
                              {/* ✅ UPDATED: Show different buttons based on state */}
                              {(() => {
                                   console.log('🔍 Button render decision:', {
                                        isCurrentQuestionChecked,
                                        allQuestionsChecked,
                                        canCheckCurrentQuestion
                                   });
                                   return null;
                              })()}
                              {!isCurrentQuestionChecked ? (
                                   /* Check Answer Button (when current question not checked yet) */
                                   <TouchableOpacity
                                        style={[styles.checkButton, !canCheckCurrentQuestion && styles.disabledButton]}
                                        onPress={handleCheckAnswer}
                                        disabled={!canCheckCurrentQuestion}
                                   >
                                        <Text style={[styles.checkButtonText, !canCheckCurrentQuestion && styles.disabledButtonText]}>
                                             Kiểm tra
                                        </Text>
                                   </TouchableOpacity>
                              ) : !allQuestionsChecked ? (
                                   /* Navigation buttons when not all questions checked */
                                   <View style={styles.navigationRow}>
                                        <TouchableOpacity
                                             style={[styles.navButton, !canGoPrevious && styles.disabledButton]}
                                             onPress={goPrevious}
                                             disabled={!canGoPrevious}
                                        >
                                             <Text style={[styles.navButtonText, !canGoPrevious && styles.disabledButtonText]}>
                                                  ← Trước
                                             </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                             style={[styles.navButton, !lessonCanGoNext && styles.disabledButton]}
                                             onPress={goNext}
                                             disabled={!lessonCanGoNext}
                                        >
                                             <Text style={[styles.navButtonText, !lessonCanGoNext && styles.disabledButtonText]}>
                                                  Tiếp →
                                             </Text>
                                        </TouchableOpacity>
                                   </View>
                              ) : (
                                   /* Submit button when all questions checked */
                                   <View style={styles.navigationRow}>
                                        <TouchableOpacity
                                             style={[styles.navButton, !canGoPrevious && styles.disabledButton]}
                                             onPress={goPrevious}
                                             disabled={!canGoPrevious}
                                        >
                                             <Text style={[styles.navButtonText, !canGoPrevious && styles.disabledButtonText]}>
                                                  ← Trước
                                             </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                             style={styles.submitButton}
                                             onPress={handleSubmit}
                                        >
                                             <Text style={styles.submitButtonText}>
                                                  Hoàn thành bài học
                                             </Text>
                                        </TouchableOpacity>
                                   </View>
                              )}
                         </View>
                    ) : (
                         /* Test mode - Original navigation */
                         <View style={styles.navigationRow}>
                              <TouchableOpacity
                                   style={[styles.navButton, !canGoPrevious && styles.disabledButton]}
                                   onPress={goPrevious}
                                   disabled={!canGoPrevious}
                              >
                                   <Text style={[styles.navButtonText, !canGoPrevious && styles.disabledButtonText]}>
                                        ← Trước
                                   </Text>
                              </TouchableOpacity>

                              {isLastQuestion ? (
                                   <TouchableOpacity
                                        style={styles.submitButton}
                                        onPress={handleSubmit}
                                   >
                                        <Text style={styles.submitButtonText}>
                                             Nộp bài
                                        </Text>
                                   </TouchableOpacity>
                              ) : (
                                   <TouchableOpacity
                                        style={[styles.navButton, !canGoNext && styles.disabledButton]}
                                        onPress={goNext}
                                        disabled={!canGoNext}
                                   >
                                        <Text style={[styles.navButtonText, !canGoNext && styles.disabledButtonText]}>
                                             Tiếp →
                                        </Text>
                                   </TouchableOpacity>
                              )}
                         </View>
                    )}
               </View>
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

     headerContainer: {
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          backgroundColor: '#f8f9fa',
     },

     headerText: {
          fontSize: 18,
          fontWeight: '600',
          color: '#333',
          marginBottom: 4,
     },

     progressText: {
          fontSize: 14,
          color: '#666',
     },

     contentContainer: {
          flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 8,
     },

     progressIndicator: {
          backgroundColor: '#f0f8ff',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: '#2196f3',
     },

     remainingText: {
          fontSize: 12,
          color: '#666',
          marginTop: 4,
          fontStyle: 'italic',
     },

     controlsContainer: {
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          backgroundColor: '#f8f9fa',
     },

     lessonControlsContainer: {
          flex: 1,
     },

     navigationRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
     },

     checkButton: {
          backgroundColor: '#4CAF50',
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
     },

     checkButtonText: {
          fontSize: 16,
          fontWeight: '600',
          color: '#ffffff',
     },

     navButton: {
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 8,
          backgroundColor: '#007AFF',
          minWidth: 100,
          alignItems: 'center',
     },

     disabledButton: {
          backgroundColor: '#ccc',
     },

     navButtonText: {
          color: 'white',
          fontSize: 16,
          fontWeight: '600',
     },

     disabledButtonText: {
          color: '#999',
     },

     submitButton: {
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
          backgroundColor: '#28a745',
          alignItems: 'center',
     },

     submitButtonText: {
          color: 'white',
          fontSize: 16,
          fontWeight: '600',
     },
});

// ============================================================================
// EXPORTS
// ============================================================================

export default QuestionSession;

// Export with default config helpers
export const LessonSession: React.FC<Omit<QuestionSessionProps, 'config'> & {
     questions: any[],
     overrides?: Partial<any>
}> = ({ questions, overrides, ...props }) => {
     const config = useMemo(() =>
          createSessionConfig('LESSON', questions, overrides),
          [questions, overrides]
     );

     return <QuestionSession config={config} {...props} />;
};

export const TestSession: React.FC<Omit<QuestionSessionProps, 'config'> & {
     questions: any[],
     timeLimit: number,
     overrides?: Partial<any>
}> = ({ questions, timeLimit, overrides, ...props }) => {
     const config = useMemo(() =>
          createSessionConfig('FINAL_TEST', questions, { timeLimit, ...overrides }),
          [questions, timeLimit, overrides]
     );

     return <QuestionSession config={config} {...props} />;
}; 