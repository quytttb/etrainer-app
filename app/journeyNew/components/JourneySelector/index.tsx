import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { LevelSelector } from "../../../../components/Journey/LevelSelector";
import JourneyOverview from "../JourneyOverview";
import { JourneyNewOverview, JourneyNewStage } from "../../types";

interface JourneySelectorProps {
     journeyData?: JourneyNewOverview | null;
     stagesData: JourneyNewStage[];
     onSelectStage?: (stageId: string) => void;
     onRefresh?: () => Promise<void>;
     isDataStale?: boolean;
     hasExistingJourney: boolean;
}

const JourneySelector: React.FC<JourneySelectorProps> = ({
     journeyData,
     stagesData,
     onSelectStage,
     onRefresh,
     isDataStale = false,
     hasExistingJourney
}) => {
     // Show LevelSelector if no journey found or if user explicitly requested
     const shouldShowLevelSelector = !hasExistingJourney || journeyData?.noJourneyFound;
     const [showLevelSelector, setShowLevelSelector] = useState(shouldShowLevelSelector);

     const handleJourneyCreated = async () => {
          console.log("🎉 Journey created successfully via LevelSelector");
          setShowLevelSelector(false);

          // Refresh data to get the new journey
          if (onRefresh) {
               await onRefresh();
          }
     };

     // Show LevelSelector if no existing journey, no journey found, or user requested new journey
     if (showLevelSelector || !hasExistingJourney || !journeyData || journeyData.noJourneyFound) {
          return (
               <SafeAreaView style={styles.container}>
                    <LevelSelector
                         onJourneyCreated={handleJourneyCreated}
                         onCancel={hasExistingJourney ? () => setShowLevelSelector(false) : undefined}
                    />
               </SafeAreaView>
          );
     }

     // Show existing journey overview
     return (
          <SafeAreaView style={styles.container}>
               <JourneyOverview
                    journeyData={journeyData}
                    stagesData={stagesData}
                    onSelectStage={onSelectStage}
                    onRefresh={onRefresh}
                    isDataStale={isDataStale}
                    onCreateNewJourney={() => setShowLevelSelector(true)}
               />
          </SafeAreaView>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#f8f9fa",
     },
});

export default JourneySelector; 