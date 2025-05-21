import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCurrentJourneyService } from "../study-schedule/service";
import { Journey, Day } from "@/types/journey";
import { completeDayService } from "./service";
import PracticeType1 from "@/components/Practice/PracticeType1/PracticeType1";
import PracticeType2 from "@/components/Practice/PracticeType2/PracticeType2";
import PracticeType3 from "@/components/Practice/PracticeType3/PracticeType3";
import PracticeType4 from "@/components/Practice/PracticeType4/PracticeType4";
import PracticeType5 from "@/components/Practice/PracticeType5/PracticeType5";
import PracticeType6 from "@/components/Practice/PracticeType6/PracticeType6";
import { LESSON_TYPE, LESSON_TYPE_MAPPING } from "@/constants/lesson-types";
import { Question } from "@/components/Practice/type";

export default function DayQuestionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dayId = params.dayId as string;
  const stageIndex = Number(params.stageIndex);
  const dayNumber = Number(params.dayNumber);
  const [currentDay, setCurrentDay] = useState<Day | null>(null);

  const [questionsByType, setQuestionsByType] = useState<
    Record<string, Question[]>
  >({});

  const [activeType, setActiveType] = useState<LESSON_TYPE | null>(null);

  const [completedTypes, setCompletedTypes] = useState<Record<string, boolean>>(
    {}
  );

  const [allCompleted, setAllCompleted] = useState<boolean>(false);

  // Explanation modal state
  const [showExplanation, setShowExplanation] = useState(false);
  const [activeTab, setActiveTab] = useState("explanation");
  const translateYAnim = useRef(new Animated.Value(500)).current;
  const [explanationData, setExplanationData] = useState({
    subtitle: "",
    explanation: "",
  });

  const { data: journeyData, isLoading } = useQuery({
    queryKey: ["DAY_QUESTIONS", dayId],
    queryFn: getCurrentJourneyService,
  });

  useEffect(() => {
    if (journeyData && journeyData.stages && journeyData.stages[stageIndex]) {
      const day = journeyData.stages[stageIndex].days.find(
        (d) => d._id === dayId
      );

      if (day) {
        setCurrentDay(day);

        if (day.questions.length > 0) {
          const grouped: Record<string, Question[]> = {};

          day.questions.forEach((question) => {
            const type = question.type;
            if (!grouped[type]) {
              grouped[type] = [];
            }
            grouped[type].push(question);
          });

          Object.keys(grouped).forEach((type) => {
            grouped[type].sort((a, b) => a.questionNumber - b.questionNumber);
          });

          setQuestionsByType(grouped);

          const initialCompletedTypes: Record<string, boolean> = {};
          Object.keys(grouped).forEach((type) => {
            initialCompletedTypes[type] = false;
          });
          setCompletedTypes(initialCompletedTypes);

          if (Object.keys(grouped).length > 0) {
            setActiveType(Object.keys(grouped)[0] as LESSON_TYPE);
          }
        }
      }
    }
  }, [journeyData, dayId, stageIndex]);

  useEffect(() => {
    if (Object.keys(completedTypes).length > 0) {
      const allTypesCompleted = Object.values(completedTypes).every(
        (value) => value
      );
      setAllCompleted(allTypesCompleted);

      if (allTypesCompleted) {
        completeDayMutation.mutate();
      }
    }
  }, [completedTypes]);

  const completeDayMutation = useMutation({
    mutationKey: ["COMPLETE_DAY"],
    mutationFn: () => completeDayService(stageIndex, dayNumber),
    onError: (error) => {
      Alert.alert(
        "Lỗi",
        "Không thể hoàn thành ngày học. Vui lòng thử lại sau."
      );
      console.error("Error completing day:", error);
    },
  });

  const handleCompleteType = (type: LESSON_TYPE) => {
    setCompletedTypes((prev) => ({
      ...prev,
      [type]: true,
    }));

    const types = Object.keys(questionsByType) as LESSON_TYPE[];
    const nextNonCompletedType = types.find(
      (t) => !completedTypes[t] && t !== type
    );

    if (nextNonCompletedType) {
      setActiveType(nextNonCompletedType);
    }
  };

  // Function to toggle explanation modal
  const toggleExplanation = (data?: {
    subtitle: string;
    explanation: string;
  }) => {
    const toValue = showExplanation ? 500 : 0;

    Animated.spring(translateYAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();

    setShowExplanation(!showExplanation);
    if (data) {
      setExplanationData(data);
    }
  };

  if (isLoading || !currentDay) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen
          options={{
            title: `Ngày ${dayNumber}`,
            headerStyle: {
              backgroundColor: "#0099CC",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <ActivityIndicator size="large" color="#0099CC" />
        <Text style={styles.loadingText}>Đang tải câu hỏi...</Text>
      </View>
    );
  }

  if (Object.keys(questionsByType).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Stack.Screen
          options={{
            title: `Ngày ${dayNumber}`,
            headerStyle: {
              backgroundColor: "#0099CC",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <FontAwesome5 name="question-circle" size={50} color="#999" />
        <Text style={styles.emptyText}>Không có câu hỏi nào cho ngày này</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderPracticeComponent = () => {
    if (!activeType || !questionsByType[activeType]) return null;

    const questions = questionsByType[activeType];
    const props = {
      questions: questions,
      onSubmit: () => handleCompleteType(activeType),
      onBack: () => router.back(),
      toggleExplanation: toggleExplanation,
    };

    switch (activeType) {
      case LESSON_TYPE.IMAGE_DESCRIPTION:
        return <PracticeType1 {...props} />;
      case LESSON_TYPE.ASK_AND_ANSWER:
        return <PracticeType2 {...props} />;
      case LESSON_TYPE.CONVERSATION_PIECE:
      case LESSON_TYPE.SHORT_TALK:
        return <PracticeType3 {...props} />;
      case LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION:
        return <PracticeType4 {...props} />;
      case LESSON_TYPE.FILL_IN_THE_PARAGRAPH:
        return <PracticeType5 {...props} />;
      case LESSON_TYPE.READ_AND_UNDERSTAND:
        return <PracticeType6 {...props} />;
      default:
        return (
          <View style={styles.unsupportedContainer}>
            <Text style={styles.emptyText}>
              Không hỗ trợ loại câu hỏi này: {activeType}
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  if (allCompleted) {
    return (
      <View style={styles.completionContainer}>
        <Stack.Screen
          options={{
            title: `Ngày ${dayNumber}`,
            headerStyle: {
              backgroundColor: "#0099CC",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <FontAwesome5 name="trophy" size={60} color="#FFD700" />
        <Text style={styles.completionTitle}>Chúc mừng!</Text>
        <Text style={styles.completionText}>
          Bạn đã hoàn thành tất cả các câu hỏi cho ngày {dayNumber}.
        </Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push("/journeyStudy")}
        >
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render explanation modal
  const renderExplanation = () => {
    return (
      <Animated.View
        style={[
          styles.explanationContainer,
          { transform: [{ translateY: translateYAnim }] },
        ]}
      >
        <View style={styles.explanationHeader}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "subtitle" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("subtitle")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "subtitle" && styles.activeTabText,
                ]}
              >
                Phụ đề
              </Text>
              {activeTab === "subtitle" && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "explanation" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("explanation")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "explanation" && styles.activeTabText,
                ]}
              >
                Giải thích
              </Text>
              {activeTab === "explanation" && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => toggleExplanation()}
            style={styles.closeButton}
          >
            <AntDesign name="close" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.explanationContent}>
          {activeTab === "subtitle" ? (
            <Text style={styles.explanationText}>
              {explanationData.subtitle || "Không có phụ đề cho câu hỏi này"}
            </Text>
          ) : (
            <Text style={styles.explanationText}>
              {explanationData.explanation ||
                "Không có giải thích cho câu hỏi này."}
            </Text>
          )}
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Ngày ${dayNumber}`,
          headerStyle: {
            backgroundColor: "#0099CC",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <View style={styles.typeSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.keys(questionsByType).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                type === activeType && styles.activeTypeButton,
                completedTypes[type] && styles.completedTypeButton,
              ]}
              onPress={() => setActiveType(type as LESSON_TYPE)}
            >
              <Text
                style={[
                  styles.typeText,
                  type === activeType && styles.activeTypeText,
                  completedTypes[type] && styles.completedTypeText,
                ]}
              >
                {LESSON_TYPE_MAPPING[type as LESSON_TYPE] || type}
                {completedTypes[type] && (
                  <FontAwesome5
                    name="check"
                    size={12}
                    color="#4CAF50"
                    style={styles.checkIcon}
                  />
                )}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.practiceContainer}>{renderPracticeComponent()}</View>
      {renderExplanation()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#0099CC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  typeSelector: {
    backgroundColor: "#f8f8f8",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
  },
  activeTypeButton: {
    backgroundColor: "#0099CC",
  },
  completedTypeButton: {
    backgroundColor: "#E8F5E9",
  },
  typeText: {
    fontSize: 14,
    color: "#666",
  },
  activeTypeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  completedTypeText: {
    color: "#4CAF50",
  },
  checkIcon: {
    marginLeft: 4,
  },
  practiceContainer: {
    flex: 1,
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  completionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  completionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Explanation modal styles
  explanationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "40%",
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    paddingBottom: 30,
    zIndex: 2,
  },
  explanationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 10,
  },
  tabContainer: {
    flexDirection: "row",
    flex: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    paddingLeft: 16,
    paddingVertical: 12,
  },
  activeTabButton: {},
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    fontWeight: "600",
    color: "#0099CC",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    width: "50%",
    height: 3,
    backgroundColor: "#0099CC",
    borderRadius: 1.5,
  },
  explanationContent: {
    padding: 16,
    maxHeight: Dimensions.get("window").height * 0.5,
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});
