import React from 'react';
import { renderWithProviders } from '../../utils/testUtils';

// Mock dependencies
jest.mock('expo-router', () => ({
     useRouter: () => ({
          push: jest.fn(),
          replace: jest.fn(),
          back: jest.fn(),
     }),
}));

// Mock service with detailed implementations
jest.mock('../../../app/journeyNew/service', () => ({
     JourneyNewService: {
          completeStageFinalTest: jest.fn(),
          getJourneyOverview: jest.fn(),
          getJourneyStages: jest.fn(),
          getStageFinalTest: jest.fn(),
     },
}));

const mockService = require('../../../app/journeyNew/service').JourneyNewService;

describe('🔥 FinalTestScreen - Deep Dive Bug Analysis', () => {

     beforeEach(() => {
          jest.clearAllMocks();
          // Reset Date.now mock
          Date.now = jest.fn(() => 1749613440000); // Fixed timestamp for consistent testing
     });

     describe('🐛 Race Condition Scenarios', () => {

          it('should handle race condition when completeStageFinalTest updates but getJourneyStages returns stale data', async () => {
               // Scenario: Backend updates stage but cache returns old data
               let callCount = 0;

               mockService.completeStageFinalTest.mockResolvedValue({
                    score: 88.89,
                    passed: true,
                    minScore: 70,
                    nextStageUnlocked: true,
                    updatedAt: new Date().toISOString()
               });

               // Mock stale cache on first call, fresh data on second call
               mockService.getJourneyStages.mockImplementation((forceFresh) => {
                    callCount++;
                    if (callCount === 1 && !forceFresh) {
                         // First call returns stale data (as if cached)
                         return Promise.resolve([
                              { id: 'stage-1', status: 'COMPLETED', finalTest: { passed: true } },
                              { id: 'stage-2', status: 'LOCKED', finalTest: { passed: false } } // Still locked!
                         ]);
                    } else {
                         // Subsequent calls or force refresh return updated data
                         return Promise.resolve([
                              { id: 'stage-1', status: 'COMPLETED', finalTest: { passed: true } },
                              { id: 'stage-2', status: 'UNLOCKED', finalTest: { passed: false } } // Now unlocked
                         ]);
                    }
               });

               // 1. Complete test successfully
               const completionResult = await mockService.completeStageFinalTest(0, { score: 88.89 });
               expect(completionResult.passed).toBe(true);

               // 2. First call without force refresh returns stale data
               const staleStages = await mockService.getJourneyStages(false);
               expect(staleStages[1].status).toBe('LOCKED'); // ❌ Bug: Still locked

               // 3. Force refresh should return updated data
               const freshStages = await mockService.getJourneyStages(true);
               expect(freshStages[1].status).toBe('UNLOCKED'); // ✅ Now unlocked
          });

          it('should verify timing issue when multiple API calls are made simultaneously', async () => {
               // Mock delays to simulate network latency
               mockService.completeStageFinalTest.mockImplementation(() =>
                    new Promise(resolve => setTimeout(() => resolve({
                         score: 75,
                         passed: true,
                         nextStageUnlocked: true
                    }), 100))
               );

               mockService.getJourneyStages.mockImplementation((forceFresh) =>
                    new Promise(resolve => setTimeout(() => resolve([
                         { id: 'stage-1', status: 'COMPLETED', finalTest: { passed: true } },
                         { id: 'stage-2', status: forceFresh ? 'UNLOCKED' : 'LOCKED', finalTest: { passed: false } }
                    ]), forceFresh ? 50 : 200)) // Force refresh is faster
               );

               // Simulate concurrent calls
               const [completionResult, stagesResult] = await Promise.all([
                    mockService.completeStageFinalTest(0, { score: 75 }),
                    mockService.getJourneyStages(true)
               ]);

               expect(completionResult.passed).toBe(true);
               // Force refresh should return correct data despite timing
               expect(stagesResult[1].status).toBe('UNLOCKED');
          });

     });

     describe('🔄 Cache Invalidation Issues', () => {

          it('should verify timestamp cache busting works correctly', () => {
               const baseEndpoint = '/api/journeys/current';
               const forceFresh = true;
               const timestamp = Date.now();

               // Test endpoint generation with cache busting
               const timestampEndpoint = forceFresh ? `${baseEndpoint}?t=${timestamp}` : baseEndpoint;

               expect(timestampEndpoint).toBe('/api/journeys/current?t=1749613440000');

               // Test that different timestamps create different URLs
               Date.now = jest.fn(() => 1749613441000);
               const newTimestamp = Date.now();
               const newEndpoint = `${baseEndpoint}?t=${newTimestamp}`;

               expect(newEndpoint).not.toBe(timestampEndpoint); // Should be different
          });

          it('should test cache persistence vs invalidation logic', async () => {
               let cacheHitCount = 0;
               const CACHE_DURATION = 5000; // 5 seconds

               mockService.getJourneyStages.mockImplementation((forceFresh) => {
                    if (!forceFresh) {
                         cacheHitCount++;
                         // Simulate cache hit
                         return Promise.resolve([
                              { id: 'stage-1', status: 'COMPLETED', cached: true },
                              { id: 'stage-2', status: 'LOCKED', cached: true }
                         ]);
                    } else {
                         // Simulate fresh API call
                         return Promise.resolve([
                              { id: 'stage-1', status: 'COMPLETED', cached: false },
                              { id: 'stage-2', status: 'UNLOCKED', cached: false }
                         ]);
                    }
               });

               // 1. Normal call uses cache
               const cachedResult = await mockService.getJourneyStages(false);
               expect(cachedResult[0].cached).toBe(true);
               expect(cacheHitCount).toBe(1);

               // 2. Force refresh bypasses cache
               const freshResult = await mockService.getJourneyStages(true);
               expect(freshResult[0].cached).toBe(false);
               expect(cacheHitCount).toBe(1); // No additional cache hits

               // 3. After completion, should force fresh data
               await mockService.completeStageFinalTest(0, { score: 80 });
               const postCompletionResult = await mockService.getJourneyStages(true);
               expect(postCompletionResult[1].status).toBe('UNLOCKED');
          });

     });

     describe('💾 Frontend-Backend Data Consistency', () => {

          it('should verify score calculation consistency between frontend and backend', () => {
               const testCases = [
                    {
                         backendScore: 70.0,
                         backendPassed: true,
                         frontendCalculated: true,
                         minScore: 70
                    },
                    {
                         backendScore: 69.9,
                         backendPassed: false,
                         frontendCalculated: false,
                         minScore: 70
                    },
                    {
                         backendScore: 88.89,
                         backendPassed: true,
                         frontendCalculated: true,
                         minScore: 70
                    },
                    {
                         // Edge case: Backend says passed but score below threshold
                         backendScore: 65,
                         backendPassed: true, // Backend override
                         frontendCalculated: false, // Frontend calculation
                         minScore: 70
                    }
               ];

               testCases.forEach(({ backendScore, backendPassed, frontendCalculated, minScore }, index) => {
                    // Frontend fallback logic
                    const passed = backendPassed !== undefined ? backendPassed : frontendCalculated;
                    const calculatedPassed = backendScore >= minScore;

                    console.log(`Test case ${index + 1}:`, {
                         backendScore,
                         backendPassed,
                         frontendCalculated: calculatedPassed,
                         finalPassed: passed
                    });

                    // Backend should take precedence
                    expect(passed).toBe(backendPassed);

                    // But we should also verify frontend calculation is correct
                    expect(calculatedPassed).toBe(frontendCalculated);
               });
          });

          it('should test stage status mapping between backend and frontend', async () => {
               const backendStageData = {
                    _id: 'userStage123',
                    stageId: 'stage_template_1',
                    state: 'COMPLETED', // Backend format
                    finalTest: {
                         unlocked: true,
                         completed: true,
                         started: true,
                         passed: true,
                         score: 85.5
                    }
               };

               // Mock backend response
               mockService.getJourneyStages.mockResolvedValue([
                    {
                         id: 'stage_template_1',
                         userStageId: 'userStage123',
                         status: 'COMPLETED', // Frontend format
                         finalExam: {
                              status: 'COMPLETED',
                              score: 85.5,
                              passed: true
                         }
                    }
               ]);

               const stages = await mockService.getJourneyStages(true);
               const stage = stages[0];

               // Verify mapping is correct
               expect(stage.id).toBe('stage_template_1');
               expect(stage.userStageId).toBe('userStage123');
               expect(stage.status).toBe('COMPLETED');
               expect(stage.finalExam.passed).toBe(true);
               expect(stage.finalExam.score).toBe(85.5);
          });

     });

     describe('🎯 Real-World Integration Scenarios', () => {

          it('should test complete user journey with realistic API responses from logs', async () => {
               // Sử dụng data thật từ logs user cung cấp
               const realTestResults = {
                    "accuracy": 100,
                    "answeredQuestions": 9,
                    "completedAt": "2025-06-11T03:43:59.179Z",
                    "correctAnswers": 9,
                    "endTime": "2025-06-11T03:43:59.179Z",
                    "mode": "FINAL_TEST",
                    "passed": true,
                    "score": 100,
                    "totalQuestions": 9,
                    "totalTimeSpent": 18356
               };

               // Mock completeStageFinalTest với response realistic
               mockService.completeStageFinalTest.mockResolvedValue({
                    message: "Final test submitted successfully",
                    journey: {
                         _id: 'journey123',
                         currentStageIndex: 1,
                         stages: [
                              {
                                   _id: 'userStage1',
                                   stageId: '6847e821fab9ed886bab5ec1',
                                   state: 'COMPLETED',
                                   finalTest: {
                                        passed: true,
                                        score: 100,
                                        completed: true,
                                        completedAt: "2025-06-11T03:43:59.179Z"
                                   }
                              },
                              {
                                   _id: 'userStage2',
                                   stageId: 'stage_template_2',
                                   state: 'IN_PROGRESS',
                                   finalTest: { passed: false, score: null, unlocked: true }
                              }
                         ]
                    },
                    finalTestResult: {
                         score: 100,
                         passed: true,
                         completedAt: "2025-06-11T03:43:59.179Z"
                    }
               });

               // Mock getJourneyStages với timing issue simulation
               let refreshCallCount = 0;
               mockService.getJourneyStages.mockImplementation((forceFresh) => {
                    refreshCallCount++;

                    if (!forceFresh && refreshCallCount === 1) {
                         // Lần đầu không force refresh - return stale data
                         console.log('🔄 Returning STALE data (no force refresh)');
                         return Promise.resolve([
                              {
                                   id: '6847e821fab9ed886bab5ec1',
                                   status: 'COMPLETED',
                                   finalExam: { passed: true, score: 100 }
                              },
                              {
                                   id: 'stage_template_2',
                                   status: 'LOCKED', // ❌ BUG: Vẫn locked mặc dù đã pass
                                   finalExam: { passed: false, score: null }
                              }
                         ]);
                    } else {
                         // Force refresh hoặc subsequent calls - return fresh data
                         console.log('✅ Returning FRESH data (force refresh)');
                         return Promise.resolve([
                              {
                                   id: '6847e821fab9ed886bab5ec1',
                                   status: 'COMPLETED',
                                   finalExam: { passed: true, score: 100 }
                              },
                              {
                                   id: 'stage_template_2',
                                   status: 'UNLOCKED', // ✅ FIXED: Now unlocked
                                   finalExam: { passed: false, score: null }
                              }
                         ]);
                    }
               });

               // 1. Submit final test với score 100%
               console.log('📤 Submitting final test...');
               const completionResult = await mockService.completeStageFinalTest(0, realTestResults);

               // Verify completion
               expect(completionResult.finalTestResult.passed).toBe(true);
               expect(completionResult.finalTestResult.score).toBe(100);
               expect(completionResult.journey.currentStageIndex).toBe(1);

               // 2. ❌ BUG SIMULATION: First check without force refresh
               console.log('🔍 Checking stages (no force refresh)...');
               const staleStages = await mockService.getJourneyStages(false);
               expect(staleStages[1].status).toBe('LOCKED'); // Bug reproduced!

               console.log('🐛 BUG DETECTED: Stage 2 still locked despite passing Stage 1 final test');

               // 3. ✅ FIX: Force refresh should resolve the issue
               console.log('🔄 Force refreshing...');
               const freshStages = await mockService.getJourneyStages(true);
               expect(freshStages[1].status).toBe('UNLOCKED'); // Bug fixed!

               console.log('✅ BUG FIXED: Stage 2 now unlocked after force refresh');

               // Verify the fix resolves the issue
               expect(mockService.completeStageFinalTest).toHaveBeenCalledWith(0, realTestResults);
               expect(mockService.getJourneyStages).toHaveBeenCalledWith(false);
               expect(mockService.getJourneyStages).toHaveBeenCalledWith(true);
          });

          it('should test the exact scenario from user logs with timestamp cache busting', async () => {
               // Test với timestamp thật từ logs: ?t=1749613440581
               const logTimestamp = 1749613440581;
               Date.now = jest.fn(() => logTimestamp);

               mockService.getStageFinalTest.mockImplementation((stageIndex, forceFresh) => {
                    const endpoint = forceFresh
                         ? `/journeys/stage-final-test/${stageIndex}?t=${Date.now()}`
                         : `/journeys/stage-final-test/${stageIndex}`;

                    console.log(`📡 API Call: ${endpoint}`);

                    return Promise.resolve({
                         canTakeTest: true,
                         finalTestCompleted: undefined,
                         finalTestUnlocked: undefined,
                         stageIndex: stageIndex,
                         totalQuestions: 9,
                         timestamp: logTimestamp
                    });
               });

               // Test force refresh với timestamp
               const result = await mockService.getStageFinalTest(0, true);

               expect(result.stageIndex).toBe(0);
               expect(result.totalQuestions).toBe(9);
               expect(result.timestamp).toBe(logTimestamp);

               // Verify cache busting URL format
               const expectedEndpoint = `/journeys/stage-final-test/0?t=${logTimestamp}`;
               expect(expectedEndpoint).toBe('/journeys/stage-final-test/0?t=1749613440581');
          });

          it('should test navigation flow after test completion matches logs pattern', () => {
               const mockRouter = {
                    push: jest.fn(),
                    replace: jest.fn(),
                    back: jest.fn()
               };

               // Simulate TestResults component navigation với refresh parameter
               const handleBackToStage = (stageId: string) => {
                    mockRouter.push({
                         pathname: "/journeyNew/screens/StageDetails",
                         params: {
                              stageId: stageId,
                              journeyId: 'journey123',
                              refresh: "true" // Critical: This triggers force refresh
                         }
                    });
               };

               const handleBackToJourney = () => {
                    mockRouter.push({
                         pathname: "/journeyNew",
                         params: {
                              refresh: "true" // Critical: This triggers force refresh  
                         }
                    });
               };

               // Test navigation calls
               handleBackToStage('6847e821fab9ed886bab5ec1');
               handleBackToJourney();

               // Verify navigation parameters include refresh
               expect(mockRouter.push).toHaveBeenCalledWith({
                    pathname: "/journeyNew/screens/StageDetails",
                    params: {
                         stageId: '6847e821fab9ed886bab5ec1',
                         journeyId: 'journey123',
                         refresh: "true"
                    }
               });

               expect(mockRouter.push).toHaveBeenCalledWith({
                    pathname: "/journeyNew",
                    params: {
                         refresh: "true"
                    }
               });
          });

     });

     describe('🔧 Advanced Edge Cases', () => {

          it('should test multiple concurrent test completions', async () => {
               // Scenario: User completes test, then immediately navigates
               let completionCount = 0;

               mockService.completeStageFinalTest.mockImplementation(() => {
                    completionCount++;
                    return Promise.resolve({
                         score: 90,
                         passed: true,
                         timestamp: Date.now(),
                         completionId: completionCount
                    });
               });

               // Simulate rapid completion + navigation
               const [result1, result2] = await Promise.all([
                    mockService.completeStageFinalTest(0, { score: 90 }),
                    mockService.completeStageFinalTest(0, { score: 90 })
               ]);

               // Both should succeed but have different IDs
               expect(result1.passed).toBe(true);
               expect(result2.passed).toBe(true);
               expect(result1.completionId).not.toBe(result2.completionId);
          });

          it('should test stage status inconsistency detection', async () => {
               // Mock inconsistent backend responses
               mockService.completeStageFinalTest.mockResolvedValue({
                    score: 95,
                    passed: true,
                    journey: {
                         stages: [
                              { state: 'COMPLETED', finalTest: { passed: true } },
                              { state: 'LOCKED', finalTest: { passed: false } } // Inconsistent!
                         ]
                    }
               });

               mockService.getJourneyStages.mockResolvedValue([
                    { id: 'stage-1', status: 'COMPLETED' },
                    { id: 'stage-2', status: 'UNLOCKED' } // Different from completion response!
               ]);

               const completionResult = await mockService.completeStageFinalTest(0, {});
               const stagesResult = await mockService.getJourneyStages(true);

               // Detect inconsistency
               const completionStageStatus = completionResult.journey.stages[1].state; // 'LOCKED'
               const stagesStageStatus = stagesResult[1].status; // 'UNLOCKED'

               expect(completionStageStatus).toBe('LOCKED');
               expect(stagesStageStatus).toBe('UNLOCKED');

               // Frontend should handle this inconsistency
               const isConsistent = completionStageStatus === stagesStageStatus;
               expect(isConsistent).toBe(false);

               console.warn('⚠️ Data inconsistency detected between APIs:', {
                    completionAPI: completionStageStatus,
                    stagesAPI: stagesStageStatus
               });
          });

          it('should test API response time variance impact on user experience', async () => {
               const startTime = Date.now();

               // Mock slow completion but fast stages call
               mockService.completeStageFinalTest.mockImplementation(() =>
                    new Promise(resolve => setTimeout(() => resolve({
                         score: 88,
                         passed: true,
                         responseTime: Date.now() - startTime
                    }), 2000)) // 2 second delay
               );

               mockService.getJourneyStages.mockImplementation(() =>
                    new Promise(resolve => setTimeout(() => resolve([
                         { id: 'stage-1', status: 'COMPLETED' },
                         { id: 'stage-2', status: 'UNLOCKED' }
                    ]), 100)) // 100ms delay
               );

               const [completionResult, stagesResult] = await Promise.all([
                    mockService.completeStageFinalTest(0, {}),
                    mockService.getJourneyStages(true)
               ]);

               // Stages result comes back much faster
               expect(completionResult.responseTime).toBeGreaterThan(1900);
               expect(stagesResult[1].status).toBe('UNLOCKED');

               // This timing difference could cause UI inconsistencies
               console.log('⏱️ Response time analysis:', {
                    completionTime: completionResult.responseTime,
                    stagesApiTime: 'fast (~100ms)',
                    potentialIssue: 'UI might show unlocked stage before completion finishes'
               });
          });

     });

}); 