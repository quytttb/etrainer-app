import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { JourneyNewQuestion, UserAnswer } from '../types';

// State interface
interface AnswerState {
     answers: UserAnswer[];
     currentAnswer: UserAnswer | null;
     isLoading: boolean;
     error: string | null;
     totalScore: number;
     maxScore: number;
     timeSpent: number;
     lastSaved: string | null;
     isDirty: boolean; // Has unsaved changes
     autoSave: boolean;
}

// Action types
type AnswerAction =
     | { type: 'SET_LOADING'; payload: boolean }
     | { type: 'SET_ERROR'; payload: string | null }
     | { type: 'SET_ANSWERS'; payload: Answer[] }
     | { type: 'ADD_ANSWER'; payload: Answer }
     | { type: 'UPDATE_ANSWER'; payload: { questionId: string; value: any } }
     | { type: 'REMOVE_ANSWER'; payload: string }
     | { type: 'SET_CURRENT_ANSWER'; payload: Answer | null }
     | { type: 'CALCULATE_SCORE'; payload: { totalScore: number; maxScore: number } }
     | { type: 'ADD_TIME_SPENT'; payload: number }
     | { type: 'SET_LAST_SAVED'; payload: string }
     | { type: 'SET_DIRTY'; payload: boolean }
     | { type: 'SET_AUTO_SAVE'; payload: boolean }
     | { type: 'CLEAR_ANSWERS' }
     | { type: 'RESET_STATE' };

// Initial state
const initialState: AnswerState = {
     answers: [],
     currentAnswer: null,
     isLoading: false,
     error: null,
     totalScore: 0,
     maxScore: 0,
     timeSpent: 0,
     lastSaved: null,
     isDirty: false,
     autoSave: true,
};

// Reducer
const answerReducer = (state: AnswerState, action: AnswerAction): AnswerState => {
     switch (action.type) {
          case 'SET_LOADING':
               return { ...state, isLoading: action.payload };

          case 'SET_ERROR':
               return { ...state, error: action.payload, isLoading: false };

          case 'SET_ANSWERS':
               return {
                    ...state,
                    answers: action.payload,
                    isLoading: false,
                    isDirty: false,
               };

          case 'ADD_ANSWER':
               const existingIndex = state.answers.findIndex(a => a.questionId === action.payload.questionId);
               let newAnswers: Answer[];

               if (existingIndex >= 0) {
                    // Update existing answer
                    newAnswers = [...state.answers];
                    newAnswers[existingIndex] = action.payload;
               } else {
                    // Add new answer
                    newAnswers = [...state.answers, action.payload];
               }

               return {
                    ...state,
                    answers: newAnswers,
                    currentAnswer: action.payload,
                    isDirty: true,
               };

          case 'UPDATE_ANSWER':
               const updatedAnswers = state.answers.map(answer =>
                    answer.questionId === action.payload.questionId
                         ? { ...answer, value: action.payload.value, timestamp: new Date().toISOString() }
                         : answer
               );

               return {
                    ...state,
                    answers: updatedAnswers,
                    isDirty: true,
               };

          case 'REMOVE_ANSWER':
               return {
                    ...state,
                    answers: state.answers.filter(answer => answer.questionId !== action.payload),
                    isDirty: true,
               };

          case 'SET_CURRENT_ANSWER':
               return { ...state, currentAnswer: action.payload };

          case 'CALCULATE_SCORE':
               return {
                    ...state,
                    totalScore: action.payload.totalScore,
                    maxScore: action.payload.maxScore,
               };

          case 'ADD_TIME_SPENT':
               return {
                    ...state,
                    timeSpent: state.timeSpent + action.payload,
               };

          case 'SET_LAST_SAVED':
               return {
                    ...state,
                    lastSaved: action.payload,
                    isDirty: false,
               };

          case 'SET_DIRTY':
               return { ...state, isDirty: action.payload };

          case 'SET_AUTO_SAVE':
               return { ...state, autoSave: action.payload };

          case 'CLEAR_ANSWERS':
               return {
                    ...state,
                    answers: [],
                    currentAnswer: null,
                    totalScore: 0,
                    timeSpent: 0,
                    isDirty: true,
               };

          case 'RESET_STATE':
               return initialState;

          default:
               return state;
     }
};

// Context interface
interface AnswerContextType {
     state: AnswerState;
     dispatch: React.Dispatch<AnswerAction>;
     // Helper functions
     setLoading: (loading: boolean) => void;
     setError: (error: string | null) => void;
     addAnswer: (answer: Answer) => void;
     updateAnswer: (questionId: string, value: any) => void;
     removeAnswer: (questionId: string) => void;
     getAnswer: (questionId: string) => Answer | null;
     isAnswered: (questionId: string) => boolean;
     calculateScore: (questions: JourneyNewQuestion[]) => void;
     saveAnswers: () => Promise<void>;
     loadAnswers: (lessonId: string) => Promise<void>;
     clearAnswers: () => void;
     resetState: () => void;
     // Computed properties
     answeredCount: number;
     accuracy: number;
     scorePercentage: number;
}

// Create context
const AnswerContext = createContext<AnswerContextType | undefined>(undefined);

// Provider component
interface AnswerProviderProps {
     children: ReactNode;
}

export const AnswerProvider: React.FC<AnswerProviderProps> = ({ children }) => {
     const [state, dispatch] = useReducer(answerReducer, initialState);

     // Helper functions
     const setLoading = (loading: boolean) => {
          dispatch({ type: 'SET_LOADING', payload: loading });
     };

     const setError = (error: string | null) => {
          dispatch({ type: 'SET_ERROR', payload: error });
     };

     const addAnswer = (answer: Answer) => {
          const answerWithTimestamp: Answer = {
               ...answer,
               timestamp: new Date().toISOString(),
               attempts: (state.answers.find(a => a.questionId === answer.questionId)?.attempts || 0) + 1,
          };
          dispatch({ type: 'ADD_ANSWER', payload: answerWithTimestamp });
     };

     const updateAnswer = (questionId: string, value: any) => {
          dispatch({ type: 'UPDATE_ANSWER', payload: { questionId, value } });
     };

     const removeAnswer = (questionId: string) => {
          dispatch({ type: 'REMOVE_ANSWER', payload: questionId });
     };

     const getAnswer = (questionId: string): Answer | null => {
          return state.answers.find(answer => answer.questionId === questionId) || null;
     };

     const isAnswered = (questionId: string): boolean => {
          const answer = getAnswer(questionId);
          return answer !== null && answer.value !== null && answer.value !== undefined;
     };

     const calculateScore = (questions: JourneyNewQuestion[]) => {
          let totalScore = 0;
          const maxScore = questions.length;

          state.answers.forEach(answer => {
               const question = questions.find(q => q.id === answer.questionId);
               if (question && question.correctAnswer === answer.value) {
                    totalScore += 1;
                    answer.isCorrect = true;
                    answer.score = 1;
               } else {
                    answer.isCorrect = false;
                    answer.score = 0;
               }
          });

          dispatch({ type: 'CALCULATE_SCORE', payload: { totalScore, maxScore } });
     };

     const saveAnswers = async (): Promise<void> => {
          try {
               setLoading(true);
               // TODO: Implement actual save logic with API or storage
               // await saveUserAnswers(lessonId, state.answers);
               dispatch({ type: 'SET_LAST_SAVED', payload: new Date().toISOString() });
          } catch (error) {
               setError('Failed to save answers');
          } finally {
               setLoading(false);
          }
     };

     const loadAnswers = async (lessonId: string): Promise<void> => {
          try {
               setLoading(true);
               // TODO: Implement actual load logic with API or storage
               // const savedAnswers = await getUserAnswers(lessonId);
               // dispatch({ type: 'SET_ANSWERS', payload: savedAnswers });
          } catch (error) {
               setError('Failed to load answers');
          } finally {
               setLoading(false);
          }
     };

     const clearAnswers = () => {
          dispatch({ type: 'CLEAR_ANSWERS' });
     };

     const resetState = () => {
          dispatch({ type: 'RESET_STATE' });
     };

     // Computed properties
     const answeredCount = state.answers.filter(answer =>
          answer.value !== null && answer.value !== undefined
     ).length;

     const accuracy = state.answers.length > 0
          ? (state.answers.filter(answer => answer.isCorrect).length / state.answers.length) * 100
          : 0;

     const scorePercentage = state.maxScore > 0
          ? (state.totalScore / state.maxScore) * 100
          : 0;

     const value: AnswerContextType = {
          state,
          dispatch,
          setLoading,
          setError,
          addAnswer,
          updateAnswer,
          removeAnswer,
          getAnswer,
          isAnswered,
          calculateScore,
          saveAnswers,
          loadAnswers,
          clearAnswers,
          resetState,
          answeredCount,
          accuracy,
          scorePercentage,
     };

     return (
          <AnswerContext.Provider value={value}>
               {children}
          </AnswerContext.Provider>
     );
};

// Custom hook to use context
export const useAnswerContext = (): AnswerContextType => {
     const context = useContext(AnswerContext);
     if (context === undefined) {
          throw new Error('useAnswerContext must be used within an AnswerProvider');
     }
     return context;
}; 