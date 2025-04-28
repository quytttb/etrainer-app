import React from "react";
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
  handleSelectAnswer: (option: string) => void;
  hideHeader?: boolean;
  showWrongAnswer?: boolean;
  disabledPrevButton?: boolean;
  isSubmit?: boolean;
  isViewMode?: boolean;
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
  showWrongAnswer = true,
  disabledPrevButton = true,
  isSubmit = true,
  isViewMode = false,
}: QuestionRendererProps) => {
  const currentAudioUri = currentQuestion.audio.url;
  const currentImageUri = currentQuestion.imageUrl;
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
        </View>
      )}

      {/* Audio Player */}
      <AudioPlayer
        audioUri={currentAudioUri}
        ref={audioPlayerRef}
        key={`audio-player-${currentQuestionIndex}`}
        autoPlay={!isViewMode}
      />

      {/* Question Content */}
      <View style={styles.content}>
        <View style={styles.contentInner}>
          <View style={styles.instructionBar}>
            <Text style={styles.instructionText}>Select the answer</Text>
          </View>

          <Image
            source={{ uri: currentImageUri }}
            style={styles.questionImage}
            resizeMode="cover"
          />
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
                !!values[`question_${currentQuestion._id}`] &&
                  option.isCorrect &&
                  showWrongAnswer &&
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
        {!isViewMode && (
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
        )}

        <TouchableOpacity
          style={[
            styles.navButton,
            { marginLeft: "auto" },
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
          {(currentQuestionIndex !== questionList.length - 1 || !isSubmit) && (
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
    backgroundColor: "#0099CC",
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
});

export default QuestionRenderer;
