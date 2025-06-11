import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TestResults = () => {
     const router = useRouter();
     const params = useLocalSearchParams();
     const {
          testType,
          stageIndex,
          stageId,
          journeyId,
          score,
          passed,
          correctAnswers,
          totalQuestions,
          timeSpent,
          message,
          minScore,
          results
     } = params;

     const [loading, setLoading] = useState(false);

     // ✅ Parse all params properly
     const scoreValue = parseFloat(score as string) || 0;
     const isPassed = passed === "true";
     const correctAnswersValue = parseInt(correctAnswers as string) || 0;
     const totalQuestionsValue = parseInt(totalQuestions as string) || 0;
     const timeSpentValue = parseInt(timeSpent as string) || 0;
     const minScoreValue = parseInt(minScore as string) || 70;
     const messageText = message as string || "";
     const testResults = results ? JSON.parse(results as string) : null;

     // ✅ Format time properly
     const formatTime = (seconds: number): string => {
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          const secs = seconds % 60;

          if (hours > 0) {
               return `${hours}h ${minutes}m ${secs}s`;
          }
          return `${minutes}m ${secs}s`;
     };

     const handleBackToStage = () => {
          router.push({
               pathname: "/journeyNew/screens/StageDetails" as any,
               params: {
                    stageId: stageId as string,
                    journeyId: journeyId as string,
                    ...(isPassed && { refresh: "true" })
               }
          });
     };

     const handleBackToJourney = () => {
          router.push({
               pathname: "/journeyNew" as any,
               params: {
                    ...(isPassed && { refresh: "true" })
               }
          });
     };

     const getScoreColor = (score: number) => {
          if (score >= 80) return "#22c55e"; // Green
          if (score >= 60) return "#f59e0b"; // Orange  
          return "#ef4444"; // Red
     };

     return (
          <View style={styles.container}>
               <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                         <Ionicons
                              name={isPassed ? "checkmark-circle" : "close-circle"}
                              size={80}
                              color={isPassed ? "#22c55e" : "#ef4444"}
                         />
                         <Text style={styles.title}>
                              {isPassed ? "Chúc mừng!" : "Chưa đạt yêu cầu"}
                         </Text>
                         <Text style={styles.subtitle}>
                              {testType === "final" ? "Bài thi cuối giai đoạn" : "Bài luyện tập"}
                         </Text>
                    </View>

                    {/* Score Section */}
                    <View style={styles.scoreSection}>
                         <View style={styles.scoreContainer}>
                              <Text style={styles.scoreLabel}>Điểm số của bạn</Text>
                              <Text style={[styles.scoreValue, { color: getScoreColor(scoreValue) }]}>
                                   {scoreValue.toFixed(1)}/100
                              </Text>
                         </View>
                    </View>

                    {/* Stats Section */}
                    <View style={styles.statsSection}>
                         <Text style={styles.sectionTitle}>Chi tiết kết quả</Text>

                         <View style={styles.statRow}>
                              <Text style={styles.statLabel}>Thời gian làm bài:</Text>
                              <Text style={styles.statValue}>{formatTime(timeSpentValue)}</Text>
                         </View>

                         <View style={styles.statRow}>
                              <Text style={styles.statLabel}>Số câu đã trả lời:</Text>
                              <Text style={styles.statValue}>{correctAnswersValue}</Text>
                         </View>

                         <View style={styles.statRow}>
                              <Text style={styles.statLabel}>Tổng số câu:</Text>
                              <Text style={styles.statValue}>{totalQuestionsValue}</Text>
                         </View>

                         <View style={styles.statRow}>
                              <Text style={styles.statLabel}>Điểm tối thiểu:</Text>
                              <Text style={styles.statValue}>{minScoreValue}</Text>
                         </View>

                         <View style={styles.statRow}>
                              <Text style={styles.statLabel}>Thời gian hoàn thành:</Text>
                              <Text style={styles.statValue}>{new Date().toLocaleString()}</Text>
                         </View>
                    </View>

                    {/* Message Section */}
                    {messageText && (
                         <View style={styles.messageSection}>
                              <Text style={[
                                   styles.messageText,
                                   { color: isPassed ? "#22c55e" : "#ef4444" }
                              ]}>
                                   {messageText}
                              </Text>
                         </View>
                    )}
               </ScrollView>

               {/* Action Buttons */}
               <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackToStage}>
                         <Text style={styles.backButtonText}>Quay lại giai đoạn</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.homeButton} onPress={handleBackToJourney}>
                         <Text style={styles.homeButtonText}>Về trang chủ</Text>
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
     content: {
          flex: 1,
          paddingHorizontal: 16,
     },
     header: {
          alignItems: "center",
          paddingVertical: 40,
     },
     title: {
          fontSize: 28,
          fontWeight: "bold",
          color: "#1a1a1a",
          marginTop: 16,
          textAlign: "center",
     },
     subtitle: {
          fontSize: 16,
          color: "#666",
          marginTop: 8,
          textAlign: "center",
     },
     scoreSection: {
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     scoreContainer: {
          alignItems: "center",
     },
     scoreLabel: {
          fontSize: 16,
          color: "#666",
          marginBottom: 8,
     },
     scoreValue: {
          fontSize: 48,
          fontWeight: "bold",
     },
     statsSection: {
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     sectionTitle: {
          fontSize: 18,
          fontWeight: "600",
          color: "#1a1a1a",
          marginBottom: 16,
     },
     statRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 8,
     },
     statLabel: {
          fontSize: 16,
          color: "#666",
     },
     statValue: {
          fontSize: 16,
          fontWeight: "600",
          color: "#1a1a1a",
     },
     messageSection: {
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     messageText: {
          fontSize: 16,
          textAlign: "center",
          lineHeight: 24,
     },
     buttonContainer: {
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingVertical: 20,
          gap: 12,
     },
     backButton: {
          flex: 1,
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: "center",
          backgroundColor: "#f1f5f9",
          borderWidth: 1,
          borderColor: "#e2e8f0",
     },
     homeButton: {
          flex: 1,
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: "center",
          backgroundColor: "#007AFF",
     },
     backButtonText: {
          color: "#64748b",
          fontSize: 16,
          fontWeight: "600",
     },
     homeButtonText: {
          color: "#fff",
          fontSize: 16,
          fontWeight: "600",
     },
});

export default TestResults; 