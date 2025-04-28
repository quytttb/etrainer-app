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
  questions: {
    question: string;
    answers: IAnswer[];
    userAnswer: string | null;
    isCorrect: boolean;
    isNotAnswer: boolean;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  questionNumber: number;
  userAnswer: string | null;
  isCorrect: boolean;
  isNotAnswer: boolean;
  __v: number;
  subtitle: string;
  explanation: string;
}
