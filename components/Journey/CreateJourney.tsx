import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import request from "@/api/request";
import { useMutation } from "@tanstack/react-query";
import { LESSON_TYPE_MAPPING } from "@/constants/lesson-types";
import type { Stage } from "@/types/journey";

interface CreateJourneyProps {
  refetch: () => void;
}

export const CreateJourney: React.FC<CreateJourneyProps> = ({ refetch }) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  type CreateStage = Omit<
    Stage,
    "started" | "startedAt" | "state" | "completedAt"
  >;
  const [stages, setStages] = useState<CreateStage[]>([]);
  const [isLoadingStages, setIsLoadingStages] = useState(false);
  const [stagesError, setStagesError] = useState<Error | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStage, setSelectedStage] = useState<CreateStage | null>(null);

  const { mutate: createJourney, isPending: isCreatingJourney } = useMutation({
    mutationFn: async () => {
      await request.post("/journeys", {
        stageIds: stages.map((stage) => stage._id),
      });
    },
    onSuccess: () => {
      refetch();
      Alert.alert("Thành công", "Đã tạo lộ trình học mới");
    },
    onError: (error) => {
      console.error("Error creating journey:", error);
      Alert.alert("Lỗi", "Không thể tạo lộ trình. Vui lòng thử lại sau.");
    },
  });

  const handleFetchStages = async () => {
    if (selectedLevel === null || selectedTarget === null) return;

    setIsLoadingStages(true);
    setStagesError(null);

    try {
      const response = await request.get<
        Array<Omit<Stage, "started" | "startedAt" | "state" | "completedAt">>
      >("/stages", {
        params: {
          minScore: selectedLevel,
          maxScore: selectedTarget,
        },
      });

      setStages(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching stages:", error);
      setStagesError(
        error instanceof Error
          ? error
          : new Error("Không thể tải dữ liệu lộ trình")
      );
    } finally {
      setIsLoadingStages(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedStage &&
                  `Chi tiết giai đoạn (${selectedStage.minScore} - ${selectedStage.targetScore} điểm)`}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome5 name="times" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedStage?.days
                .sort((a, b) => a.dayNumber - b.dayNumber)
                .map((day) => (
                  <View key={day.dayNumber} style={styles.dayCard}>
                    <Text style={styles.dayTitle}>Ngày {day.dayNumber}</Text>
                    {day.questions.map((question, idx) => (
                      <Text key={idx} style={styles.questionItem}>
                        Câu {question.questionNumber} -{" "}
                        {LESSON_TYPE_MAPPING[question.type]}
                      </Text>
                    ))}
                  </View>
                ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.sectionTitle}>Trình độ hiện tại của bạn</Text>
      <Text style={styles.sectionSubtitle}>
        Chọn một mức điểm phù hợp với trình độ của bạn
      </Text>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[styles.levelCard, selectedLevel === 0 && styles.selectedCard]}
          onPress={() => setSelectedLevel(0)}
        >
          <View style={styles.levelBadge}>
            <FontAwesome5 name="seedling" size={24} color="#fff" />
          </View>
          <Text style={styles.levelRange}>{"0 -> 150"}</Text>
          <Text style={styles.levelTitle}>Mất gốc</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.levelCard,
            selectedLevel === 300 && styles.selectedCard,
          ]}
          onPress={() => setSelectedLevel(300)}
        >
          <View style={[styles.levelBadge, { backgroundColor: "#FFB347" }]}>
            <FontAwesome5 name="book" size={24} color="#fff" />
          </View>
          <Text style={styles.levelRange}>{"300 -> 450"}</Text>
          <Text style={styles.levelTitle}>Trung cấp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.levelCard,
            selectedLevel === 600 && styles.selectedCard,
          ]}
          onPress={() => setSelectedLevel(600)}
        >
          <View style={[styles.levelBadge, { backgroundColor: "#4285F4" }]}>
            <FontAwesome5 name="graduation-cap" size={24} color="#fff" />
          </View>
          <Text style={styles.levelRange}>{"600 -> 700"}</Text>
          <Text style={styles.levelTitle}>Cao cấp</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Mục tiêu của bạn</Text>
      <Text style={styles.sectionSubtitle}>
        Chọn mức điểm bạn muốn đạt được
      </Text>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[
            styles.targetCard,
            selectedTarget === 300 && styles.selectedCard,
          ]}
          onPress={() => setSelectedTarget(300)}
        >
          <View style={[styles.targetBadge, { backgroundColor: "#8BC34A" }]}>
            <Text style={styles.targetScore}>300</Text>
          </View>
          <Text style={styles.targetTitle}>Cơ bản</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.targetCard,
            selectedTarget === 650 && styles.selectedCard,
          ]}
          onPress={() => setSelectedTarget(650)}
        >
          <View style={[styles.targetBadge, { backgroundColor: "#42A5F5" }]}>
            <Text style={styles.targetScore}>650</Text>
          </View>
          <Text style={styles.targetTitle}>Khá</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.targetCard,
            selectedTarget === 900 && styles.selectedCard,
          ]}
          onPress={() => setSelectedTarget(900)}
        >
          <View style={[styles.targetBadge, { backgroundColor: "#FFA000" }]}>
            <Text style={styles.targetScore}>900</Text>
          </View>
          <Text style={styles.targetTitle}>Xuất sắc</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.buildButton,
          (selectedLevel === null || selectedTarget === null) &&
            styles.disabledButton,
        ]}
        onPress={handleFetchStages}
        disabled={
          selectedLevel === null || selectedTarget === null || isLoadingStages
        }
      >
        {isLoadingStages ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buildButtonText}>Xây dựng lộ trình TOEIC</Text>
        )}
      </TouchableOpacity>

      {stagesError && (
        <Text style={styles.errorText}>
          Không thể tải dữ liệu lộ trình. Vui lòng thử lại sau.
        </Text>
      )}

      {stages.length > 0 && (
        <View style={styles.stagesContainer}>
          <Text style={styles.sectionTitle}>
            Các giai đoạn lộ trình của bạn
          </Text>
          {stages.map((stage, index) => (
            <View key={stage._id} style={styles.stageCard}>
              <Text style={styles.stageTitle}>Giai đoạn {index + 1}</Text>
              <View style={styles.stageInfoList}>
                <View style={styles.stageInfoItem}>
                  <FontAwesome5 name="flag" size={16} color="#666" />
                  <Text style={styles.stageInfoText}>
                    Điểm đầu vào: {stage.minScore}
                  </Text>
                </View>

                <View style={styles.stageInfoItem}>
                  <FontAwesome5 name="bullseye" size={16} color="#666" />
                  <Text style={styles.stageInfoText}>
                    Mục tiêu: {stage.targetScore} điểm
                  </Text>
                </View>

                <View style={styles.stageInfoItem}>
                  <FontAwesome5 name="calendar-alt" size={16} color="#666" />
                  <Text style={styles.stageInfoText}>
                    {stage.days.length} ngày luyện tập
                  </Text>
                </View>

                <View style={styles.stageInfoItem}>
                  <FontAwesome5 name="tasks" size={16} color="#666" />
                  <Text style={styles.stageInfoText}>
                    {`${stage.days.reduce(
                      (sum, day) => sum + day.questions.length,
                      0
                    )} câu hỏi`}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.stageDetailButton}
                onPress={() => {
                  setSelectedStage(stage);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.stageDetailButtonText}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.createJourneyButton}
            onPress={() => createJourney()}
            disabled={isCreatingJourney}
          >
            {isCreatingJourney ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.createJourneyButtonText}>
                Học theo lộ trình này
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  stagesContainer: {
    width: "100%",
  },
  stageCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    width: "100%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  stageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  stageInfoList: {
    marginBottom: 15,
  },
  stageInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stageInfoText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 12,
  },
  stageDetailButton: {
    backgroundColor: "#F0F9FF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "flex-end",
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#0099CC",
  },
  stageDetailButtonText: {
    color: "#0099CC",
    fontSize: 14,
    fontWeight: "bold",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  levelCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    width: "31%",
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  selectedCard: {
    borderColor: "#0099CC",
    borderWidth: 2,
    backgroundColor: "#F0F9FF",
  },
  levelBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  levelTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  levelRange: {
    fontSize: 16,
    color: "#0099CC",
    fontWeight: "bold",
    marginBottom: 5,
  },
  targetCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    width: "31%",
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  targetBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  targetScore: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  targetTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  buildButton: {
    backgroundColor: "#0099CC",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  buildButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  createJourneyButton: {
    backgroundColor: "#0099CC",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 20,
    alignSelf: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  createJourneyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalBody: {
    maxHeight: 400,
  },
  dayCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  questionItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  closeModalButton: {
    backgroundColor: "#0099CC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    alignSelf: "flex-end",
  },
  closeModalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
