import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
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
}: QuestionRendererProps) => {
  const currentAudioUri = currentQuestion.audio.url;
  const currentImageUri = currentQuestion.imageUrl;
  const hasSubQuestions =
    currentQuestion.questions && currentQuestion.questions.length > 0;

  const combineStyles = (
    ...styles: (object | boolean | null | undefined)[]
  ) => {
    return styles.filter(Boolean) as object[];
  };

  const getAnswerButtonStyle = (option: IAnswer, subQuestionId?: string) => {
    const fieldName = subQuestionId
      ? `question_${currentQuestion._id}_${subQuestionId}`
      : `question_${currentQuestion._id}`;
    const isSelected = values[fieldName] === option._id;
    const showCorrectAnswer =
      !!values[fieldName] &&
      option.isCorrect &&
      values[fieldName] !== option._id;

    return combineStyles(
      styles.answerButton,
      isSelected && styles.selectedAnswer,
      showCorrectAnswer && {
        backgroundColor: "red",
        borderColor: "red",
      }
    );
  };

  const renderAnswerOptions = (answers: IAnswer[], subQuestionId?: string) => {
    return (
      <View style={styles.answerOptionsContainer}>
        {answers.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index); // A, B, C, etc.
          const fieldName = subQuestionId
            ? `question_${currentQuestion._id}_${subQuestionId}`
            : `question_${currentQuestion._id}`;
          const isSelected = values[fieldName] === option._id;
          const showCorrectAnswer =
            !!values[fieldName] &&
            option.isCorrect &&
            values[fieldName] !== option._id;

          return (
            <TouchableOpacity
              key={option._id}
              style={getAnswerButtonStyle(option, subQuestionId)}
              onPress={() => handleSelectAnswer(option._id, subQuestionId)}
            >
              <View style={styles.answerContent}>
                <View style={styles.letterContainer}>
                  <Text
                    style={[
                      styles.letterText,
                      isSelected && styles.selectedLetterText,
                      showCorrectAnswer && { color: "#2FC095" },
                    ]}
                  >
                    {optionLetter}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.answerText,
                    isSelected && styles.selectedAnswerText,
                    showCorrectAnswer && { color: "#2FC095" },
                  ]}
                >
                  {option.answer}
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

        <Text style={styles.headerTitle}>
          Câu {currentQuestionIndex + 1} / {questionList.length}
        </Text>
      </View>

      {/* Audio Player */}
      <AudioPlayer
        audioUri={currentAudioUri}
        ref={audioPlayerRef}
        key={`audio-player-${currentQuestionIndex}`}
      />

      {/* Question Content */}
      <ScrollView style={styles.content}>
        <View style={styles.contentInner}>
          <View style={styles.instructionBar}>
            <Text style={styles.instructionText}>Select the answer</Text>
          </View>

          {currentImageUri && (
            <Image
              source={{ uri: currentImageUri }}
              style={styles.questionImage}
              resizeMode="cover"
            />
          )}

          {hasSubQuestions ? (
            // Render sub-questions
            <View style={styles.subQuestionsContainer}>
              {currentQuestion.questions.map((subQ, index) => (
                <View key={subQ._id} style={styles.subQuestionItem}>
                  <Text style={styles.questionText}>
                    {index + 1}. {subQ.question}
                  </Text>
                  {renderAnswerOptions(subQ.answers, subQ._id)}
                </View>
              ))}
            </View>
          ) : (
            // Render main question answers
            currentQuestion.answers &&
            renderAnswerOptions(currentQuestion.answers)
          )}
        </View>
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
  },
  contentInner: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
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
    height: 200,
    marginBottom: 15,
  },

  answerOptionsContainer: {
    flexDirection: "column",
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  answerButton: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "white",
    overflow: "hidden",
  },
  selectedAnswer: {
    backgroundColor: "#2FC095",
    borderColor: "#2FC095",
  },
  answerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  letterContainer: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  letterText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  selectedLetterText: {
    color: "white",
  },
  answerText: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  selectedAnswerText: {
    color: "white",
    fontWeight: "500",
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
});

export default QuestionRenderer;
