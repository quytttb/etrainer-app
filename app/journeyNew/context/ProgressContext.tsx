import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Progress interface
export interface LessonProgress {
     lessonId: string;
     status: 'not_started' | 'in_progress' | 'completed';
     score: number;
     timeSpent: number;
     completedAt?: string;
     attempts: number;
}

export interface StageProgress {
     stageId: string;
     status: 'not_started' | 'in_progress' | 'completed';
     lessons: LessonProgress[];
     overallScore: number;
     timeSpent: number;
     completedAt?: string;
}

export interface JourneyProgress {
     journeyId: string;
     status: 'not_started' | 'in_progress' | 'completed';
     stages: StageProgress[];
     currentStageId: string | null;
     currentLessonId: string | null;
     overallScore: number;
     timeSpent: number;
     completedAt?: string;
     lastActivity: string;
}

// State interface
interface ProgressState {
     journeyProgress: JourneyProgress | null;
     isLoading: boolean;
     error: string | null;
     autoSave: boolean;
     lastSaved: string | null;
     isDirty: boolean;
     syncStatus: 'synced' | 'pending' | 'failed';
}

// Action types
type ProgressAction =
     | { type: 'SET_LOADING'; payload: boolean }
     | { type: 'SET_ERROR'; payload: string | null }
     | { type: 'SET_JOURNEY_PROGRESS'; payload: JourneyProgress }
     | { type: 'UPDATE_LESSON_PROGRESS'; payload: { stageId: string; lessonProgress: LessonProgress } }
     | { type: 'COMPLETE_LESSON'; payload: { stageId: string; lessonId: string; score: number; timeSpent: number } }
     | { type: 'START_LESSON'; payload: { stageId: string; lessonId: string } }
     | { type: 'UPDATE_CURRENT_POSITION'; payload: { stageId: string; lessonId: string } }
     | { type: 'SET_LAST_SAVED'; payload: string }
     | { type: 'SET_DIRTY'; payload: boolean }
     | { type: 'SET_AUTO_SAVE'; payload: boolean }
     | { type: 'SET_SYNC_STATUS'; payload: 'synced' | 'pending' | 'failed' }
     | { type: 'RESET_STATE' };

// Initial state
const initialState: ProgressState = {
     journeyProgress: null,
     isLoading: false,
     error: null,
     autoSave: true,
     lastSaved: null,
     isDirty: false,
     syncStatus: 'synced',
};

// Reducer
const progressReducer = (state: ProgressState, action: ProgressAction): ProgressState => {
     switch (action.type) {
          case 'SET_LOADING':
               return { ...state, isLoading: action.payload };

          case 'SET_ERROR':
               return { ...state, error: action.payload, isLoading: false };

          case 'SET_JOURNEY_PROGRESS':
               return {
                    ...state,
                    journeyProgress: action.payload,
                    isLoading: false,
                    isDirty: false,
                    syncStatus: 'synced',
               };

          case 'UPDATE_LESSON_PROGRESS':
               if (!state.journeyProgress) return state;

               const updatedStages = state.journeyProgress.stages.map(stage => {
                    if (stage.stageId === action.payload.stageId) {
                         const updatedLessons = stage.lessons.map(lesson =>
                              lesson.lessonId === action.payload.lessonProgress.lessonId
                                   ? action.payload.lessonProgress
                                   : lesson
                         );

                         // Check if lesson doesn't exist and add it
                         const lessonExists = stage.lessons.some(l => l.lessonId === action.payload.lessonProgress.lessonId);
                         if (!lessonExists) {
                              updatedLessons.push(action.payload.lessonProgress);
                         }

                         // Calculate stage progress
                         const completedLessons = updatedLessons.filter(l => l.status === 'completed');
                         const stageScore = completedLessons.length > 0
                              ? completedLessons.reduce((sum, l) => sum + l.score, 0) / completedLessons.length
                              : 0;
                         const stageTimeSpent = updatedLessons.reduce((sum, l) => sum + l.timeSpent, 0);
                         const stageStatus: 'not_started' | 'in_progress' | 'completed' =
                              completedLessons.length === updatedLessons.length ? 'completed' :
                                   completedLessons.length > 0 ? 'in_progress' : 'not_started';

                         return {
                              ...stage,
                              lessons: updatedLessons,
                              overallScore: stageScore,
                              timeSpent: stageTimeSpent,
                              status: stageStatus,
                              completedAt: stageStatus === 'completed' ? new Date().toISOString() : undefined,
                         };
                    }
                    return stage;
               });

               // Calculate journey progress
               const completedStages = updatedStages.filter(s => s.status === 'completed');
               const journeyScore = completedStages.length > 0
                    ? completedStages.reduce((sum, s) => sum + s.overallScore, 0) / completedStages.length
                    : 0;
               const journeyTimeSpent = updatedStages.reduce((sum, s) => sum + s.timeSpent, 0);
               const journeyStatus: 'not_started' | 'in_progress' | 'completed' =
                    completedStages.length === updatedStages.length ? 'completed' :
                         completedStages.length > 0 ? 'in_progress' : 'not_started';

               return {
                    ...state,
                    journeyProgress: {
                         ...state.journeyProgress,
                         stages: updatedStages,
                         overallScore: journeyScore,
                         timeSpent: journeyTimeSpent,
                         status: journeyStatus,
                         completedAt: journeyStatus === 'completed' ? new Date().toISOString() : undefined,
                         lastActivity: new Date().toISOString(),
                    },
                    isDirty: true,
                    syncStatus: 'pending',
               };

          case 'COMPLETE_LESSON':
               if (!state.journeyProgress) return state;

               const lessonProgress: LessonProgress = {
                    lessonId: action.payload.lessonId,
                    status: 'completed',
                    score: action.payload.score,
                    timeSpent: action.payload.timeSpent,
                    completedAt: new Date().toISOString(),
                    attempts: 1, // This should be incremented if lesson is retaken
               };

               return progressReducer(state, {
                    type: 'UPDATE_LESSON_PROGRESS',
                    payload: { stageId: action.payload.stageId, lessonProgress }
               });

          case 'START_LESSON':
               if (!state.journeyProgress) return state;

               const startedLessonProgress: LessonProgress = {
                    lessonId: action.payload.lessonId,
                    status: 'in_progress',
                    score: 0,
                    timeSpent: 0,
                    attempts: 1,
               };

               const stateAfterStart = progressReducer(state, {
                    type: 'UPDATE_LESSON_PROGRESS',
                    payload: { stageId: action.payload.stageId, lessonProgress: startedLessonProgress }
               });

               return progressReducer(stateAfterStart, {
                    type: 'UPDATE_CURRENT_POSITION',
                    payload: action.payload
               });

          case 'UPDATE_CURRENT_POSITION':
               if (!state.journeyProgress) return state;

               return {
                    ...state,
                    journeyProgress: {
                         ...state.journeyProgress,
                         currentStageId: action.payload.stageId,
                         currentLessonId: action.payload.lessonId,
                         lastActivity: new Date().toISOString(),
                    },
                    isDirty: true,
               };

          case 'SET_LAST_SAVED':
               return {
                    ...state,
                    lastSaved: action.payload,
                    isDirty: false,
                    syncStatus: 'synced',
               };

          case 'SET_DIRTY':
               return { ...state, isDirty: action.payload };

          case 'SET_AUTO_SAVE':
               return { ...state, autoSave: action.payload };

          case 'SET_SYNC_STATUS':
               return { ...state, syncStatus: action.payload };

          case 'RESET_STATE':
               return initialState;

          default:
               return state;
     }
};

// Context interface
interface ProgressContextType {
     state: ProgressState;
     dispatch: React.Dispatch<ProgressAction>;
     // Helper functions
     setLoading: (loading: boolean) => void;
     setError: (error: string | null) => void;
     initializeJourney: (journeyId: string) => void;
     startLesson: (stageId: string, lessonId: string) => void;
     completeLesson: (stageId: string, lessonId: string, score: number, timeSpent: number) => void;
     updateCurrentPosition: (stageId: string, lessonId: string) => void;
     saveProgress: () => Promise<void>;
     loadProgress: (journeyId: string) => Promise<void>;
     resetProgress: () => void;
     // Computed properties
     currentStage: StageProgress | null;
     currentLesson: LessonProgress | null;
     overallProgress: number;
     completedLessonsCount: number;
     totalLessonsCount: number;
     averageScore: number;
}

// Create context
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Provider component
interface ProgressProviderProps {
     children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
     const [state, dispatch] = useReducer(progressReducer, initialState);

     // Helper functions
     const setLoading = (loading: boolean) => {
          dispatch({ type: 'SET_LOADING', payload: loading });
     };

     const setError = (error: string | null) => {
          dispatch({ type: 'SET_ERROR', payload: error });
     };

     const initializeJourney = (journeyId: string) => {
          const newJourneyProgress: JourneyProgress = {
               journeyId,
               status: 'not_started',
               stages: [],
               currentStageId: null,
               currentLessonId: null,
               overallScore: 0,
               timeSpent: 0,
               lastActivity: new Date().toISOString(),
          };

          dispatch({ type: 'SET_JOURNEY_PROGRESS', payload: newJourneyProgress });
     };

     const startLesson = (stageId: string, lessonId: string) => {
          dispatch({ type: 'START_LESSON', payload: { stageId, lessonId } });
     };

     const completeLesson = (stageId: string, lessonId: string, score: number, timeSpent: number) => {
          dispatch({ type: 'COMPLETE_LESSON', payload: { stageId, lessonId, score, timeSpent } });
     };

     const updateCurrentPosition = (stageId: string, lessonId: string) => {
          dispatch({ type: 'UPDATE_CURRENT_POSITION', payload: { stageId, lessonId } });
     };

     const saveProgress = async (): Promise<void> => {
          try {
               setLoading(true);
               dispatch({ type: 'SET_SYNC_STATUS', payload: 'pending' });

               // TODO: Implement actual save logic with API or storage
               // await saveUserProgress(state.journeyProgress);

               dispatch({ type: 'SET_LAST_SAVED', payload: new Date().toISOString() });
          } catch (error) {
               setError('Failed to save progress');
               dispatch({ type: 'SET_SYNC_STATUS', payload: 'failed' });
          } finally {
               setLoading(false);
          }
     };

     const loadProgress = async (journeyId: string): Promise<void> => {
          try {
               setLoading(true);

               // TODO: Implement actual load logic with API or storage
               // const savedProgress = await getUserProgress(journeyId);
               // if (savedProgress) {
               //   dispatch({ type: 'SET_JOURNEY_PROGRESS', payload: savedProgress });
               // } else {
               //   initializeJourney(journeyId);
               // }

               initializeJourney(journeyId);
          } catch (error) {
               setError('Failed to load progress');
          } finally {
               setLoading(false);
          }
     };

     const resetProgress = () => {
          dispatch({ type: 'RESET_STATE' });
     };

     // Computed properties
     const currentStage = state.journeyProgress?.currentStageId
          ? state.journeyProgress.stages.find(s => s.stageId === state.journeyProgress?.currentStageId) || null
          : null;

     const currentLesson = currentStage && state.journeyProgress?.currentLessonId
          ? currentStage.lessons.find(l => l.lessonId === state.journeyProgress?.currentLessonId) || null
          : null;

     const totalLessonsCount = state.journeyProgress?.stages.reduce((total, stage) =>
          total + stage.lessons.length, 0) || 0;

     const completedLessonsCount = state.journeyProgress?.stages.reduce((total, stage) =>
          total + stage.lessons.filter(l => l.status === 'completed').length, 0) || 0;

     const overallProgress = totalLessonsCount > 0 ? (completedLessonsCount / totalLessonsCount) * 100 : 0;

     const averageScore = state.journeyProgress?.overallScore || 0;

     const value: ProgressContextType = {
          state,
          dispatch,
          setLoading,
          setError,
          initializeJourney,
          startLesson,
          completeLesson,
          updateCurrentPosition,
          saveProgress,
          loadProgress,
          resetProgress,
          currentStage,
          currentLesson,
          overallProgress,
          completedLessonsCount,
          totalLessonsCount,
          averageScore,
     };

     return (
          <ProgressContext.Provider value={value}>
               {children}
          </ProgressContext.Provider>
     );
};

// Custom hook to use context
export const useProgressContext = (): ProgressContextType => {
     const context = useContext(ProgressContext);
     if (context === undefined) {
          throw new Error('useProgressContext must be used within a ProgressProvider');
     }
     return context;
}; 