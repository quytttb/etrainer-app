import { useCallback, useMemo } from 'react';
import {
     ProgressData,
     QuestionStatus,
     UseProgressReturn,
     Question,
     UserAnswer
} from '../types';

/**
 * Hook chuyên biệt để quản lý progress tracking và analytics
 * Cung cấp thông tin chi tiết về tiến độ session
 */
export const useProgress = (
     questions: Question[],
     userAnswers: Record<string, UserAnswer>,
     currentIndex: number
): UseProgressReturn => {
     // ============================================================================
     // COMPUTED PROGRESS DATA
     // ============================================================================

     // Tính toán progress data chính
     const progress = useMemo<ProgressData>(() => {
          const totalQuestions = questions.length;
          const answeredCount = Object.keys(userAnswers).length;

          return {
               currentIndex,
               totalQuestions,
               answeredCount,
               percentage: totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0,
               questionsRemaining: totalQuestions - answeredCount,
               estimatedTimeRemaining: undefined // Được tính ở level cao hơn
          };
     }, [questions.length, userAnswers, currentIndex]);

     // ============================================================================
     // UTILITY FUNCTIONS
     // ============================================================================

     // Update progress (được gọi khi có thay đổi)
     const updateProgress = useCallback(() => {
          console.log('📊 Progress updated:', progress);
     }, [progress]);

     // Get status của một câu hỏi cụ thể
     const getQuestionStatus = useCallback((index: number): QuestionStatus => {
          if (index < 0 || index >= questions.length) {
               return 'unanswered';
          }

          if (index === currentIndex) {
               return 'current';
          }

          const question = questions[index];
          if (userAnswers[question._id]) {
               return 'answered';
          }

          return 'unanswered';
     }, [questions, currentIndex, userAnswers]);

     // Get số câu hỏi đã trả lời
     const getAnsweredCount = useCallback((): number => {
          return Object.keys(userAnswers).length;
     }, [userAnswers]);

     // Get phần trăm hoàn thành
     const getCompletionPercentage = useCallback((): number => {
          const totalQuestions = questions.length;
          const answeredCount = Object.keys(userAnswers).length;

          return totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
     }, [questions.length, userAnswers]);

     // ============================================================================
     // RETURN HOOK INTERFACE
     // ============================================================================

     return {
          progress,
          updateProgress,
          getQuestionStatus,
          getAnsweredCount,
          getCompletionPercentage
     };
};

export default useProgress;