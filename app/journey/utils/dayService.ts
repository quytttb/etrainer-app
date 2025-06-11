// Day service for journey completion
import request from '@/api/request';

export const completeDayService = async (stageIndex: number, dayNumber: number) => {
     try {
          const response = await request.put(`/journeys/complete-day/${stageIndex}/${dayNumber}`);
          return response.data;
     } catch (error) {
          console.error('Error completing day:', error);
          throw error;
     }
};

export const startNextDayService = async (stageIndex: number, dayNumber: number) => {
     try {
          const response = await request.put(`/journeys/start-next-day/${stageIndex}/${dayNumber}`);
          return response.data;
     } catch (error) {
          console.error('Error starting next day:', error);
          throw error;
     }
};

export default {
     completeDayService,
     startNextDayService,
}; 