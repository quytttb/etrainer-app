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

export interface Answer {
     answer: string;
     isCorrect: boolean;
     _id: string;
}

export interface SubQuestion {
     question: string;
     answers: Answer[];
     _id: string;
}

export interface Question {
     _id: string;
     questionNumber: number;
     type: LESSON_TYPE;
     question?: string;
     audio?: {
          name: string;
          url: string;
     };
     imageUrl?: string;
     answers?: Answer[];
     questions?: SubQuestion[];
     subtitle?: string;
     explanation?: string;
}

export interface QuestionProps {
     question: Question;
     onAnswer: (answer: string | string[] | Record<string, string>) => void;
     userAnswer?: string | string[] | Record<string, string>;
     isReview?: boolean;
}

export interface QuestionResult {
     questionId: string;
     userAnswer: string | string[];
     isCorrect: boolean;
     correctAnswer?: string | string[];
} 