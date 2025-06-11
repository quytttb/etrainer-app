import React from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import JourneyCard from "./JourneyCard";
import ProgressBar from "./ProgressBar";
import StageList from "./StageList";
import DataStaleIndicator from "../Common/DataStaleIndicator";
import { JourneyCardSkeleton, StageListSkeleton } from "../Common/SkeletonLoader";
import { JourneyNewOverview, JourneyNewStage } from "../../types";

interface JourneyOverviewProps {
     journeyData: JourneyNewOverview;
     stagesData: JourneyNewStage[];
     onSelectStage?: (stageId: string) => void;
     onRefresh?: () => Promise<void>;
     isDataStale?: boolean;
     onCreateNewJourney?: () => void;
}

const JourneyOverview: React.FC<JourneyOverviewProps> = ({
     journeyData,
     stagesData,
     onSelectStage,
     onRefresh,
     isDataStale = false,
     onCreateNewJourney,
}) => {
     const router = useRouter();
     const [refreshing, setRefreshing] = React.useState(false);

     const handleRefresh = async () => {
          if (!onRefresh) return;

          try {
               setRefreshing(true);
               await onRefresh();
          } catch (error) {
               console.error("Error refreshing journey data:", error);
          } finally {
               setRefreshing(false);
          }
     };

     // ✅ NEW: Handle Journey Card press - navigate to current stage
     const handleJourneyCardPress = () => {
          console.log("🎯 Journey card pressed, finding current stage...");

          // Find the current stage (first stage that's not completed or the unlocked one)
          const currentStage = stagesData.find(stage =>
               stage.status === 'IN_PROGRESS' || stage.status === 'UNLOCKED'
          );

          if (currentStage) {
               console.log("🚀 Navigating to current stage:", currentStage.id);

               router.push({
                    pathname: "/journeyNew/screens/StageDetails" as any,
                    params: {
                         stageId: currentStage.id,
                         journeyId: journeyData.id,
                         journeyTitle: journeyData.title,
                         stageNumber: currentStage.stageNumber?.toString() || "1",
                         stageTitle: currentStage.title || "Stage"
                    }
               });
          } else {
               console.log("⚠️ No current stage found, using first stage");
               // Fallback to first stage
               const firstStage = stagesData[0];
               if (firstStage) {
                    router.push({
                         pathname: "/journeyNew/screens/StageDetails" as any,
                         params: {
                              stageId: firstStage.id,
                              journeyId: journeyData.id,
                              journeyTitle: journeyData.title,
                              stageNumber: firstStage.stageNumber?.toString() || "1",
                              stageTitle: firstStage.title || "Stage"
                         }
                    });
               }
          }
     };

     return (
          <ScrollView
               style={styles.container}
               contentContainerStyle={styles.contentContainer}
               showsVerticalScrollIndicator={false}
               refreshControl={
                    <RefreshControl
                         refreshing={refreshing}
                         onRefresh={handleRefresh}
                         colors={["#3b82f6"]}
                         tintColor="#3b82f6"
                    />
               }
          >
               <View style={styles.header}>
                    <View style={styles.headerContent}>
                         <View style={styles.headerText}>
                              <Text style={styles.title}>Lộ Trình Học Tập</Text>
                              <Text style={styles.subtitle}>Theo dõi tiến độ và bắt đầu học</Text>
                         </View>
                         <View style={styles.headerButtons}>
                              {onCreateNewJourney && (
                                   <TouchableOpacity
                                        style={styles.newJourneyButton}
                                        onPress={onCreateNewJourney}
                                   >
                                        <FontAwesome5 name="plus" size={16} color="#fff" />
                                        <Text style={styles.newJourneyButtonText}>Mới</Text>
                                   </TouchableOpacity>
                              )}
                         </View>
                    </View>
               </View>

               {/* Data Stale Indicator */}
               <DataStaleIndicator
                    isVisible={isDataStale}
                    onRefresh={handleRefresh}
                    message="Dữ liệu journey đã cũ. Nhấn để cập nhật."
               />

               {/* Journey Card */}
               {journeyData ? (
                    <JourneyCard
                         title={journeyData.title}
                         description={journeyData.description}
                         progress={journeyData.progress}
                         currentStage={journeyData.currentStage}
                         totalStages={journeyData.totalStages}
                         status={journeyData.status}
                         completedDays={journeyData.completedDays}
                         totalDays={journeyData.totalDays}
                         onPress={handleJourneyCardPress}
                    />
               ) : (
                    <JourneyCardSkeleton />
               )}

               {/* Progress Overview */}
               {journeyData && (
                    <ProgressBar
                         progress={journeyData.progress}
                         label="Tiến độ tổng thể"
                    />
               )}

               {/* Stages List */}
               {stagesData?.length > 0 ? (
                    <StageList
                         stages={stagesData}
                         onSelectStage={onSelectStage}
                    />
               ) : (
                    <StageListSkeleton />
               )}
          </ScrollView>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#f8f9fa",
     },
     contentContainer: {
          paddingBottom: 100, // Space for bottom navigation
     },
     header: {
          padding: 20,
          backgroundColor: "#fff",
          marginBottom: 16,
     },
     headerContent: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
     },
     headerText: {
          flex: 1,
     },
     title: {
          fontSize: 24,
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: 4,
     },
     subtitle: {
          fontSize: 16,
          color: "#7f8c8d",
     },
     headerButtons: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
     },
     newJourneyButton: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#0099CC",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
     },
     newJourneyButtonText: {
          color: "#fff",
          fontSize: 14,
          fontWeight: "600",
          marginLeft: 6,
     },
});

export default JourneyOverview; 