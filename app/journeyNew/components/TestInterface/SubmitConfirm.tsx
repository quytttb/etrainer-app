import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { JourneyNewQuestion } from "../../types";
import { formatTime } from "../../utils/timeUtils";

interface SubmitConfirmProps {
     questions: JourneyNewQuestion[];
     userAnswers: Record<string, any[]>;
     timeSpent: number;
     testType: "practice" | "final";
     onConfirm: () => void;
     onCancel: () => void;
     onReviewQuestion: (index: number) => void;
}

const SubmitConfirm: React.FC<SubmitConfirmProps> = ({
     questions,
     userAnswers,
     timeSpent,
     testType,
     onConfirm,
     onCancel,
     onReviewQuestion,
}) => {
     const answeredCount = Object.keys(userAnswers).filter(
          questionId => userAnswers[questionId] && userAnswers[questionId].length > 0
     ).length;

     const unansweredCount = questions.length - answeredCount;
     const completionPercentage = Math.round((answeredCount / questions.length) * 100);

     const getQuestionStatus = (index: number): "answered" | "unanswered" => {
          const questionId = questions[index]?.id;
          return userAnswers[questionId] && userAnswers[questionId].length > 0
               ? "answered"
               : "unanswered";
     };

     return (
          <View style={styles.container}>
               {/* Header */}
               <View style={styles.header}>
                    <Text style={styles.title}>Xác nhận nộp bài</Text>
                    <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                         <FontAwesome name="times" size={20} color="#666" />
                    </TouchableOpacity>
               </View>

               {/* Summary */}
               <View style={styles.summary}>
                    <View style={styles.summaryItem}>
                         <FontAwesome name="clock-o" size={20} color="#666" />
                         <Text style={styles.summaryText}>
                              Thời gian: {formatTime(timeSpent)}
                         </Text>
                    </View>
                    <View style={styles.summaryItem}>
                         <FontAwesome name="check-circle" size={20} color="#4CAF50" />
                         <Text style={styles.summaryText}>
                              Đã làm: {answeredCount}/{questions.length} câu
                         </Text>
                    </View>
                    {unansweredCount > 0 && (
                         <View style={styles.warning}>
                              <FontAwesome name="exclamation-triangle" size={16} color="#f44336" />
                              <Text style={styles.warningText}>
                                   Còn {unansweredCount} câu chưa trả lời
                              </Text>
                         </View>
                    )}
               </View>

               {/* Question List */}
               <ScrollView style={styles.questionList}>
                    {questions.map((question, index) => {
                         const status = getQuestionStatus(index);
                         return (
                              <TouchableOpacity
                                   key={question.id}
                                   style={styles.questionItem}
                                   onPress={() => onReviewQuestion(index)}
                              >
                                   <View style={[
                                        styles.statusDot,
                                        status === "answered" ? styles.answeredDot : styles.unansweredDot
                                   ]} />
                                   <Text style={styles.questionText}>
                                        Câu {index + 1}: {question.question || "Câu hỏi"}
                                   </Text>
                                   <FontAwesome name="chevron-right" size={16} color="#666" />
                              </TouchableOpacity>
                         );
                    })}
               </ScrollView>

               {/* Actions */}
               <View style={styles.actions}>
                    <TouchableOpacity
                         style={styles.cancelButton}
                         onPress={onCancel}
                    >
                         <Text style={styles.cancelButtonText}>Tiếp tục làm bài</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                         style={styles.submitButton}
                         onPress={onConfirm}
                    >
                         <Text style={styles.submitButtonText}>Xác nhận nộp bài</Text>
                    </TouchableOpacity>
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#fff",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
     },
     header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
     },
     title: {
          fontSize: 18,
          fontWeight: "600",
          color: "#333",
     },
     closeButton: {
          padding: 8,
     },
     summary: {
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
     },
     summaryItem: {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
     },
     summaryText: {
          fontSize: 16,
          color: "#333",
     },
     warning: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginTop: 8,
          padding: 8,
          backgroundColor: "#ffebee",
          borderRadius: 8,
     },
     warningText: {
          fontSize: 14,
          color: "#f44336",
     },
     questionList: {
          flex: 1,
          padding: 16,
     },
     questionItem: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
     },
     statusDot: {
          width: 12,
          height: 12,
          borderRadius: 6,
          marginRight: 12,
     },
     answeredDot: {
          backgroundColor: "#4CAF50",
     },
     unansweredDot: {
          backgroundColor: "#f44336",
     },
     questionText: {
          flex: 1,
          fontSize: 14,
          color: "#333",
     },
     actions: {
          flexDirection: "row",
          padding: 16,
          gap: 12,
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
     },
     cancelButton: {
          flex: 1,
          paddingVertical: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e0e0e0",
          alignItems: "center",
     },
     cancelButtonText: {
          fontSize: 16,
          color: "#666",
     },
     submitButton: {
          flex: 1,
          paddingVertical: 12,
          borderRadius: 8,
          backgroundColor: "#4CAF50",
          alignItems: "center",
     },
     submitButtonText: {
          fontSize: 16,
          color: "#fff",
          fontWeight: "600",
     },
});

export default SubmitConfirm; 