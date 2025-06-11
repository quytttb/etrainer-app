// Question types used across the app

export interface Question {
     _id: string;
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

export default Question; 