// Re-export types from parent types file
export type {
     Question,
     JourneyNewQuestion,
     Answer,
     UserAnswer
} from '../types';

import type { Question } from '../types';

// Component props interfaces
export interface QuestionProps {
     question: Question;
     onAnswer: (answers: any) => void;
     userAnswer?: any;
     isReview?: boolean;
} 