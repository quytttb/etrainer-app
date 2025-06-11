import React, { useState, useEffect } from "react";
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
  showWrongAnswer = true,
  disabledPrevButton = true,
  isSubmit = true,
  isViewMode = false,
  isHiddenSubmit = false,
  toggleExplanation,
}: QuestionRendererProps) => {
  const currentAudioUri = currentQuestion.audio.url;
  const currentImageUri = currentQuestion.imageUrl;
  const currentAnswers = currentQuestion.answers;

  const isDisabledPrevButton = currentQuestionIndex === 0 && disabledPrevButton;
  const isSubmitButton =
    isSubmit && currentQuestionIndex === questionList.length - 1;

  const combineStyles = (
    ...styles: (object | boolean | null | undefined)[]
  ) => styles.filter(Boolean) as object[];

  const getAnswerButtonStyle = (option: IAnswer) => {
    const selected = values[`question_${currentQuestion._id}`] === option._id;
    const correct = option.isCorrect;
    const answered = !!values[`question_${currentQuestion._id}`];
    const showCorrect = (answered || isViewMode) && correct;
    const wrongSelected =
      answered && selected && !correct && showWrongAnswer;

    return combineStyles(
      styles.answerButton,
      wrongSelected && styles.selectedWrongAnswer,
      ((showCorrect && showWrongAnswer) || (selected && !showWrongAnswer)) &&
        styles.correctAnswer
    );
  };

  // ✅ 1. State lưu các câu đã yêu thích
  const [favoriteMap, setFavoriteMap] = useState<{ [questionId: string]: boolean }>({});
  const userId = "demo-user-id"; // TODO: lấy từ context/auth

  // ✅ 2. Lấy trạng thái yêu thích từ server khi chuyển câu
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const response = await fetch(
          `http://197.187.3.102/api/favorite/status?userId=${userId}&questionId=${currentQuestion._id}`
        );
        const data = await response.json();
        setFavoriteMap((prev) => ({
          ...prev,
          [currentQuestion._id]: data.isFavorite,
        }));
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái yêu thích:", error);
      }
    };

    fetchFavoriteStatus();
  }, [currentQuestion._id]);

  const isFavorite = !!favoriteMap[currentQuestion._id];

  const handleToggleFavorite = async () => {
    const newState = !isFavorite;
    setFavoriteMap((prev) => ({
      ...prev,
      [currentQuestion._id]: newState,
    }));

    try {
      await fetch("http://197.187.3.102/api/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          questionId: currentQuestion._id,
          isFavorite: newState,
        }),
      });
    } catch (error) {
      console.error("Lỗi cập nhật yêu thích:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0099CC" />
      {!hideHeader && (
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Câu {currentQuestionIndex + 1} / {questionList.length}
          </Text>
          <TouchableOpacity
            style={styles.heartButton}
            onPress={handleToggleFavorite}
          >
            <AntDesign
              name={isFavorite ? "heart" : "hearto"}
              size={26}
              color={isFavorite ? "#FF4D4F" : "#fff"}
            />
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

      <AudioPlayer
        audioUri={currentAudioUri}
        ref={audioPlayerRef}
        key={`audio-player-${currentQuestionIndex}`}
        autoPlay={!isViewMode}
      />

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
        {isViewMode && currentQuestionIndex === 0 ? null : (
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

        {!isHiddenSubmit && (
          <TouchableOpacity
            style={[
              styles.navButton,
              { marginLeft: "auto" },
              isSubmitButton && {
                backgroundColor: "#0099CC",
                borderColor: "#0099CC",
              },
            ]}
            onPress={goToNextQuestion}
          >
            <Text
              style={[
                styles.navButtonText,
                isSubmitButton && { color: "white" },
              ]}
            >
              {isSubmitButton ? "Submit" : "Next"}
            </Text>
            {(currentQuestionIndex !== questionList.length - 1 || !isSubmit) && (
              <AntDesign name="right" size={20} color="#333" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0099CC",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  heartButton: {
    marginLeft: 16,
  },
  submitExamTxt: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  contentInner: {
    width: "100%",
    alignItems: "center",
  },
  instructionBar: {
    backgroundColor: "#E6F7FF",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
  },
  instructionText: {
    color: "#0099CC",
    fontWeight: "bold",
    fontSize: 16,
  },
  questionImage: {
    width: 220,
    height: 140,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#eee",
  },
  answerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 24,
  },
  answerButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0099CC",
    borderRadius: 8,
    paddingVertical: 16,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedWrongAnswer: {
    backgroundColor: "#FF4D4F",
    borderColor: "#FF4D4F",
  },
  correctAnswer: {
    backgroundColor: "#52C41A",
    borderColor: "#52C41A",
  },
  answerText: {
    fontSize: 18,
    color: "#0099CC",
    fontWeight: "bold",
  },
  correctAnswerText: {
    color: "#fff",
  },
  navigationButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 24,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0099CC",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 8,
  },
  navButtonText: {
    fontSize: 16,
    color: "#0099CC",
    fontWeight: "bold",
    marginLeft: 6,
    marginRight: 6,
  },
  disabledButton: {
    backgroundColor: "#F0F0F0",
    borderColor: "#CCC",
  },
  disabledText: {
    color: "#CCC",
  },
});

export default QuestionRenderer;
