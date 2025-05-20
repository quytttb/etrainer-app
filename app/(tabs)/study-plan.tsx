import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getCurrentJourney } from "../study-schedule/service";
import { useIsFocused } from "@react-navigation/native";
import { CreateJourney } from "../../components/Journey/CreateJourney";

const PlanScreen: React.FC = () => {
  const router = useRouter();
  const isFocused = useIsFocused();

  const {
    data: journeyData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["CURRENT_JOURNEY", isFocused],
    queryFn: getCurrentJourney,
  });

  const handleContinueJourney = () => {
    if (journeyData && journeyData.status) {
      const currentStage = journeyData.stages[journeyData.currentStageIndex];
      router.push({
        pathname: "/learningPath",
        params: {
          stageId: currentStage.stageId,
          targetScore: currentStage.targetScore,
        },
      });
    } else {
      router.push("/learningPath");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0099CC" />
        <Text style={styles.loadingText}>Đang tải thông tin lộ trình...</Text>
      </View>
    );
  }

  if (journeyData?.status) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.journeyHeader}>
          <Text style={styles.journeyTitle}>Lộ trình hiện tại của bạn</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              Mục tiêu:{" "}
              {journeyData.stages[journeyData.currentStageIndex]?.targetScore}{" "}
              điểm TOEIC
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Tiến độ hoàn thành</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${journeyData.completionRate}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {journeyData.completionRate}% hoàn thành
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Số ngày đã hoàn thành</Text>
            <Text style={styles.statValue}>
              {journeyData.completedDays}/{journeyData.totalDays}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Giai đoạn hiện tại</Text>
            <Text style={styles.statValue}>
              {journeyData.currentStageIndex + 1}/{journeyData.stages.length}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueJourney}
        >
          <Text style={styles.continueButtonText}>Tiếp tục học tập</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Không thể tải thông tin lộ trình</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.reload()}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <CreateJourney onJourneyCreated={handleContinueJourney} />;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  centerContent: {
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "#ff0000",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#0099CC",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noJourneyText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 5,
  },
  journeyHeader: {
    width: "100%",
    backgroundColor: "#0099CC",
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    alignItems: "center",
  },
  journeyTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scoreContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  progressContainer: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  progressBarContainer: {
    height: 15,
    backgroundColor: "#E0E0E0",
    borderRadius: 7.5,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    alignSelf: "flex-end",
  },
  statsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    elevation: 1,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    textAlign: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  continueButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PlanScreen;
