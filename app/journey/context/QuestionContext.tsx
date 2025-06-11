import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { JourneyNewQuestion } from '../types';

// State interface
interface QuestionState {
     questions: JourneyNewQuestion[];
     currentQuestionIndex: number;
     currentQuestion: JourneyNewQuestion | null;
     isLoading: boolean;
     error: string | null;
     totalQuestions: number;
     questionHistory: number[];
     bookmarkedQuestions: string[];
     difficulty: 'easy' | 'medium' | 'hard' | 'all';
     filter: {
          type?: string;
          hasAudio?: boolean;
          hasImage?: boolean;
     };
}

// Action types
type QuestionAction =
     | { type: 'SET_LOADING'; payload: boolean }
     | { type: 'SET_ERROR'; payload: string | null }
     | { type: 'SET_QUESTIONS'; payload: JourneyNewQuestion[] }
     | { type: 'SET_CURRENT_QUESTION_INDEX'; payload: number }
     | { type: 'NEXT_QUESTION' }
     | { type: 'PREVIOUS_QUESTION' }
     | { type: 'GO_TO_QUESTION'; payload: number }
     | { type: 'ADD_TO_HISTORY'; payload: number }
     | { type: 'BOOKMARK_QUESTION'; payload: string }
     | { type: 'UNBOOKMARK_QUESTION'; payload: string }
     | { type: 'SET_DIFFICULTY'; payload: 'easy' | 'medium' | 'hard' | 'all' }
     | { type: 'SET_FILTER'; payload: Partial<QuestionState['filter']> }
     | { type: 'RESET_STATE' };

// Initial state
const initialState: QuestionState = {
     questions: [],
     currentQuestionIndex: 0,
     currentQuestion: null,
     isLoading: false,
     error: null,
     totalQuestions: 0,
     questionHistory: [],
     bookmarkedQuestions: [],
     difficulty: 'all',
     filter: {},
};

// Reducer
const questionReducer = (state: QuestionState, action: QuestionAction): QuestionState => {
     switch (action.type) {
          case 'SET_LOADING':
               return { ...state, isLoading: action.payload };

          case 'SET_ERROR':
               return { ...state, error: action.payload, isLoading: false };

          case 'SET_QUESTIONS':
               return {
                    ...state,
                    questions: action.payload,
                    totalQuestions: action.payload.length,
                    currentQuestion: action.payload[state.currentQuestionIndex] || null,
                    isLoading: false,
               };

          case 'SET_CURRENT_QUESTION_INDEX':
               const newIndex = action.payload;
               return {
                    ...state,
                    currentQuestionIndex: newIndex,
                    currentQuestion: state.questions[newIndex] || null,
               };

          case 'NEXT_QUESTION':
               const nextIndex = Math.min(state.currentQuestionIndex + 1, state.questions.length - 1);
               return {
                    ...state,
                    currentQuestionIndex: nextIndex,
                    currentQuestion: state.questions[nextIndex] || null,
                    questionHistory: [...state.questionHistory, state.currentQuestionIndex],
               };

          case 'PREVIOUS_QUESTION':
               const prevIndex = Math.max(state.currentQuestionIndex - 1, 0);
               return {
                    ...state,
                    currentQuestionIndex: prevIndex,
                    currentQuestion: state.questions[prevIndex] || null,
               };

          case 'GO_TO_QUESTION':
               const targetIndex = Math.max(0, Math.min(action.payload, state.questions.length - 1));
               return {
                    ...state,
                    currentQuestionIndex: targetIndex,
                    currentQuestion: state.questions[targetIndex] || null,
               };

          case 'ADD_TO_HISTORY':
               return {
                    ...state,
                    questionHistory: [...state.questionHistory, action.payload],
               };

          case 'BOOKMARK_QUESTION':
               return {
                    ...state,
                    bookmarkedQuestions: [...state.bookmarkedQuestions, action.payload],
               };

          case 'UNBOOKMARK_QUESTION':
               return {
                    ...state,
                    bookmarkedQuestions: state.bookmarkedQuestions.filter(id => id !== action.payload),
               };

          case 'SET_DIFFICULTY':
               return { ...state, difficulty: action.payload };

          case 'SET_FILTER':
               return {
                    ...state,
                    filter: { ...state.filter, ...action.payload },
               };

          case 'RESET_STATE':
               return initialState;

          default:
               return state;
     }
};

// Context interface
interface QuestionContextType {
     state: QuestionState;
     dispatch: React.Dispatch<QuestionAction>;
     // Helper functions
     setLoading: (loading: boolean) => void;
     setError: (error: string | null) => void;
     setQuestions: (questions: JourneyNewQuestion[]) => void;
     goToNextQuestion: () => void;
     goToPreviousQuestion: () => void;
     goToQuestion: (index: number) => void;
     bookmarkQuestion: (questionId: string) => void;
     unbookmarkQuestion: (questionId: string) => void;
     isBookmarked: (questionId: string) => boolean;
     setDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | 'all') => void;
     setFilter: (filter: Partial<QuestionState['filter']>) => void;
     resetState: () => void;
     // Computed properties
     isFirstQuestion: boolean;
     isLastQuestion: boolean;
     progress: number;
}

// Create context
const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

// Provider component
interface QuestionProviderProps {
     children: ReactNode;
}

export const QuestionProvider: React.FC<QuestionProviderProps> = ({ children }) => {
     const [state, dispatch] = useReducer(questionReducer, initialState);

     // Helper functions
     const setLoading = (loading: boolean) => {
          dispatch({ type: 'SET_LOADING', payload: loading });
     };

     const setError = (error: string | null) => {
          dispatch({ type: 'SET_ERROR', payload: error });
     };

     const setQuestions = (questions: JourneyNewQuestion[]) => {
          dispatch({ type: 'SET_QUESTIONS', payload: questions });
     };

     const goToNextQuestion = () => {
          dispatch({ type: 'NEXT_QUESTION' });
     };

     const goToPreviousQuestion = () => {
          dispatch({ type: 'PREVIOUS_QUESTION' });
     };

     const goToQuestion = (index: number) => {
          dispatch({ type: 'GO_TO_QUESTION', payload: index });
     };

     const bookmarkQuestion = (questionId: string) => {
          dispatch({ type: 'BOOKMARK_QUESTION', payload: questionId });
     };

     const unbookmarkQuestion = (questionId: string) => {
          dispatch({ type: 'UNBOOKMARK_QUESTION', payload: questionId });
     };

     const isBookmarked = (questionId: string): boolean => {
          return state.bookmarkedQuestions.includes(questionId);
     };

     const setDifficulty = (difficulty: 'easy' | 'medium' | 'hard' | 'all') => {
          dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
     };

     const setFilter = (filter: Partial<QuestionState['filter']>) => {
          dispatch({ type: 'SET_FILTER', payload: filter });
     };

     const resetState = () => {
          dispatch({ type: 'RESET_STATE' });
     };

     // Computed properties
     const isFirstQuestion = state.currentQuestionIndex === 0;
     const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
     const progress = state.totalQuestions > 0 ? (state.currentQuestionIndex + 1) / state.totalQuestions * 100 : 0;

     const value: QuestionContextType = {
          state,
          dispatch,
          setLoading,
          setError,
          setQuestions,
          goToNextQuestion,
          goToPreviousQuestion,
          goToQuestion,
          bookmarkQuestion,
          unbookmarkQuestion,
          isBookmarked,
          setDifficulty,
          setFilter,
          resetState,
          isFirstQuestion,
          isLastQuestion,
          progress,
     };

     return (
          <QuestionContext.Provider value={value}>
               {children}
          </QuestionContext.Provider>
     );
};

// Custom hook to use context
export const useQuestionContext = (): QuestionContextType => {
     const context = useContext(QuestionContext);
     if (context === undefined) {
          throw new Error('useQuestionContext must be used within a QuestionProvider');
     }
     return context;
}; 