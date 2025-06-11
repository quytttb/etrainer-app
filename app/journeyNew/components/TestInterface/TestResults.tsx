import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { JourneyNewQuestion } from "../../types";

interface TestResultsProps {
     questions: JourneyNewQuestion[];
     userAnswers: Record<string, any[]>;
     score: number;
     timeSpent: number;
     testType: "practice" | "final";
     onRetry?: () => void;
     onContinue: () => void;
     onReviewQuestion?: (questionIndex: number) => void;
}

interface QuestionResult {
     question: JourneyNewQuestion;
     index: number;
     isCorrect: boolean;
     userAnswer?: string;
     correctAnswer?: string; // ✅ FIX: Make optional to handle undefined cases
     explanation?: string;
}

const TestResults: React.FC<TestResultsProps> = ({
     questions,
     userAnswers,
     score,
     timeSpent,
     testType,
     onRetry,
     onContinue,
     onReviewQuestion,
}) => {
     const formatTime = (seconds: number): string => {
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          const secs = seconds % 60;

          if (hours > 0) {
               return `${hours}h ${minutes}m`;
          }
          return `${minutes}m ${secs}s`;
     };

     const getScoreColor = (score: number): string => {
          if (score >= 80) return "#27ae60";
          if (score >= 60) return "#f39c12";
          return "#e74c3c";
     };

     const getScoreLabel = (score: number): string => {
          if (score >= 90) return "Xuất sắc";
          if (score >= 80) return "Tốt";
          if (score >= 70) return "Khá";
          if (score >= 60) return "Trung bình";
          return "Cần cải thiện";
     };

     const getPerformanceAnalysis = () => {
          const correctCount = questions.filter((q, index) => {
               // Mock logic for checking if answer is correct
               return userAnswers[q.id] && userAnswers[q.id].length > 0;
          }).length;

          const accuracy = Math.round((correctCount / questions.length) * 100);
          const avgTimePerQuestion = Math.round(timeSpent / questions.length);

          return {
               correctCount,
               incorrectCount: questions.length - correctCount,
               accuracy,
               avgTimePerQuestion,
          };
     };

     const getQuestionResults = (): QuestionResult[] => {
          return questions.map((question, index) => {
               const userAnswer = userAnswers[question.id]?.[0];
               const isCorrect = userAnswer === question.correctAnswer;

               return {
                    question,
                    index,
                    isCorrect,
                    userAnswer: userAnswer || "Không trả lời",
                    correctAnswer: question.correctAnswer,
                    explanation: question.explanation,
               };
          });
     };

     const analysis = getPerformanceAnalysis();
     const questionResults = getQuestionResults();
     const incorrectQuestions = questionResults.filter(r => !r.isCorrect);

     return (
          <View style={styles.container}>
               <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
               >
                    {/* Header with Score */}
                    <View style={styles.scoreContainer}>
                         <View style={styles.scoreCircle}>
                              <Text style={[styles.scoreText, { color: getScoreColor(score) }]}>
                                   {score}
                              </Text>
                              <Text style={styles.scoreUnit}>điểm</Text>
                         </View>
                         <Text style={[styles.scoreLabel, { color: getScoreColor(score) }]}>
                              {getScoreLabel(score)}
                         </Text>
                         <Text style={styles.testTypeLabel}>
                              {testType === "final" ? "🎯 Bài thi cuối kỳ" : "📝 Bài practice"}
                         </Text>
                    </View>

                    {/* Performance Summary */}
                    <View style={styles.summaryContainer}>
                         <Text style={styles.summaryTitle}>Tổng quan kết quả</Text>
                         <View style={styles.summaryGrid}>
                              <View style={styles.summaryItem}>
                                   <View style={[styles.summaryIcon, { backgroundColor: "#27ae60" }]}>
                                        <FontAwesome name="check" size={16} color="#fff" />
                                   </View>
                                   <Text style={styles.summaryNumber}>{analysis.correctCount}</Text>
                                   <Text style={styles.summaryLabel}>Đúng</Text>
                              </View>
                              <View style={styles.summaryItem}>
                                   <View style={[styles.summaryIcon, { backgroundColor: "#e74c3c" }]}>
                                        <FontAwesome name="times" size={16} color="#fff" />
                                   </View>
                                   <Text style={styles.summaryNumber}>{analysis.incorrectCount}</Text>
                                   <Text style={styles.summaryLabel}>Sai</Text>
                              </View>
                              <View style={styles.summaryItem}>
                                   <View style={[styles.summaryIcon, { backgroundColor: "#3498db" }]}>
                                        <FontAwesome name="clock-o" size={16} color="#fff" />
                                   </View>
                                   <Text style={styles.summaryNumber}>{formatTime(timeSpent)}</Text>
                                   <Text style={styles.summaryLabel}>Thời gian</Text>
                              </View>
                              <View style={styles.summaryItem}>
                                   <View style={[styles.summaryIcon, { backgroundColor: "#9b59b6" }]}>
                                        <FontAwesome name="percent" size={16} color="#fff" />
                                   </View>
                                   <Text style={styles.summaryNumber}>{analysis.accuracy}%</Text>
                                   <Text style={styles.summaryLabel}>Độ chính xác</Text>
                              </View>
                         </View>
                    </View>

                    {/* Wrong Questions Review */}
                    {incorrectQuestions.length > 0 && (
                         <View style={styles.reviewContainer}>
                              <Text style={styles.reviewTitle}>
                                   📚 Câu hỏi cần xem lại ({incorrectQuestions.length})
                              </Text>
                              {incorrectQuestions.slice(0, 5).map((result) => (
                                   <TouchableOpacity
                                        key={result.question.id}
                                        style={styles.reviewItem}
                                        onPress={() => onReviewQuestion?.(result.index)}
                                        activeOpacity={0.7}
                                   >
                                        <View style={styles.reviewHeader}>
                                             <Text style={styles.reviewQuestionNumber}>
                                                  Câu {result.index + 1}
                                             </Text>
                                             <FontAwesome name="chevron-right" size={12} color="#7f8c8d" />
                                        </View>
                                        <Text style={styles.reviewQuestion} numberOfLines={2}>
                                             {result.question.question}
                                        </Text>
                                        <View style={styles.reviewAnswers}>
                                             <Text style={styles.reviewWrongAnswer}>
                                                  ❌ Bạn chọn: {result.userAnswer}
                                             </Text>
                                             <Text style={styles.reviewCorrectAnswer}>
                                                  ✅ Đáp án đúng: {result.correctAnswer}
                                             </Text>
                                        </View>
                                   </TouchableOpacity>
                              ))}
                              {incorrectQuestions.length > 5 && (
                                   <Text style={styles.moreQuestionsText}>
                                        Và {incorrectQuestions.length - 5} câu hỏi khác...
                                   </Text>
                              )}
                         </View>
                    )}

                    {/* Recommendations */}
                    <View style={styles.recommendationsContainer}>
                         <Text style={styles.recommendationsTitle}>💡 Gợi ý học tập</Text>
                         {score < 60 && (
                              <View style={styles.recommendationItem}>
                                   <FontAwesome name="refresh" size={16} color="#e74c3c" />
                                   <Text style={styles.recommendationText}>
                                        Kết quả chưa tốt. Hãy ôn lại lý thuyết và thử lại.
                                   </Text>
                              </View>
                         )}
                         {score >= 60 && score < 80 && (
                              <View style={styles.recommendationItem}>
                                   <FontAwesome name="arrow-up" size={16} color="#f39c12" />
                                   <Text style={styles.recommendationText}>
                                        Kết quả khá tốt! Ôn thêm các câu sai để cải thiện.
                                   </Text>
                              </View>
                         )}
                         {score >= 80 && (
                              <View style={styles.recommendationItem}>
                                   <FontAwesome name="star" size={16} color="#27ae60" />
                                   <Text style={styles.recommendationText}>
                                        Xuất sắc! Bạn đã nắm vững kiến thức này.
                                   </Text>
                              </View>
                         )}
                         <View style={styles.recommendationItem}>
                              <FontAwesome name="clock-o" size={16} color="#3498db" />
                              <Text style={styles.recommendationText}>
                                   Thời gian trung bình: {analysis.avgTimePerQuestion}s/câu
                              </Text>
                         </View>
                    </View>
               </ScrollView>

               {/* Action Buttons */}
               <View style={styles.actionsContainer}>
                    {onRetry && score < 80 && (
                         <TouchableOpacity
                              style={styles.retryButton}
                              onPress={onRetry}
                              activeOpacity={0.8}
                         >
                              <FontAwesome name="refresh" size={16} color="#fff" />
                              <Text style={styles.retryText}>Làm lại</Text>
                         </TouchableOpacity>
                    )}
                    <TouchableOpacity
                         style={[
                              styles.continueButton,
                              !onRetry || score >= 80 ? { flex: 1 } : {}
                         ]}
                         onPress={onContinue}
                         activeOpacity={0.8}
                    >
                         <FontAwesome name="arrow-right" size={16} color="#fff" />
                         <Text style={styles.continueText}>
                              {testType === "final" ? "Hoàn thành" : "Tiếp tục"}
                         </Text>
                    </TouchableOpacity>
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#f8f9fa",
     },
     scrollView: {
          flex: 1,
     },
     scoreContainer: {
          alignItems: "center",
          paddingVertical: 32,
          backgroundColor: "#fff",
          marginBottom: 16,
     },
     scoreCircle: {
          alignItems: "center",
          marginBottom: 12,
     },
     scoreText: {
          fontSize: 48,
          fontWeight: "bold",
     },
     scoreUnit: {
          fontSize: 16,
          color: "#7f8c8d",
          marginTop: -8,
     },
     scoreLabel: {
          fontSize: 20,
          fontWeight: "600",
          marginBottom: 8,
     },
     testTypeLabel: {
          fontSize: 14,
          color: "#7f8c8d",
     },
     summaryContainer: {
          backgroundColor: "#fff",
          marginHorizontal: 16,
          marginBottom: 16,
          borderRadius: 12,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     summaryTitle: {
          fontSize: 18,
          fontWeight: "600",
          color: "#2c3e50",
          marginBottom: 16,
     },
     summaryGrid: {
          flexDirection: "row",
          justifyContent: "space-between",
     },
     summaryItem: {
          alignItems: "center",
          flex: 1,
     },
     summaryIcon: {
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
     },
     summaryNumber: {
          fontSize: 16,
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: 4,
     },
     summaryLabel: {
          fontSize: 12,
          color: "#7f8c8d",
          textAlign: "center",
     },
     reviewContainer: {
          backgroundColor: "#fff",
          marginHorizontal: 16,
          marginBottom: 16,
          borderRadius: 12,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     reviewTitle: {
          fontSize: 18,
          fontWeight: "600",
          color: "#2c3e50",
          marginBottom: 16,
     },
     reviewItem: {
          borderBottomWidth: 1,
          borderBottomColor: "#ecf0f1",
          paddingVertical: 12,
     },
     reviewHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
     },
     reviewQuestionNumber: {
          fontSize: 14,
          fontWeight: "600",
          color: "#3498db",
     },
     reviewQuestion: {
          fontSize: 14,
          color: "#2c3e50",
          marginBottom: 8,
          lineHeight: 20,
     },
     reviewAnswers: {
          gap: 4,
     },
     reviewWrongAnswer: {
          fontSize: 12,
          color: "#e74c3c",
     },
     reviewCorrectAnswer: {
          fontSize: 12,
          color: "#27ae60",
     },
     moreQuestionsText: {
          textAlign: "center",
          fontSize: 14,
          color: "#7f8c8d",
          fontStyle: "italic",
          marginTop: 12,
     },
     recommendationsContainer: {
          backgroundColor: "#fff",
          marginHorizontal: 16,
          marginBottom: 100,
          borderRadius: 12,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     recommendationsTitle: {
          fontSize: 18,
          fontWeight: "600",
          color: "#2c3e50",
          marginBottom: 16,
     },
     recommendationItem: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
     },
     recommendationText: {
          fontSize: 14,
          color: "#2c3e50",
          marginLeft: 12,
          flex: 1,
          lineHeight: 20,
     },
     actionsContainer: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: "#ecf0f1",
          gap: 12,
     },
     retryButton: {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 14,
          backgroundColor: "#e74c3c",
          borderRadius: 8,
     },
     retryText: {
          marginLeft: 8,
          fontSize: 16,
          fontWeight: "600",
          color: "#fff",
     },
     continueButton: {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 14,
          backgroundColor: "#27ae60",
          borderRadius: 8,
     },
     continueText: {
          marginLeft: 8,
          fontSize: 16,
          fontWeight: "600",
          color: "#fff",
     },
});

export default TestResults; 