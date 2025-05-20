import request from "@/api/request";
import { Journey } from "@/types/journey";

export const getCurrentJourneyService = () => {
  return request.get<Journey>("/journeys/active");
};
