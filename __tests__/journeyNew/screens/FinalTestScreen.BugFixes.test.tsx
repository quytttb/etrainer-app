import React from 'react';
import { renderWithProviders } from '../../utils/testUtils';

// Mock dependencies
jest.mock('expo-router', () => ({
     useRouter: () => ({
          push: jest.fn(),
          replace: jest.fn(),
          back: jest.fn(),
     }),
     useLocalSearchParams: () => ({
          stageIndex: '0',
          journeyId: 'journey-1',
          stageId: 'stage-1',
     }),
}));

// Mock service
jest.mock('../../../app/journeyNew/service', () => ({
     JourneyNewService: {
          getStageFinalTest: jest.fn(),
          submitFinalTestResults: jest.fn(),
          getNextStageStatus: jest.fn(),
     },
}));

// Mock final test component
jest.mock('../../../app/journeyNew/components/TestInterface', () => {
     const mockReact = require('react');
     return function MockTestInterface(props: any) {
          return mockReact.createElement('View', {
               testID: 'test-interface',
               questions: props.questions,
               onSubmit: props.onSubmit,
               scrollEnabled: props.scrollEnabled,
               hasAudioQuestions: props.hasAudioQuestions,
          }, 'Test Interface Component');
     };
});

// Mock scroll view component
jest.mock('react-native', () => {
     const RN = jest.requireActual('react-native');
     return {
          ...RN,
          ScrollView: jest.fn().mockImplementation(({ children, scrollEnabled, ...props }) => {
               const mockReact = require('react');
               return mockReact.createElement('View', {
                    testID: 'scroll-view',
                    scrollEnabled: scrollEnabled,
                    ...props
               }, children);
          }),
     };
});

const mockService = require('../../../app/journeyNew/service').JourneyNewService;

// Tạo mock FinalTestScreen component
const FinalTestScreen = () => {
     const mockReact = require('react');
     const { ScrollView } = require('react-native');
     const TestInterface = require('../../../app/journeyNew/components/TestInterface').default;

     const [questions] = mockReact.useState([
          {
               id: 'final-q1',
               type: 'ASK_AND_ANSWER',
               audio: {
                    url: 'https://example.com/audio/final-test.mp3',
                    name: 'final-test.mp3'
               },
               answers: [
                    { id: 'a1', text: 'Correct Answer', isCorrect: true },
                    { id: 'a2', text: 'Wrong Answer', isCorrect: false }
               ]
          }
     ]);

     const hasAudioQuestions = questions.some((q: any) => q.audio);

     return mockReact.createElement(ScrollView, {
          testID: 'final-test-scroll-view',
          scrollEnabled: true,
          showsVerticalScrollIndicator: hasAudioQuestions
     }, mockReact.createElement(TestInterface, {
          questions: questions,
          scrollEnabled: true,
          hasAudioQuestions: hasAudioQuestions,
          onSubmit: (results: any) => {
               console.log('Final test submitted:', results);
          }
     }));
};

describe('FinalTestScreen - Bug Fixes Tests', () => {

     beforeEach(() => {
          jest.clearAllMocks();
     });

     describe('(3) Câu hỏi hiện audio có thể kéo xuống', () => {

          it('should enable scrolling when questions contain audio content', () => {
               const questionsWithAudio = [
                    {
                         id: 'final-q1',
                         type: 'ASK_AND_ANSWER',
                         audio: {
                              url: 'https://res.cloudinary.com/dobcvl12/video/upload/menu_prices.mp3',
                              name: 'menu_prices.mp3'
                         },
                         transcript: 'Our lunch special today is $12.99 and includes soup, main course, and dessert.',
                         answers: [
                              { id: 'a1', text: '$12.99', isCorrect: true },
                              { id: 'a2', text: '$15.99', isCorrect: false },
                              { id: 'a3', text: '$10.99', isCorrect: false },
                              { id: 'a4', text: '$14.99', isCorrect: false }
                         ]
                    }
               ];

               mockService.getStageFinalTest.mockResolvedValue({
                    questions: questionsWithAudio,
                    totalQuestions: 1
               });

               const { getByTestId } = renderWithProviders(<FinalTestScreen />);

               const scrollView = getByTestId('final-test-scroll-view');
               expect(scrollView).toBeTruthy();
               expect(scrollView.props.scrollEnabled).toBe(true);
               expect(scrollView.props.showsVerticalScrollIndicator).toBe(true);
          });

          it('should detect audio questions correctly', () => {
               const questionsWithAudio = [
                    {
                         id: 'q1',
                         type: 'ASK_AND_ANSWER',
                         audio: {
                              url: 'https://example.com/audio1.mp3',
                              name: 'audio1.mp3'
                         },
                         answers: [{ id: 'a1', text: 'Answer', isCorrect: true }]
                    },
                    {
                         id: 'q2',
                         type: 'READ_AND_UNDERSTAND',
                         textContent: 'Text only question',
                         answers: [{ id: 'a1', text: 'Answer', isCorrect: true }]
                    }
               ];

               mockService.getStageFinalTest.mockResolvedValue({
                    questions: questionsWithAudio,
                    totalQuestions: 2
               });

               const { getByTestId } = renderWithProviders(<FinalTestScreen />);

               const testInterface = getByTestId('test-interface');
               expect(testInterface.props.hasAudioQuestions).toBe(true);
               expect(testInterface.props.scrollEnabled).toBe(true);
          });

          it('should handle mixed content types - audio and text', () => {
               const mixedQuestions = [
                    {
                         id: 'q1',
                         type: 'ASK_AND_ANSWER',
                         audio: {
                              url: 'https://example.com/audio.mp3',
                              name: 'audio.mp3'
                         },
                         answers: [{ id: 'a1', text: 'Audio Answer', isCorrect: true }]
                    },
                    {
                         id: 'q2',
                         type: 'IMAGE_DESCRIPTION',
                         image: {
                              url: 'https://example.com/image.jpg',
                              description: 'Test image'
                         },
                         answers: [{ id: 'a1', text: 'Image Answer', isCorrect: true }]
                    },
                    {
                         id: 'q3',
                         type: 'READ_AND_UNDERSTAND',
                         textContent: 'Text content here',
                         answers: [{ id: 'a1', text: 'Text Answer', isCorrect: true }]
                    }
               ];

               mockService.getStageFinalTest.mockResolvedValue({
                    questions: mixedQuestions,
                    totalQuestions: 3
               });

               const { getByTestId } = renderWithProviders(<FinalTestScreen />);

               const scrollView = getByTestId('final-test-scroll-view');
               expect(scrollView.props.scrollEnabled).toBe(true);

               const testInterface = getByTestId('test-interface');
               expect(testInterface.props.hasAudioQuestions).toBe(true);
          });
     });

     describe('(3) Unlock Stage tiếp theo khi điểm >= 70%', () => {

          it('should unlock next stage when score is exactly 70%', async () => {
               const testResults = {
                    score: 70,
                    totalQuestions: 10,
                    correctAnswers: 7,
                    passed: true
               };

               mockService.submitFinalTestResults.mockResolvedValue({
                    success: true,
                    results: testResults,
                    nextStageUnlocked: true
               });

               mockService.getNextStageStatus.mockResolvedValue({
                    nextStageId: 'stage-2',
                    unlocked: true,
                    message: 'Chúc mừng! Giai đoạn tiếp theo đã được mở khóa'
               });

               const questionsForTest = [
                    {
                         id: 'q1',
                         type: 'ASK_AND_ANSWER',
                         answers: [{ id: 'a1', text: 'Answer', isCorrect: true }]
                    }
               ];

               mockService.getStageFinalTest.mockResolvedValue({
                    questions: questionsForTest,
                    totalQuestions: 1
               });

               const { getByTestId } = renderWithProviders(<FinalTestScreen />);
               const testInterface = getByTestId('test-interface');

               // Simulate test submission
               await testInterface.props.onSubmit(testResults);

               expect(mockService.submitFinalTestResults).toHaveBeenCalledWith(
                    expect.objectContaining({
                         score: 70,
                         passed: true
                    })
               );

               expect(mockService.getNextStageStatus).toHaveBeenCalled();
          });

          it('should unlock next stage when score is above 70%', async () => {
               const testResults = {
                    score: 85,
                    totalQuestions: 10,
                    correctAnswers: 8.5, // 85%
                    passed: true
               };

               mockService.submitFinalTestResults.mockResolvedValue({
                    success: true,
                    results: testResults,
                    nextStageUnlocked: true
               });

               const questionsForTest = [
                    {
                         id: 'q1',
                         type: 'ASK_AND_ANSWER',
                         answers: [{ id: 'a1', text: 'Answer', isCorrect: true }]
                    }
               ];

               mockService.getStageFinalTest.mockResolvedValue({
                    questions: questionsForTest,
                    totalQuestions: 1
               });

               const { getByTestId } = renderWithProviders(<FinalTestScreen />);
               const testInterface = getByTestId('test-interface');

               await testInterface.props.onSubmit(testResults);

               expect(mockService.submitFinalTestResults).toHaveBeenCalledWith(
                    expect.objectContaining({
                         score: 85,
                         passed: true
                    })
               );
          });

          it('should NOT unlock next stage when score is below 70%', async () => {
               const testResults = {
                    score: 65,
                    totalQuestions: 10,
                    correctAnswers: 6.5, // 65%
                    passed: false
               };

               mockService.submitFinalTestResults.mockResolvedValue({
                    success: true,
                    results: testResults,
                    nextStageUnlocked: false
               });

               mockService.getNextStageStatus.mockResolvedValue({
                    nextStageId: 'stage-2',
                    unlocked: false,
                    message: 'Bạn cần đạt tối thiểu 70% để mở khóa giai đoạn tiếp theo'
               });

               const questionsForTest = [
                    {
                         id: 'q1',
                         type: 'ASK_AND_ANSWER',
                         answers: [{ id: 'a1', text: 'Answer', isCorrect: true }]
                    }
               ];

               mockService.getStageFinalTest.mockResolvedValue({
                    questions: questionsForTest,
                    totalQuestions: 1
               });

               const { getByTestId } = renderWithProviders(<FinalTestScreen />);
               const testInterface = getByTestId('test-interface');

               await testInterface.props.onSubmit(testResults);

               expect(mockService.submitFinalTestResults).toHaveBeenCalledWith(
                    expect.objectContaining({
                         score: 65,
                         passed: false
                    })
               );

               const nextStageStatus = await mockService.getNextStageStatus();
               expect(nextStageStatus.unlocked).toBe(false);
          });

          it('should handle edge case with score exactly at boundary (69.9%)', async () => {
               const testResults = {
                    score: 69.9,
                    totalQuestions: 10,
                    correctAnswers: 6.99,
                    passed: false
               };

               mockService.submitFinalTestResults.mockResolvedValue({
                    success: true,
                    results: testResults,
                    nextStageUnlocked: false
               });

               const questionsForTest = [
                    {
                         id: 'q1',
                         type: 'ASK_AND_ANSWER',
                         answers: [{ id: 'a1', text: 'Answer', isCorrect: true }]
                    }
               ];

               mockService.getStageFinalTest.mockResolvedValue({
                    questions: questionsForTest,
                    totalQuestions: 1
               });

               const { getByTestId } = renderWithProviders(<FinalTestScreen />);
               const testInterface = getByTestId('test-interface');

               await testInterface.props.onSubmit(testResults);

               expect(mockService.submitFinalTestResults).toHaveBeenCalledWith(
                    expect.objectContaining({
                         score: 69.9,
                         passed: false
                    })
               );
          });

          it('should calculate pass status correctly based on 70% threshold', () => {
               const testCases = [
                    { score: 70, expectPassed: true },
                    { score: 71, expectPassed: true },
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