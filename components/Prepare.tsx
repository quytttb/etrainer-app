import React, { useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageSourcePropType,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LESSON_TYPE, LESSON_TYPE_MAPPING } from "@/constants/lesson-types";
import { useQuery } from "@tanstack/react-query";
import { getPracticeHistoryService } from "./Home/service";
import { getLessonDescriptions } from "@/utils/lessonDescriptions";

interface PrepareProps {
  onStart: () => void;
  icon?: string;
  type: LESSON_TYPE;
}

const Prepare = ({ onStart, type }: PrepareProps) => {
  const router = useRouter();

  const { data: practiceHistories } = useQuery({
    queryKey: ["PRACTICE_HISTORY", type],
    queryFn: () => getPracticeHistoryService({ type }),
    enabled: !!type,
  });

  const { totalQuestions, correctAnswers, avgAccuracyRateString } =
    useMemo(() => {
      const totalQuestions =
        practiceHistories?.reduce(
          (acc, item) => acc + item.totalQuestions,
          0
        ) ?? 0;
      const correctAnswers =
        practiceHistories?.reduce(
          (acc, item) => acc + item.correctAnswers,
          0
        ) ?? 0;

      const avgAccuracyRate = (correctAnswers / totalQuestions) * 100;
      const avgAccuracyRateString = avgAccuracyRate
        ? avgAccuracyRate.toFixed()
        : 0;

      return {
        totalQuestions,
        correctAnswers,
        avgAccuracyRateString,
      };
    }, [practiceHistories]);

  const data = useMemo(() => {
    const partNumber = Object.keys(LESSON_TYPE).findIndex(
      (key) => LESSON_TYPE[key as keyof typeof LESSON_TYPE] === type
    );
    const partName = LESSON_TYPE_MAPPING[type];
    const { description, englishDescription } = getLessonDescriptions(type);

    return {
      title: `Part ${partNumber + 1}. ${partName}`,
      description,
      englishDescription,
    };
  }, [type]);

  const iconMapping: Record<string, ImageSourcePropType> = {
    [LESSON_TYPE.IMAGE_DESCRIPTION]: require("../assets/images/image_icon.png"),
    [LESSON_TYPE.ASK_AND_ANSWER]: require("../assets/images/qa.png"),
    [LESSON_TYPE.CONVERSATION_PIECE]: require("../assets/images/chat.png"),
    [LESSON_TYPE.SHORT_TALK]: require("../assets/images/headphones.png"),
    [LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION]: require("../assets/images/vocabulary.png"),
    [LESSON_TYPE.FILL_IN_THE_PARAGRAPH]: require("../assets/images/form.png"),
    [LESSON_TYPE.READ_AND_UNDERSTAND]: require("../assets/images/voca_icon.png"),
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back}>
          <AntDesign name="left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{data.title}</Text>
        <View style={{ width: 24 }}></View>
      </View>

      {/* Stats Area */}
      <View style={styles.statsContainer}>
        <View style={styles.statsLeft}>
          <Image source={iconMapping[type]} style={styles.miniIcon} />
          <View style={styles.statsTextContainer}>
            <Text style={styles.statsText}>
              Số câu đã làm: {totalQuestions}
            </Text>
            <Text style={styles.statsText}>Số câu đúng: {correctAnswers}</Text>
            <Text style={styles.statsText}>
              Hoàn thành: {avgAccuracyRateString}%
            </Text>
          </View>
        </View>

        <View style={styles.quickTipsContainer}>
          <Text style={styles.quickTipsText}>QUICK</Text>
          <Text style={styles.quickTipsText}>TIPS</Text>
          <Ionicons name="flash" size={24} color="#FFCC00" />
        </View>
      </View>

      {/* Question Card */}
      <View style={styles.statsContainerWrapper}>
        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>Câu hỏi:</Text>

          <Text style={styles.englishDescription}>
            {data.englishDescription}
          </Text>

          <Text style={styles.vietnameseDescription}>
            Hướng dẫn: {data.description}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={onStart}>
        <Text style={styles.startButtonText}>Bắt đầu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#0099CC",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  statsContainerWrapper: {
    padding: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  statsLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  miniIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "white",
    marginRight: 10,
  },
  statsTextContainer: {
    justifyContent: "center",
  },
  statsText: {
    fontSize: 16,
    marginVertical: 2,
  },
  quickTipsContainer: {
    borderRadius: 8,
    padding: 5,
    alignItems: "center",
    flexDirection: "row",
  },
  quickTipsText: {
    fontWeight: "bold",
    marginHorizontal: 2,
  },
  questionCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 8,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  englishDescription: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 15,
  },
  vietnameseDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  questionCountLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  questionCountSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  selectorButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  selectorButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  countDisplay: {
    marginHorizontal: 20,
  },
  countText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#0099CC",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Prepare;
