import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/Header";
import { LESSON_TYPE_MAPPING } from "@/constants/lesson-types";
import { useQuery } from "@tanstack/react-query";
import { getExamResultService } from "../service";

const getEncouragementMessage = (percentage: number): string => {
  if (percentage >= 90) {
    return "Xuất sắc! Bạn là người giỏi nhất!";
  } else if (percentage >= 80) {
    return "Làm rất tốt! Tiếp tục phát huy nhé!";
  } else if (percentage >= 70) {
    return "Khá tốt! Bạn đã nắm được kiến thức!";
  } else if (percentage >= 60) {
    return "Cố gắng hơn, bạn sắp đạt được rồi!";
  } else if (percentage >= 40) {
    return "Hãy ôn lại kiến thức và thử lại nhé!";
  } else {
    return "Đừng nản lòng, hãy thử lại lần sau!";
  }
};

const ExamResult = () => {
  const params = useLocalSearchParams();

  const { data } = useQuery({
    queryKey: ["EXAM_RESULT", params.id],
    queryFn: () => getExamResultService(params.id as string),
    enabled: !!params.id,
  });

  const { totalQuestions, correctAnswers, percentage, encouragementMessage } =
    useMemo(() => {
      const totalQuestions = data?.totalQuestions || 0;
      const correctAnswers = data?.correctAnswers || 0;
      const percentage = data?.accuracyRate || 0;
      const encouragementMessage = getEncouragementMessage(percentage);

      return {
        totalQuestions,
        correctAnswers,
        percentage,
        encouragementMessage,
      };
    }, [data]);

  const router = useRouter();

  if (!data) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerFallback}>
        <Header title="Kết quả" onBackPress={() => router.push("/home")} />
      </View>

      <View style={styles.resultSummary}>
        <View style={styles.borderedContainer}>
          <View style={styles.imageAndTextContainer}>
            <Image
              source={require("../../../assets/images/headphones.png")}
              style={styles.ninjaImage}
            />
            <View>
              <Text style={styles.practiceType}>{data.exam.name}</Text>
              <Text
                style={[
                  styles.encouragement,
                  percentage >= 70
                    ? styles.goodScore
                    : percentage >= 40
                    ? styles.averageScore
                    : styles.lowScore,
                ]}
              >
                {encouragementMessage}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.resultContainer}>
          <Text style={styles.resultScore}>
            Kết quả: {correctAnswers}/{totalQuestions} câu
          </Text>
          <Text style={styles.resultPercentage}>
            Tỉ lệ đúng trung bình: {percentage}%
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => router.push(`/exam/result/review/${params.id}`)}
      >
        <Text style={styles.retryButtonText}>Xem kết quả</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultSummary: {
    alignItems: "center",
    marginBottom: 20,
    flex: 1,
  },
  borderedContainer: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    width: "90%",
    marginBottom: 20,
    marginTop: 70,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  imageAndTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 10,
  },
  ninjaImage: {
    width: 90,
    height: 90,
  },
  practiceType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6F00",
  },
  encouragement: {
    fontSize: 16,
    color: "#666",
    width: "90%",
    lineHeight: 24,
  },
  resultContainer: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    width: "90%",
    padding: 20,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: -160,
  },
  incorrectContainer: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    width: "90%",
    marginHorizontal: "5%",
    marginBottom: 20,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    padding: 10,
  },
  resultScore: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  resultPercentage: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  incorrectList: {
    flex: 1,
    marginBottom: 10,
  },
  incorrectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 20,
    color: "#FF6F00",
  },
  incorrectItem: {
    paddingVertical: 10,
    marginBottom: 10,
  },
  incorrectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },
  correctAnswerText: {
    fontSize: 16,
    color: "#FF6F00",
    flex: 2,
    textAlign: "center",
  },
  arrowIcon: {
    fontSize: 18,
    color: "#CCC",
  },
  detailButton: {
    backgroundColor: "#0099CC",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  detailButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  continueButton: {
    backgroundColor: "#0099CC",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 90,
  },
  continueText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  viewAllButton: {
    backgroundColor: "#0099CC",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  viewAllButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  retryButton: {
    backgroundColor: "#0099CC",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 150,
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 20,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerFallback: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
  },
  goodScore: {
    color: "#4CAF50",
  },
  averageScore: {
    color: "#FF9800",
  },
  lowScore: {
    color: "#F44336",
  },
});

export default ExamResult;
