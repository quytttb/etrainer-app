import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import AudioPlayer, {
  AudioPlayerRef,
} from "@/components/AudioPlayer/AudioPlayer";
import { IAnswer, Question } from "../type";

interface QuestionRendererProps {
  currentQuestionIndex: number;
  questionList: Question[];
  currentQuestion: Question;
  values: Record<string, string>;
  audioPlayerRef: React.RefObject<AudioPlayerRef>;
  handleBack: () => void;
  goToNextQuestion: () => Promise<void>;
  goToPrevQuestion: () => Promise<void>;
  handleSelectAnswer: (option: string, subQuestionId?: string) => void;
  hideHeader?: boolean;
  showWrongAnswer?: boolean; // thêm props này
  disabledPrevButton?: boolean;
  isSubmit?: boolean;
  isViewMode?: boolean;
  isHiddenSubmit?: boolean;
  toggleExplanation?: any;
}

const QuestionRenderer = ({
  currentQuestionIndex,
  questionList,
  currentQuestion,
  values,
  audioPlayerRef,
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
}: QuestionRendererProps) => {
  const currentAudioUri = currentQuestion.audio.url;

  const isDisabledPrevButton = currentQuestionIndex === 0 && disabledPrevButton;
  const isSubmitButton =
    isSubmit && currentQuestionIndex === questionList.length - 1;

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

          const showCorrectAnswer =
            (userHasAnswered || isViewMode) && isCorrectAnswer;
          const isWrongAnswer =
            userHasAnswered &&
            isSelected &&
            !isCorrectAnswer &&
            showWrongAnswer;

          return (
            <TouchableOpacity
              key={option._id}
              style={styles.circleOptionWrapper}
              onPress={() => handleSelectAnswer(option._id, subQuestionId)}
            >
              <View
                style={[
                  styles.circleOption,
                  ((showCorrectAnswer && showWrongAnswer) ||
                    (isSelected && !showWrongAnswer)) &&
                    styles.selectedCircleOption,
                  isWrongAnswer && styles.selectedWrongAnswer,
                ]}
              >
                <Text
                  style={[
                    styles.circleOptionText,
                    showCorrectAnswer &&
                      showWrongAnswer &&
                      styles.selectedCircleOptionText,
                    (isWrongAnswer || isSelected) && {
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
          {/* Thêm icon trái tim (yêu thích) */}
          <TouchableOpacity style={styles.heartButton}>
            <AntDesign name="hearto" size={26} color="#fff" />
          </TouchableOpacity>
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

      {/* Audio Player */}
      <AudioPlayer
        audioUri={currentAudioUri}
        ref={audioPlayerRef}
        key={`audio-player-${currentQuestionIndex}`}
        autoPlay={!isViewMode}
      />

      {/* Questions Content */}
      <ScrollView style={styles.content}>
        <View style={styles.contentInner}>{renderQuestions()}</View>
      </ScrollView>

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
    flex: 1,
  },
  heartButton: {
    marginLeft: 8,
    marginRight: 8,
    padding: 4,
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
    borderTopColor: "#EEE",
    borderTopWidth: 1,
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
    backgroundColor: "#0099CC",
    borderColor: "#0099CC",
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

  submitExamTxt: {
    color: "#fff",
    textDecorationLine: "underline",
    fontSize: 16,
    marginBottom: 1,
  },
});

export default QuestionRenderer;
