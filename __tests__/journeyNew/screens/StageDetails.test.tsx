import React from 'react';
import { renderWithProviders } from '../../utils/testUtils';
import StageDetailsScreen from '../../../app/journeyNew/screens/StageDetails';

// Mock dependencies
jest.mock('expo-router', () => ({
     useRouter: () => ({
          push: jest.fn(),
          replace: jest.fn(),
          back: jest.fn(),
     }),
     useLocalSearchParams: () => ({
          stageId: 'stage-1',
          journeyId: 'journey-1',
          journeyTitle: 'English Learning Journey',
     }),
}));

jest.mock('@react-navigation/native', () => {
     const mockReact = require('react');
     return {
          useFocusEffect: (callback: any) => {
               mockReact.useEffect(callback, []);
          },
     };
});

jest.mock('../../../hooks/useBackHandler');

// Mock the service module with proper ES module structure
jest.mock('../../../app/journeyNew/service', () => ({
     JourneyNewService: {
          getJourneyOverview: jest.fn(),
          getJourneyStages: jest.fn(),
          getStageFinalTest: jest.fn(),
     },
}));

// Mock components using successful pattern from JourneyOverview
jest.mock('../../../app/journeyNew/components/StageDetail', () => {
     const mockReact = require('react');
     return function MockStageDetail(props: any) {
          return mockReact.createElement('View', {
               testID: 'stage-detail',
               data: props.stageData, // ✅ FIXED: Use stageData prop instead of data
               onSelectDay: props.onSelectDay,
               onSelectLesson: props.onSelectLesson,
               onSelectTest: props.onSelectTest,
               onStartFinalExam: props.onStartFinalExam,
               onGoBack: props.onGoBack
          }, 'Stage Detail Component');
     };
});

jest.mock('../../../app/journeyNew/components/Common/LoadingSpinner', () => {
     const mockReact = require('react');
     const { Text } = require('react-native');
     return function MockLoadingSpinner(props: any) {
          return mockReact.createElement('View', {
               testID: 'loading-spinner',
               style: props.fullScreen ? { flex: 1 } : {}
          }, mockReact.createElement(Text, {}, props.text || 'Loading...'));
     };
});

jest.mock('../../../app/journeyNew/components/Common/ErrorMessage', () => {
     const mockReact = require('react');
     const { TouchableOpacity, Text } = require('react-native');
     return function MockErrorMessage(props: any) {
          return mockReact.createElement('View', {
               testID: 'error-message',
               style: props.fullScreen ? { flex: 1 } : {}
          }, [
               mockReact.createElement(Text, { key: 'message' }, props.message),
               props.onRetry ? mockReact.createElement(TouchableOpacity, {
                    key: 'retry',
                    testID: 'retry-button',
                    onPress: props.onRetry
               }, mockReact.createElement(Text, {}, props.retryText || 'Retry')) : null
          ].filter(Boolean));
     };
});

const mockService = require('../../../app/journeyNew/service').JourneyNewService;

describe('StageDetails Screen', () => {
     const mockJourneyData = {
          stages: [
               {
                    stageId: 'stage-1',
                    status: 'IN_PROGRESS',
                    days: [
                         {
                              _id: 'day-1',
                              dayNumber: 1,
                              started: true,
                              completed: true,
                              questions: ['q1', 'q2', 'q3'],
                         },
                         {
                              _id: 'day-2',
                              dayNumber: 2,
                              started: true,
                              completed: false,
                              questions: ['q4', 'q5', 'q6'],
                         },
                         {
                              _id: 'day-3',
                              dayNumber: 3,
                              started: false,
                              completed: false,
                              questions: ['q7', 'q8', 'q9'],
                         },
                    ],
                    finalTest: {
                         unlocked: false,
                         started: false,
                         completed: false,
                         score: null,
                         passed: false,
                    },
               },
          ],
     };

     const mockStagesData = [
          {
               id: 'stage-1',
               minScore: 0,
               targetScore: 300,
               days: [
                    { dayNumber: 1, questions: ['q1', 'q2', 'q3'] },
                    { dayNumber: 2, questions: ['q4', 'q5', 'q6'] },
                    { dayNumber: 3, questions: ['q7', 'q8', 'q9'] },
               ],
          },
     ];

     const mockFinalTestData = {
          finalTestInfo: {
               questions: ['ft1', 'ft2', 'ft3', 'ft4', 'ft5'],
          },
          finalTestUnlocked: false,
          finalTestCompleted: false,
          canTakeTest: false,
     };

     beforeEach(() => {
          jest.clearAllMocks();

          // Setup service mocks
          mockService.getJourneyOverview = jest.fn().mockResolvedValue(mockJourneyData);
          mockService.getJourneyStages = jest.fn().mockResolvedValue(mockStagesData);
          mockService.getStageFinalTest = jest.fn().mockResolvedValue(mockFinalTestData);
     });

     describe('Loading States', () => {
          it('should show loading spinner initially', () => {
               const { getByTestId } = renderWithProviders(<StageDetailsScreen />);

               const loadingSpinner = getByTestId('loading-spinner');
               expect(loadingSpinner).toBeTruthy();
          });

          it('should show correct loading text', () => {
               const { getByText } = renderWithProviders(<StageDetailsScreen />);

               // Should show custom loading text from StageDetails
               expect(getByText('Đang tải thông tin giai đoạn...')).toBeTruthy();
          });
     });

     describe('Error States', () => {
          it('should show error message when API call fails', async () => {
               mockService.getJourneyOverview.mockRejectedValue(new Error('Network error'));

               const { findByText } = renderWithProviders(<StageDetailsScreen />);

               const errorMessage = await findByText('Không thể tải dữ liệu giai đoạn. Vui lòng thử lại.');
               expect(errorMessage).toBeTruthy();
          });

          it('should show error when stage not found', async () => {
               mockService.getJourneyOverview.mockResolvedValue({ stages: [] });
               mockService.getJourneyStages.mockResolvedValue([]);

               const { findByText } = renderWithProviders(<StageDetailsScreen />);

               const errorMessage = await findByText('Không thể tải dữ liệu giai đoạn. Vui lòng thử lại.');
               expect(errorMessage).toBeTruthy();
          });

          it('should provide retry functionality on error', async () => {
               mockService.getJourneyOverview.mockRejectedValue(new Error('Network error'));

               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const retryButton = await findByTestId('retry-button');
               expect(retryButton).toBeTruthy();
          });
     });

     describe('Success State - Stage Rendering', () => {
          it('should render StageDetail component when data loads successfully', async () => {
               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail).toBeTruthy();
          });

          it('should pass correct stage data to StageDetail component', async () => {
               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail.props.data).toBeDefined();
               expect(stageDetail.props.data.id).toBe('stage-1');
               expect(stageDetail.props.data.title).toContain('Giai đoạn 1');
          });

          it('should calculate progress correctly from completed days', async () => {
               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               // 1 completed day out of 3 total days = 33% (rounded)
               expect(stageDetail.props.data.progress).toBe(33);
          });
     });

     describe('Day Management', () => {
          it('should display all days from stage data', async () => {
               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail.props.data.days).toHaveLength(3);
          });

          it('should show correct day completion status', async () => {
               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               const days = stageDetail.props.data.days;

               expect(days[0].completed).toBe(true);
               expect(days[1].completed).toBe(false);
               expect(days[2].completed).toBe(false);
          });

          it('should show correct day unlock status', async () => {
               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               const days = stageDetail.props.data.days;

               expect(days[0].started).toBe(true);
               expect(days[1].started).toBe(true);
               expect(days[2].started).toBe(false);
          });
     });

     describe('Final Test Integration', () => {
          it('should include final test data in stage data', async () => {
               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail.props.data.finalTest).toBeDefined();
               expect(stageDetail.props.data.finalTestData).toBeDefined();
          });

          it('should show final test unlock status correctly', async () => {
               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail.props.data.finalTest.unlocked).toBe(false);
               expect(stageDetail.props.data.finalTestData.canTakeTest).toBe(false);
          });

          it('should handle final test data loading failure gracefully', async () => {
               mockService.getStageFinalTest.mockRejectedValue(new Error('Final test error'));

               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               // Should still render stage detail even if final test fails
               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail).toBeTruthy();
          });
     });

     describe('Stage Information Display', () => {
          it('should display correct stage title with score range', async () => {
               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail.props.data.title).toBe('Giai đoạn 1: 0-300 điểm');
          });

          it('should display correct stage description', async () => {
               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail.props.data.description).toBe('Nâng cao kỹ năng TOEIC từ 0 lên 300 điểm');
          });

          it('should include min and target scores', async () => {
               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail.props.data.minScore).toBe(0);
               expect(stageDetail.props.data.targetScore).toBe(300);
          });

          it('should include stage number for display', async () => {
               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail.props.data.stageNumber).toBe(1);
          });
     });

     describe('Progress Calculation', () => {
          it('should calculate progress based on completed days', async () => {
               const modifiedMockData = {
                    ...mockJourneyData,
                    stages: [
                         {
                              ...mockJourneyData.stages[0],
                              days: [
                                   { ...mockJourneyData.stages[0].days[0], completed: true },
                                   { ...mockJourneyData.stages[0].days[1], completed: true },
                                   { ...mockJourneyData.stages[0].days[2], completed: false },
                              ],
                         },
                    ],
               };

               mockService.getJourneyOverview.mockResolvedValue(modifiedMockData);

               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               // 2 completed days out of 3 total days = 67% (rounded)
               expect(stageDetail.props.data.progress).toBe(67);
          });

          it('should handle 100% completion correctly', async () => {
               const modifiedMockData = {
                    ...mockJourneyData,
                    stages: [
                         {
                              ...mockJourneyData.stages[0],
                              days: mockJourneyData.stages[0].days.map(day => ({ ...day, completed: true })),
                         },
                    ],
               };

               mockService.getJourneyOverview.mockResolvedValue(modifiedMockData);

               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail.props.data.progress).toBe(100);
          });

          it('should handle zero progress correctly', async () => {
               const modifiedMockData = {
                    ...mockJourneyData,
                    stages: [
                         {
                              ...mockJourneyData.stages[0],
                              days: mockJourneyData.stages[0].days.map(day => ({ ...day, completed: false })),
                         },
                    ],
               };

               mockService.getJourneyOverview.mockResolvedValue(modifiedMockData);

               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail.props.data.progress).toBe(0);
          });
     });

     describe('Navigation Context', () => {
          it('should include journey context information', async () => {
               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail.props.data.journeyId).toBe('journey-1');
               expect(stageDetail.props.data.journeyTitle).toBe('English Learning Journey');
          });

          it('should include stage index for navigation', async () => {
               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail.props.data.stageIndex).toBe(0);
          });
     });
}); 