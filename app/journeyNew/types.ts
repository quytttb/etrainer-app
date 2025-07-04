// Type definitions for Journey New

export interface JourneyNewOverview {
     id: string;
     title: string;
     description: string;
     progress: number; // 0-100
     totalStages: number;
     currentStage: number;
     status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
     // ✅ ADDED: Fields from backend schema
     currentStageIndex: number;
     completionRate: number;
     completedDays: number;
     totalDays: number;
     user?: string; // User ObjectId
     startedAt?: Date;
     completedAt?: Date;
     createdAt?: Date;
     updatedAt?: Date;
     noJourneyFound?: boolean; // Flag to indicate no journey exists
}

export interface JourneyNewStage {
     id: string;
     stageNumber: number;
     title: string;
     description: string;
     minScore: number;
     targetScore: number;
     lessons: JourneyNewLesson[];
     tests: JourneyNewTest[];
     finalExam?: JourneyNewFinalExam;
     status: 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED';
     progress: number; // 0-100
     // ✅ ADDED: Fields from backend schema
     stageId: string; // ObjectId reference to stages collection
     days: JourneyNewDay[];
     finalTest: JourneyNewFinalTest;
     started: boolean;
     startedAt?: Date;
     state: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
     completedAt?: Date;
}

export interface JourneyNewDay {
     dayNumber: number;
     started: boolean;
     completed: boolean;
     startedAt?: Date;
     questions: string[]; // ObjectId references to questions
}

export interface JourneyNewFinalTest {
     unlocked: boolean;
     started: boolean;
     completed: boolean;
     startedAt?: Date;
     completedAt?: Date;
     score?: number;
     passed: boolean;
}

export interface JourneyNewLesson {
     id: string;
     lessonNumber: number;
     title: string;
     type: 'VOCABULARY' | 'GRAMMAR' | 'LISTENING' | 'READING' | 'PRACTICE';
     duration: number; // in minutes
     questions: JourneyNewQuestion[];
     status: 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED';
     score?: number;
}

export interface JourneyNewTest {
     id: string;
     testNumber: number;
     title: string;
     duration: number; // in minutes
     totalQuestions: number;
     questions: JourneyNewQuestion[];
     status: 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED';
     score?: number;
     passed?: boolean;
}

export interface JourneyNewFinalExam {
     id: string;
     title: string;
     duration: number; // in minutes
     totalQuestions: number;
     minScore: number;
     targetScore: number;
     questions: JourneyNewQuestion[];
     status: 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED';
     score?: number;
     passed?: boolean;
}

export interface JourneyNewQuestion {
     id: string;
     questionNumber: number;
     type: 'IMAGE_DESCRIPTION' | 'ASK_AND_ANSWER' | 'CONVERSATION_PIECE' | 'SHORT_TALK' |
     'FILL_IN_THE_BLANK_QUESTION' | 'FILL_IN_THE_PARAGRAPH' | 'READ_AND_UNDERSTAND' |
     'STAGE_FINAL_TEST' | 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK' | 'LISTENING' | 'READING';
     question?: string;
     audio?: {
          name: string;
          url: string;
     };
     imageUrl?: string;
     answers?: Array<{
          answer: string;
          isCorrect: boolean;
          _id: string;
     }>;
     questions?: Array<{
          question: string;
          answers: Array<{
               answer: string;
               isCorrect: boolean;
               _id: string;
          }>;
          _id: string;
     }>;
     subtitle?: string;
     options?: string[];
     correctAnswer?: string;
     explanation?: string;
     audioUrl?: string;
     userAnswer?: string;
     isCorrect?: boolean;
}

export interface JourneyNewProgress {
     journeyId: string;
     currentStageId: string;
     completedLessons: string[];
     completedTests: string[];
     overallProgress: number; // 0-100
     totalScore: number;
     lastActivityAt: string;
}

export interface JourneyNewResult {
     id: string;
     journeyId: string;
     stageId: string;
     lessonId?: string;
     testId?: string;
     examId?: string;
     score: number;
     totalQuestions: number;
     correctAnswers: number;
     passed: boolean;
     completedAt: string;
     timeTaken: number; // in seconds
}

// API Response types
export interface JourneyNewApiResponse<T> {
     success: boolean;
     data: T;
     message?: string;
     error?: string;
}

export type JourneyNewOverviewResponse = JourneyNewApiResponse<JourneyNewOverview>;
export type JourneyNewStagesResponse = JourneyNewApiResponse<JourneyNewStage[]>;
export type JourneyNewLessonsResponse = JourneyNewApiResponse<JourneyNewLesson[]>;
export type JourneyNewTestsResponse = JourneyNewApiResponse<JourneyNewTest[]>;
export type JourneyNewResultResponse = JourneyNewApiResponse<JourneyNewResult>;

// Test Interface Types (Phase 4A)
export interface TestResults {
     answers: Record<string, any[]>;
     timeSpent: number;
     completedAt: string;
     score?: number;
}

// Question status for navigation
export type QuestionStatus = "answered" | "current" | "unanswered";

// Test timer states
export interface TimerState {
     timeRemaining: number;
     isPaused: boolean;
     totalTime: number;
}

// Reexport commonly used types with shorter names
export type Question = JourneyNewQuestion;
export type Answer = { answer: string; isCorrect: boolean; _id: string; };

// ✅ Fix React Navigation warning - add default export
export default {}; 