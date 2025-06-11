// Re-export journey types for services
export type {
     JourneyNewOverview,
     JourneyNewStage,
     JourneyNewQuestion,
     JourneyNewResult,
     UserAnswer,
     JourneyNewProgress,
     JourneyNewLesson,
     JourneyNewTest,
} from '../app/journey/types';

// Additional service-specific types
export interface PaginationParams {
     page?: number;
     limit?: number;
     offset?: number;
}

export interface SortParams {
     sortBy?: string;
     sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
     status?: string;
     search?: string;
     dateFrom?: string;
     dateTo?: string;
}

export interface BaseServiceParams extends PaginationParams, SortParams, FilterParams { }

// Service response wrapper
export interface ServiceResponse<T> {
     data: T;
     success: boolean;
     message?: string;
     error?: string;
     meta?: {
          pagination?: {
               page: number;
               limit: number;
               total: number;
               totalPages: number;
          };
          timestamp: string;
     };
} 