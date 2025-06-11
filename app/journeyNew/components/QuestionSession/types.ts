// ============================================================================
// 📝 QuestionSession Component Types
// Comprehensive Type Definitions for Unified Component
// ============================================================================

// ============================================================================
// CORE ENUMS & CONSTANTS
// ============================================================================

/**
 * Session modes for QuestionSession component
 */
export type SessionMode = 'LESSON' | 'FINAL_TEST';

/**
 * Question types from database analysis (8 types total)
 */
export enum LESSON_TYPE {
     IMAGE_DESCRIPTION = "IMAGE_DESCRIPTION",
     ASK_AND_ANSWER = "ASK_AND_ANSWER",
     CONVERSATION_PIECE = "CONVERSATION_PIECE",
     SHORT_TALK = "SHORT_TALK",
     FILL_IN_THE_BLANK_QUESTION = "FILL_IN_THE_BLANK_QUESTION",
     FILL_IN_THE_PARAGRAPH = "FILL_IN_THE_PARAGRAPH",
     READ_AND_UNDERSTAND = "READ_AND_UNDERSTAND",
     STAGE_FINAL_TEST = "STAGE_FINAL_TEST"
}

/**
 * Question status for navigation and progress tracking
 */
export type QuestionStatus = "answered" | "current" | "unanswered";

/**
 * Session states for tracking progress
 */
export type SessionState = "NOT_STARTED" | "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "SUBMITTED";

// ============================================================================
// QUESTION & ANSWER TYPES (Based on Database Schema)
// ============================================================================

/**
 * Audio file structure from database
 */
export interface AudioFile {
     name: string;
     url: string;
}

/**
 * Single answer option structure
 */
export interface AnswerOption {
     answer: string;
     isCorrect: boolean;
     _id: string;
}

/**
 * Sub-question structure (for CONVERSATION_PIECE, READ_AND_UNDERSTAND, etc.)
 */
export interface SubQuestion {
     question: string;
     answers: AnswerOption[];
     _id: string;
}

/**
 * Core Question interface (from database schema)
 */
export interface Question {
     _id: string;                    // MongoDB ObjectId
     questionNumber: number;         // Auto-incremented number
     type: LESSON_TYPE;             // Question type enum
     question?: string;             // Main question text (nullable)
     audio?: AudioFile;             // Audio file (nullable)
     imageUrl?: string;             // Image URL (nullable) 
     answers?: AnswerOption[];      // Single question answers (nullable)
     questions?: SubQuestion[];     // Multiple sub-questions (nullable)
     subtitle?: string;             // Audio transcript/subtitle (nullable)
     explanation?: string;          // Answer explanation (nullable)
}

/**
 * User's answer for a question (flexible format)
 */
export interface UserAnswer {
     questionId: string;
     answer: string | string[] | number | boolean | any;
     timestamp: number;
     isCorrect?: boolean;           // Calculated after submission
     timeSpent?: number;           // Time spent on this question
}

// ============================================================================
// SESSION CONFIGURATION
// ============================================================================

/**
 * Main configuration interface for QuestionSession
 */
export interface QuestionSessionConfig {
     // ✅ Core Settings
     mode: SessionMode;
     questions: Question[];

     // ✅ Timer Settings (Test Mode)
     timeLimit?: number;                    // Total time in milliseconds
     showTimer?: boolean;                   // Display countdown timer
     autoSubmitOnTimeout?: boolean;         // Auto-submit when time runs out
     warningThresholds?: number[];          // Warning at [5min, 1min] remaining

     // ✅ Navigation Settings
     allowJumpNavigation?: boolean;         // Jump to any question (test=true)
     showQuestionOverview?: boolean;        // Show question grid (test=true)
     enablePrevious?: boolean;              // Allow going back (lesson=true)

     // ✅ UX Settings  
     enablePause?: boolean;                 // Pause functionality (test=true)
     requireSubmitConfirmation?: boolean;   // Confirm before submit (test=true)
     autoSaveProgress?: boolean;            // Auto-save answers (lesson=true)
     showExplanations?: boolean;            // Show explanations after answer
     allowRetry?: boolean;                  // Allow answer changes

     // ✅ Display Settings
     showProgress?: boolean;                // Show progress bar
     showQuestionNumbers?: boolean;         // Show question numbering
     compactMode?: boolean;                 // Compact UI for small screens

     // ✅ Callbacks
     onAnswer?: (questionId: string, answer: UserAnswer) => void;
     onComplete?: (results: SessionResult) => void;
     onExit?: () => void;
     onPause?: () => void;
     onResume?: () => void;
     onTimeWarning?: (remainingTime: number) => void;
     onQuestionChange?: (currentIndex: number, question: Question) => void;
}

// ============================================================================
// SESSION RESULTS & ANALYTICS
// ============================================================================

/**
 * Results from completed session
 */
export interface SessionResult {
     // ✅ Basic Info
     sessionId: string;
     mode: SessionMode;
     completedAt: string;           // ISO timestamp

     // ✅ Timing Data
     totalTimeSpent: number;        // Total time in milliseconds
     timePerQuestion: number[];     // Time spent per question
     startTime: string;             // ISO timestamp
     endTime: string;               // ISO timestamp

     // ✅ Answer Data
     userAnswers: UserAnswer[];     // All user answers
     totalQuestions: number;        // Total questions in session
     answeredQuestions: number;     // Questions that were answered

     // ✅ Score Data (calculated)
     correctAnswers: number;        // Number of correct answers
     score: number;                 // Calculated score (0-100)
     accuracy: number;              // Accuracy percentage (0-100)
     passed?: boolean;              // For tests: did user pass?

     // ✅ Analytics
     questionStats: QuestionStat[]; // Per-question statistics
     sessionStats: SessionStats;   // Overall session statistics
}

/**
 * Statistics for individual question
 */
export interface QuestionStat {
     questionId: string;
     questionType: LESSON_TYPE;
     timeSpent: number;             // Time spent on this question
     attempts: number;              // Number of attempts (if retry enabled)
     isCorrect: boolean;            // Final answer correctness
     difficulty?: 'EASY' | 'MEDIUM' | 'HARD'; // Calculated difficulty
}

/**
 * Overall session statistics
 */
export interface SessionStats {
     averageTimePerQuestion: number;
     fastestQuestion: number;       // Shortest time spent
     slowestQuestion: number;       // Longest time spent
     accuracyByType: Record<LESSON_TYPE, number>; // Accuracy per question type
     completionRate: number;        // Percentage of questions answered
     engagementScore: number;       // Overall engagement (0-100)
}

// ============================================================================
// COMPONENT PROP INTERFACES
// ============================================================================

/**
 * Main QuestionSession component props
 */
export interface QuestionSessionProps {
     config: QuestionSessionConfig;
     className?: string;
     style?: any;                   // React Native StyleProp
     testId?: string;               // For testing
}

/**
 * SessionHeader component props
 */
export interface SessionHeaderProps {
     mode: SessionMode;
     showTimer: boolean;
     timeRemaining?: number;        // Seconds remaining
     isPaused?: boolean;
     progress: ProgressData;
     onPause?: () => void;
     onResume?: () => void;
     onExit?: () => void;
}

/**
 * Navigation component props  
 */
export interface NavigationProps {
     currentIndex: number;
     totalQuestions: number;
     allowJumpNavigation: boolean;
     showQuestionOverview: boolean;
     questionStatuses: QuestionStatus[];
     canGoPrevious: boolean;
     canGoNext: boolean;
     onPrevious: () => void;
     onNext: () => void;
     onJumpTo: (index: number) => void;
     onShowOverview: () => void;
}

/**
 * SubmitButton component props
 */
export interface SubmitButtonProps {
     mode: SessionMode;
     requireConfirmation: boolean;
     isLastQuestion: boolean;
     hasAnswered: boolean;
     isSubmitting: boolean;
     onSubmit: () => void;
     onNext: () => void;
}

/**
 * QuestionOverview component props (Test mode only)
 */
export interface QuestionOverviewProps {
     questions: Question[];
     currentIndex: number;
     questionStatuses: QuestionStatus[];
     onQuestionSelect: (index: number) => void;
     onClose: () => void;
}

// ============================================================================
// PROGRESS & STATE MANAGEMENT
// ============================================================================

/**
 * Progress tracking data
 */
export interface ProgressData {
     currentIndex: number;          // Current question index (0-based)
     totalQuestions: number;        // Total number of questions
     answeredCount: number;         // Number of answered questions
     percentage: number;            // Progress percentage (0-100)
     questionsRemaining: number;    // Questions left to answer
     estimatedTimeRemaining?: number; // Estimated time to complete
}

/**
 * Timer state management
 */
export interface TimerState {
     totalTime: number;             // Total time allocated (ms)
     timeRemaining: number;         // Time remaining (ms)
     timeElapsed: number;           // Time elapsed (ms)
     isPaused: boolean;             // Is timer paused?
     isActive: boolean;             // Is timer running?
     warnings: number[];            // Warning thresholds hit
}

/**
 * Session state management  
 */
export interface SessionStateData {
     state: SessionState;
     currentQuestionIndex: number;
     userAnswers: Record<string, UserAnswer>;
     startTime: number;
     pausedTime: number;            // Total time paused
     timerState: TimerState;
     progress: ProgressData;
}

// ============================================================================
// API COMPATIBILITY TYPES
// ============================================================================

/**
 * Backend API request format for submitting session results
 */
export interface SessionSubmissionRequest {
     mode: SessionMode;
     startTime: string;             // ISO timestamp
     endTime: string;               // ISO timestamp
     questionAnswers: BackendAnswer[]; // Formatted for backend
     sessionData?: any;             // Additional session data
}

/**
 * Backend-compatible answer format
 */
export interface BackendAnswer {
     questionId: string;
     userAnswer: any;               // Flexible format for backend
     timeSpent: number;
     attempts: number;
     isCorrect?: boolean;           // Calculated by backend
     type: LESSON_TYPE;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
     success: boolean;
     data: T;
     message?: string;
     error?: string;
     timestamp: string;
}

// ============================================================================
// HOOK INTERFACES
// ============================================================================

/**
 * useQuestionSession hook return type
 */
export interface UseQuestionSessionReturn {
     // ✅ State
     currentQuestion: Question | null;
     currentIndex: number;
     userAnswers: Record<string, UserAnswer>;
     sessionState: SessionStateData;
     progress: ProgressData;

     // ✅ Actions  
     goToQuestion: (index: number) => void;
     goNext: () => void;
     goPrevious: () => void;
     saveAnswer: (answer: any) => void;
     submitSession: () => Promise<SessionResult>;
     pauseSession: () => void;
     resumeSession: () => void;
     exitSession: () => void;

     // ✅ Computed Values
     canGoNext: boolean;
     canGoPrevious: boolean;
     isLastQuestion: boolean;
     questionStatuses: QuestionStatus[];
     isSessionComplete: boolean;
}

/**
 * useTimer hook return type
 */
export interface UseTimerReturn {
     timerState: TimerState;
     start: () => void;
     pause: () => void;
     resume: () => void;
     reset: () => void;
     addTime: (milliseconds: number) => void;
     formatTime: (milliseconds: number) => string;
}

/**
 * useProgress hook return type
 */
export interface UseProgressReturn {
     progress: ProgressData;
     updateProgress: () => void;
     getQuestionStatus: (index: number) => QuestionStatus;
     getAnsweredCount: () => number;
     getCompletionPercentage: () => number;
}

// ============================================================================
// UTILITY & HELPER TYPES
// ============================================================================

/**
 * Error types for QuestionSession
 */
export interface SessionError {
     type: 'NETWORK' | 'VALIDATION' | 'TIMEOUT' | 'UNKNOWN';
     message: string;
     details?: any;
     questionId?: string;
     timestamp: number;
}

/**
 * Loading states
 */
export type LoadingState = 'idle' | 'loading' | 'submitting' | 'error' | 'success';

/**
 * Theme/styling configuration
 */
export interface SessionTheme {
     colors: {
          primary: string;
          secondary: string;
          success: string;
          warning: string;
          error: string;
          background: string;
          text: string;
     };
     spacing: {
          xs: number;
          sm: number;
          md: number;
          lg: number;
          xl: number;
     };
     typography: {
          heading: any;
          body: any;
          caption: any;
     };
}

// ============================================================================
// EXPORTS & DEFAULTS
// ============================================================================

// Re-export commonly used types with shorter names
export type { Question as QuestionType };
export type { UserAnswer as AnswerType };
export type { SessionResult as ResultType };
export type { QuestionSessionConfig as ConfigType };

// Default configurations for different modes
export const DEFAULT_LESSON_CONFIG: Partial<QuestionSessionConfig> = {
     mode: 'LESSON',
     showTimer: false,
     allowJumpNavigation: false,
     showQuestionOverview: false,
     enablePause: false,
     requireSubmitConfirmation: false,
     autoSaveProgress: true,
     showExplanations: true,
     allowRetry: true,
     showProgress: true,
     showQuestionNumbers: true,
     enablePrevious: true,
};

export const DEFAULT_TEST_CONFIG: Partial<QuestionSessionConfig> = {
     mode: 'FINAL_TEST',
     showTimer: true,
     allowJumpNavigation: true,
     showQuestionOverview: true,
     enablePause: true,
     requireSubmitConfirmation: true,
     autoSaveProgress: false,
     showExplanations: false,
     allowRetry: false,
     showProgress: true,
     showQuestionNumbers: true,
     autoSubmitOnTimeout: true,
     warningThresholds: [5 * 60 * 1000, 1 * 60 * 1000], // 5min, 1min warnings
     enablePrevious: true,
};

// ============================================================================
// TYPE GUARDS & UTILITIES
// ============================================================================

/**
 * Type guard to check if question has single answers
 */
export const hasSingleAnswers = (question: Question): question is Question & { answers: AnswerOption[] } => {
     return question.answers !== undefined && question.answers.length > 0;
};

/**
 * Type guard to check if question has multiple sub-questions
 */
export const hasSubQuestions = (question: Question): question is Question & { questions: SubQuestion[] } => {
     return question.questions !== undefined && question.questions.length > 0;
};

/**
 * Type guard to check if question has audio
 */
export const hasAudio = (question: Question): question is Question & { audio: AudioFile } => {
     return question.audio !== undefined && question.audio.url.length > 0;
};

/**
 * Type guard to check if question has image
 */
export const hasImage = (question: Question): question is Question & { imageUrl: string } => {
     return question.imageUrl !== undefined && question.imageUrl.length > 0;
};

/**
 * Utility function to create session config with defaults
 */
export const createSessionConfig = (
     mode: SessionMode,
     questions: Question[],
     overrides?: Partial<QuestionSessionConfig>
): QuestionSessionConfig => {
     const defaults = mode === 'LESSON' ? DEFAULT_LESSON_CONFIG : DEFAULT_TEST_CONFIG;

     return {
          ...defaults,
          mode,
          questions,
          ...overrides,
     } as QuestionSessionConfig;
};

/**
 * Utility to validate session config
 */
export const validateSessionConfig = (config: QuestionSessionConfig): string[] => {
     const errors: string[] = [];

     if (!config.questions || config.questions.length === 0) {
          errors.push('Questions array cannot be empty');
     }

     if (config.mode === 'FINAL_TEST' && !config.timeLimit) {
          errors.push('Test mode requires timeLimit to be set');
     }

     if (config.timeLimit && config.timeLimit <= 0) {
          errors.push('timeLimit must be greater than 0');
     }

     if (config.warningThresholds && config.warningThresholds.some(t => t <= 0)) {
          errors.push('Warning thresholds must be positive numbers');
     }

     return errors;
}; 