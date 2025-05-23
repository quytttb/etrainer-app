import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { IAnswer, Question } from "../type";

interface QuestionRenderer4Props {
  currentQuestionIndex: number;
  questionList: Question[];
  currentQuestion: Question;
  values: Record<string, string>;
  handleBack: () => void;
  goToNextQuestion: () => void;
  goToPrevQuestion: () => void;
  handleSelectAnswer: (option: string) => void;
  hideHeader?: boolean;
  showWrongAnswer?: boolean; // thêm props này
  disabledPrevButton?: boolean;
  isSubmit?: boolean;
  isViewMode?: boolean;
  isHiddenSubmit?: boolean;
  toggleExplanation?: any;
}

const QuestionRenderer4 = ({
  currentQuestionIndex,
  questionList,
  currentQuestion,
  values,
  handleBack,
  goToNextQuestion,
  goToPrevQuestion,
  handleSelectAnswer,
  hideHeader = false,
  showWrongAnswer = true, // mặc định true
  disabledPrevButton = true,
  isSubmit = true,
  isViewMode = false,
  isHiddenSubmit = false,
  toggleExplanation,
}: QuestionRenderer4Props) => {
  const currentAnswers = currentQuestion.answers;

  const isDisabledPrevButton = currentQuestionIndex === 0 && disabledPrevButton;
  const isSubmitButton =
    isSubmit && currentQuestionIndex === questionList.length - 1;

  const combineStyles = (
    ...styles: (object | boolean | null | undefined)[]
  ) => {
    return styles.filter(Boolean) as object[];
  };

  const getAnswerButtonStyle = (option: IAnswer) => {
    const isSelected = values[`question_${currentQuestion._id}`] === option._id;
    const isCorrectAnswer = option.isCorrect;
    const userHasAnswered = !!values[`question_${currentQuestion._id}`];
    const showCorrectAnswer =
      (userHasAnswered || isViewMode) && isCorrectAnswer;
    const isWrongAnswer =
      userHasAnswered && isSelected && !isCorrectAnswer && showWrongAnswer;

    return combineStyles(
      styles.answerButton,
      isWrongAnswer && styles.selectedWrongAnswer,
      ((showCorrectAnswer && showWrongAnswer) ||
        (isSelected && !showWrongAnswer)) &&
        styles.correctAnswer
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0099CC" />

      {/* Header */}
      {!hideHeader && (
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Câu {currentQuestionIndex + 1} / {questionList.length}
          </Text>

          {toggleExplanation && (
            <TouchableOpacity
              style={{ marginLeft: "auto" }}
              onPress={() => toggleExplanation(currentQuestion)}
            >
              <Text style={styles.submitExamTxt}>Giải thích</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Question Content */}
      <View style={styles.content}>
        <View style={styles.contentInner}>
          <View style={styles.instructionBar}>
            <Text style={styles.instructionText}>
              {currentQuestion.question}
            </Text>
          </View>

          <View style={styles.answersList}>
            {currentAnswers.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index);
              return (
                <View key={option._id} style={styles.answerItem}>
                  <Text style={styles.answerLetter}>{optionLetter}.</Text>
                  <Text style={styles.answerText}>{option.answer}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Answer Options */}
      <View style={styles.answerContainer}>
        {currentAnswers.map((option) => (
          <TouchableOpacity
            key={option._id}
            style={getAnswerButtonStyle(option)}
            onPress={() => handleSelectAnswer(option._id)}
          >
            <Text
              style={[
                styles.answerText,
                ((!!values[`question_${currentQuestion._id}`] &&
                  option.isCorrect &&
                  showWrongAnswer) ||
                  (isViewMode && option.isCorrect)) &&
                  styles.correctAnswerText,
                values[`question_${currentQuestion._id}`] === option._id && {
                  color: "white",
                },
              ]}
            >
              {String.fromCharCode(65 + currentAnswers.indexOf(option))}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[
            styles.navButton,
            isDisabledPrevButton && styles.disabledButton,
          ]}
          onPress={goToPrevQuestion}
          disabled={isDisabledPrevButton}
        >
          <AntDesign
            name="left"
            size={20}
            color={isDisabledPrevButton ? "#CCC" : "#333"}
          />
          <Text
            style={[
              styles.navButtonText,
              isDisabledPrevButton && styles.disabledText,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        {!isHiddenSubmit && (
          <TouchableOpacity
            style={[
              styles.navButton,
              isSubmitButton
                ? { backgroundColor: "#0099CC", borderColor: "#0099CC" }
                : null,
            ]}
            onPress={goToNextQuestion}
          >
            <Text
              style={[
                styles.navButtonText,
                isSubmitButton ? { color: "white" } : null,
              ]}
            >
              {isSubmitButton ? "Submit" : "Next"}
            </Text>
            {(currentQuestionIndex !== questionList.length - 1 ||
              !isSubmit) && <AntDesign name="right" size={20} color="#333" />}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0099CC",
    paddingHorizontal: 15,
    height: 60,
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
  selectedWrongAnswer: {
    backgroundColor: "red",
    borderColor: "red",
  },
  correctAnswer: {
    backgroundColor: "#0099CC",
    borderColor: "#0099CC",
  },
  answerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  correctAnswerText: {
    color: "white",
  },
  selectedAnswerText: {
    color: "white",
  },

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

  answersList: {
    padding: 15,
    backgroundColor: "#FFFFFF",
  },
  answerItem: {
    flexDirection: "row",
    marginBottom: 15,
  },
  answerLetter: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: 30,
  },

  submitExamTxt: {
    color: "#fff",
    textDecorationLine: "underline",
    fontSize: 16,
    marginBottom: 1,
  },
});

export default QuestionRenderer4;
