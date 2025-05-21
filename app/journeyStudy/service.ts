import request from "@/api/request";
import { Journey } from "@/types/journey";

export const getCurrentJourneyService = () => {
  return request.get<Journey>("/journeys/active");
};

export const completeDayService = (stageIndex: number, dayNumber: number) => {
  return request.put(`/journeys/complete-day/${stageIndex}/${dayNumber}`);
};
