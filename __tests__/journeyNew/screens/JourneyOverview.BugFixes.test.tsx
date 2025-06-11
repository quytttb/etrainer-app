import React from 'react';
import { renderWithProviders } from '../../utils/testUtils';
import JourneyOverviewScreen from '../../../app/journeyNew/screens/JourneyOverview';

// Mock dependencies
jest.mock('expo-router', () => ({
     useRouter: () => ({
          push: jest.fn(),
          replace: jest.fn(),
     }),
}));

jest.mock('../../../app/journeyNew/hooks/useJourneyData');
jest.mock('../../../hooks/useBackHandler');
jest.mock('../../../hooks/useAuth');

// Mock JourneySelector component to test props
jest.mock('../../../app/journeyNew/components/JourneySelector', () => {
     const mockReact = require('react');
     return function MockJourneySelector(props: any) {
          return mockReact.createElement('View', {
               testID: 'journey-selector',
               ...props
          }, 'Journey Selector');
     };
});

const mockUseJourneyData = require('../../../app/journeyNew/hooks/useJourneyData').useJourneyData;
const mockUseAuth = require('../../../hooks/useAuth').default;

describe('JourneyOverview Screen - Bug Fixes Tests', () => {

     beforeEach(() => {
          jest.clearAllMocks();

          mockUseAuth.mockReturnValue({
               onLogout: jest.fn(),
          });
     });

     describe('(1) Card lộ trình hiện tại - Giai đoạn hiển thị', () => {

          it('should display correct current stage instead of NaN/2', () => {
               const mockData = {
                    overview: {
                         id: 'journey-1',
                         title: 'Lộ Trình Học Tập',
                         progress: 50,
                         currentStage: 2,
                         totalStages: 4,
                    },
                    stages: [
                         {
                              id: 'stage-1',
                              stageNumber: 1,
                              title: 'Giai đoạn 1: 300-450 điểm',
                              status: 'COMPLETED',
                              progress: 100,
                         },
                         {
                              id: 'stage-2',
                              stageNumber: 2,
                              title: 'Giai đoạn 2: 450-600 điểm',
                              status: 'IN_PROGRESS',
                              progress: 75,
                         }
                    ],
                    loading: false,
                    error: null,
                    refreshData: jest.fn(),
                    isDataStale: false,
                    forceRefresh: jest.fn(),
                    isAuthenticated: true,
               };

               mockUseJourneyData.mockReturnValue(mockData);

               const { getByTestId } = renderWithProviders(<JourneyOverviewScreen />);
               const journeySelector = getByTestId('journey-selector');

               // Kiểm tra props được truyền vào component
               expect(journeySelector.props.journeyData.currentStage).toBe(2);
               expect(journeySelector.props.journeyData.totalStages).toBe(4);
               // Đảm bảo không có NaN/2
               expect(journeySelector.props.journeyData.currentStage).not.toBeNaN();
               expect(journeySelector.props.journeyData.totalStages).not.toBeNaN();
               expect(typeof journeySelector.props.journeyData.currentStage).toBe('number');
               expect(typeof journeySelector.props.journeyData.totalStages).toBe('number');
          });

          it('should handle edge case where currentStage is undefined', () => {
               const mockData = {
                    overview: {
                         id: 'journey-1',
                         title: 'Lộ Trình Học Tập',
                         progress: 0,
                         currentStage: undefined,
                         totalStages: 3,
                    },
                    stages: [],
                    loading: false,
                    error: null,
                    refreshData: jest.fn(),
                    isDataStale: false,
                    forceRefresh: jest.fn(),
                    isAuthenticated: true,
               };

               mockUseJourneyData.mockReturnValue(mockData);

               const { getByTestId } = renderWithProviders(<JourneyOverviewScreen />);
               const journeySelector = getByTestId('journey-selector');

               // Nên hiển thị giá trị mặc định thay vì undefined
               expect(journeySelector.props.journeyData.currentStage).toBeDefined();
               expect(journeySelector.props.journeyData.currentStage).not.toBeNaN();
          });

          it('should handle edge case where totalStages is zero', () => {
               const mockData = {
                    overview: {
                         id: 'journey-1',
                         title: 'Lộ Trình Học Tập',
                         progress: 0,
                         currentStage: 1,
                         totalStages: 0,
                    },
                    stages: [],
                    loading: false,
                    error: null,
                    refreshData: jest.fn(),
                    isDataStale: false,
                    forceRefresh: jest.fn(),
                    isAuthenticated: true,
               };

               mockUseJourneyData.mockReturnValue(mockData);

               const { getByTestId } = renderWithProviders(<JourneyOverviewScreen />);
               const journeySelector = getByTestId('journey-selector');

               // Nên xử lý trường hợp totalStages = 0 để tránh hiển thị NaN
               expect(journeySelector.props.journeyData.totalStages).toBeDefined();
               expect(journeySelector.props.journeyData.totalStages).not.toBeNaN();
          });
     });

     describe('(1) Sử dụng tiếng Việt, không phải tiếng Anh', () => {

          it('should display Vietnamese titles and descriptions', () => {
               const mockData = {
                    overview: {
                         id: 'journey-1',
                         title: 'Lộ Trình Học Tập',  // Tiếng Việt
                         description: 'Nâng cao kỹ năng TOEIC từ 300 lên 450 điểm',  // Tiếng Việt
                         progress: 50,
                         currentStage: 1,
                         totalStages: 2,
                    },
                    stages: [
                         {
                              id: 'stage-1',
                              stageNumber: 1,
                              title: 'Giai đoạn 1: 300-450 điểm',  // Tiếng Việt
                              status: 'Đang học',  // Tiếng Việt
                              progress: 50,
                         }
                    ],
                    loading: false,
                    error: null,
                    refreshData: jest.fn(),
                    isDataStale: false,
                    forceRefresh: jest.fn(),
                    isAuthenticated: true,
               };

               mockUseJourneyData.mockReturnValue(mockData);

               const { getByTestId } = renderWithProviders(<JourneyOverviewScreen />);
               const journeySelector = getByTestId('journey-selector');

               // Kiểm tra tiêu đề tiếng Việt
               expect(journeySelector.props.journeyData.title).toBe('Lộ Trình Học Tập');
               expect(journeySelector.props.journeyData.title).not.toMatch(/English Learning Journey/i);

               // Kiểm tra stage title tiếng Việt
               expect(journeySelector.props.stagesData[0].title).toBe('Giai đoạn 1: 300-450 điểm');
               expect(journeySelector.props.stagesData[0].title).not.toMatch(/Beginner|Intermediate|Advanced/i);
          });

          it('should not contain English text in status', () => {
               const mockData = {
                    overview: {
                         id: 'journey-1',
                         title: 'Lộ Trình Học Tập',
                         progress: 75,
                         currentStage: 2,
                         totalStages: 3,
                    },
                    stages: [
                         {
                              id: 'stage-1',
                              stageNumber: 1,
                              title: 'Giai đoạn 1',
                              status: 'Hoàn thành',  // Tiếng Việt thay vì 'COMPLETED'
                              progress: 100,
                         },
                         {
                              id: 'stage-2',
                              stageNumber: 2,
                              title: 'Giai đoạn 2',
                              status: 'Đang học',  // Tiếng Việt thay vì 'IN_PROGRESS'
                              progress: 50,
                         },
                         {
                              id: 'stage-3',
                              stageNumber: 3,
                              title: 'Giai đoạn 3',
                              status: 'Chưa mở khóa',  // Tiếng Việt thay vì 'LOCKED'
                              progress: 0,
                         }
                    ],
                    loading: false,
                    error: null,
                    refreshData: jest.fn(),
                    isDataStale: false,
                    forceRefresh: jest.fn(),
                    isAuthenticated: true,
               };

               mockUseJourneyData.mockReturnValue(mockData);

               const { getByTestId } = renderWithProviders(<JourneyOverviewScreen />);
               const journeySelector = getByTestId('journey-selector');

               // Kiểm tra status không chứa tiếng Anh
               journeySelector.props.stagesData.forEach((stage: any) => {
                    expect(stage.status).not.toMatch(/COMPLETED|IN_PROGRESS|LOCKED|CURRENT/);
                    expect(stage.status).toMatch(/Hoàn thành|Đang học|Chưa mở khóa/);
               });
          });
     });

     describe('Card lộ trình hiển thị progress chính xác', () => {

          it('should display accurate progress percentage', () => {
               const mockData = {
                    overview: {
                         id: 'journey-1',
                         title: 'Lộ Trình Học Tập',
                         progress: 67,  // Phần trăm chính xác
                         currentStage: 2,
                         totalStages: 3,
                    },
                    stages: [
                         {
                              id: 'stage-1',
                              stageNumber: 1,
                              title: 'Giai đoạn 1',
                              status: 'Hoàn thành',
                              progress: 100,
                         },
                         {
                              id: 'stage-2',
                              stageNumber: 2,
                              title: 'Giai đoạn 2',
                              status: 'Đang học',
                              progress: 50,
                         }
                    ],
                    loading: false,
                    error: null,
                    refreshData: jest.fn(),
                    isDataStale: false,
                    forceRefresh: jest.fn(),
                    isAuthenticated: true,
               };

               mockUseJourneyData.mockReturnValue(mockData);

               const { getByTestId } = renderWithProviders(<JourneyOverviewScreen />);
               const journeySelector = getByTestId('journey-selector');

               expect(journeySelector.props.journeyData.progress).toBe(67);
               expect(journeySelector.props.journeyData.progress).toBeGreaterThanOrEqual(0);
               expect(journeySelector.props.journeyData.progress).toBeLessThanOrEqual(100);
          });
     });
}); 