import { apiClient, ApiResponse } from './client';
import {
     JourneyNewOverview,
     JourneyNewStage,
     JourneyNewQuestion,
     JourneyNewResult,
     UserAnswer
} from '@/app/journey/types';

// Journey service interfaces
export interface JourneyListParams {
     page?: number;
     limit?: number;
     status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
     search?: string;
}

export interface JourneyCreateParams {
     title: string;
     description?: string;
     targetScore?: number;
}

export interface LessonCompleteParams {
     stageId: string;
     dayId: string;
     answers: UserAnswer[];
     timeSpent: number;
     score?: number;
}

export interface StageCompleteParams {
     stageId: string;
     score: number;
     timeSpent: number;
     passed: boolean;
}

// Journey API Service
export class JourneyApiService {

     // ===== JOURNEY OVERVIEW METHODS =====

     /**
      * Get current user's journey overview
      */
     async getCurrentJourney(): Promise<ApiResponse<JourneyNewOverview>> {
          return apiClient.get<JourneyNewOverview>('/user/current-journey');
     }

     /**
      * Get all available journeys for user
      */
     async getJourneyList(params?: JourneyListParams): Promise<ApiResponse<JourneyNewOverview[]>> {
          const queryParams = new URLSearchParams();

          if (params) {
               Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) {
                         queryParams.append(key, value.toString());
                    }
               });
          }

          const url = `/journeys${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
          return apiClient.get<JourneyNewOverview[]>(url);
     }

     /**
      * Create new journey for user
      */
     async createJourney(params: JourneyCreateParams): Promise<ApiResponse<JourneyNewOverview>> {
          return apiClient.post<JourneyNewOverview>('/journeys', params);
     }

     /**
      * Get journey by ID
      */
     async getJourneyById(journeyId: string): Promise<ApiResponse<JourneyNewOverview>> {
          return apiClient.get<JourneyNewOverview>(`/journeys/${journeyId}`);
     }

     // ===== STAGE METHODS =====

     /**
      * Get all stages for a journey
      */
     async getJourneyStages(
          journeyId?: string,
          forceFresh = false
     ): Promise<ApiResponse<JourneyNewStage[]>> {
          const params = new URLSearchParams();
          if (forceFresh) {
               params.append('refresh', 'true');
          }

          const url = journeyId
               ? `/journeys/${journeyId}/stages${params.toString() ? `?${params.toString()}` : ''}`
               : `/user/current-journey/stages${params.toString() ? `?${params.toString()}` : ''}`;

          return apiClient.get<JourneyNewStage[]>(url);
     }

     /**
      * Get specific stage details
      */
     async getStageDetails(stageId: string): Promise<ApiResponse<JourneyNewStage>> {
          return apiClient.get<JourneyNewStage>(`/stages/${stageId}`);
     }

     /**
      * Start a stage
      */
     async startStage(stageId: string): Promise<ApiResponse<{ message: string }>> {
          return apiClient.post<{ message: string }>(`/stages/${stageId}/start`);
     }

     /**
      * Complete a stage
      */
     async completeStage(params: StageCompleteParams): Promise<ApiResponse<JourneyNewResult>> {
          return apiClient.post<JourneyNewResult>(`/stages/${params.stageId}/complete`, {
               score: params.score,
               timeSpent: params.timeSpent,
               passed: params.passed,
          });
     }

     // ===== DAY/LESSON METHODS =====

     /**
      * Get questions for a specific day
      */
     async getDayQuestions(
          stageId: string,
          dayNumber: number
     ): Promise<ApiResponse<JourneyNewQuestion[]>> {
          return apiClient.get<JourneyNewQuestion[]>(
               `/stages/${stageId}/days/${dayNumber}/questions`
          );
     }

     /**
      * Submit answers for a day/lesson
      */
     async submitDayAnswers(params: LessonCompleteParams): Promise<ApiResponse<JourneyNewResult>> {
          return apiClient.post<JourneyNewResult>(
               `/stages/${params.stageId}/days/${params.dayId}/submit`,
               {
                    answers: params.answers,
                    timeSpent: params.timeSpent,
                    score: params.score,
               }
          );
     }

     /**
      * Complete a day/lesson
      */
     async completeDay(
          stageIndex: number,
          dayNumber: number
     ): Promise<ApiResponse<{ message: string }>> {
          return apiClient.post<{ message: string }>('/user/complete-day', {
               stageIndex,
               dayNumber,
          });
     }

     // ===== FINAL TEST METHODS =====

     /**
      * Get stage final test questions
      */
     async getStageFinalTest(
          stageIndex: number,
          forceFresh = false
     ): Promise<ApiResponse<JourneyNewQuestion[]>> {
          const params = new URLSearchParams();
          if (forceFresh) {
               params.append('refresh', 'true');
          }

          return apiClient.get<JourneyNewQuestion[]>(
               `/stages/${stageIndex}/final-test${params.toString() ? `?${params.toString()}` : ''}`
          );
     }

     /**
      * Submit stage final test
      */
     async submitStageFinalTest(
          stageIndex: number,
          answers: UserAnswer[]
     ): Promise<ApiResponse<JourneyNewResult>> {
          return apiClient.post<JourneyNewResult>(
               `/stages/${stageIndex}/final-test/submit`,
               { answers }
          );
     }

     // ===== PROGRESS METHODS =====

     /**
      * Get user progress for journey
      */
     async getUserProgress(journeyId?: string): Promise<ApiResponse<any>> {
          const url = journeyId
               ? `/journeys/${journeyId}/progress`
               : '/user/current-journey/progress';
          return apiClient.get(url);
     }

     /**
      * Update user progress
      */
     async updateProgress(data: any): Promise<ApiResponse<{ message: string }>> {
          return apiClient.post<{ message: string }>('/user/progress', data);
     }

     // ===== STATISTICS METHODS =====

     /**
      * Get user statistics
      */
     async getUserStats(): Promise<ApiResponse<any>> {
          return apiClient.get('/user/stats');
     }

     /**
      * Get journey analytics
      */
     async getJourneyAnalytics(journeyId: string): Promise<ApiResponse<any>> {
          return apiClient.get(`/journeys/${journeyId}/analytics`);
     }

     // ===== UTILITY METHODS =====

     /**
      * Ping journey service health
      */
     async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
          return apiClient.get<{ status: string; timestamp: string }>('/health');
     }

     /**
      * Force refresh cache
      */
     async refreshCache(): Promise<ApiResponse<{ message: string }>> {
          return apiClient.post<{ message: string }>('/cache/refresh');
     }
}

// Create and export singleton instance
export const journeyApiService = new JourneyApiService();

// Legacy compatibility - gradually migrate these
export const getCurrentJourneyService = () => {
     return journeyApiService.getCurrentJourney();
};

export const completeDayService = (stageIndex: number, dayNumber: number) => {
     return journeyApiService.completeDay(stageIndex, dayNumber);
};

// Export for use in components
export default journeyApiService; 