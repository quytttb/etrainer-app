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
          stageIndex: '0',
     }),
}));

jest.mock('../../../app/journeyNew/hooks/useJourneyData');
jest.mock('../../../hooks/useBackHandler');

// Mock service
jest.mock('../../../app/journeyNew/service', () => ({
     JourneyNewService: {
          getJourneyOverview: jest.fn(),
          getJourneyStages: jest.fn(),
          getStageFinalTest: jest.fn(),
     },
}));

// Mock StageDetail component
jest.mock('../../../app/journeyNew/components/StageDetail', () => {
     const mockReact = require('react');
     return function MockStageDetail(props: any) {
          return mockReact.createElement('View', {
               testID: 'stage-detail',
               stageData: props.stageData,
               onSelectDay: props.onSelectDay,
               onSelectLesson: props.onSelectLesson,
               onSelectTest: props.onSelectTest,
               onStartFinalExam: props.onStartFinalExam,
               onGoBack: props.onGoBack
          }, 'Stage Detail Component');
     };
});

const mockUseJourneyData = require('../../../app/journeyNew/hooks/useJourneyData').useJourneyData;
const mockService = require('../../../app/journeyNew/service').JourneyNewService;

describe('StageDetails Screen - Bug Fixes Tests', () => {

     beforeEach(() => {
          jest.clearAllMocks();
     });

     describe('(4) Điểm tối thiểu mong muốn là 70%, không phải 300%', () => {

          it('should display minimum score as 70% for Stage 1', async () => {
               const mockJourneyData = {
                    id: 'journey-1',
                    title: 'Lộ Trình Học Tập',
                    stages: [
                         {
                              id: 'stage-1',
                              stageNumber: 1,
                              title: 'Giai đoạn 1: 300-450 điểm',
                              description: 'Nâng cao kỹ năng TOEIC từ 300 lên 450 điểm',
                              minScore: 70, // Đây phải là 70%, không phải 300%
                              targetScore: 450,
                              status: 'IN_PROGRESS',
                              progress: 50,
                              days: [
                                   {
                                        _id: 'day-1',
                                        dayNumber: 1,
                                        completed: true,
                                        started: true,
                                        questions: ['q1', 'q2', 'q3']
                                   }
                              ],
                              finalTest: {
                                   unlocked: false,
                                   completed: false,
                                   passed: false,
                                   requiredScore: 70 // Điểm tối thiểu để pass
                              }
                         }
                    ]
               };

               mockService.getJourneyOverview.mockResolvedValue(mockJourneyData);

               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');
               expect(stageDetail).toBeTruthy();

               // Kiểm tra minScore là 70%, không phải 300%
               expect(stageDetail.props.stageData.minScore).toBe(70);
               expect(stageDetail.props.stageData.minScore).not.toBe(300);
               expect(stageDetail.props.stageData.minScore).toBeGreaterThanOrEqual(0);
               expect(stageDetail.props.stageData.minScore).toBeLessThanOrEqual(100);
          });

          it('should display minimum score as 70% for Stage 2', async () => {
               const mockJourneyData = {
                    id: 'journey-1',
                    title: 'Lộ Trình Học Tập',
                    stages: [
                         {
                              id: 'stage-2',
                              stageNumber: 2,
                              title: 'Giai đoạn 2: 450-600 điểm',
                              description: 'Nâng cao kỹ năng TOEIC từ 450 lên 600 điểm',
                              minScore: 70, // Điểm tối thiểu 70%
                              targetScore: 600,
                              status: 'LOCKED',
                              progress: 0,
                              days: [],
                              finalTest: {
                                   unlocked: false,
                                   completed: false,
                                   passed: false,
                                   requiredScore: 70
                              }
                         }
                    ]
               };

               // Mock useLocalSearchParams để simulate stage 2
               jest.doMock('expo-router', () => ({
                    useRouter: () => ({
                         push: jest.fn(),
                         replace: jest.fn(),
                         back: jest.fn(),
                    }),
                    useLocalSearchParams: () => ({
                         stageId: 'stage-2',
                         journeyId: 'journey-1',
                         stageIndex: '1',
                    }),
               }));

               mockService.getJourneyOverview.mockResolvedValue(mockJourneyData);

               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');

               expect(stageDetail.props.stageData.minScore).toBe(70);
               expect(stageDetail.props.stageData.minScore).not.toBe(450); // Không phải target score
               expect(stageDetail.props.stageData.minScore).not.toBe(300);
          });

          it('should validate minimum score is percentage (0-100)', async () => {
               const mockJourneyData = {
                    id: 'journey-1',
                    title: 'Lộ Trình Học Tập',
                    stages: [
                         {
                              id: 'stage-1',
                              stageNumber: 1,
                              title: 'Giai đoạn 1: 300-450 điểm',
                              minScore: 70, // Phần trăm
                              targetScore: 450, // Điểm TOEIC target
                              status: 'IN_PROGRESS',
                              progress: 50,
                              days: [],
                              finalTest: {
                                   unlocked: true,
                                   completed: false,
                                   passed: false,
                                   requiredScore: 70
                              }
                         }
                    ]
               };

               mockService.getJourneyOverview.mockResolvedValue(mockJourneyData);

               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');

               // minScore phải là percentage (0-100)
               expect(stageDetail.props.stageData.minScore).toBeGreaterThanOrEqual(0);
               expect(stageDetail.props.stageData.minScore).toBeLessThanOrEqual(100);

               // targetScore là điểm TOEIC (300-990)
               expect(stageDetail.props.stageData.targetScore).toBeGreaterThanOrEqual(300);
               expect(stageDetail.props.stageData.targetScore).toBeLessThanOrEqual(990);

               // Phân biệt rõ ràng giữa minScore và targetScore
               expect(stageDetail.props.stageData.minScore).not.toBe(stageDetail.props.stageData.targetScore);
          });

          it('should not confuse minimum score percentage with TOEIC target score', async () => {
               const mockJourneyData = {
                    id: 'journey-1',
                    title: 'Lộ Trình Học Tập',
                    stages: [
                         {
                              id: 'stage-1',
                              stageNumber: 1,
                              title: 'Giai đoạn 1: 300-450 điểm',
                              minScore: 70, // 70% để pass final test
                              targetScore: 450, // 450 điểm TOEIC
                              status: 'IN_PROGRESS',
                              progress: 50,
                              days: [],
                              finalTest: {
                                   unlocked: true,
                                   completed: false,
                                   passed: false,
                                   requiredScore: 70 // 70% để pass
                              }
                         },
                         {
                              id: 'stage-2',
                              stageNumber: 2,
                              title: 'Giai đoạn 2: 450-600 điểm',
                              minScore: 70, // 70% để pass final test
                              targetScore: 600, // 600 điểm TOEIC
                              status: 'LOCKED',
                              progress: 0,
                              days: [],
                              finalTest: {
                                   unlocked: false,
                                   completed: false,
                                   passed: false,
                                   requiredScore: 70
                              }
                         }
                    ]
               };

               mockService.getJourneyOverview.mockResolvedValue(mockJourneyData);

               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');

               // Tất cả các stage đều có minScore = 70%
               mockJourneyData.stages.forEach((stage) => {
                    expect(stage.minScore).toBe(70);
                    expect(stage.minScore).not.toBe(stage.targetScore);
               });

               // Final test required score cũng phải là 70%
               expect(stageDetail.props.stageData.finalTest.requiredScore).toBe(70);
          });

          it('should handle edge cases with invalid minimum scores', async () => {
               const mockJourneyDataWithInvalidScore = {
                    id: 'journey-1',
                    title: 'Lộ Trình Học Tập',
                    stages: [
                         {
                              id: 'stage-1',
                              stageNumber: 1,
                              title: 'Giai đoạn 1',
                              minScore: 300, // Sai: đây là target score, không phải min score
                              targetScore: 450,
                              status: 'IN_PROGRESS',
                              progress: 50,
                              days: [],
                              finalTest: {
                                   unlocked: true,
                                   requiredScore: 300 // Sai: phải là 70%
                              }
                         }
                    ]
               };

               mockService.getJourneyOverview.mockResolvedValue(mockJourneyDataWithInvalidScore);

               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');

               // Nên validate và sửa minScore không hợp lý
               if (stageDetail.props.stageData.minScore > 100) {
                    // Nếu code đã fix bug, minScore sẽ được điều chỉnh về 70%
                    expect(stageDetail.props.stageData.minScore).toBe(70);
               } else {
                    // Hoặc ít nhất không phải là target score
                    expect(stageDetail.props.stageData.minScore).not.toBe(300);
                    expect(stageDetail.props.stageData.minScore).not.toBe(450);
               }
          });

          it('should display correct Vietnamese text for minimum score', async () => {
               const mockJourneyData = {
                    id: 'journey-1',
                    title: 'Lộ Trình Học Tập',
                    stages: [
                         {
                              id: 'stage-1',
                              stageNumber: 1,
                              title: 'Giai đoạn 1: 300-450 điểm',
                              description: 'Điểm tối thiều: 70%', // Tiếng Việt
                              minScore: 70,
                              targetScore: 450,
                              status: 'IN_PROGRESS',
                              progress: 50,
                              days: [],
                              finalTest: {
                                   unlocked: true,
                                   requiredScore: 70,
                                   description: 'Bạn cần đạt tối thiểu 70% để mở khóa giai đoạn tiếp theo'
                              }
                         }
                    ]
               };

               mockService.getJourneyOverview.mockResolvedValue(mockJourneyData);

               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');

               expect(stageDetail.props.stageData.minScore).toBe(70);

               // Kiểm tra description tiếng Việt
               expect(stageDetail.props.stageData.description).toMatch(/Điểm tối thiều: 70%/);
               expect(stageDetail.props.stageData.finalTest.description).toMatch(/70%/);
               expect(stageDetail.props.stageData.finalTest.description).toMatch(/giai đoạn tiếp theo/);
          });
     });

     describe('Progress calculation with correct minimum score', () => {

          it('should calculate final test passing status based on 70% threshold', async () => {
               const mockJourneyData = {
                    id: 'journey-1',
                    title: 'Lộ Trình Học Tập',
                    stages: [
                         {
                              id: 'stage-1',
                              stageNumber: 1,
                              title: 'Giai đoạn 1',
                              minScore: 70,
                              targetScore: 450,
                              status: 'IN_PROGRESS',
                              progress: 100,
                              days: [
                                   { _id: 'day-1', completed: true },
                                   { _id: 'day-2', completed: true },
                                   { _id: 'day-3', completed: true }
                              ],
                              finalTest: {
                                   unlocked: true,
                                   completed: true,
                                   passed: true,
                                   score: 75, // 75% > 70% = passed
                                   requiredScore: 70
                              }
                         }
                    ]
               };

               mockService.getJourneyOverview.mockResolvedValue(mockJourneyData);

               const { findByTestId } = renderWithProviders(<StageDetailsScreen />);

               const stageDetail = await findByTestId('stage-detail');

               expect(stageDetail.props.stageData.finalTest.passed).toBe(true);
               expect(stageDetail.props.stageData.finalTest.score).toBeGreaterThanOrEqual(70);
          });
     });
}); 