import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Question {
     id: string;
     questionNumber: number;
     type: string;
     question?: string;
     audio?: {
          name: string;
          url: string;
     };
     imageUrl?: string;
     answers?: Array<{
          answer: string;
          isCorrect: boolean;
          _id: string;
     }>;
     questions?: Array<{
          question: string;
          answers: Array<{
               answer: string;
               isCorrect: boolean;
               _id: string;
          }>;
          _id: string;
     }>;
     subtitle?: string;
     explanation?: string;
}

interface QuestionRendererProps {
     question: Question;
     questionIndex: number;
     userAnswer?: any;
     onAnswerChange: (answer: any) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
     question,
     questionIndex,
     userAnswer,
     onAnswerChange,
}) => {
     const getQuestionTypeIcon = (type: string) => {
          switch (type) {
               case "IMAGE_DESCRIPTION":
                    return "🖼️";
               case "ASK_AND_ANSWER":
                    return "❓";
               case "CONVERSATION_PIECE":
                    return "💬";
               case "SHORT_TALK":
                    return "🎤";
               case "FILL_IN_THE_BLANK_QUESTION":
                    return "📝";
               case "FILL_IN_THE_PARAGRAPH":
                    return "📄";
               case "READ_AND_UNDERSTAND":
                    return "📖";
               case "STAGE_FINAL_TEST":
                    return "🎓";
               default:
                    return "❓";
          }
     };

     const getQuestionTypeLabel = (type: string) => {
          switch (type) {
               case "IMAGE_DESCRIPTION":
                    return "Mô tả hình ảnh";
               case "ASK_AND_ANSWER":
                    return "Hỏi và đáp";
               case "CONVERSATION_PIECE":
                    return "Đoạn hội thoại";
               case "SHORT_TALK":
                    return "Bài nói ngắn";
               case "FILL_IN_THE_BLANK_QUESTION":
                    return "Điền vào câu";
               case "FILL_IN_THE_PARAGRAPH":
                    return "Điền vào đoạn văn";
               case "READ_AND_UNDERSTAND":
                    return "Đọc hiểu";
               case "STAGE_FINAL_TEST":
                    return "Thi cuối giai đoạn";
               default:
                    return "Câu hỏi";
          }
     };

     const renderSingleQuestion = () => {
          if (!question.question) return null;

          return (
               <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>{question.question}</Text>
               </View>
          );
     };

     const renderMultipleQuestions = () => {
          if (!question.questions || question.questions.length === 0) return null;

          return (
               <View style={styles.questionsContainer}>
                    {question.questions.map((subQuestion, index) => (
                         <View key={subQuestion._id} style={styles.subQuestionContainer}>
                              <Text style={styles.subQuestionNumber}>
                                   {questionIndex + 1}.{index + 1}
                              </Text>
                              <Text style={styles.subQuestionText}>
                                   {subQuestion.question}
                              </Text>
                         </View>
                    ))}
               </View>
          );
     };

     const renderSubtitle = () => {
          if (!question.subtitle) return null;

          return (
               <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitleText}>{question.subtitle}</Text>
               </View>
          );
     };

     const renderInstruction = () => {
          let instruction = "";

          switch (question.type) {
               case "ASK_AND_ANSWER":
                    instruction = "Nghe và chọn đáp án đúng:";
                    break;
               case "CONVERSATION_PIECE":
                    instruction = "Nghe đoạn hội thoại và trả lời các câu hỏi:";
                    break;
               case "IMAGE_DESCRIPTION":
                    instruction = "Nhìn hình ảnh và chọn mô tả phù hợp nhất:";
                    break;
               case "SHORT_TALK":
                    instruction = "Nghe bài nói và trả lời câu hỏi:";
                    break;
               case "FILL_IN_THE_BLANK_QUESTION":
                    instruction = "Chọn từ/cụm từ phù hợp để điền vào chỗ trống:";
                    break;
               case "FILL_IN_THE_PARAGRAPH":
                    instruction = "Chọn từ/cụm từ phù hợp để điền vào các chỗ trống trong đoạn văn:";
                    break;
               case "READ_AND_UNDERSTAND":
                    instruction = "Đọc đoạn văn và trả lời câu hỏi:";
                    break;
               default:
                    instruction = "Hãy trả lời câu hỏi:";
          }

          return (
               <View style={styles.instructionContainer}>
                    <Text style={styles.instructionText}>{instruction}</Text>
               </View>
          );
     };

     return (
          <View style={styles.container}>
               {/* Question Type Header */}
               <View style={styles.typeHeader}>
                    <View style={styles.typeInfo}>
                         <Text style={styles.typeIcon}>{getQuestionTypeIcon(question.type)}</Text>
                         <View style={styles.typeText}>
                              <Text style={styles.questionNumber}>
                                   Câu {question.questionNumber}
                              </Text>
                              <Text style={styles.typeLabel}>
                                   {getQuestionTypeLabel(question.type)}
                              </Text>
                         </View>
                    </View>
               </View>

               {/* Instruction */}
               {renderInstruction()}

               {/* Subtitle (for conversations, readings) */}
               {renderSubtitle()}

               {/* Question Content */}
               <View style={styles.contentContainer}>
                    {question.question && renderSingleQuestion()}
                    {question.questions && renderMultipleQuestions()}
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          backgroundColor: "#fff",
          marginHorizontal: 16,
          marginVertical: 8,
          borderRadius: 12,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     typeHeader: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#ecf0f1",
     },
     typeInfo: {
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
     },
     typeIcon: {
          fontSize: 28,
          marginRight: 12,
     },
     typeText: {
          flex: 1,
     },
     questionNumber: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: 2,
     },
     typeLabel: {
          fontSize: 14,
          color: "#7f8c8d",
          fontWeight: "500",
     },
     instructionContainer: {
          backgroundColor: "#f8f9fa",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
     },
     instructionText: {
          fontSize: 14,
          color: "#495057",
          fontWeight: "500",
          textAlign: "center",
     },
     subtitleContainer: {
          backgroundColor: "#e3f2fd",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: "#2196f3",
     },
     subtitleText: {
          fontSize: 14,
          color: "#1565c0",
          fontStyle: "italic",
          lineHeight: 20,
     },
     contentContainer: {
          marginTop: 8,
     },
     questionContainer: {
          marginBottom: 16,
     },
     questionText: {
          fontSize: 16,
          color: "#2c3e50",
          lineHeight: 24,
          fontWeight: "500",
     },
     questionsContainer: {
          marginBottom: 16,
     },
     subQuestionContainer: {
          flexDirection: "row",
          alignItems: "flex-start",
          marginBottom: 12,
          paddingLeft: 8,
     },
     subQuestionNumber: {
          fontSize: 14,
          fontWeight: "bold",
          color: "#3498db",
          marginRight: 8,
          minWidth: 30,
     },
     subQuestionText: {
          fontSize: 15,
          color: "#2c3e50",
          lineHeight: 22,
          flex: 1,
     },
});

export default QuestionRenderer; 