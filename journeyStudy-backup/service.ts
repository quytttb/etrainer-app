import request from "@/api/request";
import { Journey } from "@/types/journey";

export const getCurrentJourneyService = () => {
  return request.get<Journey>("/journeys/current");
};

export const completeDayService = (stageIndex: number, dayNumber: number, payload?: {
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
}) => {
  return request.put(`/journeys/complete-day/${stageIndex}/${dayNumber}`, payload);
};

export const skipStageService = (stageIndex: number) => {
  return request.post(`/journeys/skip-stage/${stageIndex}`);
};

// Final Test API services
export const getStageFinalTestService = (stageIndex: number) => {
  return request.get(`/journeys/stage-final-test/${stageIndex}`);
};

export const startStageFinalTestService = (stageIndex: number) => {
  return request.post(`/journeys/start-stage-final-test/${stageIndex}`);
};

export const completeStageFinalTestService = (stageIndex: number, answers?: any) => {
  return request.put(`/journeys/complete-stage-final-test/${stageIndex}`, answers);
};

export const submitFinalTestService = (stageIndex: number, payload: {
  answers?: any;
  score?: number;
  correctAnswers?: number;
  totalQuestions?: number;
}) => {
  return request.put(`/journeys/submit-final-test/${stageIndex}`, payload);
};

export const startNextDayService = (stageIndex: number, dayNumber: number) => {
  return request.put(`/journeys/start-next-day/${stageIndex}/${dayNumber}`);
};
