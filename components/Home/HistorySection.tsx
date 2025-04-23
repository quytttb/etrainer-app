import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getPracticeHistoryService } from "./service";
import { LESSON_TYPE_MAPPING } from "@/constants/lesson-types";
import dayjs from "dayjs";

const formatDuration = (startTime: string, endTime: string): string => {
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  const diffMs = end.diff(start);

  const diffSeconds = Math.floor(diffMs / 1000);

  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const getColorByAccuracyRate = (
  accuracyRate: number
): { progressColor: string; badgeColor: string } => {
  if (accuracyRate >= 80) {
    return {
      progressColor: "#2FC095",
      badgeColor: "#E8FFF3",
    };
  } else if (accuracyRate >= 60) {
    return {
      progressColor: "#0099CC",
      badgeColor: "#E9F5FF",
    };
  } else if (accuracyRate >= 40) {
    return {
      progressColor: "#FF8C42",
      badgeColor: "#FFF2E9",
    };
  } else {
    return {
      progressColor: "#FF5252",
      badgeColor: "#FFEBEB",
    };
  }
};

interface ExamHistory {
  id: string;
  title: string;
  questionCount: number;
  score: string;
}

const HistorySection = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("practice");

  const { data: practiceHistories } = useQuery({
    queryKey: ["PRACTICE_HISTORY"],
    queryFn: () => getPracticeHistoryService(),
  });

  const defaultExamHistory: ExamHistory[] = [
    { id: "test1", title: "Test 1", questionCount: 20, score: "20/990" },
    { id: "test2", title: "Test 2", questionCount: 15, score: "40/990" },
    { id: "test3", title: "Test 3", questionCount: 10, score: "10/990" },
  ];
  const examItems = defaultExamHistory;

  return (
    <View style={styles.historySection}>
      <Text style={styles.sectionTitle}>Lịch sử</Text>

      {/* Tab buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "practice" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("practice")}
        >
          <Text style={styles.tabText}>Luyện tập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "exam" && styles.activeTab]}
          onPress={() => setActiveTab("exam")}
        >
          <Text style={styles.tabText}>Thi</Text>
        </TouchableOpacity>
      </View>

      {/* Content for Practice tab */}
      {activeTab === "practice" && (
        <View style={styles.historyCardContainer}>
          {/* Practice Items */}
          {practiceHistories && practiceHistories.length > 0 ? (
            practiceHistories.splice(0, 4).map((item) => {
              const { progressColor, badgeColor } = getColorByAccuracyRate(
                item.accuracyRate
              );

              return (
                <TouchableOpacity
                  key={item._id}
                  style={styles.practiceCard}
                  onPress={() => router.push(`/practice/result/${item._id}`)}
                >
                  <View style={styles.practiceCardHeader}>
                    <View style={styles.practiceCardHeaderText}>
                      <Text style={styles.practiceType}>
                        {LESSON_TYPE_MAPPING[item.lessonType]}
                      </Text>
                      <Text style={styles.practiceDate}>
                        {dayjs(item.createdAt).format("DD/MM/YYYY")}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.durationBadge,
                        { backgroundColor: badgeColor },
                      ]}
                    >
                      <Text
                        style={[styles.durationText, { color: progressColor }]}
                      >
                        {formatDuration(item.startTime, item.endTime)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.progressInfoContainer}>
                    {/* Progress bar */}
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${item.accuracyRate}%`,
                            backgroundColor: progressColor,
                          },
                        ]}
                      />
                    </View>

                    {/* Stats row */}
                    <View style={styles.statsRow}>
                      <Text style={styles.statsText}>
                        <Text style={styles.statsBold}>
                          {item.correctAnswers}
                        </Text>{" "}
                        đúng /
                        <Text style={styles.statsBold}>
                          {" "}
                          {item.totalQuestions}
                        </Text>{" "}
                        câu
                      </Text>
                      <Text
                        style={[
                          styles.percentageText,
                          { color: progressColor },
                        ]}
                      >
                        {item.accuracyRate}%
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.emptyTxt}>Chưa có lịch sử luyện tập</Text>
          )}
        </View>
      )}

      {/* Content for Exam tab */}
      {activeTab === "exam" && (
        <View style={styles.historyCard}>
          <View style={styles.historyColumn}>
            <Text style={styles.historySubTitle}>Thi</Text>
            {examItems.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <Text style={styles.historyText}>{item.title}</Text>
                <Text style={styles.historyProgress}>{item.score}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  historySection: {
    marginTop: 60,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  tabButton: {
    padding: 10,
    width: "50%",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#ccc",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: "#0099CC",
  },
  tabText: {
    fontSize: 16,
    color: "#333",
  },
  historyCardContainer: {
    marginBottom: 80,
  },
  historyHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  historySubTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  viewAllText: {
    fontSize: 16,
    color: "#0099CC",
    fontWeight: "bold",
  },
  practiceCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  practiceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  practiceCardHeaderText: {
    flex: 1,
  },
  practiceType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  practiceDate: {
    fontSize: 14,
    color: "#666",
  },
  durationBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  durationText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  progressInfoContainer: {
    marginTop: 10,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#EEE",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#0099CC",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsText: {
    fontSize: 14,
    color: "#333",
  },
  statsBold: {
    fontWeight: "bold",
  },
  percentageText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0099CC",
  },
  historyCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  historyColumn: {
    width: "100%",
  },
  historyItem: {
    marginBottom: 10,
  },
  historyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  historyProgress: {
    fontSize: 14,
    color: "#0099CC",
  },
  viewMoreText: {
    fontSize: 16,
    color: "#0099CC",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "60%",
    zIndex: 11,
  },
  modalHeaderBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0099CC",
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  modalClose: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  modalItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 10,
  },
  modalItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  modalItemDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  emptyTxt: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
});

export default HistorySection;
