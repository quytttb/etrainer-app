import React from 'react';
import { renderWithProviders } from '../../utils/testUtils';
import LessonScreen from '../../../app/journeyNew/screens/LessonScreen';

// Mock dependencies
jest.mock('expo-router', () => ({
     useRouter: () => ({
          push: jest.fn(),
          replace: jest.fn(),
          back: jest.fn(),
     }),
     useLocalSearchParams: () => ({
          questionIds: JSON.stringify(['q1', 'q2', 'q3']),
          dayNumber: '1',
          stageIndex: '0',
          journeyId: 'journey-1',
          stageId: 'stage-1',
          isReview: 'false',
     }),
}));

// Mock service
jest.mock('../../../app/journeyNew/service', () => ({
     JourneyNewService: {
          getQuestionsByIds: jest.fn(),
          updateLessonProgress: jest.fn(),
     },
}));

// Mock audio player component
jest.mock('../../../app/journeyNew/components/LessonContent/AudioPlayer', () => {
     const mockReact = require('react');
     return function MockAudioPlayer(props: any) {
          return mockReact.createElement('View', {
               testID: 'audio-player',
               audioUrl: props.audioUrl,
               isPlaying: props.isPlaying,
               onPlay: props.onPlay,
               onPause: props.onPause,
          }, 'Audio Player Component');
     };
});

// Mock image viewer component  
jest.mock('../../../app/journeyNew/components/LessonContent/ImageViewer', () => {
     const mockReact = require('react');
     return function MockImageViewer(props: any) {
          return mockReact.createElement('View', {
               testID: 'image-viewer',
               imageUrl: props.imageUrl,
               description: props.description,
          }, 'Image Viewer Component');
     };
});

const mockService = require('../../../app/journeyNew/service').JourneyNewService;

describe('LessonScreen - Bug Fixes Tests', () => {

     beforeEach(() => {
          jest.clearAllMocks();
          global.fetch = jest.fn();
     });

     describe('(2) Câu hỏi có audio và image - Xử lý media', () => {

          it('should render AudioPlayer component for questions with audio content', async () => {
               const questionsWithAudio = [
                    {
                         id: 'q1',
                         type: 'ASK_AND_ANSWER',
                         title: 'Audio Question',
                         audio: {
                              url: 'https://example.com/audio/menu_prices.mp3',
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

               mockService.getQuestionsByIds.mockResolvedValue(questionsWithAudio);

               const { findByTestId } = renderWithProviders(<LessonScreen />);

               // Kiểm tra có audio player
               const audioPlayer = await findByTestId('audio-player');
               expect(audioPlayer).toBeTruthy();
               expect(audioPlayer.props.audioUrl).toBe('https://example.com/audio/menu_prices.mp3');
          });

          it('should render ImageViewer component for questions with image content', async () => {
               const questionsWithImage = [
                    {
                         id: 'q2',
                         type: 'IMAGE_DESCRIPTION',
                         title: 'What can you see in this image?',
                         image: {
                              url: 'https://images.unsplash.com/photo-1606326086606-aa0b62935f2b',
                              description: 'A busy office scene'
                         },
                         answers: [
                              { id: 'a1', text: 'A busy office with people working', isCorrect: true },
                              { id: 'a2', text: 'An empty restaurant', isCorrect: false },
                              { id: 'a3', text: 'A school classroom', isCorrect: false },
                              { id: 'a4', text: 'A hospital waiting room', isCorrect: false }
                         ]
                    }
               ];

               mockService.getQuestionsByIds.mockResolvedValue(questionsWithImage);

               const { findByTestId } = renderWithProviders(<LessonScreen />);

               // Kiểm tra có image viewer
               const imageViewer = await findByTestId('image-viewer');
               expect(imageViewer).toBeTruthy();
               expect(imageViewer.props.imageUrl).toBe('https://images.unsplash.com/photo-1606326086606-aa0b62935f2b');
          });

          it('should NOT display text content when audio URL is provided', async () => {
               const questionsWithAudio = [
                    {
                         id: 'q3',
                         type: 'ASK_AND_ANSWER',
                         title: 'Audio Question',
                         audio: {
                              url: 'https://example.com/audio/conversation.mp3',
                              name: 'conversation.mp3'
                         },
                         transcript: 'This should not be displayed as text when audio is available',
                         textContent: 'This text should not be shown',
                         answers: [
                              { id: 'a1', text: '$12.99', isCorrect: true }
                         ]
                    }
               ];

               mockService.getQuestionsByIds.mockResolvedValue(questionsWithAudio);

               const { findByTestId, queryByText } = renderWithProviders(<LessonScreen />);

               const audioPlayer = await findByTestId('audio-player');
               expect(audioPlayer).toBeTruthy();

               // Không nên hiển thị text khi có audio
               expect(queryByText('This should not be displayed as text when audio is available')).toBeFalsy();
               expect(queryByText('This text should not be shown')).toBeFalsy();
          });

          it('should NOT display text content when image URL is provided', async () => {
               const questionsWithImage = [
                    {
                         id: 'q4',
                         type: 'IMAGE_DESCRIPTION',
                         title: 'Image Question',
                         image: {
                              url: 'https://example.com/image.jpg',
                              description: 'Office scene'
                         },
                         textContent: 'This text should not be shown when image is present',
                         answers: [
                              { id: 'a1', text: 'Office', isCorrect: true }
                         ]
                    }
               ];

               mockService.getQuestionsByIds.mockResolvedValue(questionsWithImage);

               const { findByTestId, queryByText } = renderWithProviders(<LessonScreen />);

               const imageViewer = await findByTestId('image-viewer');
               expect(imageViewer).toBeTruthy();

               // Không nên hiển thị text khi có image
               expect(queryByText('This text should not be shown when image is present')).toBeFalsy();
          });

          it('should handle questions with both audio and image content', async () => {
               const questionsWithBothMedia = [
                    {
                         id: 'q5',
                         type: 'MULTI_MEDIA',
                         title: 'Multi Media Question',
                         audio: {
                              url: 'https://example.com/audio/description.mp3',
                              name: 'description.mp3'
                         },
                         image: {
                              url: 'https://example.com/image/scene.jpg',
                              description: 'Restaurant scene'
                         },
                         answers: [
                              { id: 'a1', text: 'Restaurant', isCorrect: true }
                         ]
                    }
               ];

               mockService.getQuestionsByIds.mockResolvedValue(questionsWithBothMedia);

               const { findByTestId } = renderWithProviders(<LessonScreen />);

               // Cả audio player và image viewer đều phải có
               const audioPlayer = await findByTestId('audio-player');
               const imageViewer = await findByTestId('image-viewer');

               expect(audioPlayer).toBeTruthy();
               expect(imageViewer).toBeTruthy();
               expect(audioPlayer.props.audioUrl).toBe('https://example.com/audio/description.mp3');
               expect(imageViewer.props.imageUrl).toBe('https://example.com/image/scene.jpg');
          });

          it('should provide audio player controls', async () => {
               const questionsWithAudio = [
                    {
                         id: 'q6',
                         type: 'ASK_AND_ANSWER',
                         title: 'Audio Question',
                         audio: {
                              url: 'https://example.com/audio/test.mp3',
                              name: 'test.mp3'
                         },
                         answers: [
                              { id: 'a1', text: 'Answer', isCorrect: true }
                         ]
                    }
               ];

               mockService.getQuestionsByIds.mockResolvedValue(questionsWithAudio);

               const { findByTestId } = renderWithProviders(<LessonScreen />);

               const audioPlayer = await findByTestId('audio-player');
               expect(audioPlayer).toBeTruthy();

               // Kiểm tra audio player có các controls cần thiết
               expect(audioPlayer.props.onPlay).toBeDefined();
               expect(audioPlayer.props.onPause).toBeDefined();
               expect(typeof audioPlayer.props.onPlay).toBe('function');
               expect(typeof audioPlayer.props.onPause).toBe('function');
          });
     });

     describe('Text-only questions fallback', () => {

          it('should display text content only when no audio or image is provided', async () => {
               const textOnlyQuestions = [
                    {
                         id: 'q7',
                         type: 'READ_AND_UNDERSTAND',
                         title: 'Text Question',
                         textContent: 'This is a text-only question that should be displayed.',
                         answers: [
                              { id: 'a1', text: 'Answer', isCorrect: true }
                         ]
                    }
               ];

               mockService.getQuestionsByIds.mockResolvedValue(textOnlyQuestions);

               const { findByTestId, queryByTestId, getByText } = renderWithProviders(<LessonScreen />);

               // Không nên có audio player hoặc image viewer
               expect(queryByTestId('audio-player')).toBeFalsy();
               expect(queryByTestId('image-viewer')).toBeFalsy();

               // Nên hiển thị text content
               expect(getByText('This is a text-only question that should be displayed.')).toBeTruthy();
          });
     });
}); 