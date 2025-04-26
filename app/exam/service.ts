import request from "@/api/request";
import { IExam } from "../(tabs)/service";
import { LESSON_TYPE } from "@/constants/lesson-types";
import { Question } from "@/components/Practice/type";

export const getExamByIdService = (id: string): Promise<IExam> => {
  return request.get(`/exam/${id}`);
};

interface ISubmitExam {
  startTime: string;
  endTime: string;
  sections: any[];
  examId: string;
}

export const submitExamService = (payload: ISubmitExam) => {
  return request.post("/exam/submit", payload);
};

export interface IExamResult {
  _id: string;
  startTime: string;
  endTime: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracyRate: number;
  sections: {
    type: LESSON_TYPE;
    questions: Question[];
  }[];
  exam: { name: string; createdAt: string };
  createdAt: string;
}

export const getExamResultService = (id: string): Promise<IExamResult> => {
  return request.get(`/exam/result/${id}`);
};
