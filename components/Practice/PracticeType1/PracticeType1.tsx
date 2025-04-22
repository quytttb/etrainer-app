import React, { useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import AudioPlayer, {
  AudioPlayerRef,
} from "@/components/AudioPlayer/AudioPlayer";

interface Question {
  id: number;
  imageUri: string;
  audioUri: string;
  instruction: string;
  answers: string[];
}

interface PracticeType1Props {
  questions?: Question[];
  onBack?: () => void;
  onSubmit?: (values: Record<string, string>) => void;
}

const PracticeType1 = ({ questions, onBack, onSubmit }: PracticeType1Props) => {
  // Same default questions setup
  const defaultQuestions: Question[] = [
    {
      id: 1,
      imageUri: "https://picsum.photos/500/500",
      audioUri:
        "https://res.cloudinary.com/dwyso05qz/video/upload/v1744550715/sqjdwfhycpxb7gzs3k0m.mp4",
      instruction: "Select the answer for question 1",
      answers: ["A", "B", "C", "D"],
    },
    {
      id: 2,
      imageUri: "https://picsum.photos/id/237/500/500",
      audioUri:
        "https://res.cloudinary.com/dwyso05qz/video/upload/v1744550715/sqjdwfhycpxb7gzs3k0m.mp4",
      instruction: "Select the answer for question 2",
      answers: ["A", "B", "C", "D"],
    },
  ];

  const questionList = questions || defaultQuestions;
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const navigation = useNavigation();

  // Create initial form values (one field per question)
  const initialValues: Record<string, string> = {};
  questionList.forEach((q) => {
    initialValues[`question_${q.id}`] = "";
  });

  // Optional: Create validation schema
  const validationSchema = Yup.object().shape(
    questionList.reduce((schema, q) => {
      return {
        ...schema,
        [`question_${q.id}`]: Yup.string().required("Please select an answer"),
      };
    }, {})
  );

  const handleBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        if (onSubmit) onSubmit(values);
      }}
    >
      {({ values, setFieldValue, handleSubmit }) => {
        const [currentQuestionIndex, setCurrentQuestionIndex] =
          React.useState(0);
        const currentQuestion = questionList[currentQuestionIndex];

        const goToNextQuestion = async () => {
          if (currentQuestionIndex < questionList.length - 1) {
            if (audioPlayerRef.current) {
              await audioPlayerRef.current.reset();
            }
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          } else {
            // If it's the last question, submit the form
            handleSubmit();
          }
        };

        const goToPrevQuestion = async () => {
          if (currentQuestionIndex > 0) {
            if (audioPlayerRef.current) {
              await audioPlayerRef.current.reset();
            }
            setCurrentQuestionIndex(currentQuestionIndex - 1);
          }
        };

        const handleSelectAnswer = (option: string) => {
          setFieldValue(`question_${currentQuestion.id}`, option);
        };

        return (
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2FC095" />

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="chevron-back" size={28} color="white" />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>
                Câu {currentQuestion.id} / {questionList.length}
              </Text>
            </View>

            {/* Audio Player */}
            <AudioPlayer
              audioUri={currentQuestion.audioUri}
              ref={audioPlayerRef}
              key={`audio-player-${currentQuestionIndex}`}
            />

            {/* Question Content */}
            <View style={styles.content}>
              <View style={styles.contentInner}>
                <View style={styles.instructionBar}>
                  <Text style={styles.instructionText}>
                    {currentQuestion.instruction}
                  </Text>
                </View>

                <Image
                  source={{ uri: currentQuestion.imageUri }}
                  style={styles.questionImage}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Answer Options */}
            <View style={styles.answerContainer}>
              {currentQuestion.answers.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.answerButton,
                    values[`question_${currentQuestion.id}`] === option &&
                      styles.selectedAnswer,
                  ]}
                  onPress={() => handleSelectAnswer(option)}
                >
                  <Text
                    style={[
                      styles.answerText,
                      values[`question_${currentQuestion.id}`] === option &&
                        styles.selectedAnswerText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentQuestionIndex === 0 && styles.disabledButton,
                ]}
                onPress={goToPrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <AntDesign
                  name="left"
                  size={20}
                  color={currentQuestionIndex === 0 ? "#CCC" : "#333"}
                />
                <Text
                  style={[
                    styles.navButtonText,
                    currentQuestionIndex === 0 && styles.disabledText,
                  ]}
                >
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentQuestionIndex === questionList.length - 1
                    ? { backgroundColor: "#2FC095", borderColor: "#2FC095" }
                    : null,
                ]}
                onPress={goToNextQuestion}
              >
                <Text
                  style={[
                    styles.navButtonText,
                    currentQuestionIndex === questionList.length - 1
                      ? { color: "white" }
                      : null,
                  ]}
                >
                  {currentQuestionIndex === questionList.length - 1
                    ? "Submit"
                    : "Next"}
                </Text>
                {currentQuestionIndex !== questionList.length - 1 && (
                  <AntDesign name="right" size={20} color="#333" />
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  // Thêm styles mới
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    backgroundColor: "#FFF",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 6,
    backgroundColor: "#F8F8F8",
  },
  navButtonText: {
    marginHorizontal: 5,
    color: "#333",
    fontWeight: "500",
  },
  disabledButton: {
    backgroundColor: "#F0F0F0",
    borderColor: "#EEE",
  },
  disabledText: {
    color: "#CCC",
  },
  selectedAnswerText: {
    color: "white",
  },
  // Các style khác giữ nguyên...
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2FC095",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginLeft: 32,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderTopColor: "#eee",
    borderTopWidth: 1,
  },
  contentInner: {
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  instructionBar: {
    backgroundColor: "#E4C767",
    padding: 15,
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  questionImage: {
    width: "100%",
    height: "70%",
  },
  answerContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#F0F0F0",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopColor: "#eee",
    borderTopWidth: 1,
  },
  answerButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#BBB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  selectedAnswer: {
    backgroundColor: "#2FC095",
    borderColor: "#2FC095",
  },
  answerText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PracticeType1;
