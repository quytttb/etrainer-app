import request from "@/api/request";

export const getCurrentJourney = (): Promise<Journey> => {
  return request.get("/journeys/current");
};

export const createJourney = (data: CreateJourneyPayload): Promise<Journey> => {
  return request.post("/journeys/create", data);
};

import { LESSON_TYPE } from "@/constants/lesson-types";

export interface CreateJourneyPayload {
  currentLevel: number;
  targetScore: number;
}

export interface Question {
  _id: string;
  type: LESSON_TYPE;
  question: string | null;
  imageUrl: string | null;
  audio?: {
    name: string | null;
    url: string | null;
  };
  answers?:
    | {
        answer: string;
        isCorrect: boolean;
        _id: string;
      }[]
    | null;
  questions?:
    | {
        question: string;
        answers: {
          answer: string;
          isCorrect: boolean;
          _id: string;
        }[];
        _id: string;
      }[]
    | null;
  subtitle?: string | null;
  explanation?: string | null;
  createdAt: string;
  updatedAt: string;
  questionNumber: number;
  __v: number;
}

export interface JourneyDay {
  dayNumber: number;
  started: boolean;
  completed: boolean;
  startedAt: string;
  questions: Question[];
  _id: string;
}

export interface JourneyStage {
  stageId: string;
  minScore: number;
  targetScore: number;
  days: JourneyDay[];
  started: boolean;
  startedAt: string;
  state: "IN_PROGRESS" | "COMPLETED";
  completedAt?: string;
  _id: string;
}

export interface Journey {
  _id: string;
  user: string;
  stages: JourneyStage[];
  currentStageIndex: number;
  state: "IN_PROGRESS" | "COMPLETED";
  completedAt?: string;
  startedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  status: boolean;
  completionRate: number;
  completedDays: number;
  totalDays: number;
}

export const getCurrentJourneyService = (): Promise<Journey> => {
  return request.get(`/journeys/current`);
};
