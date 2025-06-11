import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// Mock JourneySelector component
export const JourneySelector = ({
     journeyData,
     stagesData,
     onSelectStage,
     onRefresh,
     isDataStale,
     hasExistingJourney
}: any) => (
     <View testID="journey-selector" {...{ journeyData, stagesData, hasExistingJourney }}>
          <Text>Journey Selector</Text>
          {journeyData && <Text>{journeyData.title}</Text>}
          {stagesData?.map((stage: any) => (
               <TouchableOpacity
                    key={stage.id}
                    onPress={() => onSelectStage(stage.id)}
                    testID={`stage-${stage.id}`}
               >
                    <Text>{stage.title} - {stage.status}</Text>
               </TouchableOpacity>
          ))}
          {isDataStale && (
               <TouchableOpacity onPress={onRefresh} testID="refresh-button">
                    <Text>Refresh</Text>
               </TouchableOpacity>
          )}
     </View>
);

// Mock LoadingSpinner component
export const LoadingSpinner = ({ fullScreen, text }: any) => (
     <View testID="loading-spinner" style={fullScreen ? { flex: 1 } : {}}>
          <Text>{text || 'Loading...'}</Text>
     </View>
);

// Mock ErrorMessage component
export const ErrorMessage = ({ fullScreen, message, onRetry, retryText }: any) => (
     <View testID="error-message" style={fullScreen ? { flex: 1 } : {}}>
          <Text>{message}</Text>
          {onRetry && (
               <TouchableOpacity onPress={onRetry} testID="retry-button">
                    <Text>{retryText || 'Retry'}</Text>
               </TouchableOpacity>
          )}
     </View>
);

// Mock StageCard component
export const StageCard = ({ stage, onPress, isLocked }: any) => (
     <TouchableOpacity
          testID={`stage-card-${stage.id}`}
          onPress={() => !isLocked && onPress(stage.id)}
          disabled={isLocked}
     >
          <View>
               <Text>{stage.title}</Text>
               <Text>{stage.status}</Text>
               <Text>Progress: {stage.progress}%</Text>
               {isLocked && <Text>🔒 Locked</Text>}
          </View>
     </TouchableOpacity>
);

// Mock ProgressBar component
export const ProgressBar = ({ progress, height, color }: any) => (
     <View testID="progress-bar" style={{ height: height || 8 }}>
          <View
               testID="progress-fill"
               style={{
                    width: `${progress}%`,
                    backgroundColor: color || '#007bff',
                    height: '100%'
               }}
          />
     </View>
);

// Mock DayCard component  
export const DayCard = ({ day, onPress, isLocked, isCompleted }: any) => (
     <TouchableOpacity
          testID={`day-card-${day.number}`}
          onPress={() => !isLocked && onPress(day)}
          disabled={isLocked}
     >
          <View>
               <Text>Day {day.number}</Text>
               {isCompleted && <Text>✅ Completed</Text>}
               {isLocked && <Text>🔒 Locked</Text>}
          </View>
     </TouchableOpacity>
);

// Mock StageDetail component
export const StageDetail = ({
     data,
     onSelectDay,
     onSelectLesson,
     onSelectTest,
     onStartFinalExam,
     onGoBack
}: any) => (
     <View testID="stage-detail" {...{ data }}>
          <Text>{data?.title}</Text>
          <Text>{data?.description}</Text>
          <Text>Progress: {data?.progress}%</Text>

          {data?.days?.map((day: any) => (
               <TouchableOpacity
                    key={day._id}
                    onPress={() => onSelectDay && onSelectDay(day._id)}
                    testID={`day-${day._id}`}
               >
                    <Text>Day {day.dayNumber}</Text>
                    {day.completed && <Text>✅</Text>}
                    {!day.started && <Text>🔒</Text>}
               </TouchableOpacity>
          ))}

          {data?.finalTest && (
               <TouchableOpacity
                    onPress={() => onStartFinalExam && onStartFinalExam()}
                    testID="final-test-button"
                    disabled={!data.finalTest.unlocked}
               >
                    <Text>Final Test</Text>
                    {!data.finalTest.unlocked && <Text>🔒</Text>}
               </TouchableOpacity>
          )}

          {onGoBack && (
               <TouchableOpacity onPress={onGoBack} testID="back-button">
                    <Text>Back</Text>
               </TouchableOpacity>
          )}
     </View>
); 