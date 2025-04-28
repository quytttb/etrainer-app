import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";

import PracticeType1_Exam from "@/components/Exam/PracticeType1_Exam";
import PracticeType2_Exam from "@/components/Exam/PracticeType2_Exam";
import PracticeType3_Exam from "@/components/Exam/PracticeType3_Exam";
import PracticeType4_Exam from "@/components/Exam/PracticeType4_Exam";
import PracticeType5_Exam from "@/components/Exam/PracticeType5_Exam";
import PracticeType6_Exam from "@/components/Exam/PracticeType6_Exam";
import { useQuery } from "@tanstack/react-query";
import { getExamResultService } from "../service";
import { router, useLocalSearchParams } from "expo-router";

const getPracticeComponent = (type: string) => {
  switch (type) {
    case "IMAGE_DESCRIPTION":
      return PracticeType1_Exam;
    case "ASK_AND_ANSWER":
      return PracticeType2_Exam;
    case "CONVERSATION_PIECE":
    case "SHORT_TALK":
      return PracticeType3_Exam;
    case "FILL_IN_THE_BLANK_QUESTION":
      return PracticeType4_Exam;
    case "FILL_IN_THE_PARAGRAPH":
      return PracticeType5_Exam;
    case "READ_AND_UNDERSTAND":
      return PracticeType6_Exam;
    default:
      return null;
  }
};

const ExamHistory = () => {
  const params = useLocalSearchParams();

  const examRef = useRef<any>(null);

  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [activeTab, setActiveTab] = useState("explanation"); // 'subtitle' or 'explanation'
  const translateYAnim = useRef(new Animated.Value(500)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const toggleExplanation = () => {
    const toValue = showExplanation ? 500 : 0;
    const opacityValue = showExplanation ? 0 : 1;

    Animated.parallel([
      Animated.spring(translateYAnim, {
        toValue,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
      Animated.timing(overlayOpacity, {
        toValue: opacityValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setShowExplanation(!showExplanation);
  };

  const { data } = useQuery({
    queryKey: ["EXAM_HISTORY", params?.id],
    queryFn: () => getExamResultService(params.id as string),
    enabled: !!params.id,
  });

  const sections = data?.sections ?? [];

  const { questions } = useMemo(() => {
    const section = sections[sectionIndex];
    const sectionType = section?.type;

    const questions =
      sections.find((it) => it.type === sectionType)?.questions ?? [];

    return {
      questions,
    };
  }, [sections, sectionIndex]);

  useEffect(() => {
    if (!sections.length) return;

    const currentSectionIdx = sections.findIndex(
      (it) => it.type === params.type
    );
    const section = sections[currentSectionIdx];
    const currentQuestionIdx = section.questions.findIndex(
      (it) => it._id === params.questionId
    );

    setSectionIndex(currentSectionIdx);
    setQuestionIndex(currentQuestionIdx);
  }, [sections]);

  if (!data) return <ActivityIndicator />;

  const totalQuestion = data.totalQuestions;

  const handleBack = () => {
    if (questionIndex > 0) {
      // Go to previous question in same section
      setQuestionIndex(questionIndex - 1);
    } else if (sectionIndex > 0) {
      // Go to previous section's last question
      const prevSectionIndex = sectionIndex - 1;
      const prevSectionQuestions = sections[prevSectionIndex].questions;
      setSectionIndex(prevSectionIndex);
      setQuestionIndex(prevSectionQuestions.length - 1);
    }
  };

  const handleSectionSubmit = () => {
    if (sectionIndex < sections.length - 1) {
      setSectionIndex(sectionIndex + 1);
      setQuestionIndex(0);
    }
  };

  const getCurrentQuestionDisplay = () => {
    const section = sections[sectionIndex];
    const type = section.type;
    const questions = section.questions;

    let globalIndex = 1;
    for (let i = 0; i < sectionIndex; i++) {
      const sec = sections[i];
      if (
        [
          "IMAGE_DESCRIPTION",
          "ASK_AND_ANSWER",
          "FILL_IN_THE_BLANK_QUESTION",
        ].includes(sec.type)
      ) {
        globalIndex += sec.questions.length;
      } else {
        for (let q of sec.questions) {
          globalIndex += q.questions?.length || 0;
        }
      }
    }

    if (
      [
        "IMAGE_DESCRIPTION",
        "ASK_AND_ANSWER",
        "FILL_IN_THE_BLANK_QUESTION",
      ].includes(type)
    ) {
      // Không có sub-question
      return `Câu ${globalIndex + questionIndex}/${totalQuestion}`;
    } else {
      // Có sub-question
      const subQuestions = questions[questionIndex]?.questions || [];
      if (subQuestions.length <= 1) {
        // Nếu chỉ có 1 sub-question, chỉ hiện 1 số
        return `Câu ${globalIndex + questionIndex}/${totalQuestion}`;
      } else {
        // Nếu có nhiều sub-question, hiện dải số
        const from = globalIndex + questionIndex;
        const to = from + subQuestions.length - 1;
        return `Câu ${from} - ${to}/${totalQuestion}`;
      }
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View
        style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}
      >
        <TouchableOpacity onPress={router.back}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{getCurrentQuestionDisplay()}</Text>
      </View>

      <View>
        <TouchableOpacity onPress={toggleExplanation}>
          <Text style={styles.submitExamTxt}>Giải thích</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const section = sections[sectionIndex];
  const PracticeComponent = getPracticeComponent(section.type);

  const renderExplanation = () => {
    const currentQuestion = questions[questionIndex];
    const explanation =
      currentQuestion?.explanation || "Không có giải thích cho câu hỏi này.";
    const subtitle =
      currentQuestion?.subtitle || "Không có phụ đề cho câu hỏi này.";

    return (
      <>
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
              onPress={toggleExplanation}
              style={styles.closeButton}
            >
              <AntDesign name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.explanationContent}>
            {activeTab === "subtitle" ? (
              <Text style={styles.explanationText}>{subtitle}</Text>
            ) : (
              <Text style={styles.explanationText}>{explanation}</Text>
            )}
          </ScrollView>
        </Animated.View>
      </>
    );
  };

  let content = PracticeComponent ? (
    <PracticeComponent
      questions={section.questions}
      onSubmit={handleSectionSubmit}
      initialQuestionIndex={questionIndex}
      onQuestionIndexChange={setQuestionIndex}
      onBack={handleBack}
      initialValues={questions}
      examRef={examRef}
      showWrongAnswer
      isViewMode
    />
  ) : (
    <View style={styles.container}>
      <Text>Không hỗ trợ type này: {section.type}</Text>
      <TouchableOpacity style={styles.button} onPress={handleSectionSubmit}>
        <Text style={styles.buttonText}>Section tiếp theo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {renderHeader()}
      <View style={{ flex: 1 }}>{content}</View>
      {renderExplanation()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0099CC",
    paddingHorizontal: 15,
    justifyContent: "space-between",
    height: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },

  timerText: {
    color: "yellow",
    letterSpacing: 1,
    textAlign: "right",
  },
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "left",
  },
  sectionType: {
    fontSize: 16,
    color: "#333",
    marginBottom: 32,
    lineHeight: 26,
  },
  button: {
    backgroundColor: "#0099CC",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#22c993",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "500",
  },

  submitExamTxt: {
    color: "#fff",
    textDecorationLine: "underline",
    fontSize: 16,
    marginBottom: 1,
  },

  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    marginBlock: 20,
    columnGap: 10,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },

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

export default ExamHistory;
