import { IExam } from "@/app/(tabs)/service";
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";

import PracticeType1_Exam from "@/components/Exam/PracticeType1_Exam";
import PracticeType2_Exam from "@/components/Exam/PracticeType2_Exam";
import PracticeType3_Exam from "@/components/Exam/PracticeType3_Exam";
import PracticeType4_Exam from "@/components/Exam/PracticeType4_Exam";
import PracticeType5_Exam from "@/components/Exam/PracticeType5_Exam";
import PracticeType6_Exam from "@/components/Exam/PracticeType6_Exam";
import { LESSON_TYPE, LESSON_TYPE_MAPPING } from "@/constants/lesson-types";
import { getLessonDescriptions } from "@/utils/lessonDescriptions";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { submitExamService } from "../service";
import { router } from "expo-router";

interface ExamProps {
  data: IExam;
  onBack: () => void;
  totalQuestion: number;
}

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

const Exam = (props: ExamProps) => {
  const { data, onBack, totalQuestion } = props;
  const sections = data.sections;
  const totalSeconds = data.duration * 60;

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [startTime, setStartTime] = useState("");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [sectionResults, setSectionResults] = useState<{
    [type: string]: any[];
  }>({});

  const { sectionName, description, sectionType } = useMemo(() => {
    const section = sections[sectionIndex];
    const sectionType = section.type;

    const sectionName = LESSON_TYPE_MAPPING[sectionType];
    const { description } = getLessonDescriptions(sectionType);

    return {
      sectionName,
      description,
      sectionType,
    };
  }, [sections, sectionIndex]);

  useEffect(() => {
    setStartTime(dayjs().toISOString());
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const submitExamMutation = useMutation({
    mutationKey: ["SUBMIT_EXAM"],
    mutationFn: submitExamService,
    onSuccess: (r) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      Alert.alert("Thành công", "Đã nộp bài thi thành công");

      router.replace(`/exam/result/${r._id}`);
    },
    onError: () => {
      Alert.alert("Lỗi", "Có lỗi khi nộp bài thi");
    },
  });

  const handleSubmitExam = () => {
    const actionAnswers = data.sections.map((section) => {
      let questions;
      if (sectionResults[section.type]) {
        questions = sectionResults[section.type];
      } else {
        questions = section.questions.map((question) => {
          if (
            [
              LESSON_TYPE.IMAGE_DESCRIPTION,
              LESSON_TYPE.ASK_AND_ANSWER,
              LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION,
            ].includes(section.type)
          ) {
            return {
              ...question,
              isNotAnswer: true,
              isCorrect: false,
              userAnswer: "",
            };
          } else {
            return {
              ...question,
              questions: question.questions.map((it) => ({
                ...it,
                isNotAnswer: true,
                isCorrect: false,
                userAnswer: "",
              })),
            };
          }
        });
      }

      return {
        ...section,
        questions,
      };
    });

    submitExamMutation.mutate({
      startTime,
      endTime: dayjs().toISOString(),
      sections: actionAnswers,
      examId: data._id,
    });
  };

  const handleNext = () => {
    setShowIntro(false);
    setQuestionIndex(0);
  };

  const handleBack = () => {
    setShowIntro(true);
    setQuestionIndex(0);
  };

  const handleSectionSubmit = () => {
    if (sectionIndex < sections.length - 1) {
      setSectionIndex(sectionIndex + 1);
      setShowIntro(true);
      setQuestionIndex(0);
    } else {
      handleSubmitExam();
    }
  };

  const handleBackFromIntro = () => {
    if (sectionIndex > 0) {
      // Quay lại section trước
      const prevSectionIndex = sectionIndex - 1;
      setSectionIndex(prevSectionIndex);

      // Hiển thị câu hỏi (không hiển thị intro)
      setShowIntro(false);

      // Đặt vị trí tại câu hỏi cuối cùng của section trước
      const prevSectionQuestions = sections[prevSectionIndex].questions;
      const lastQuestionIndex = prevSectionQuestions.length - 1;
      setQuestionIndex(lastQuestionIndex);
    } else {
      onBack();
    }
  };

  const handleValuesChange = (questionAnswers: any[]) => {
    setSectionResults((prev) => {
      const currentAnswers = prev[sectionType];

      if (
        !currentAnswers ||
        JSON.stringify(currentAnswers) !== JSON.stringify(questionAnswers)
      ) {
        return {
          ...prev,
          [sectionType]: questionAnswers,
        };
      }

      return prev;
    });
  };

  const handleSubmitSection = () => {
    setSectionIndex(sectionIndex + 1);
    setShowIntro(true);
    setQuestionIndex(0);
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [
      h > 0 ? String(h).padStart(2, "0") : null,
      String(m).padStart(2, "0"),
      String(s).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
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
      <Text style={styles.headerTitle}>
        {showIntro ? sectionName : getCurrentQuestionDisplay()}
      </Text>
      <View>
        <TouchableOpacity onPress={handleSubmitExam}>
          <Text style={styles.submitExamTxt}>Nộp bài</Text>
        </TouchableOpacity>
        <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
      </View>
    </View>
  );

  let content = null;
  if (showIntro) {
    content = (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>
            PART {sectionIndex + 1}. {sectionName}
          </Text>
          <Text style={styles.sectionType}>{description}</Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={handleBackFromIntro}>
            <Text style={styles.buttonText}>Quay lại</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    const section = sections[sectionIndex];
    const PracticeComponent = getPracticeComponent(section.type);

    content = PracticeComponent ? (
      <PracticeComponent
        questions={section.questions}
        onSubmit={handleSectionSubmit}
        initialQuestionIndex={questionIndex}
        onQuestionIndexChange={setQuestionIndex}
        onBack={handleBack}
        initialValues={sectionResults[sectionType]}
        onValuesChange={handleValuesChange}
      />
    ) : (
      <View style={styles.container}>
        <Text>Không hỗ trợ type này: {section.type}</Text>
        <TouchableOpacity style={styles.button} onPress={handleSubmitSection}>
          <Text style={styles.buttonText}>Section tiếp theo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {renderHeader()}
      <View style={{ flex: 1 }}>{content}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2FC095",
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
    backgroundColor: "#22c993",
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
});

export default Exam;
