import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { IAnswer, Question } from "../type";

interface QuestionRenderer6Props {
  currentQuestionIndex: number;
  questionList: Question[];
  currentQuestion: Question;
  values: Record<string, string>;
  handleBack: () => void;
  goToNextQuestion: () => void;
  goToPrevQuestion: () => void;
  handleSelectAnswer: (option: string, subQuestionId?: string) => void;
}

const screenHeight = Dimensions.get("window").height;

const QuestionRenderer6 = ({
  currentQuestionIndex,
  questionList,
  currentQuestion,
  values,
  handleBack,
  goToNextQuestion,
  goToPrevQuestion,
  handleSelectAnswer,
}: QuestionRenderer6Props) => {
  // Hiển thị các câu hỏi con nếu có, nếu không hiển thị câu hỏi chính
  const renderQuestions = () => {
    return currentQuestion.questions.map((subQuestion, index) => (
      <View key={subQuestion._id} style={styles.questionBox}>
        <View style={styles.questionHeader}>
          <View style={styles.questionNumberBox}>
            <Text style={styles.questionNumber}>{index + 1}</Text>
          </View>
          <Text style={styles.questionTitle}>{subQuestion.question}</Text>
        </View>
        {renderAnswerOptionsNew(subQuestion.answers)}
        {renderCircleOptions(subQuestion.answers, subQuestion._id)}
      </View>
    ));
  };

  // Hiển thị các tùy chọn trả lời dưới dạng danh sách
  const renderAnswerOptionsNew = (answers: IAnswer[]) => {
    if (!answers) return null;

    return (
      <View style={styles.answersList}>
        {answers.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...
          return (
            <View key={option._id} style={styles.answerItem}>
              <Text style={styles.answerLetter}>{optionLetter}.</Text>
              <Text style={styles.answerText}>{option.answer}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  // Hiển thị các nút tròn để chọn đáp án
  const renderCircleOptions = (answers: IAnswer[], subQuestionId?: string) => {
    if (!answers) return null;

    const fieldName = subQuestionId
      ? `question_${currentQuestion._id}_${subQuestionId}`
      : `question_${currentQuestion._id}`;

    return (
      <View style={styles.circleOptionsContainer}>
        {answers.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index);
          const isSelected = values[fieldName] === option._id;

          const isCorrectAnswer = option.isCorrect;
          const userHasAnswered = !!values[fieldName];

          const showCorrectAnswer = userHasAnswered && isCorrectAnswer;
          const isWrongAnswer =
            userHasAnswered && isSelected && !isCorrectAnswer;

          return (
            <TouchableOpacity
              key={option._id}
              style={styles.circleOptionWrapper}
              onPress={() => handleSelectAnswer(option._id, subQuestionId)}
            >
              <View
                style={[
                  styles.circleOption,
                  showCorrectAnswer && styles.selectedCircleOption,
                  isWrongAnswer && styles.selectedWrongAnswer,
                ]}
              >
                <Text
                  style={[
                    styles.circleOptionText,
                    showCorrectAnswer && styles.selectedCircleOptionText,
                    isWrongAnswer && {
                      color: "white",
                    },
                  ]}
                >
                  {optionLetter}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2FC095" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Câu {currentQuestionIndex + 1}</Text>
      </View>

      <ScrollView
        style={styles.questionParagraphContainer}
        contentContainerStyle={{ padding: 10 }}
        showsVerticalScrollIndicator={true}
      >
        <View>
          {currentQuestion.imageUrl ? (
            <Image
              source={{ uri: currentQuestion.imageUrl }}
              style={styles.questionImage}
              resizeMode="contain"
            />
          ) : null}

          <Text style={{ lineHeight: 20 }}>{currentQuestion.question}</Text>
        </View>
      </ScrollView>

      {/* Questions Content */}
      <ScrollView style={styles.content}>
        <View style={styles.contentInner}>{renderQuestions()}</View>
      </ScrollView>

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginHorizontal: 8,
  },
  explainButton: {
    marginLeft: 10,
  },
  explainButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    marginTop: 10,
  },
  contentInner: {
    padding: 0,
  },
  questionBox: {
    marginBottom: 15,
  },
  questionHeader: {
    backgroundColor: "#E4C767",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  questionNumberBox: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 4,
    marginRight: 10,
    borderColor: "black",
    borderWidth: 1,
  },
  questionNumber: {
    fontWeight: "bold",
    color: "#333",
  },
  questionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
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
  answerText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  circleOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#F5F5F5",
  },
  circleOptionWrapper: {
    alignItems: "center",
  },
  circleOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCircleOption: {
    backgroundColor: "#2FC095",
    borderColor: "#2FC095",
  },
  circleOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  selectedCircleOptionText: {
    color: "#FFFFFF",
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
  subQuestionsContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  subQuestionItem: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },

  selectedWrongAnswer: {
    backgroundColor: "red",
    borderColor: "red",
  },
  questionParagraphContainer: {
    maxHeight: screenHeight * 0.4,
    minHeight: 60,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2FC095",
  },
  questionImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    marginBottom: 10,
  },
});

export default QuestionRenderer6;
