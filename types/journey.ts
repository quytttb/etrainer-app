import { Question } from "@/components/Practice/type";

interface Day {
  dayNumber: number;
  started: boolean;
  completed: boolean;
  startedAt: string;
  questions: Question[];
  _id: string;
}

interface Stage {
  stageId: string;
  minScore: number;
  targetScore: number;
  days: Day[];
  started: boolean;
  startedAt: string;
  state: "IN_PROGRESS" | "COMPLETED";
  completedAt?: string;
  _id: string;
}

interface Journey {
  _id: string;
  user: string;
  stages: Stage[];
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

export type { Day, Stage, Journey };
