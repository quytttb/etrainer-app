// Configuration file for Journey New

// API Configuration
export const API_CONFIG = {
     // Base URL for the API - Uses environment variable from .env
     BASE_URL: process.env.EXPO_PUBLIC_APP_API_URL || 'http://localhost:8080/api', // Fallback to localhost
     // Production URL also available in .env: https://etrainer-backend-main.vercel.app/api

     // API Endpoints - Updated according to ENDPOINT_ANALYSIS_REPORT.md
     ENDPOINTS: {
          // ✅ UPDATED ENDPOINTS - Based on actual backend routes
          JOURNEY_CURRENT: '/journeys/current',                    // GET current journey
          CREATE_JOURNEY: '/journeys',                             // POST create journey
          STAGES: '/stages',                                       // GET all stages (unchanged)
          QUESTIONS: '/question',                                  // GET questions (note: singular 'question')
          PRACTICE_SUBMIT: '/practice/submit',                     // POST submit practice
          PRACTICE_START: '/practice/start',                       // POST start practice  
          PRACTICE_HISTORY: '/practice/history',                   // GET practice history

          // Journey management endpoints
          COMPLETE_DAY: (stageIndex: number, dayNumber: number) =>
               `/journeys/complete-day/${stageIndex}/${dayNumber}`,  // PUT complete day

          // Final test endpoints
          STAGE_FINAL_TEST: (stageIndex: number) =>
               `/journeys/stage-final-test/${stageIndex}`,          // GET final test
          START_FINAL_TEST: (stageIndex: number) =>
               `/journeys/start-stage-final-test/${stageIndex}`,    // POST start final test
          COMPLETE_FINAL_TEST: (stageIndex: number) =>
               `/journeys/complete-stage-final-test/${stageIndex}`, // PUT complete final test

          // Skip stage endpoint
          SKIP_STAGE: (stageIndex: number) =>
               `/journeys/skip-stage/${stageIndex}`,                // PUT skip stage

          // ❌ DEPRECATED - Old endpoints (keeping for reference)
          // USER_JOURNEYS: '/user-journeys',  // ❌ Backend uses /journeys/current instead
          // PRACTICE_HISTORIES: '/practice-histories', // ❌ Backend uses /practice/history instead
          // EXAMS: '/exams', // ❌ Final tests handled via journeys routes
     },

     // Request timeout in milliseconds
     TIMEOUT: 10000,

     // Retry configuration
     RETRY: {
          MAX_ATTEMPTS: 3,
          DELAY: 1000, // ms
     },
};

// Storage Keys for AsyncStorage
export const STORAGE_KEYS = {
     ACCESS_TOKEN: 'accessToken',
     REFRESH_TOKEN: 'refreshToken',
     USER_ID: 'userId',
     USER_DATA: 'userData',
     JOURNEY_CACHE: 'journeyCache',
     OFFLINE_DATA: 'offlineData',
};

// App Constants
export const APP_CONSTANTS = {
     // Default values
     DEFAULT_LESSON_DURATION: 30, // minutes
     DEFAULT_TEST_DURATION: 60, // minutes

     // Progress thresholds
     PROGRESS_THRESHOLDS: {
          EXCELLENT: 90,
          GOOD: 70,
          AVERAGE: 50,
          NEEDS_IMPROVEMENT: 30,
     },

     // Cache expiration times
     CACHE_EXPIRATION: {
          JOURNEY_DATA: 5 * 60 * 1000, // 5 minutes
          STAGES_DATA: 10 * 60 * 1000, // 10 minutes
          QUESTIONS_DATA: 30 * 60 * 1000, // 30 minutes
     },
};

// Environment detection
export const IS_DEVELOPMENT = __DEV__;
export const IS_PRODUCTION = !__DEV__;

// Get API base URL based on environment
export const getAPIBaseURL = (): string => {
     const baseURL = API_CONFIG.BASE_URL;
     if (IS_DEVELOPMENT) {
          console.log('🌐 API Base URL:', baseURL);
     }
     return baseURL;
};

// Build full API endpoint
export const buildAPIEndpoint = (endpoint: string): string => {
     return `${getAPIBaseURL()}${endpoint}`;
};

export default API_CONFIG; 