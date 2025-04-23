import { LESSON_TYPE } from "@/constants/lesson-types";

export interface IAnswer {
  answer: string;
  isCorrect: boolean;
  _id: string;
}

export interface Question {
  _id: string;
  audio: {
    name: string;
    url: string;
  };
  type: string;
  question: string | null;
  imageUrl: string;
  answers: IAnswer[];
  questions: string | null;
  createdAt: string;
  updatedAt: string;
  questionNumber: number;
  __v: number;
}
