import request from "@/api/request";

export interface IJourneyQuestion {
  _id: string;
  type: string;
  question: string | null;
  imageUrl: string | null;
  answers: Array<{
    answer: string;
    isCorrect: boolean;
    _id: string;
  }> | null;
  questions: Array<{
    question: string;
    answers: Array<{
      answer: string;
      isCorrect: boolean;
      _id: string;
    }>;
    _id: string;
  }> | null;
  subtitle: string | null;
  explanation: string | null;
  audio: {
    name: string | null;
    url: string | null;
  };
  createdAt: string;
  updatedAt: string;
  questionNumber: number;
  __v: number;
}

export interface IJourneyDay {
  dayNumber: number;
  started: boolean;
  completed: boolean;
  startedAt: string;
  questions: IJourneyQuestion[];
  _id: string;
}

export interface IJourneyStage {
  stageId: string;
  minScore: number;
  targetScore: number;
  days: IJourneyDay[];
  started: boolean;
  startedAt: string;
  state: "IN_PROGRESS" | "COMPLETED";
  completedAt?: string;
  _id: string;
}

export interface IJourney {
  _id: string;
  user: string;
  stages: IJourneyStage[];
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

export const getCurrentJourneyService = (): Promise<IJourney> => {
  return request.get("/journeys/current");
};
