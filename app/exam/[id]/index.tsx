import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getExamByIdService } from "../service";
import { LESSON_TYPE } from "@/constants/lesson-types";
import Exam from "./exam";

const PrepareTestScreen = () => {
  const { id } = useLocalSearchParams();

  const [step, setStep] = useState<"PREPARE" | "EXAM">("PREPARE");

  const { data } = useQuery({
    queryKey: ["EXAM", id],
    queryFn: () => getExamByIdService(id as string),
    enabled: !!id,
  });

  const totalQuestion = useMemo(() => {
    if (!data) return 0;

    const totalQuestions = data.sections.reduce((acc, section) => {
      if (
        [
          LESSON_TYPE.IMAGE_DESCRIPTION,
          LESSON_TYPE.ASK_AND_ANSWER,
          LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION,
        ].includes(section.type)
      ) {
        return acc + section.questions.length;
      }

      const total = section.questions.reduce((acc, question) => {
        return acc + question.questions!.length;
      }, 0);

      return acc + total;
    }, 0);

    return totalQuestions;
  }, [data]);

  const handleStartExam = () => {
    setStep("EXAM");
  };

  const handleBackPress = () => {
    router.push("/exam");
  };

  if (!data) {
    return (
      <View style={{ marginTop: 100 }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (step === "EXAM") {
    // Truyền thêm totalQuestion vào Exam, các props khác (currentQuestionIndex, currentSubQuestionIndex) sẽ được xử lý trong Exam
    return (
      <Exam
        data={data}
        totalQuestion={totalQuestion}
        onBack={() => setStep("PREPARE")}
      />
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{data.name}</Text>

      <View style={styles.testInfoContainer}>
        <Text style={styles.testInfo}>Thời gian: {data.duration} phút</Text>
        <Text style={styles.testInfo}>Số câu hỏi: {totalQuestion}</Text>
      </View>

      <View style={styles.startButtonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartExam}>
          <Text style={styles.startButtonText}>Bắt đầu nào</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 80,
    marginBottom: 20,
    color: "#000",
  },
  testInfoContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  testInfo: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  startButtonContainer: {
    marginTop: "auto",
    marginBottom: 50,
    width: "100%",
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#0099CC",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 18,
    color: "#f00",
    textAlign: "center",
    marginTop: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 2,
    backgroundColor: "transparent",
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#00BFAE",
    fontWeight: "bold",
  },
});

export default PrepareTestScreen;
