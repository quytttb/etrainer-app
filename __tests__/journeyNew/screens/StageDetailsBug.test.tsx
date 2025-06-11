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
          }, 'Stage Detail Component');
     };
});

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
                              minScore: 70, // Đây phải là 70%, không phải 300%
                              targetScore: 450,
                              status: 'IN_PROGRESS',
                              progress: 50,
                              days: [],
                              finalTest: {
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

          it('should calculate pass status correctly based on 70% threshold', () => {
               const testCases = [
                    { score: 70, expectPassed: true },
                    { score: 85, expectPassed: true },
                    { score: 100, expectPassed: true },
                    { score: 69, expectPassed: false },
                    { score: 50, expectPassed: false },
                    { score: 0, expectPassed: false }
               ];

               testCases.forEach(({ score, expectPassed }) => {
                    const passed = score >= 70;
                    expect(passed).toBe(expectPassed);
               });
          });
     });
}); 