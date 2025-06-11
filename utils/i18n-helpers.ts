import i18n from '../app/i18n';
import { LESSON_TYPE } from '@/constants/lesson-types';

/**
 * Translation helper functions for common use cases
 */

export const translateDifficulty = (difficulty: string): string => {
     const key = `journey.${difficulty.toLowerCase()}`;
     return i18n.t(key, { defaultValue: difficulty });
};

export const translateStatus = (status: string): string => {
     switch (status) {
          case 'COMPLETED':
               return i18n.t('common.completed');
          case 'IN_PROGRESS':
               return i18n.t('common.inProgress');
          case 'UNLOCKED':
               return i18n.t('common.unlocked');
          case 'LOCKED':
               return i18n.t('common.locked');
          default:
               return status;
     }
};

export const translateLessonType = (type: LESSON_TYPE): string => {
     switch (type) {
          case LESSON_TYPE.IMAGE_DESCRIPTION:
               return i18n.t('questions.questionTypes.imageDescription');
          case LESSON_TYPE.ASK_AND_ANSWER:
               return i18n.t('questions.questionTypes.askAndAnswer');
          case LESSON_TYPE.CONVERSATION_PIECE:
               return i18n.t('questions.questionTypes.conversationPiece');
          case LESSON_TYPE.SHORT_TALK:
               return i18n.t('questions.questionTypes.shortTalk');
          case LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION:
               return i18n.t('questions.questionTypes.fillInBlankQuestion');
          case LESSON_TYPE.FILL_IN_THE_PARAGRAPH:
               return i18n.t('questions.questionTypes.fillInParagraph');
          case LESSON_TYPE.READ_AND_UNDERSTAND:
               return i18n.t('questions.questionTypes.readAndUnderstand');
          case LESSON_TYPE.VOCABULARY:
               return i18n.t('questions.questionTypes.vocabulary');
          case LESSON_TYPE.GRAMMAR:
               return i18n.t('questions.questionTypes.grammar');
          default:
               return type;
     }
};

export const getQuestionInstruction = (type: LESSON_TYPE): string => {
     switch (type) {
          case LESSON_TYPE.IMAGE_DESCRIPTION:
               return i18n.t('questions.instruction.imageDescription');
          case LESSON_TYPE.ASK_AND_ANSWER:
          case LESSON_TYPE.CONVERSATION_PIECE:
          case LESSON_TYPE.SHORT_TALK:
               return i18n.t('questions.instruction.listening');
          case LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION:
               return i18n.t('questions.instruction.fillInBlank');
          case LESSON_TYPE.FILL_IN_THE_PARAGRAPH:
               return i18n.t('questions.instruction.fillInParagraph');
          case LESSON_TYPE.READ_AND_UNDERSTAND:
               return i18n.t('questions.instruction.readingComprehension');
          default:
               return i18n.t('lessons.chooseAnswer');
     }
};

export const formatCompletionRate = (rate: number): string => {
     return i18n.t('study.completionRate', { rate: Math.round(rate) });
};

export const formatScore = (score: number): string => {
     return i18n.t('stages.completedScore', { score });
};

export const formatMinimumScore = (score: number): string => {
     return i18n.t('stages.minimumScore', { score });
};

export const formatTimeRemaining = (minutes: number): string => {
     return i18n.t('alerts.timeRemaining', { minutes });
};

export const formatDayCompleted = (day: number, score: number): string => {
     return i18n.t('alerts.dayCompletedMessage', { day, score });
};

export const formatLessonCompleted = (count: number): string => {
     return i18n.t('lessons.lessonCompleted', { count });
};

export const formatAllQuestionsCompleted = (count: number, dayNumber: number): string => {
     return i18n.t('lessons.allQuestionsCompleted', { count, dayNumber });
};

/**
 * Get current language code
 */
export const getCurrentLanguage = (): string => {
     return i18n.language || 'vi';
};

/**
 * Check if current language is Vietnamese
 */
export const isVietnamese = (): boolean => {
     return getCurrentLanguage() === 'vi';
};

/**
 * Check if current language is English
 */
export const isEnglish = (): boolean => {
     return getCurrentLanguage() === 'en';
};

/**
 * Switch between Vietnamese and English
 */
export const toggleLanguage = async (): Promise<void> => {
     const currentLang = getCurrentLanguage();
     const newLang = currentLang === 'vi' ? 'en' : 'vi';
     await i18n.changeLanguage(newLang);
};

/**
 * Set specific language
 */
export const setLanguage = async (lang: 'vi' | 'en'): Promise<void> => {
     await i18n.changeLanguage(lang);
};

/**
 * Get localized lesson description with fallback
 */
export const getLessonDescription = (type: LESSON_TYPE): { description: string; englishDescription: string } => {
     // This function maintains compatibility with existing lessonDescriptions.ts
     // while providing localized content
     const description = isVietnamese()
          ? getVietnameseLessonDescription(type)
          : getEnglishLessonDescription(type);

     const englishDescription = getEnglishLessonDescription(type);

     return { description, englishDescription };
};

const getVietnameseLessonDescription = (type: LESSON_TYPE): string => {
     switch (type) {
          case LESSON_TYPE.IMAGE_DESCRIPTION:
               return "Đối với mỗi câu hỏi trong phần này, bạn sẽ nghe bốn câu nói về một bức tranh trong tập kiểm tra của mình. Khi nghe các câu phát biểu, bạn phải chọn một câu mô tả đúng nhất những gì bạn nhìn thấy trong hình. Sau đó tìm số câu hỏi trên phiếu trả lời và đánh dấu câu trả lời của bạn.";
          case LESSON_TYPE.ASK_AND_ANSWER:
               return "Bạn sẽ nghe một câu hỏi hoặc câu phát biểu và ba câu trả lời được nói bằng tiếng Anh. Chúng sẽ không được in trong sách giáo khoa của bạn và sẽ chỉ được nói một lần. Chọn câu trả lời đúng nhất cho câu hỏi hoặc câu phát biểu và đánh dấu chữ cái (A), (B) hoặc (C) trên phiếu trả lời của bạn.";
          case LESSON_TYPE.CONVERSATION_PIECE:
               return "Bạn sẽ nghe một số đoạn hội thoại giữa hai hoặc nhiều người. Bạn sẽ được yêu cầu trả lời ba câu hỏi về những gì diễn giả nói trong mỗi cuộc trò chuyện. Chọn câu trả lời đúng nhất cho mỗi câu hỏi và đánh dấu chữ cái (A), (B), (C) hoặc (D) trên phiếu trả lời của bạn. Các đoạn hội thoại sẽ không được in trong tập kiểm tra của bạn và sẽ chỉ được nói một lần";
          case LESSON_TYPE.SHORT_TALK:
               return "Bạn sẽ nghe một số bài nói được trình bày bởi một diễn giả. Bạn sẽ được yêu cầu trả lời ba câu hỏi về những gì diễn giả nói trong mỗi bài nói. Chọn câu trả lời đúng nhất cho mỗi câu hỏi và đánh dấu chữ cái (A), (B), (C) hoặc (D) trên phiếu trả lời của bạn. Các bài nói sẽ không được in trong tập kiểm tra của bạn và sẽ chỉ được nói một lần.";
          case LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION:
               return "Một từ hoặc cụm từ bị thiếu trong mỗi câu dưới đây. Bốn lựa chọn trả lời được đưa ra dưới mỗi câu. Chọn câu trả lời đúng nhất để hoàn thành câu. Sau đó đánh dầu chữ cái (A), (B), (C) hoặc (D) trên phiếu trả lời của bạn";
          case LESSON_TYPE.FILL_IN_THE_PARAGRAPH:
               return "Đọc các đoạn văn sau. Thiếu một từ, cụm từ hoặc câu trong các phần của mỗi văn bản. Bốn lựa chọn trả lời cho mỗi câu hỏi được đưa ra bên dưới văn bản. Chọn câu trả lời đúng nhất để hoàn thành đoạn văn. Sau đó đánh dấu chữ cái (A), (B), (C) hoặc (D) trên phiếu trả lời của bạn.";
          case LESSON_TYPE.READ_AND_UNDERSTAND:
               return "Trong phần này, bạn sẽ đọc một số văn bản chọn lọc, chẳng hạn như e-mail các bài báo và tạp chí cũng như tin nhằn tức thời. Mỗi văn bản hoặc tập hợp văn bản được theo sau bởi một số câu hỏi. Chọn câu trả lời đúng nhất cho mỗi câu hỏi và đánh dấu chữ cái (A), (B), (C) hoặc (D) trên phiếu trả lời của bạn.";
          default:
               return "";
     }
};

const getEnglishLessonDescription = (type: LESSON_TYPE): string => {
     switch (type) {
          case LESSON_TYPE.IMAGE_DESCRIPTION:
               return "For each question in this part, you will hear four statements about a picture in your test book. When you hear the statements, you must select the one statement that best describes what you see in the picture. Then find the number of the question on your answer sheet and mark your answer. The statements will not be printed in your test book and will be spoken only one time.";
          case LESSON_TYPE.ASK_AND_ANSWER:
               return "You will hear a question or statement and three responses spoken in English. They will not be printed in your text book and will be spoken only one time. Select the best response to the question or statement and mark the letter (A), (B) or (C) on your answer sheet.";
          case LESSON_TYPE.CONVERSATION_PIECE:
               return "You will hear some conversations between two or more people. You will be asked to answer three questions about what the speakers say in each conversation. Select the best response to each question and mark the letter (A), (B), (C), or (D) on your answer sheet. The conversations will not be printed in your test book and will be spoken only one time";
          case LESSON_TYPE.SHORT_TALK:
               return "You will hear some talks given by a single speaker. You will be asked to answer three questions about what the speaker says in each talk. Select the best response to each question and mark the letter (A), (B), (C), or (D) on your answer sheet. The talks will not be printed in your test book and will be spoken only one time.";
          case LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION:
               return "A word or phrase is missing in each of the sentences below. Four answer choices are given below each sentence. Select the best answer to complete the sentence. Then mark the letter (A), (B), (C), or (D) on your answer sheet";
          case LESSON_TYPE.FILL_IN_THE_PARAGRAPH:
               return "Read the texts that follow. A word, phrase, or sentence is missing in parts of each text. Four answer choices for each question are given below the text. Select the best answer to complete the text. Then mark the letter (A), (B), (C), or (D) on your answer sheet.";
          case LESSON_TYPE.READ_AND_UNDERSTAND:
               return "In this part you will read a selection of texts, such as magazine and newspaper articles e-mails, and instant messages. Each text or set of texts is followed by several questions. Select the best answer for each question and mark the letter (A), (B), (C), or (D) on your answer sheet.";
          default:
               return "";
     }
}; 