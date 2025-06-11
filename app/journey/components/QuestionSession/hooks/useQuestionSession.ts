import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
     QuestionSessionConfig,
     Question,
     UserAnswer,
     SessionStateData,
     SessionState,
     ProgressData,
     TimerState,
     SessionResult,
     QuestionStatus,
     UseQuestionSessionReturn,
     LESSON_TYPE,
     validateSessionConfig
} from '../types';

/**
 * Hook chính để quản lý toàn bộ logic của QuestionSession
 * Xử lý state management, navigation, answers, và session lifecycle
 */
export const useQuestionSession = (config: QuestionSessionConfig): UseQuestionSessionReturn => {
     // ============================================================================
     // VALIDATION & INITIALIZATION
     // ============================================================================

     // Validate config khi khởi tạo
     const configErrors = useMemo(() => validateSessionConfig(config), [config]);

     if (configErrors.length > 0) {
          console.error('❌ QuestionSession config errors:', configErrors);
          throw new Error(`Invalid session config: ${configErrors.join(', ')}`);
     }

     // ============================================================================
     // CORE STATE MANAGEMENT
     // ============================================================================

     // Ref để lưu submitSession function tránh dependency cycle
     const submitSessionRef = useRef<(() => Promise<SessionResult>) | null>(null);

     // Current question index (0-based)
     const [currentIndex, setCurrentIndex] = useState<number>(0);

     // User answers cho tất cả câu hỏi
     const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({});

     // Session state tổng thể
     const [sessionState, setSessionState] = useState<SessionState>('NOT_STARTED');

     // Thời gian bắt đầu session
     const [startTime, setStartTime] = useState<number | null>(null);

     // Thời gian tạm dừng tích lũy
     const [pausedTime, setPausedTime] = useState<number>(0);

     // Timer state cho test mode
     const [timerState, setTimerState] = useState<TimerState>({
          totalTime: config.timeLimit || 0,
          timeRemaining: config.timeLimit || 0,
          timeElapsed: 0,
          isPaused: false,
          isActive: false,
          warnings: []
     });

     // ============================================================================
     // COMPUTED VALUES
     // ============================================================================

     // Current question object
     const currentQuestion = useMemo<Question | null>(() => {
          if (currentIndex >= 0 && currentIndex < config.questions.length) {
               return config.questions[currentIndex];
          }
          return null;
     }, [currentIndex, config.questions]);

     // Check xem có phải câu hỏi cuối không
     const isLastQuestion = useMemo(() => {
          return currentIndex === config.questions.length - 1;
     }, [currentIndex, config.questions.length]);

     // Check xem có thể đi tiếp không
     const canGoNext = useMemo(() => {
          // Lesson mode: cần có answer để đi tiếp, nhưng disable ở câu cuối
          if (config.mode === 'LESSON') {
               if (isLastQuestion) return false; // Disable nút "tiếp" ở câu cuối

               if (!currentQuestion || !userAnswers[currentQuestion._id]) {
                    return false;
               }

               // ✅ FIX: Check đủ answers cho multi-sub questions
               const userAnswer = userAnswers[currentQuestion._id].answer;

               // ✅ FIX: For CONVERSATION_PIECE và READ_AND_UNDERSTAND: check đủ sub-questions with proper key validation
               if (currentQuestion.type === 'CONVERSATION_PIECE' || currentQuestion.type === 'READ_AND_UNDERSTAND') {
                    if (currentQuestion.questions && currentQuestion.questions.length > 0) {
                         const requiredQuestions = currentQuestion.questions.length;
                         const answeredQuestions = currentQuestion.questions.filter(subQ =>
                              userAnswer && userAnswer[subQ._id]
                         ).length;
                         console.log(`🔍 Multi-sub validation: type=${currentQuestion.type}, required=${requiredQuestions}, answered=${answeredQuestions}, userAnswer=`, userAnswer);
                         return answeredQuestions === requiredQuestions;
                    }
               }

               // For other question types: just check có answer
               return true;
          }

          // Test mode: luôn có thể đi tiếp
          return !isLastQuestion;
     }, [config.mode, currentQuestion, userAnswers, isLastQuestion]);

     // Check xem có thể đi lùi không
     const canGoPrevious = useMemo(() => {
          if (!config.enablePrevious) return false;
          return currentIndex > 0;
     }, [currentIndex, config.enablePrevious]);

     // Tính progress data
     const progress = useMemo<ProgressData>(() => {
          const totalQuestions = config.questions.length;
          const answeredCount = Object.keys(userAnswers).length;

          return {
               currentIndex,
               totalQuestions,
               answeredCount,
               percentage: totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0,
               questionsRemaining: totalQuestions - answeredCount,
               estimatedTimeRemaining: config.timeLimit ?
                    Math.max(0, timerState.timeRemaining) : undefined
          };
     }, [currentIndex, config.questions.length, userAnswers, config.timeLimit, timerState.timeRemaining]);

     // Tính question statuses cho navigation
     const questionStatuses = useMemo<QuestionStatus[]>(() => {
          return config.questions.map((question, index) => {
               if (index === currentIndex) return 'current';
               if (userAnswers[question._id]) return 'answered';
               return 'unanswered';
          });
     }, [config.questions, currentIndex, userAnswers]);

     // Check xem session đã hoàn thành chưa
     const isSessionComplete = useMemo(() => {
          return sessionState === 'COMPLETED' || sessionState === 'SUBMITTED';
     }, [sessionState]);

     // Tạo session state data object
     const sessionStateData = useMemo<SessionStateData>(() => ({
          state: sessionState,
          currentQuestionIndex: currentIndex,
          userAnswers,
          startTime: startTime || 0,
          pausedTime,
          timerState,
          progress
     }), [sessionState, currentIndex, userAnswers, startTime, pausedTime, timerState, progress]);

     // ============================================================================
     // SESSION LIFECYCLE MANAGEMENT
     // ============================================================================

     // Khởi tạo session khi component mount
     useEffect(() => {
          if (sessionState === 'NOT_STARTED') {
               setSessionState('IN_PROGRESS');
               setStartTime(Date.now());

               // Khởi động timer cho test mode
               if (config.mode === 'FINAL_TEST' && config.timeLimit) {
                    setTimerState(prev => ({
                         ...prev,
                         isActive: true,
                         isPaused: false
                    }));
               }

               console.log(`🚀 Session started: ${config.mode} with ${config.questions.length} questions`);
          }
     }, [sessionState, config.mode, config.timeLimit, config.questions.length]);

     // Auto-submit sẽ được định nghĩa sau submitSession function

     // Timer countdown effect (chỉ cho test mode)
     useEffect(() => {
          if (config.mode !== 'FINAL_TEST' || !timerState.isActive || timerState.isPaused) {
               return;
          }

          const interval = setInterval(() => {
               setTimerState(prev => {
                    const newTimeRemaining = Math.max(0, prev.timeRemaining - 1000);
                    const newTimeElapsed = prev.totalTime - newTimeRemaining;

                    // Check warnings
                    const newWarnings = [...prev.warnings];
                    if (config.warningThresholds) {
                         config.warningThresholds.forEach(threshold => {
                              if (newTimeRemaining <= threshold && !newWarnings.includes(threshold)) {
                                   newWarnings.push(threshold);
                                   config.onTimeWarning?.(newTimeRemaining);
                              }
                         });
                    }

                    // Auto submit khi hết time
                    if (newTimeRemaining <= 0 && config.autoSubmitOnTimeout && submitSessionRef.current) {
                         console.log('⏰ Time is up! Auto-submitting session...');
                         // Wrap trong setTimeout để tránh setState trong render
                         setTimeout(() => {
                              submitSessionRef.current?.().catch(error => {
                                   console.error('❌ Failed to auto-submit on timeout:', error);
                              });
                         }, 50);
                    }

                    return {
                         ...prev,
                         timeRemaining: newTimeRemaining,
                         timeElapsed: newTimeElapsed,
                         warnings: newWarnings
                    };
               });
          }, 1000);

          return () => clearInterval(interval);
     }, [timerState.isActive, timerState.isPaused, config.mode, config.warningThresholds, config.autoSubmitOnTimeout, config.onTimeWarning]);

     // ============================================================================
     // NAVIGATION FUNCTIONS
     // ============================================================================

     // Đi đến câu hỏi cụ thể (chỉ test mode hoặc đã answer)
     const goToQuestion = useCallback((index: number) => {
          if (index < 0 || index >= config.questions.length) {
               console.warn(`⚠️ Invalid question index: ${index}`);
               return;
          }

          // Test mode: cho phép jump freely
          if (config.mode === 'FINAL_TEST' && config.allowJumpNavigation) {
               setCurrentIndex(index);
               config.onQuestionChange?.(index, config.questions[index]);
               return;
          }

          // Lesson mode: chỉ cho phép jump đến câu đã answered
          if (config.mode === 'LESSON') {
               const targetQuestion = config.questions[index];
               if (userAnswers[targetQuestion._id] || index <= currentIndex) {
                    setCurrentIndex(index);
                    config.onQuestionChange?.(index, config.questions[index]);
               } else {
                    console.warn(`⚠️ Cannot jump to unanswered question in lesson mode: ${index}`);
               }
          }
     }, [config, currentIndex, userAnswers]);

     // Đi đến câu hỏi tiếp theo
     const goNext = useCallback(async () => {
          if (!canGoNext) {
               console.warn('⚠️ Cannot go to next question');
               return;
          }

          // ✅ FIX: Stop all audio when navigating to next question
          try {
               if (typeof (global as any).AudioManager?.stopAllAudio === 'function') {
                    console.log('🎵 Stopping all audio before next question...');
                    (global as any).AudioManager.stopAllAudio();
               }
          } catch (error) {
               console.warn('⚠️ Failed to stop audio:', error);
          }

          const nextIndex = currentIndex + 1;

          if (isLastQuestion) {
               // Câu hỏi cuối: auto-submit cho lesson mode, chuyển sang completed cho test mode
               if (config.mode === 'LESSON') {
                    console.log('✅ Lesson completed - auto-submitting...');
                    setSessionState('COMPLETED');
                    // Will trigger submission in useEffect
               } else {
                    setSessionState('COMPLETED');
                    console.log('✅ Test session completed - reached last question');
               }
          } else {
               setCurrentIndex(nextIndex);
               config.onQuestionChange?.(nextIndex, config.questions[nextIndex]);
          }
     }, [canGoNext, currentIndex, isLastQuestion, config]);

     // Đi về câu hỏi trước
     const goPrevious = useCallback(() => {
          if (!canGoPrevious) {
               console.warn('⚠️ Cannot go to previous question');
               return;
          }

          const prevIndex = currentIndex - 1;
          setCurrentIndex(prevIndex);
          config.onQuestionChange?.(prevIndex, config.questions[prevIndex]);
     }, [canGoPrevious, currentIndex, config]);

     // ============================================================================
     // ANSWER MANAGEMENT
     // ============================================================================

     // Lưu answer cho câu hỏi hiện tại
     const saveAnswer = useCallback((answer: any) => {
          if (!currentQuestion) {
               console.warn('⚠️ No current question to save answer for');
               return;
          }

          const userAnswer: UserAnswer = {
               questionId: currentQuestion._id,
               answer,
               timestamp: Date.now(),
               timeSpent: startTime ? Date.now() - startTime : 0
          };

          setUserAnswers(prev => ({
               ...prev,
               [currentQuestion._id]: userAnswer
          }));

          // Auto-save cho lesson mode
          if (config.autoSaveProgress) {
               config.onAnswer?.(currentQuestion._id, userAnswer);
          }

          console.log(`💾 Answer saved for question ${currentQuestion._id}:`, answer);
     }, [currentQuestion, startTime, config]);

     // ============================================================================
     // SESSION CONTROL FUNCTIONS
     // ============================================================================

     // Tạm dừng session (chỉ test mode)
     const pauseSession = useCallback(() => {
          if (config.mode !== 'FINAL_TEST' || !config.enablePause) {
               console.warn('⚠️ Pause not available in current mode');
               return;
          }

          setSessionState('PAUSED');
          setTimerState(prev => ({ ...prev, isPaused: true }));
          config.onPause?.();

          console.log('⏸️ Session paused');
     }, [config]);

     // Tiếp tục session
     const resumeSession = useCallback(() => {
          if (sessionState !== 'PAUSED') {
               console.warn('⚠️ Session is not paused');
               return;
          }

          setSessionState('IN_PROGRESS');
          setTimerState(prev => ({ ...prev, isPaused: false }));
          config.onResume?.();

          console.log('▶️ Session resumed');
     }, [sessionState, config]);

     // Thoát session
     const exitSession = useCallback(() => {
          setSessionState('NOT_STARTED');
          setCurrentIndex(0);
          setUserAnswers({});
          setStartTime(null);
          setPausedTime(0);
          setTimerState({
               totalTime: config.timeLimit || 0,
               timeRemaining: config.timeLimit || 0,
               timeElapsed: 0,
               isPaused: false,
               isActive: false,
               warnings: []
          });

          config.onExit?.();
          console.log('🚪 Session exited');
     }, [config]);

     // ============================================================================
     // SESSION SUBMISSION
     // ============================================================================

     // Submit session và tính toán kết quả
     const submitSession = useCallback(async (): Promise<SessionResult> => {
          if (sessionState === 'SUBMITTED') {
               throw new Error('Session already submitted');
          }

          const endTime = Date.now();
          const totalTimeSpent = startTime ? endTime - startTime - pausedTime : 0;

          // Tính toán score
          let correctAnswers = 0;
          const questionStats = config.questions.map((question, index) => {
               const userAnswer = userAnswers[question._id];
               let isCorrect = false;

               if (userAnswer) {
                    // Logic tính toán correct answer dựa trên question type
                    isCorrect = calculateAnswerCorrectness(question, userAnswer.answer);
                    if (isCorrect) correctAnswers++;
               }

               return {
                    questionId: question._id,
                    questionType: question.type,
                    timeSpent: userAnswer?.timeSpent || 0,
                    attempts: 1, // TODO: implement retry tracking
                    isCorrect,
                    difficulty: 'MEDIUM' as const // TODO: implement difficulty calculation
               };
          });

          const accuracy = config.questions.length > 0 ?
               (correctAnswers / config.questions.length) * 100 : 0;

          const sessionResult: SessionResult = {
               sessionId: `session_${Date.now()}`,
               mode: config.mode,
               completedAt: new Date(endTime).toISOString(),
               totalTimeSpent,
               timePerQuestion: questionStats.map(stat => stat.timeSpent),
               startTime: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
               endTime: new Date(endTime).toISOString(),
               userAnswers: Object.values(userAnswers),
               totalQuestions: config.questions.length,
               answeredQuestions: Object.keys(userAnswers).length,
               correctAnswers,
               score: accuracy,
               accuracy,
               passed: config.mode === 'FINAL_TEST' ? accuracy >= 50 : undefined, // 50% pass threshold as required
               questionStats,
               sessionStats: {
                    averageTimePerQuestion: totalTimeSpent / config.questions.length,
                    fastestQuestion: Math.min(...questionStats.map(s => s.timeSpent)),
                    slowestQuestion: Math.max(...questionStats.map(s => s.timeSpent)),
                    accuracyByType: calculateAccuracyByType(questionStats),
                    completionRate: (Object.keys(userAnswers).length / config.questions.length) * 100,
                    engagementScore: Math.min(100, (totalTimeSpent / (config.timeLimit || totalTimeSpent)) * 100)
               }
          };

          setSessionState('SUBMITTED');
          // Note: onComplete được gọi từ QuestionSessionEnhanced.handleSessionComplete
          // để tránh duplicate calls

          console.log('✅ Session submitted successfully:', sessionResult);
          return sessionResult;
     }, [sessionState, startTime, pausedTime, userAnswers, config]);

     // ============================================================================
     // HELPER FUNCTIONS
     // ============================================================================

     // Tính toán correctness của answer dựa trên question type
     const calculateAnswerCorrectness = (question: Question, userAnswer: any): boolean => {
          switch (question.type) {
               case LESSON_TYPE.IMAGE_DESCRIPTION:
               case LESSON_TYPE.ASK_AND_ANSWER:
                    // ✅ FIX: Single choice questions - compare by answer ID (frontend sends answer._id)
                    if (question.answers) {
                         return question.answers.some(ans => ans.isCorrect && ans._id === userAnswer);
                    }
                    return false;

               case LESSON_TYPE.SHORT_TALK:
                    // ✅ FIX: SHORT_TALK uses questions array, not answers array
                    if (question.questions && userAnswer && typeof userAnswer === 'object') {
                         let correctCount = 0;
                         let totalQuestions = question.questions.length;

                         console.log(`🔍 Scoring SHORT_TALK: totalQuestions=${totalQuestions}, userAnswer=`, userAnswer);

                         for (const subQ of question.questions) {
                              const userSubAnswer = userAnswer[subQ._id];

                              if (userSubAnswer && subQ.answers) {
                                   // Compare by answer ID for sub-questions
                                   const isCorrect = subQ.answers.some(ans => ans.isCorrect && ans._id === userSubAnswer);
                                   if (isCorrect) correctCount++;
                                   console.log(`  Sub-Q ${subQ._id}: user="${userSubAnswer}", correct=${isCorrect}`);
                              } else {
                                   console.log(`  Sub-Q ${subQ._id}: No answer provided, userSubAnswer=${userSubAnswer}`);
                              }
                         }

                         const allCorrect = correctCount === totalQuestions;
                         console.log(`  Final: ${correctCount}/${totalQuestions} correct, allCorrect=${allCorrect}`);
                         return allCorrect;
                    }
                    return false;

               case LESSON_TYPE.CONVERSATION_PIECE:
               case LESSON_TYPE.READ_AND_UNDERSTAND:
                    // ✅ FIX: Multiple sub-questions - use subQuestion._id as key
                    if (question.questions && userAnswer && typeof userAnswer === 'object') {
                         let correctCount = 0;
                         let totalQuestions = question.questions.length;

                         console.log(`🔍 Scoring ${question.type}: totalQuestions=${totalQuestions}, userAnswer=`, userAnswer);

                         for (const subQ of question.questions) {
                              // ✅ FIX: Use subQuestion._id as key instead of index
                              const userSubAnswer = userAnswer[subQ._id];

                              if (userSubAnswer && subQ.answers) {
                                   // ✅ FIX: Compare by answer ID for sub-questions too
                                   const isCorrect = subQ.answers.some(ans => ans.isCorrect && ans._id === userSubAnswer);
                                   if (isCorrect) correctCount++;
                                   console.log(`  Sub-Q ${subQ._id}: user="${userSubAnswer}", correct=${isCorrect}`);
                              } else {
                                   console.log(`  Sub-Q ${subQ._id}: No answer provided, userSubAnswer=${userSubAnswer}`);
                              }
                         }

                         const allCorrect = correctCount === totalQuestions;
                         console.log(`  Final: ${correctCount}/${totalQuestions} correct, allCorrect=${allCorrect}`);
                         return allCorrect;
                    }
                    return false;

               case LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION:
                    // ✅ FIX: Compare by answer ID, not text (frontend sends answer._id)
                    if (question.answers) {
                         const correctAnswer = question.answers.find(ans => ans.isCorrect);
                         // Frontend sends answer ID, so compare with _id field
                         return correctAnswer?._id === userAnswer;
                    }
                    return false;

               case LESSON_TYPE.FILL_IN_THE_PARAGRAPH:
                    // ✅ FIX: FILL_IN_THE_PARAGRAPH uses questions array, not answers array
                    if (question.questions && userAnswer && typeof userAnswer === 'object') {
                         let correctCount = 0;
                         let totalQuestions = question.questions.length;

                         console.log(`🔍 Scoring FILL_IN_THE_PARAGRAPH: totalQuestions=${totalQuestions}, userAnswer=`, userAnswer);

                         for (const subQ of question.questions) {
                              const userSubAnswer = userAnswer[subQ._id];

                              if (userSubAnswer && subQ.answers) {
                                   // Compare by answer ID for sub-questions
                                   const isCorrect = subQ.answers.some(ans => ans.isCorrect && ans._id === userSubAnswer);
                                   if (isCorrect) correctCount++;
                                   console.log(`  Sub-Q ${subQ._id}: user="${userSubAnswer}", correct=${isCorrect}`);
                              } else {
                                   console.log(`  Sub-Q ${subQ._id}: No answer provided, userSubAnswer=${userSubAnswer}`);
                              }
                         }

                         const allCorrect = correctCount === totalQuestions;
                         console.log(`  Final: ${correctCount}/${totalQuestions} correct, allCorrect=${allCorrect}`);
                         return allCorrect;
                    }
                    return false;

               default:
                    console.warn(`⚠️ Unknown question type for correctness calculation: ${question.type}`);
                    return false;
          }
     };

     // Tính accuracy theo từng loại câu hỏi
     const calculateAccuracyByType = (questionStats: any[]): Record<LESSON_TYPE, number> => {
          const result = {} as Record<LESSON_TYPE, number>;

          Object.values(LESSON_TYPE).forEach(type => {
               const typeStats = questionStats.filter(stat => stat.questionType === type);
               if (typeStats.length > 0) {
                    const correctCount = typeStats.filter(stat => stat.isCorrect).length;
                    result[type] = (correctCount / typeStats.length) * 100;
               } else {
                    result[type] = 0;
               }
          });

          return result;
     };

     // ============================================================================
     // AUTO-SUBMIT EFFECT (AFTER SUBMITSESSION DEFINITION)
     // ============================================================================

     // Cập nhật ref khi submitSession thay đổi
     useEffect(() => {
          submitSessionRef.current = submitSession;
     }, [submitSession]);

     // Auto-submit khi lesson completed  
     useEffect(() => {
          if (sessionState === 'COMPLETED' && config.mode === 'LESSON' && submitSessionRef.current) {
               console.log('✅ Lesson completed - auto-submitting...');
               // Wrap trong setTimeout để tránh setState trong render
               setTimeout(() => {
                    submitSessionRef.current?.().catch(error => {
                         console.error('❌ Failed to submit lesson:', error);
                    });
               }, 100);
          }
     }, [sessionState, config.mode]);

     // ============================================================================
     // RETURN HOOK INTERFACE
     // ============================================================================

     return {
          // State
          currentQuestion,
          currentIndex,
          userAnswers,
          sessionState: sessionStateData,
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
     };
};

export default useQuestionSession; 