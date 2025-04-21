import React, { useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageSourcePropType,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LESSON_TYPE, LESSON_TYPE_MAPPING } from "@/constants/lesson-types";

interface PrepareProps {
  onStart?: () => void;
  onBack?: () => void;
  icon?: string;
  type: LESSON_TYPE;
}

const Prepare = ({ onStart, onBack, type }: PrepareProps) => {
  const router = useRouter();

  const data = useMemo(() => {
    const partNumber = Object.keys(LESSON_TYPE).findIndex(
      (key) => LESSON_TYPE[key as keyof typeof LESSON_TYPE] === type
    );
    const partName = LESSON_TYPE_MAPPING[type];
    let description = "";
    let englishDescription = "";

    switch (type) {
      case LESSON_TYPE.IMAGE_DESCRIPTION: {
        description =
          "Đối với mỗi câu hỏi trong phần này, bạn sẽ nghe bốn câu nói về một bức tranh trong tập kiểm tra của mình. Khi nghe các câu phát biểu, bạn phải chọn một câu mô tả đúng nhất những gì bạn nhìn thấy trong hình. Sau đó tìm số câu hỏi trên phiếu trả lời và đánh dấu câu trả lời của bạn.";

        englishDescription =
          "For each question in this part, you will hear four statements about a picture in your test book. When you hear the statements, you must select the one statement that best describes what you see in the picture. Then find the number of the question on your answer sheet and mark your answer. The statements will not be printed in your test book and will be spoken only one time.";
        break;
      }

      case LESSON_TYPE.ASK_AND_ANSWER: {
        description =
          "Bạn sẽ nghe một câu hỏi hoặc câu phát biểu và ba câu trả lời được nói bằng tiếng Anh. Chúng sẽ không được in trong sách giáo khoa của bạn và sẽ chỉ được nói một lần. Chọn câu trả lời đúng nhất cho câu hỏi hoặc câu phát biểu và đánh dấu chữ cái (A), (B) hoặc (C) trên phiếu trả lời của bạn.";
        englishDescription =
          "You will hear a question or statement and three responses spoken in English. They will not be printed in your text book and will be spoken only one time. Select the best response to the question or statement and mark the letter (A), (B) or (C) on your answer sheet.";
        break;
      }

      case LESSON_TYPE.CONVERSATION_PIECE: {
        description =
          "Bạn sẽ nghe một số đoạn hội thoại giữa hai hoặc nhiều người. Bạn sẽ được yêu cầu trả lời ba câu hỏi về những gì diễn giả nói trong mỗi cuộc trò chuyện. Chọn câu trả lời đúng nhất cho mỗi câu hỏi và đánh dấu chữ cái (A), (B), (C) hoặc (D) trên phiếu trả lời của bạn. Các đoạn hội thoại sẽ không được in trong tập kiểm tra của bạn và sẽ chỉ được nói một lần";
        englishDescription =
          "You will hear some conversations between two or more people. You will be asked to answer three questions about what the speakers say in each conversation. Select the best response to each question and mark the letter (A), (B), (C), or (D) on your answer sheet. The conversations will not be printed in your test book and will be spoken only one time";
        break;
      }

      case LESSON_TYPE.SHORT_TALK: {
        description =
          "Bạn sẽ nghe một số bài nói được trình bày bởi một diễn giả. Bạn sẽ được yêu cầu trả lời ba câu hỏi về những gì diễn giả nói trong mỗi bài nói. Chọn câu trả lời đúng nhất cho mỗi câu hỏi và đánh dấu chữ cái (A), (B), (C) hoặc (D) trên phiếu trả lời của bạn. Các bài nói sẽ không được in trong tập kiểm tra của bạn và sẽ chỉ được nói một lần.";
        englishDescription =
          "You will hear some talks given by a single speaker. You will be asked to answer three questions about what the speaker says in each talk. Select the best response to each question and mark the letter (A), (B), (C), or (D) on your answer sheet. The talks will not be printed in your test book and will be spoken only one time.";
        break;
      }

      case LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION: {
        description =
          "Một từ hoặc cụm từ bị thiếu trong mỗi câu dưới đây. Bốn lựa chọn trả lời được đưa ra dưới mỗi câu. Chọn câu trả lời đúng nhất để hoàn thành câu. Sau đó đánh dầu chữ cái (A), (B), (C) hoặc (D) trên phiếu trả lời của bạn";
        englishDescription =
          "A word or phrase is missing in each of the sentences below. Four answer choices are given below each sentence. Select the best answer to complete the sentence. Then mark the letter (A), (B), (C), or (D) on your answer sheet";
        break;
      }

      case LESSON_TYPE.FILL_IN_THE_PARAGRAPH: {
        description =
          "Đọc các đoạn văn sau. Thiếu một từ, cụm từ hoặc câu trong các phần của mỗi văn bản. Bốn lựa chọn trả lời cho mỗi câu hỏi được đưa ra bên dưới văn bản. Chọn câu trả lời đúng nhất để hoàn thành đoạn văn. Sau đó đánh dấu chữ cái (A), (B), (C) hoặc (D) trên phiếu trả lời của bạn.";
        englishDescription =
          "Read the texts that follow. A word, phrase, or sentence is missing in parts of each text. Four answer choices for each question are given below the text. Select the best answer to complete the text. Then mark the letter (A), (B), (C), or (D) on your answer sheet.";
        break;
      }

      case LESSON_TYPE.READ_AND_UNDERSTAND: {
        englishDescription =
          "In this part you will read a selection of texts, such as magazine and newspaper articles e-mails, and instant messages. Each text or set of texts is followed by several questions. Select the best answer for each question and mark the letter (A), (B), (C), or (D) on your answer sheet.";
        description =
          "Trong phần này, bạn sẽ đọc một số văn bản chọn lọc, chẳng hạn như e-mail các bài báo và tạp chí cũng như tin nhằn tức thời. Mỗi văn bản hoặc tập hợp văn bản được theo sau bởi một số câu hỏi. Chọn câu trả lời đúng nhất cho mỗi câu hỏi và đánh dấu chữ cái (A), (B), (C) hoặc (D) trên phiếu trả lời của bạn.";
        break;
      }
    }

    return {
      title: `Part ${partNumber + 1}. ${partName}`,
      description,
      englishDescription,
    };
  }, [type]);

  const iconMapping: Record<string, ImageSourcePropType> = {
    [LESSON_TYPE.IMAGE_DESCRIPTION]: require("../assets/images/image_icon.png"),
    [LESSON_TYPE.ASK_AND_ANSWER]: require("../assets/images/qa.png"),
    [LESSON_TYPE.CONVERSATION_PIECE]: require("../assets/images/chat.png"),
    [LESSON_TYPE.SHORT_TALK]: require("../assets/images/headphones.png"),
    [LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION]: require("../assets/images/vocabulary.png"),
    [LESSON_TYPE.FILL_IN_THE_PARAGRAPH]: require("../assets/images/form.png"),
    [LESSON_TYPE.READ_AND_UNDERSTAND]: require("../assets/images/voca_icon.png"),
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <AntDesign
            name="left"
            size={24}
            color="white"
            onPress={router.back}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{data.title}</Text>
        <View style={{ width: 24 }}></View>
      </View>

      {/* Stats Area */}
      <View style={styles.statsContainer}>
        <View style={styles.statsLeft}>
          <Image source={iconMapping[type]} style={styles.miniIcon} />
          <View style={styles.statsTextContainer}>
            <Text style={styles.statsText}>Số câu đã làm: 12</Text>
            <Text style={styles.statsText}>Số câu đúng: 4</Text>
            <Text style={styles.statsText}>Hoàn thành: 33%</Text>
          </View>
        </View>

        <View style={styles.quickTipsContainer}>
          <Text style={styles.quickTipsText}>QUICK</Text>
          <Text style={styles.quickTipsText}>TIPS</Text>
          <Ionicons name="flash" size={24} color="#FFCC00" />
        </View>
      </View>

      {/* Question Card */}
      <View style={styles.statsContainerWrapper}>
        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>Câu hỏi:</Text>

          <Text style={styles.englishDescription}>
            {data.englishDescription}
          </Text>

          <Text style={styles.vietnameseDescription}>
            Hướng dẫn: {data.description}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={onStart}>
        <Text style={styles.startButtonText}>Bắt đầu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#2FC095",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  statsContainerWrapper: {
    padding: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  statsLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  miniIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "white",
    marginRight: 10,
  },
  statsTextContainer: {
    justifyContent: "center",
  },
  statsText: {
    fontSize: 16,
    marginVertical: 2,
  },
  quickTipsContainer: {
    borderRadius: 8,
    padding: 5,
    alignItems: "center",
    flexDirection: "row",
  },
  quickTipsText: {
    fontWeight: "bold",
    marginHorizontal: 2,
  },
  questionCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 8,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  englishDescription: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 15,
  },
  vietnameseDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  questionCountLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  questionCountSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  selectorButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  selectorButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  countDisplay: {
    marginHorizontal: 20,
  },
  countText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#2FC095",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Prepare;
