import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Platform, Alert, TouchableOpacity, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import JourneySelector from "../components/JourneySelector";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import ErrorMessage from "../components/Common/ErrorMessage";
import { useJourneyData } from "../hooks/useJourneyData";
import useBackHandler from "../../../hooks/useBackHandler";
import useAuth from "../../../hooks/useAuth";

interface JourneyOverviewScreenProps {
     navigation?: any;
     route?: any;
}

const JourneyOverviewScreen: React.FC<JourneyOverviewScreenProps> = ({
     navigation,
     route,
}) => {
     const router = useRouter();
     const params = useLocalSearchParams();
     const { onLogout } = useAuth();
     const {
          overview: journeyData,
          stages: stagesData,
          loading,
          error,
          refreshData,
          isDataStale,
          forceRefresh,
          isAuthenticated
     } = useJourneyData();

     const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

     // Handle back button - default navigation behavior
     useBackHandler();

     // ✅ NEW: Handle refresh parameter from navigation
     useEffect(() => {
          const shouldRefresh = params.refresh === "true";
          if (shouldRefresh && !loading) {
               console.log("🔄 Journey refresh requested from navigation params");
               forceRefresh();
          }
     }, [params.refresh, forceRefresh, loading]);

     // ✅ NEW: Handle authentication errors
     useEffect(() => {
          if (!loading && !isAuthenticated && error?.includes('đăng nhập')) {
               console.log('🚫 User not authenticated, redirecting to login');
               // Small delay to show the error message briefly
               const timer = setTimeout(() => {
                    router.replace('/auth/login' as any);
               }, 1500);
               return () => clearTimeout(timer);
          }
     }, [loading, isAuthenticated, error, router]);

     const handleSelectStage = (stageId: string) => {
          console.log("🚀 Stage selected:", stageId);

          // Find the selected stage
          const selectedStage = stagesData.find(stage => stage.id === stageId);

          if (!selectedStage) {
               console.error("Stage not found:", stageId);
               return;
          }

          // Check if stage is unlocked
          if (selectedStage.status === 'LOCKED') {
               console.log("Stage is locked:", stageId);
               // TODO: Show locked stage message or modal
               return;
          }

          // Navigate to StageDetails screen với parameters
          console.log("🧭 Navigating with params:", {
               stageId,
               journeyId: journeyData?.id,
               journeyTitle: journeyData?.title,
               selectedStageStatus: selectedStage.status
          });

          // ✅ Sử dụng router.push() để giữ JourneyOverview trong tab stack
          // Khi StageDetails back, nó sẽ replace về JourneyOverview, không pop ra khỏi Journey tab
          router.push({
               pathname: "/journeyNew/screens/StageDetails" as any,
               params: {
                    stageId: stageId,
                    journeyId: journeyData?.id || "",
                    journeyTitle: journeyData?.title || "English Learning Journey",
                    stageNumber: selectedStage.stageNumber?.toString() || "1",
                    stageTitle: selectedStage.title || "Stage"
               }
          });
     };

     // ✅ UPDATED: Handle authentication errors specially
     const handleRetry = () => {
          if (!isAuthenticated && error?.includes('đăng nhập')) {
               // If it's an auth error, go to login instead of retry
               router.replace('/auth/login' as any);
          } else {
               // Normal retry for other errors
               refreshData();
          }
     };

     // ✅ LOADING STATE
     if (loading) {
          return (
               <SafeAreaView style={styles.container}>
                    <LoadingSpinner
                         fullScreen
                         text="Đang tải dữ liệu journey..."
                    />
               </SafeAreaView>
          );
     }

     // ✅ ERROR STATE
     if (error) {
          return (
               <SafeAreaView style={styles.container}>
                    <ErrorMessage
                         fullScreen
                         message={error}
                         onRetry={handleRetry}
                         retryText={!isAuthenticated && error?.includes('đăng nhập') ? 'Đăng nhập' : 'Thử lại'}
                    />
               </SafeAreaView>
          );
     }

     if (!journeyData) {
          return (
               <SafeAreaView style={styles.container}>
                    <ErrorMessage
                         fullScreen
                         message="Không tìm thấy dữ liệu journey"
                         onRetry={refreshData}
                    />
               </SafeAreaView>
          );
     }

     // ✅ FIXED: Handle undefined currentStage and totalStages to prevent NaN display
     const processedJourneyData = journeyData ? {
          ...journeyData,
          currentStage: journeyData.currentStage ?? 1, // Default to 1 if undefined
          totalStages: journeyData.totalStages || stagesData.length || 1 // Default based on stages count
     } : null;

     return (
          <SafeAreaView style={styles.container}>
               <JourneySelector
                    journeyData={processedJourneyData}
                    stagesData={stagesData}
                    onSelectStage={handleSelectStage}
                    onRefresh={refreshData}
                    isDataStale={isDataStale}
                    hasExistingJourney={!!processedJourneyData && processedJourneyData.id !== ''}
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

export default JourneyOverviewScreen; 