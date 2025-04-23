import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getPracticeResultService } from "../../service";
import { useQuery } from "@tanstack/react-query";
import { LESSON_TYPE, LESSON_TYPE_MAPPING } from "@/constants/lesson-types";
import { IAnswer } from "@/components/Practice/type";

const PracticeResultReview = () => {
  const params = useLocalSearchParams();

  const { data } = useQuery({
    queryKey: ["PRACTICE_RESULT", params.id],
    queryFn: () => getPracticeResultService(params.id as string),
    enabled: !!params.id,
  });

  const { partName, totalQuestions, correctAnswers } = useMemo(() => {
    const partName = data?.lessonType
      ? LESSON_TYPE_MAPPING[data?.lessonType]
      : "-";
    const totalQuestions = data?.totalQuestions || 0;
    const correctAnswers = data?.correctAnswers || 0;

    return {
      partName,
      totalQuestions,
      correctAnswers,
    };
  }, [data]);

  const questions: {
    _id: string;
    question: number;
    answers: IAnswer[];
    isCorrect: boolean;
    isNotAnswer: boolean;
    userAnswer: string;
  }[] = useMemo(() => {
    if (!data) return [];

    switch (data.lessonType) {
      case LESSON_TYPE.IMAGE_DESCRIPTION: {
        return data.questionAnswers.map((item, idx) => ({
          _id: item._id,
          question: idx + 1,
          answers: item.answers,
          isCorrect: item.isCorrect,
          isNotAnswer: item.isNotAnswer,
          userAnswer: item.userAnswer,
        }));
      }

      default: {
        return [];
      }
    }
  }, []);

  const [filter, setFilter] = useState("all");

  const filteredQuestions = questions.filter((q) => {
    if (filter === "incorrect") return !q.isCorrect;
    if (filter === "correct") return q.isCorrect;
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Đánh giá</Text>
        <Text style={styles.subtitle}>{partName}</Text>
        {/* Dynamic subtitle */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {correctAnswers}/{totalQuestions} Trả lời đúng
          </Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilter]}
          onPress={() => setFilter("all")}
        >
          <Text style={styles.filterText}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "incorrect" && styles.activeFilter,
          ]}
          onPress={() => setFilter("incorrect")}
        >
          <Text style={styles.filterText}>Chọn sai</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "correct" && styles.activeFilter,
          ]}
          onPress={() => setFilter("correct")}
        >
          <Text style={styles.filterText}>Chọn đúng</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Question List */}
      <ScrollView style={styles.scrollView}>
        {filteredQuestions.map((q) => (
          <View key={q._id} style={styles.questionItem}>
            <View style={styles.questionHeader}>
              <Text
                style={q.isCorrect ? styles.correctIcon : styles.incorrectIcon}
              >
                {q.isCorrect ? "✔" : "✘"}
              </Text>
              <Text style={styles.questionText}>Câu {q.question}</Text>
            </View>
            <View style={styles.optionsContainer}>
              {q.answers.map((option, index) => (
                <View
                  key={option._id}
                  style={[
                    styles.option,
                    {
                      backgroundColor: option.isCorrect
                        ? "#4CAF50"
                        : option._id === q.userAnswer
                        ? "#FF6F6F"
                        : "#FFF",
                      borderColor:
                        option.isCorrect || option._id === q.userAnswer
                          ? option.isCorrect
                            ? "#4CAF50"
                            : "#FF6F6F"
                          : "#CCC",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          option.isCorrect || option._id === q.userAnswer
                            ? "white"
                            : "black",
                      },
                    ]}
                  >
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => router.back()}
      >
        <Text style={styles.continueButtonText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#0099CC",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
  },
  activeFilter: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  filterText: {
    fontSize: 14,
    color: "#000",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  questionItem: {
    backgroundColor: "#FFF",
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  correctIcon: {
    color: "#4CAF50",
    fontSize: 18,
    marginRight: 10,
  },
  incorrectIcon: {
    color: "#FF6F6F",
    fontSize: 18,
    marginRight: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#0099CC",
    paddingVertical: 15,
    marginHorizontal: 50,
    borderRadius: 30,
    marginTop: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  continueButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default PracticeResultReview;
