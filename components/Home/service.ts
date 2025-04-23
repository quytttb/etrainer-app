import request from "@/api/request";
import { IPracticeHistory } from "@/app/practice/service";

export const getPracticeHistoryService = (): Promise<IPracticeHistory[]> => {
  return request.get("/practice/history");
};
