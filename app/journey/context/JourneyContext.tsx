import React, { createContext, useContext, useReducer, ReactNode } from "react";

// State interface
interface JourneyState {
     currentJourneyId: string | null;
     currentStageId: string | null;
     currentLessonId: string | null;
     isLoading: boolean;
     error: string | null;
     journeyData: any | null;
     stages: any[];
     lessons: any[];
     tests: any[];
}

// Action types
type JourneyAction =
     | { type: "SET_LOADING"; payload: boolean }
     | { type: "SET_ERROR"; payload: string | null }
     | { type: "SET_JOURNEY_DATA"; payload: any }
     | { type: "SET_CURRENT_JOURNEY"; payload: string }
     | { type: "SET_CURRENT_STAGE"; payload: string }
     | { type: "SET_CURRENT_LESSON"; payload: string }
     | { type: "SET_STAGES"; payload: any[] }
     | { type: "SET_LESSONS"; payload: any[] }
     | { type: "SET_TESTS"; payload: any[] }
     | { type: "RESET_STATE" };

// Initial state
const initialState: JourneyState = {
     currentJourneyId: null,
     currentStageId: null,
     currentLessonId: null,
     isLoading: false,
     error: null,
     journeyData: null,
     stages: [],
     lessons: [],
     tests: [],
};

// Reducer
const journeyReducer = (state: JourneyState, action: JourneyAction): JourneyState => {
     switch (action.type) {
          case "SET_LOADING":
               return { ...state, isLoading: action.payload };

          case "SET_ERROR":
               return { ...state, error: action.payload, isLoading: false };

          case "SET_JOURNEY_DATA":
               return { ...state, journeyData: action.payload, isLoading: false };

          case "SET_CURRENT_JOURNEY":
               return { ...state, currentJourneyId: action.payload };

          case "SET_CURRENT_STAGE":
               return { ...state, currentStageId: action.payload };

          case "SET_CURRENT_LESSON":
               return { ...state, currentLessonId: action.payload };

          case "SET_STAGES":
               return { ...state, stages: action.payload };

          case "SET_LESSONS":
               return { ...state, lessons: action.payload };

          case "SET_TESTS":
               return { ...state, tests: action.payload };

          case "RESET_STATE":
               return initialState;

          default:
               return state;
     }
};

// Context interface
interface JourneyContextType {
     state: JourneyState;
     dispatch: React.Dispatch<JourneyAction>;
     // Helper functions
     setLoading: (loading: boolean) => void;
     setError: (error: string | null) => void;
     setJourneyData: (data: any) => void;
     setCurrentJourney: (journeyId: string) => void;
     setCurrentStage: (stageId: string) => void;
     setCurrentLesson: (lessonId: string) => void;
     resetState: () => void;
}

// Create context
const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

// Provider component
interface JourneyProviderProps {
     children: ReactNode;
}

export const JourneyProvider: React.FC<JourneyProviderProps> = ({ children }) => {
     const [state, dispatch] = useReducer(journeyReducer, initialState);

     // Helper functions
     const setLoading = (loading: boolean) => {
          dispatch({ type: "SET_LOADING", payload: loading });
     };

     const setError = (error: string | null) => {
          dispatch({ type: "SET_ERROR", payload: error });
     };

     const setJourneyData = (data: any) => {
          dispatch({ type: "SET_JOURNEY_DATA", payload: data });
     };

     const setCurrentJourney = (journeyId: string) => {
          dispatch({ type: "SET_CURRENT_JOURNEY", payload: journeyId });
     };

     const setCurrentStage = (stageId: string) => {
          dispatch({ type: "SET_CURRENT_STAGE", payload: stageId });
     };

     const setCurrentLesson = (lessonId: string) => {
          dispatch({ type: "SET_CURRENT_LESSON", payload: lessonId });
     };

     const resetState = () => {
          dispatch({ type: "RESET_STATE" });
     };

     const value: JourneyContextType = {
          state,
          dispatch,
          setLoading,
          setError,
          setJourneyData,
          setCurrentJourney,
          setCurrentStage,
          setCurrentLesson,
          resetState,
     };

     return (
          <JourneyContext.Provider value={value}>
               {children}
          </JourneyContext.Provider>
     );
};

// Custom hook to use context
export const useJourneyContext = (): JourneyContextType => {
     const context = useContext(JourneyContext);
     if (context === undefined) {
          throw new Error("useJourneyContext must be used within a JourneyProvider");
     }
     return context;
}; 