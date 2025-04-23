import request from "@/api/request";
import { LESSON_TYPE } from "@/constants/lesson-types";

interface IStartPracticeBody {
  type: LESSON_TYPE;
  count: number;
}

export const startPracticeService = (payload: IStartPracticeBody) => {
  return request.post("/practice/start", {
    ...payload,
    count: payload.count ?? 6,
  });
};

export interface ISubmitPractice {
  startTime: string;
  endTime: string;
  lessonType: LESSON_TYPE;
  questionAnswers: [];
}

export const submitPracticeService = (payload: ISubmitPractice) => {
  return request.post("/practice/submit", payload);
};
