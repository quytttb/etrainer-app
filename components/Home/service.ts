import request from "@/api/request";
import { IPracticeHistory } from "@/app/practice/service";
import { LESSON_TYPE } from "@/constants/lesson-types";

interface IPracticeHistoryParams {
  type?: LESSON_TYPE;
}

export const getPracticeHistoryService = (
  params?: IPracticeHistoryParams
): Promise<IPracticeHistory[]> => {
  return request.get("/practice/history", {
    params: {
      lessonType: params?.type,
    },
  });
};
