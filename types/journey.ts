import { Question } from "@/components/Practice/type";

interface Day {
  dayNumber: number;
  started: boolean;
  completed: boolean;
  startedAt: string;
  questions: Question[];
  _id: string;
}

interface FinalTest {
  _id?: string;
  stageIndex?: number;
  questions?: Question[];
  unlocked: boolean;
  started: boolean;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
  score?: number;
  passed: boolean;
  answers?: any[];
}

interface Stage {
  stageId: string;
  minScore: number;
  targetScore: number;
  days: Day[];
  started: boolean;
  startedAt: string;
  state: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
  completedAt?: string;
  _id: string;
  finalTest?: FinalTest;
}

interface Journey {
  _id: string;
  user: string;
  stages: Stage[];
  currentStageIndex: number;
  state: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "REPLACED";
  completedAt?: string;
  replacedAt?: string;
  startedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  status: boolean;
  completionRate: number;
  completedDays: number;
  totalDays: number;
}

export type { Day, Stage, Journey, FinalTest };
