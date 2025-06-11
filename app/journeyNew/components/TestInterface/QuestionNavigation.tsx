import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { JourneyNewQuestion } from "../../types";

interface QuestionNavigationProps {
     questions: JourneyNewQuestion[];
     currentQuestionIndex: number;
     getQuestionStatus: (index: number) => "answered" | "current" | "unanswered";
     onQuestionSelect: (index: number) => void;
     onClose: () => void;
     answeredCount: number;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
     questions,
     currentQuestionIndex,
     getQuestionStatus,
     onQuestionSelect,
     onClose,
     answeredCount,
}) => {
     const renderQuestionButton = (index: number) => {
          const status = getQuestionStatus(index);
          const isCurrent = status === "current";
          const isAnswered = status === "answered";

          return (
               <TouchableOpacity
                    key={index}
                    style={[
                         styles.questionButton,
                         isCurrent && styles.currentQuestion,
                         isAnswered && styles.answeredQuestion,
                    ]}
                    onPress={() => onQuestionSelect(index)}
                    activeOpacity={0.7}
               >
                    <Text style={[
                         styles.questionNumber,
                         isCurrent && styles.currentQuestionText,
                         isAnswered && styles.answeredQuestionText,
                    ]}>
                         {index + 1}
                    </Text>
               </TouchableOpacity>
          );
     };

     return (
          <View style={styles.container}>
               {/* Header */}
               <View style={styles.header}>
                    <Text style={styles.title}>Danh sách câu hỏi</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                         <FontAwesome name="times" size={20} color="#666" />
                    </TouchableOpacity>
               </View>

               {/* Progress */}
               <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                         Đã trả lời: {answeredCount}/{questions.length} câu
                    </Text>
                    <View style={styles.progressBar}>
                         <View
                              style={[
                                   styles.progressFill,
                                   { width: `${(answeredCount / questions.length) * 100}%` }
                              ]}
                         />
                    </View>
               </View>

               {/* Question Grid */}
               <ScrollView style={styles.gridContainer}>
                    <View style={styles.grid}>
                         {questions.map((_, index) => renderQuestionButton(index))}
                    </View>
               </ScrollView>

               {/* Legend */}
               <View style={styles.legend}>
                    <View style={styles.legendItem}>
                         <View style={[styles.legendDot, styles.unansweredDot]} />
                         <Text style={styles.legendText}>Chưa trả lời</Text>
                    </View>
                    <View style={styles.legendItem}>
                         <View style={[styles.legendDot, styles.answeredDot]} />
                         <Text style={styles.legendText}>Đã trả lời</Text>
                    </View>
                    <View style={styles.legendItem}>
                         <View style={[styles.legendDot, styles.currentDot]} />
                         <Text style={styles.legendText}>Câu hiện tại</Text>
                    </View>
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
     progressContainer: {
          padding: 16,
     },
     progressText: {
          fontSize: 14,
          color: "#666",
          marginBottom: 8,
     },
     progressBar: {
          height: 4,
          backgroundColor: "#f0f0f0",
          borderRadius: 2,
          overflow: "hidden",
     },
     progressFill: {
          height: "100%",
          backgroundColor: "#4CAF50",
     },
     gridContainer: {
          flex: 1,
          padding: 16,
     },
     grid: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
     },
     questionButton: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#f5f5f5",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "#e0e0e0",
     },
     currentQuestion: {
          backgroundColor: "#2196F3",
          borderColor: "#2196F3",
     },
     answeredQuestion: {
          backgroundColor: "#4CAF50",
          borderColor: "#4CAF50",
     },
     questionNumber: {
          fontSize: 16,
          fontWeight: "500",
          color: "#666",
     },
     currentQuestionText: {
          color: "#fff",
     },
     answeredQuestionText: {
          color: "#fff",
     },
     legend: {
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
     },
     legendItem: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
     },
     legendDot: {
          width: 12,
          height: 12,
          borderRadius: 6,
     },
     unansweredDot: {
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#e0e0e0",
     },
     answeredDot: {
          backgroundColor: "#4CAF50",
     },
     currentDot: {
          backgroundColor: "#2196F3",
     },
     legendText: {
          fontSize: 12,
          color: "#666",
     },
});

export default QuestionNavigation; 