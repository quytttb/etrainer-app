import { LESSON_TYPE } from "@/constants/lesson-types";

export function getLessonDescriptions(type: LESSON_TYPE) {
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

  return { description, englishDescription };
}
