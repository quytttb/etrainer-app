import request from "@/api/request";
import { Question } from "@/components/Practice/type";
import { LESSON_TYPE } from "@/constants/lesson-types";
import { getExpoPushToken } from "@/utils/getExpoPushToken";

interface ICreateStudyReminder {
  hour: number;
  minute: number;
}

export const setStudyReminderService = async (
  payload: ICreateStudyReminder
) => {
  return request.post("/reminder", {
    ...payload,
    expoPushToken: await getExpoPushToken(),
  });
};

export const getNotificationService = () => {
  return request.get("/notification");
};

export interface IExam {
  name: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  _id: string;
  sections: { type: LESSON_TYPE; _id: string; questions: Question[] }[];
}

export const getExamListService = (): Promise<IExam[]> => {
  return request.get("/exam");
};
