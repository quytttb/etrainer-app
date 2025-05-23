import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LESSON_TYPE, LESSON_TYPE_MAPPING } from "@/constants/lesson-types";
import { useQuery } from "@tanstack/react-query";
import { getCurrentJourneyService } from "@/app/study-schedule/service";
import type { Journey, Stage, Day } from "@/types/journey";

interface StageJourneyProps {}

export const StageJourney: React.FC<StageJourneyProps> = () => {
  const router = useRouter();

  const {
    data: journey,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Journey, Error>({
    queryKey: ["ACTIVE_JOURNEY"],
    queryFn: () => getCurrentJourneyService(),
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0099CC" />
        <Text style={styles.loadingText}>Đang tải lộ trình học...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome5 name="exclamation-circle" size={50} color="#FF3B30" />
        <Text style={styles.errorText}>Không thể tải lộ trình học</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!journey) {
    return (
      <View style={styles.noJourneyContainer}>
        <FontAwesome5 name="route" size={50} color="#999" />
        <Text style={styles.noJourneyText}>Bạn chưa có lộ trình học nào</Text>
        <TouchableOpacity
          style={styles.createJourneyButton}
          onPress={() => router.back()}
        >
          <Text style={styles.createJourneyButtonText}>Tạo lộ trình học</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.journeyHeader}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/study-plan")}
            style={styles.backButton}
          >
            <FontAwesome5 name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.journeyTitle}>Lộ trình TOEIC của bạn</Text>
        </View>
        <View style={styles.journeyProgress}>
          <Text style={styles.journeyProgressText}>
            Giai đoạn{" "}
            {journey?.currentStageIndex !== undefined
              ? journey.currentStageIndex + 1
              : 0}
            /{journey?.stages?.length || 0} • Ngày{" "}
            {Math.min(
              (journey?.completedDays || 0) + 1,
              journey?.totalDays || 0
            )}
            /{journey?.totalDays || 0}
          </Text>
        </View>
      </View>

      {journey?.stages?.map((stage: Stage, stageIndex: number) => (
        <View key={stage._id} style={styles.stageContainer}>
          <View style={styles.stageHeader}>
            <Text style={styles.stageTitle}>Giai đoạn {stageIndex + 1}</Text>
            <Text style={styles.stageScore}>
              {stage.minScore} - {stage.targetScore} điểm
            </Text>
          </View>

          {stage.days
            .sort((a: Day, b: Day) => a.dayNumber - b.dayNumber)
            .map((day: Day, dayIndex: number) => {
              return (
                <TouchableOpacity
                  key={day._id}
                  style={[
                    styles.dayCard,
                    day.completed && styles.completedDayCard,
                    day.started && styles.currentDayCard,
                  ]}
                  disabled={!day.started}
                  onPress={() =>
                    day.started &&
                    router.push({
                      pathname: "/journeyStudy/day-questions",
                      params: {
                        dayId: day._id,
                        stageIndex: stageIndex,
                        dayNumber: day.dayNumber,
                      },
                    })
                  }
                >
                  <View style={styles.dayCardContent}>
                    <View style={styles.dayInfo}>
                      <Text
                        style={[
                          styles.dayNumber,
                          day.completed && styles.completedText,
                          day.started && styles.currentText,
                        ]}
                      >
                        Ngày {day.dayNumber}
                      </Text>
                      <Text style={styles.dayQuestionCount}>
                        {day.questions.length} câu hỏi
                      </Text>
                    </View>

                    <View style={styles.dayStatusContainer}>
                      {day.completed ? (
                        <FontAwesome5
                          name="check-circle"
                          size={20}
                          color="#4CAF50"
                        />
                      ) : day.started ? (
                        <FontAwesome5
                          name="play-circle"
                          size={20}
                          color="#0099CC"
                        />
                      ) : (
                        <FontAwesome5 name="lock" size={20} color="#999" />
                      )}
                    </View>
                  </View>

                  <View style={styles.questionList}>
                    {day.questions
                      .sort((a, b) => a.questionNumber - b.questionNumber)
                      .map((question) => (
                        <View key={question._id} style={styles.questionItem}>
                          <Text style={styles.questionText}>
                            Câu {question.questionNumber} -{" "}
                            {LESSON_TYPE_MAPPING[
                              question.type as LESSON_TYPE
                            ] || question.type}
                          </Text>
                        </View>
                      ))}
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#0099CC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noJourneyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  noJourneyText: {
    marginTop: 16,
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  createJourneyButton: {
    marginTop: 20,
    backgroundColor: "#0099CC",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  createJourneyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  journeyHeader: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  journeyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  journeyProgress: {
    backgroundColor: "#E3F2FD",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  journeyProgressText: {
    color: "#0099CC",
    fontWeight: "bold",
  },
  stageContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stageHeader: {
    backgroundColor: "#0099CC",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  stageScore: {
    fontSize: 14,
    color: "#E3F2FD",
    fontWeight: "bold",
  },
  dayCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  completedDayCard: {
    backgroundColor: "#F1F8E9",
  },
  currentDayCard: {
    backgroundColor: "#E3F2FD",
  },
  dayCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dayInfo: {
    flex: 1,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  completedText: {
    color: "#4CAF50",
  },
  currentText: {
    color: "#0099CC",
  },
  dayQuestionCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  dayStatusContainer: {
    width: 40,
    alignItems: "flex-end",
  },
  questionList: {
    marginTop: 12,
  },
  questionItem: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
});
