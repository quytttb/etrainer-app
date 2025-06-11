import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Journey Context
const mockJourneyContext = {
     currentJourney: null,
     isLoading: false,
     error: null,
     refetch: jest.fn(),
     createJourney: jest.fn(),
     completeDay: jest.fn(),
     startNextDay: jest.fn(),
     skipStage: jest.fn(),
     submitFinalTest: jest.fn(),
};

const JourneyContextProvider = React.createContext(mockJourneyContext);

// Custom render function với providers
interface CustomRenderOptions extends RenderOptions {
     journey?: any;
     queryClient?: QueryClient;
}

export const renderWithProviders = (
     ui: React.ReactElement,
     options: CustomRenderOptions = {}
) => {
     const {
          journey = mockJourneyContext,
          queryClient = new QueryClient({
               defaultOptions: {
                    queries: { retry: false },
                    mutations: { retry: false },
               },
          }),
          ...renderOptions
     } = options;

     const Wrapper = ({ children }: { children: React.ReactNode }) => (
          <QueryClientProvider client={queryClient}>
               <JourneyContextProvider.Provider value={journey}>
                    {children}
               </JourneyContextProvider.Provider>
          </QueryClientProvider>
     );

     return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock data generators
export const mockUserJourney = {
     _id: 'test-journey-id',
     user: 'test-user-id',
     stages: [
          {
               stageId: 'stage-1',
               minScore: 0,
               targetScore: 300,
               days: [
                    {
                         dayNumber: 1,
                         started: true,
                         completed: true,
                         startedAt: new Date(),
                         questions: ['q1', 'q2', 'q3'],
                         _id: 'day-1'
                    },
                    {
                         dayNumber: 2,
                         started: false,
                         completed: false,
                         startedAt: null,
                         questions: ['q4', 'q5', 'q6'],
                         _id: 'day-2'
                    }
               ],
               finalTest: {
                    unlocked: false,
                    started: false,
                    completed: false,
                    score: null,
                    passed: false
               },
               started: true,
               startedAt: new Date(),
               state: 'IN_PROGRESS',
               _id: 'stage-progress-1'
          },
          {
               stageId: 'stage-2',
               minScore: 300,
               targetScore: 600,
               days: [
                    {
                         dayNumber: 1,
                         started: false,
                         completed: false,
                         startedAt: null,
                         questions: ['q7', 'q8', 'q9'],
                         _id: 'day-3'
                    }
               ],
               finalTest: {
                    unlocked: false,
                    started: false,
                    completed: false,
                    score: null,
                    passed: false
               },
               started: false,
               startedAt: null,
               state: 'NOT_STARTED',
               _id: 'stage-progress-2'
          }
     ],
     currentStageIndex: 0,
     state: 'IN_PROGRESS',
     startedAt: new Date(),
     createdAt: new Date(),
     updatedAt: new Date()
};

export const mockStageData = {
     _id: 'stage-1',
     minScore: 0,
     targetScore: 300,
     days: [
          {
               dayNumber: 1,
               questions: ['q1', 'q2', 'q3'],
               exam: null,
               _id: 'template-day-1'
          },
          {
               dayNumber: 2,
               questions: ['q4', 'q5', 'q6'],
               exam: null,
               _id: 'template-day-2'
          }
     ],
     createdAt: new Date(),
     updatedAt: new Date()
};

export const mockQuestions = [
     {
          _id: 'q1',
          questionNumber: 1,
          type: 'ASK_AND_ANSWER',
          question: 'What is your name?',
          answers: [
               { answer: 'My name is John', isCorrect: true, _id: 'a1' },
               { answer: 'I am fine', isCorrect: false, _id: 'a2' }
          ],
          imageUrl: null,
          audio: null,
          explanation: 'Basic introduction question'
     },
     {
          _id: 'q2',
          questionNumber: 2,
          type: 'CONVERSATION_PIECE',
          question: null,
          questions: [
               {
                    question: 'Who is speaking?',
                    answers: [
                         { answer: 'John', isCorrect: true, _id: 'sub-a1' },
                         { answer: 'Mary', isCorrect: false, _id: 'sub-a2' }
                    ],
                    _id: 'sub-q1'
               }
          ],
          audio: {
               name: 'conversation.mp3',
               url: 'https://example.com/audio.mp3'
          },
          subtitle: 'Audio transcript here'
     }
];

// Test helpers
export const waitForLoadingToFinish = () =>
     new Promise(resolve => setTimeout(resolve, 100));

export const createMockNavigation = () => ({
     navigate: jest.fn(),
     goBack: jest.fn(),
     dispatch: jest.fn(),
     setParams: jest.fn(),
     isFocused: jest.fn(() => true),
});

export const createMockRoute = (params = {}) => ({
     key: 'test-route',
     name: 'TestScreen',
     params,
});

// Re-export testing library utilities
export * from '@testing-library/react-native'; 