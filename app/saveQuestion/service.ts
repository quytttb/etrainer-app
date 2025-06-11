import request from "@/api/request";

export interface IFavoriteQuestion {
  _id: string;
  userId: string;
  questionId: string;
  question: string;
  answer: string;
  category: string;
}

export interface IQuestionDetail {
  _id: string;
  question: string;
  answer: string;
  explanation?: string; // Nếu có
  // các trường khác nếu có
}

export const getFavoriteQuestionsService = async (userId: string): Promise<IFavoriteQuestion[]> => {
  const res = await request.get(`/favorites?userId=${userId}`);
  return res.data;
};

export const getQuestionByIdService = async (id: string): Promise<{ data: IQuestionDetail }> => {
  const res = await request.get(`/question/${id}`);
  return res.data;
};
