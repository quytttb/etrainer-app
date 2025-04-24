import request from "@/api/request";
import { IExam } from "../(tabs)/service";

export const getExamByIdService = (id: string): Promise<IExam> => {
  return request.get(`/exam/${id}`);
};
