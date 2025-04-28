import PracticeType1 from "@/components/Practice/PracticeType1/PracticeType1";
import { LESSON_TYPE } from "@/constants/lesson-types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState, useRef } from "react";
import PracticeType3 from "@/components/Practice/PracticeType3/PracticeType3";
import PracticeType2 from "@/components/Practice/PracticeType2/PracticeType2";
import PracticeType4 from "@/components/Practice/PracticeType4/PracticeType4";
import PracticeType5 from "@/components/Practice/PracticeType5/PracticeType5";
import PracticeType6 from "@/components/Practice/PracticeType6/PracticeType6";
import { useQuery } from "@tanstack/react-query";
import { getPracticeResultService } from "../service";
import { Question } from "@/components/Practice/type";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const PracticeHistory = () => {
  const { id, questionId } = useLocalSearchParams();

  // Animation and explanation state
  const [showExplanation, setShowExplanation] = useState(false);
  const [activeTab, setActiveTab] = useState("explanation");
  const translateYAnim = useRef(new Animated.Value(500)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [explanationData, setExplanationData] = useState({
    subtitle: "",
    explanation: "",
  });

  const toggleExplanation = (data?: {
    subtitle: string;
    explanation: string;
  }) => {
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
    data && setExplanationData(data);
  };

  const { data } = useQuery({
    queryKey: ["PRACTICE_HISTORY", id],
    queryFn: () => getPracticeResultService(id as string),
    enabled: !!id,
  });

  const { type1, type2, type3, type4, type5, type6 } = useMemo(() => {
    const type = data?.lessonType;

    if (!type)
      return {
        type1: false,
        type2: false,
        type3: false,
        type4: false,
        type5: false,
        type6: false,
      };

    const type1 = [LESSON_TYPE.IMAGE_DESCRIPTION].includes(type);
    const type2 = [LESSON_TYPE.ASK_AND_ANSWER].includes(type);
    const type3 = [
      LESSON_TYPE.CONVERSATION_PIECE,
      LESSON_TYPE.SHORT_TALK,
    ].includes(type);
    const type4 = [LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION].includes(type);
    const type5 = [LESSON_TYPE.FILL_IN_THE_PARAGRAPH].includes(type);
    const type6 = [LESSON_TYPE.READ_AND_UNDERSTAND].includes(type);

    return { type1, type2, type3, type4, type5, type6 };
  }, [data?.lessonType]);

  const questions = data?.questionAnswers as Question[];

  // Render explanation component
  const renderExplanation = () => {
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
      </>
    );
  };

  const props = {
    questions: questions,
    onBack: router.back,
    isViewMode: true,
    questionId: questionId as string,
    toggleExplanation: toggleExplanation,
  };

  const renderContent = () => {
    if (type1) {
      return <PracticeType1 {...props} />;
    }
    if (type2) {
      return <PracticeType2 {...props} />;
    }
    if (type3) {
      return <PracticeType3 {...props} />;
    }
    if (type4) {
      return <PracticeType4 {...props} />;
    }
    if (type5) {
      return <PracticeType5 {...props} />;
    }
    if (type6) {
      return <PracticeType6 {...props} />;
    }
    return null;
  };

  return (
    <>
      {renderContent()}
      {renderExplanation()}
    </>
  );
};

// Add necessary styles
const styles = StyleSheet.create({
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

export default PracticeHistory;
