import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { renderWithProviders } from '../../utils/testUtils';
import JourneyOverviewScreen from '../../../app/journeyNew/screens/JourneyOverview';

// Mock dependencies inline
jest.mock('expo-router', () => ({
     useRouter: () => ({
          push: jest.fn(),
          replace: jest.fn(),
     }),
}));

jest.mock('../../../app/journeyNew/hooks/useJourneyData');
jest.mock('../../../hooks/useBackHandler');
jest.mock('../../../hooks/useAuth');

// Mock components inline
jest.mock('../../../app/journeyNew/components/JourneySelector', () => {
     const mockReact = require('react');
     return function MockJourneySelector(props: any) {
          return mockReact.createElement('View', {
               testID: 'journey-selector',
               ...props
          }, 'Journey Selector');
     };
});

jest.mock('../../../app/journeyNew/components/Common/LoadingSpinner', () => {
     const mockReact = require('react');
     return function MockLoadingSpinner(props: any) {
          return mockReact.createElement('View', {
               testID: 'loading-spinner',
               style: props.fullScreen ? { flex: 1 } : {}
          }, props.text || 'Loading...');
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

const mockUseJourneyData = require('../../../app/journeyNew/hooks/useJourneyData').useJourneyData;
const mockUseAuth = require('../../../hooks/useAuth').default;

describe('JourneyOverview Screen', () => {
     const defaultMockData = {
          overview: {
               id: 'journey-1',
               title: 'English Learning Journey',
               progress: 45,
               currentStage: 1,
               totalStages: 3,
          },
          stages: [
               {
                    id: 'stage-1',
                    stageNumber: 1,
                    title: 'Beginner',
                    status: 'CURRENT',
                    progress: 80,
                    totalDays: 10,
                    completedDays: 8,
               },
               {
                    id: 'stage-2',
                    stageNumber: 2,
                    title: 'Intermediate',
                    status: 'LOCKED',
                    progress: 0,
                    totalDays: 15,
                    completedDays: 0,
               },
          ],
          loading: false,
          error: null,
          refreshData: jest.fn(),
          isDataStale: false,
          forceRefresh: jest.fn(),
          isAuthenticated: true,
     };

     beforeEach(() => {
          // Reset all mocks
          jest.clearAllMocks();

          // Setup default auth mock
          mockUseAuth.mockReturnValue({
               onLogout: jest.fn(),
          });

          // Setup default journey data mock
          mockUseJourneyData.mockReturnValue(defaultMockData);
     });

     describe('Loading States', () => {
          it('should show loading spinner when data is loading', () => {
               mockUseJourneyData.mockReturnValue({
                    ...defaultMockData,
                    loading: true,
               });

               const { getByTestId } = renderWithProviders(<JourneyOverviewScreen />);

               const loadingSpinner = getByTestId('loading-spinner');
               expect(loadingSpinner).toBeTruthy();
          });

          it('should show correct loading text', () => {
               mockUseJourneyData.mockReturnValue({
                    ...defaultMockData,
                    loading: true,
               });

               const { getByTestId } = renderWithProviders(<JourneyOverviewScreen />);

               const loadingSpinner = getByTestId('loading-spinner');
               expect(loadingSpinner).toBeTruthy();
               expect(loadingSpinner.children[0]).toBe('Đang tải dữ liệu journey...');
          });
     });

     describe('Error States', () => {
          it('should show error message when there is an error', () => {
               const errorMessage = 'Network connection failed';
               mockUseJourneyData.mockReturnValue({
                    ...defaultMockData,
                    loading: false,
                    error: errorMessage,
               });

               const { getByText } = renderWithProviders(<JourneyOverviewScreen />);

               expect(getByText(errorMessage)).toBeTruthy();
               expect(getByText('Thử lại')).toBeTruthy();
          });

          it('should show authentication error with login button', () => {
               const authError = 'Vui lòng đăng nhập';
               mockUseJourneyData.mockReturnValue({
                    ...defaultMockData,
                    loading: false,
                    error: authError,
                    isAuthenticated: false,
               });

               const { getByText } = renderWithProviders(<JourneyOverviewScreen />);

               expect(getByText(authError)).toBeTruthy();
               expect(getByText('Đăng nhập')).toBeTruthy();
          });

          it('should show no data error when journey data is null', () => {
               mockUseJourneyData.mockReturnValue({
                    ...defaultMockData,
                    overview: null,
                    loading: false,
                    error: null,
               });

               const { getByText } = renderWithProviders(<JourneyOverviewScreen />);

               expect(getByText('Không tìm thấy dữ liệu journey')).toBeTruthy();
          });
     });

     describe('Success State - Journey Rendering', () => {
          it('should render JourneySelector when data is loaded successfully', () => {
               const { getByTestId } = renderWithProviders(<JourneyOverviewScreen />);

               const journeySelector = getByTestId('journey-selector');
               expect(journeySelector).toBeTruthy();
          });

          it('should pass journey data to JourneySelector', () => {
               const { getByTestId } = renderWithProviders(<JourneyOverviewScreen />);

               const journeySelector = getByTestId('journey-selector');
               expect(journeySelector).toBeTruthy();

               // Verify that props are passed (props are attached to mock element)
               expect(journeySelector.props.journeyData).toEqual(defaultMockData.overview);
               expect(journeySelector.props.stagesData).toEqual(defaultMockData.stages);
          });
     });

     describe('Container Rendering', () => {
          it('should render with SafeAreaView container', () => {
               const { UNSAFE_getByType } = renderWithProviders(<JourneyOverviewScreen />);

               // Check that SafeAreaView is rendered
               const safeAreaView = UNSAFE_getByType('RCTSafeAreaView');
               expect(safeAreaView).toBeTruthy();
          });
     });
}); 