import 'react-native-gesture-handler/jestSetup';

// Mock các modules cần thiết
jest.mock('react-native-reanimated', () => {
     const Reanimated = require('react-native-reanimated/mock');
     // Mock useSharedValue, useAnimatedStyle, etc.
     Reanimated.default.call = () => { };
     return Reanimated;
});

// Mock Expo modules
jest.mock('expo-font');
jest.mock('expo-asset');
jest.mock('expo-constants', () => ({
     __esModule: true,
     default: {
          appOwnership: 'standalone',
          expoVersion: '49.0.0',
     },
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
     useNavigation: () => ({
          navigate: jest.fn(),
          goBack: jest.fn(),
          dispatch: jest.fn(),
     }),
     useRoute: () => ({
          params: {},
     }),
     useFocusEffect: jest.fn(),
     useIsFocused: () => true,
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
     setItem: jest.fn(),
     getItem: jest.fn(),
     removeItem: jest.fn(),
     clear: jest.fn(),
}));

// Mock API calls
jest.mock('axios');

// Mock react-native-paper
jest.mock('react-native-paper', () => ({
     Button: 'Button',
     Card: 'Card',
     Text: 'Text',
     Surface: 'Surface',
     Portal: ({ children }: any) => children,
     Provider: ({ children }: any) => children,
}));

// Mock Journey components
jest.mock('../app/journeyNew/components/JourneySelector', () => {
     const { JourneySelector } = require('./__mocks__/journeyComponents');
     return { default: JourneySelector };
});

jest.mock('../app/journeyNew/components/Common/LoadingSpinner', () => {
     const { LoadingSpinner } = require('./__mocks__/journeyComponents');
     return { default: LoadingSpinner };
});

jest.mock('../app/journeyNew/components/Common/ErrorMessage', () => {
     const { ErrorMessage } = require('./__mocks__/journeyComponents');
     return { default: ErrorMessage };
});

jest.mock('../app/journeyNew/components/StageDetail', () => {
     const { StageDetail } = require('./__mocks__/journeyComponents');
     return { default: StageDetail };
});

// Global test timeout
jest.setTimeout(30000); 