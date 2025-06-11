import request from "@/api/request";
import { Question } from "@/components/Practice/type";
import { LESSON_TYPE } from "@/constants/lesson-types";

interface ICreateStudyReminder {
  hour: number;
  minute: number;
}

export const setStudyReminderService = async (
  payload: ICreateStudyReminder
) => {
  return request.post("/reminder", payload);
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

export interface IFavoriteQuestion {
  _id: string;
  userId: string;
  questionId: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}
export interface IFavoriteQuestion {
  _id: string;
  userId: string;
  questionId: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// 1. Lấy danh sách câu hỏi yêu thích theo userId
export const getFavoriteQuestionsService = (userId: string): Promise<IFavoriteQuestion[]> => {
  return request.get("/favorite", {
    params: { userId },
  });
};

// 2. Thêm câu hỏi yêu thích
export const addFavoriteQuestionService = async ({
  userId,
  questionId,
  question,
  answer,
  category,
}: {
  userId: string;
  questionId: string;
  question: string;
  answer: string;
  category: string;
}) => {
  return request.post("/favorite/add", {
    userId,
    questionId,
    question,
    answer,
    category,
  });
};

// 3. Xóa câu hỏi yêu thích theo id
export const deleteFavoriteQuestionService = async (id: string) => {
  return request.delete(`/favorite/${id}`);
};
