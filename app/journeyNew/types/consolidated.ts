// Consolidated Types for Journey New
// This file consolidates all types from various contexts, hooks, and utils
// Use this file when you need to reference types across multiple modules

// Re-export core types from main types.ts
export type {
     JourneyNewOverview as Journey,
     JourneyNewStage as Stage,
     JourneyNewLesson as Lesson,
     JourneyNewTest as Test,
     JourneyNewFinalExam as FinalExam,
     JourneyNewQuestion as Question,
     JourneyNewProgress,
     JourneyNewResult,
     QuestionStatus,
     TimerState,
     TestResults
} from '../types';

// Re-export question types (avoiding conflicts)
export type {
     LESSON_TYPE,
     Answer as QuestionAnswer,
     SubQuestion,
     Question as QuestionType,
     QuestionProps,
     QuestionResult
} from './question';

// Context State Types
export interface AppQuestionState {
     questions: import('../types').JourneyNewQuestion[];
     currentQuestionIndex: number;
     currentQuestion: import('../types').JourneyNewQuestion | null;
     isLoading: boolean;
     error: string | null;
     totalQuestions: number;
     questionHistory: number[];
     bookmarkedQuestions: string[];
     difficulty: 'easy' | 'medium' | 'hard' | 'all';
     filter: {
          type?: string;
          hasAudio?: boolean;
          hasImage?: boolean;
     };
}

export interface AppAnswerState {
     answers: UserAnswer[];
     currentAnswer: UserAnswer | null;
     isLoading: boolean;
     error: string | null;
     totalScore: number;
     maxScore: number;
     timeSpent: number;
     lastSaved: string | null;
     isDirty: boolean;
     autoSave: boolean;
}

export interface AppReviewState {
     isReviewing: boolean;
     currentReviewIndex: number;
     reviewStats: ReviewStats | null;
     mistakes: QuestionMistake[];
     reviewQuestions: import('../types').JourneyNewQuestion[];
     reviewAnswers: UserAnswer[];
     showExplanations: boolean;
     showCorrectAnswers: boolean;
     filterByCorrect: 'all' | 'correct' | 'incorrect' | 'skipped';
     isLoading: boolean;
     error: string | null;
     reviewStartTime: string | null;
     reviewEndTime: string | null;
}

export interface AppProgressState {
     journeyProgress: JourneyProgressData | null;
     isLoading: boolean;
     error: string | null;
     autoSave: boolean;
     lastSaved: string | null;
     isDirty: boolean;
     syncStatus: 'synced' | 'pending' | 'failed';
}

// User Answer (distinct from Question Answer)
export interface UserAnswer {
     questionId: string;
     value: any;
     isCorrect?: boolean;
     score?: number;
     timeSpent?: number;
     timestamp?: string;
     attempts?: number;
}

// Review Types
export interface ReviewStats {
     totalQuestions: number;
     answeredQuestions: number;
     correctAnswers: number;
     incorrectAnswers: number;
     skippedQuestions: number;
     score: number;
     accuracy: number;
     timeSpent: number;
     averageTimePerQuestion: number;
     fastestQuestion: number;
     slowestQuestion: number;
     completedAt: string;
}

export interface QuestionMistake {
     questionId: string;
     question: import('../types').JourneyNewQuestion;
     userAnswer: any;
     correctAnswer: any;
     explanation?: string;
     category: string;
     difficulty: 'easy' | 'medium' | 'hard';
}

// Progress Types
export interface LessonProgress {
     lessonId: string;
     status: 'not_started' | 'in_progress' | 'completed';
     score: number;
     timeSpent: number;
     completedAt?: string;
     attempts: number;
}

export interface StageProgress {
     stageId: string;
     status: 'not_started' | 'in_progress' | 'completed';
     lessons: LessonProgress[];
     overallScore: number;
     timeSpent: number;
     completedAt?: string;
}

export interface JourneyProgressData {
     journeyId: string;
     status: 'not_started' | 'in_progress' | 'completed';
     stages: StageProgress[];
     currentStageId: string | null;
     currentLessonId: string | null;
     overallScore: number;
     timeSpent: number;
     completedAt?: string;
     lastActivity: string;
}

// Storage Types
export interface StoredUserProgress {
     userId: string;
     journeyId: string;
     currentStage: number;
     currentDay: number;
     currentLesson: number;
     completedLessons: string[];
     completedTests: string[];
     totalScore: number;
     timeSpent: number;
     lastActivity: string;
}

export interface StoredAnswer {
     questionId: string;
     answer: any;
     isCorrect: boolean;
     timestamp: string;
     timeSpent: number;
}

export interface UserSettings {
     audioEnabled: boolean;
     autoPlay: boolean;
     playbackSpeed: number;
     notifications: boolean;
     theme: 'light' | 'dark' | 'auto';
     language: string;
}

export interface TestResult {
     testId: string;
     score: number;
     totalQuestions: number;
     correctAnswers: number;
     timeSpent: number;
     completedAt: string;
     answers: StoredAnswer[];
}

export interface Bookmark {
     id: string;
     questionId: string;
     lessonId: string;
     note?: string;
     createdAt: string;
}

// Validation Types
export interface ValidationResult {
     isValid: boolean;
     errors: string[];
     warnings?: string[];
}

// Hook Return Types
export interface UseQuestionReturn {
     currentQuestion: import('../types').JourneyNewQuestion | null;
     currentIndex: number;
     totalQuestions: number;
     isFirstQuestion: boolean;
     isLastQuestion: boolean;
     goToNextQuestion: () => void;
     goToPreviousQuestion: () => void;
     goToQuestion: (index: number) => void;
     canNavigateToQuestion: (index: number) => boolean;
}

export interface UseAnswerReturn {
     answers: UserAnswer[];
     currentAnswer: UserAnswer | null;
     isAnswered: (questionId: string) => boolean;
     getAnswer: (questionId: string) => UserAnswer | null;
     setAnswer: (questionId: string, value: any) => void;
     removeAnswer: (questionId: string) => void;
     clearAnswers: () => void;
     calculateScore: () => number;
     validateAnswer: (questionId: string, value: any) => boolean;
}

export interface UseReviewReturn {
     stats: ReviewStats;
     isReviewing: boolean;
     startReview: () => void;
     endReview: () => void;
     getQuestionReview: (questionId: string) => {
          question: import('../types').JourneyNewQuestion;
          userAnswer: any;
          correctAnswer: any;
          isCorrect: boolean;
          explanation?: string;
     } | null;
}

// Component Props Types
export interface QuestionRendererProps {
     question: import('../types').JourneyNewQuestion;
     onAnswer: (answer: string | string[]) => void;
     userAnswer?: string | string[];
     isReview?: boolean;
}

export interface ProgressIndicatorProps {
     current: number;
     total: number;
     label?: string;
     showPercentage?: boolean;
     size?: 'small' | 'medium' | 'large';
     color?: string;
     backgroundColor?: string;
}

export interface ScoreDisplayProps {
     score: number;
     total: number;
     label?: string;
     showPercentage?: boolean;
     size?: 'small' | 'medium' | 'large';
     passingScore?: number;
     showPassingIndicator?: boolean;
}

export interface NavigationButtonsProps {
     onPrevious?: () => void;
     onNext?: () => void;
     previousLabel?: string;
     nextLabel?: string;
     showPrevious?: boolean;
     showNext?: boolean;
     isPreviousDisabled?: boolean;
     isNextDisabled?: boolean;
     isNextLoading?: boolean;
     size?: 'small' | 'medium' | 'large';
     variant?: 'primary' | 'secondary' | 'outline';
}

// Context Types (for consumers)
export interface QuestionContextValue {
     state: AppQuestionState;
     dispatch: React.Dispatch<any>;
     setLoading: (loading: boolean) => void;
     setError: (error: string | null) => void;
     setQuestions: (questions: import('../types').JourneyNewQuestion[]) => void;
     goToNextQuestion: () => void;
     goToPreviousQuestion: () => void;
     goToQuestion: (index: number) => void;
     bookmarkQuestion: (questionId: string) => void;
     unbookmarkQuestion: (questionId: string) => void;
     isBookmarked: (questionId: string) => boolean;
     setDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | 'all') => void;
     setFilter: (filter: Partial<AppQuestionState['filter']>) => void;
     resetState: () => void;
     isFirstQuestion: boolean;
     isLastQuestion: boolean;
     progress: number;
}

export interface AnswerContextValue {
     state: AppAnswerState;
     dispatch: React.Dispatch<any>;
     setLoading: (loading: boolean) => void;
     setError: (error: string | null) => void;
     addAnswer: (answer: UserAnswer) => void;
     updateAnswer: (questionId: string, value: any) => void;
     removeAnswer: (questionId: string) => void;
     getAnswer: (questionId: string) => UserAnswer | null;
     isAnswered: (questionId: string) => boolean;
     calculateScore: (questions: import('../types').JourneyNewQuestion[]) => void;
     saveAnswers: () => Promise<void>;
     loadAnswers: (lessonId: string) => Promise<void>;
     clearAnswers: () => void;
     resetState: () => void;
     answeredCount: number;
     accuracy: number;
     scorePercentage: number;
}

export interface ReviewContextValue {
     state: AppReviewState;
     dispatch: React.Dispatch<any>;
     setLoading: (loading: boolean) => void;
     setError: (error: string | null) => void;
     startReview: (questions: import('../types').JourneyNewQuestion[], answers: UserAnswer[]) => void;
     endReview: () => void;
     calculateReviewStats: (questions: import('../types').JourneyNewQuestion[], answers: UserAnswer[]) => ReviewStats;
     generateMistakes: (questions: import('../types').JourneyNewQuestion[], answers: UserAnswer[]) => QuestionMistake[];
     goToNextReviewQuestion: () => void;
     goToPreviousReviewQuestion: () => void;
     goToReviewQuestion: (index: number) => void;
     toggleExplanations: () => void;
     toggleCorrectAnswers: () => void;
     setFilter: (filter: 'all' | 'correct' | 'incorrect' | 'skipped') => void;
     resetState: () => void;
     currentReviewQuestion: import('../types').JourneyNewQuestion | null;
     currentReviewAnswer: UserAnswer | null;
     filteredQuestions: import('../types').JourneyNewQuestion[];
     isFirstReviewQuestion: boolean;
     isLastReviewQuestion: boolean;
     reviewProgress: number;
}

export interface ProgressContextValue {
     state: AppProgressState;
     dispatch: React.Dispatch<any>;
     setLoading: (loading: boolean) => void;
     setError: (error: string | null) => void;
     initializeJourney: (journeyId: string) => void;
     startLesson: (stageId: string, lessonId: string) => void;
     completeLesson: (stageId: string, lessonId: string, score: number, timeSpent: number) => void;
     updateCurrentPosition: (stageId: string, lessonId: string) => void;
     saveProgress: () => Promise<void>;
     loadProgress: (journeyId: string) => Promise<void>;
     resetProgress: () => void;
     currentStage: StageProgress | null;
     currentLesson: LessonProgress | null;
     overallProgress: number;
     completedLessonsCount: number;
     totalLessonsCount: number;
     averageScore: number;
} 