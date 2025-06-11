import { ExpoRouter } from 'expo-router';

declare global {
     namespace ExpoRouter {
          export interface __routes {
               // Tab routes
               '/(tabs)/home': undefined;
               '/(tabs)/study-plan': undefined;
               '/(tabs)/journey-new': undefined;
               '/(tabs)/chatAI': undefined;
               '/(tabs)/exam': undefined;
               '/(tabs)/setting': undefined;
               '/(tabs)/mock-test': undefined;

               // Auth routes
               '/auth/login': undefined;
               '/auth/register': undefined;

               // App routes
               '/splash': undefined;
               '/onboarding': undefined;
               '/home': undefined;

               // Journey routes
               '/journeyStudy': undefined;
               '/journeyStudy/day-questions': undefined;
               '/journeyNew/overview': undefined;

               // Learning path routes
               '/learningPath': undefined;
               '/learningPath/dayDetailScreen': undefined;
               '/learningPath/introduce': undefined;
               '/learningPath/exam/[id]': { id: string };
               '/learningPath/result/[id]': { id: string };
               '/learningPath/lesson-detail/[id]': { id: string };

               // Exam routes
               '/exam': undefined;
               '/exam/[id]': { id: string };
               '/exam/detail/[examId]': { examId: string };
               '/exam/list/[partId]': { partId: string };
               '/exam/prepare/[id]': { id: string };
               '/exam/result/[id]': { id: string };
               '/exam/result/review/[id]': { id: string };
               '/exam/[id]/history': { id: string };

               // Practice routes
               '/practice': undefined;
               '/practice/result/[id]': { id: string };
               '/practice/result/review/[id]': { id: string };
               '/practice/history/[id]': { id: string };

               // Vocabulary routes
               '/vocabulary': undefined;
               '/vocabulary/detail/[id]': { id: string };
               '/vocabulary/flash-card/[id]': { id: string };
               '/vocabulary/graft/[id]': { id: string };
               '/vocabulary/select-words/[id]': { id: string };

               // Grammar routes
               '/grammar': undefined;
               '/grammar/detail/[id]': { id: string };

               // Question routes
               '/question': undefined;
               '/question/detail/[id]': { id: string };
               '/next-screen': undefined;

               // User routes
               '/user': undefined;
               '/profile': undefined;

               // Other routes
               '/notifis': undefined;
               '/saveQuestion': undefined;
               '/saveQuestion/favorite-detail': undefined;
               '/study-schedule': undefined;
               '/study-schedule/detail/[id]': { id: string };
               '/test-plan/[testId]': { testId: string };
               '/test-plan/detail/[id]': { id: string };
               '/reviewResults': undefined;
               '/list-fulltest/full-test': undefined;
               '/list-minitest/mini-test': undefined;
               '/F_result': undefined;
               '/T_result': undefined;
          }
     }
} 