import request from "@/api/request";

export const getCurrentJourney = (): Promise<Journey> => {
  return request.get("/journeys/current");
};

export const createJourney = (data: CreateJourneyPayload): Promise<Journey> => {
  return request.post("/journeys", data);
};

import { Journey } from "@/types/journey";

export interface CreateJourneyPayload {
  currentLevel: number;
  targetScore: number;
}

export const getCurrentJourneyService = (): Promise<Journey> => {
  return request.get(`/journeys/current`);
};
