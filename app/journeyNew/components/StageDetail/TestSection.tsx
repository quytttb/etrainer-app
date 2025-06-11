import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface Test {
     id: string;
     title: string;
     questions: number;
     duration: number;
     completed: boolean;
     score?: number | null;
     unlocked: boolean;
}

interface FinalExam {
     id: string;
     title: string;
     questions: number;
     duration: number;
     minScore: number;
     unlocked: boolean;
     completed: boolean;
     score?: number | null;
}

interface TestSectionProps {
     tests: Test[];
     finalExam: FinalExam;
     onSelectTest?: (testId: string, testType?: string) => void;
     onStartFinalExam?: () => void;
}

const TestSection: React.FC<TestSectionProps> = ({
     tests,
     finalExam,
     onSelectTest,
     onStartFinalExam,
}) => {
     const getTestStatusColor = (test: Test) => {
          if (test.completed) return "#27ae60";
          if (!test.unlocked) return "#95a5a6";
          return "#3498db";
     };

     const getTestStatusText = (test: Test) => {
          if (test.completed) return "Hoàn thành";
          if (!test.unlocked) return "Chưa mở khóa";
          return "Sẵn sàng";
     };

     const getFinalExamStatusColor = () => {
          if (!finalExam) return "#95a5a6";
          if (finalExam.completed) return "#27ae60";
          if (!finalExam.unlocked) return "#95a5a6";
          return "#e74c3c";
     };

     const getFinalExamStatusText = () => {
          if (!finalExam) return "Đang tải...";
          if (finalExam.completed) return "Đã hoàn thành";
          if (!finalExam.unlocked) return "Chưa mở khóa";
          return "Sẵn sàng thi";
     };

     const renderTestCard = (test: Test) => (
          <TouchableOpacity
               key={test.id}
               style={[
                    styles.testCard,
                    !test.unlocked && styles.lockedCard,
               ]}
               onPress={() => onSelectTest?.(test.id, "practice")}
               disabled={!test.unlocked}
               activeOpacity={0.8}
          >
               <View style={styles.testHeader}>
                    <View style={styles.testIcon}>
                         <Text style={styles.iconText}>📝</Text>
                    </View>

                    <View style={styles.testInfo}>
                         <Text style={styles.testTitle}>{test.title}</Text>
                         <View style={styles.testMeta}>
                              <Text style={styles.metaText}>{test.questions} câu hỏi</Text>
                              <Text style={styles.metaSeparator}>•</Text>
                              <Text style={styles.metaText}>{test.duration} phút</Text>
                         </View>
                    </View>

                    <View style={styles.testStatus}>
                         {test.completed && test.score !== null && (
                              <View style={[styles.scoreTag, { backgroundColor: getTestStatusColor(test) }]}>
                                   <Text style={styles.scoreTagText}>{test.score}%</Text>
                              </View>
                         )}
                         <Text style={[styles.statusText, { color: getTestStatusColor(test) }]}>
                              {getTestStatusText(test)}
                         </Text>
                    </View>
               </View>

               {test.completed && (
                    <View style={styles.completedIndicator}>
                         <Text style={styles.completedText}>✅</Text>
                    </View>
               )}
          </TouchableOpacity>
     );

     return (
          <View style={styles.container}>
               {/* Final Exam Section - Only show final exam, remove practice tests */}
               <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thi Cuối Giai Đoạn</Text>

                    {finalExam ? (
                         <TouchableOpacity
                              style={[
                                   styles.finalExamCard,
                                   !finalExam.unlocked && styles.lockedCard,
                              ]}
                              onPress={onStartFinalExam}
                              disabled={!finalExam.unlocked}
                              activeOpacity={0.8}
                         >
                              <View style={styles.finalExamHeader}>
                                   <View style={styles.examIcon}>
                                        <Text style={styles.examIconText}>🎓</Text>
                                   </View>

                                   <View style={styles.examInfo}>
                                        <Text style={styles.examTitle}>{finalExam.title}</Text>
                                        <View style={styles.examMeta}>
                                             <Text style={styles.metaText}>Điểm tối thiểu: {finalExam.minScore}%</Text>
                                        </View>
                                   </View>
                              </View>

                              <View style={styles.examStatusSection}>
                                   {finalExam.completed && finalExam.score != null && finalExam.score !== undefined && (
                                        <View style={styles.finalScoreContainer}>
                                             <Text style={styles.finalScoreLabel}>Điểm:</Text>
                                             <Text style={[
                                                  styles.finalScoreText,
                                                  { color: finalExam.score >= finalExam.minScore ? "#27ae60" : "#e74c3c" }
                                             ]}>
                                                  {finalExam.score}%
                                             </Text>
                                        </View>
                                   )}

                                   <View style={[
                                        styles.examStatusTag,
                                        { backgroundColor: getFinalExamStatusColor() }
                                   ]}>
                                        <Text style={styles.examStatusText}>
                                             {getFinalExamStatusText()}
                                        </Text>
                                   </View>
                              </View>

                              {finalExam.completed && (
                                   <View style={styles.examCompletedBanner}>
                                        <Text style={styles.examCompletedText}>
                                             {finalExam.score != null && finalExam.score !== undefined && finalExam.score >= finalExam.minScore
                                                  ? "🎉 Đã đạt yêu cầu"
                                                  : "⚠️ Cần thi lại"}
                                        </Text>
                                   </View>
                              )}

                              {!finalExam.unlocked && (
                                   <View style={styles.lockedBanner}>
                                        <Text style={styles.lockedBannerText}>
                                             🔒 Hoàn thành tất cả bài học để mở khóa
                                        </Text>
                                   </View>
                              )}
                         </TouchableOpacity>
                    ) : (
                         <Text style={styles.sectionTitle}>Đang tải thông tin thi cuối...</Text>
                    )}
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          marginTop: 20,
          marginBottom: 20,
     },
     section: {
          marginBottom: 24,
     },
     sectionTitle: {
          fontSize: 20,
          fontWeight: "bold",
          color: "#2c3e50",
          marginHorizontal: 16,
          marginBottom: 16,
     },
     testCard: {
          backgroundColor: "#fff",
          marginHorizontal: 16,
          marginBottom: 12,
          borderRadius: 12,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          position: "relative",
     },
     lockedCard: {
          opacity: 0.6,
     },
     testHeader: {
          flexDirection: "row",
          alignItems: "center",
     },
     testIcon: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#ecf0f1",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
     },
     iconText: {
          fontSize: 20,
     },
     testInfo: {
          flex: 1,
     },
     testTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: "#2c3e50",
          marginBottom: 4,
     },
     testMeta: {
          flexDirection: "row",
          alignItems: "center",
     },
     metaText: {
          fontSize: 12,
          color: "#7f8c8d",
     },
     metaSeparator: {
          fontSize: 12,
          color: "#bdc3c7",
          marginHorizontal: 6,
     },
     testStatus: {
          alignItems: "flex-end",
     },
     scoreTag: {
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 10,
          marginBottom: 4,
     },
     scoreTagText: {
          color: "#fff",
          fontSize: 12,
          fontWeight: "bold",
     },
     statusText: {
          fontSize: 12,
          fontWeight: "600",
     },
     completedIndicator: {
          position: "absolute",
          top: 8,
          right: 8,
     },
     completedText: {
          fontSize: 16,
     },
     finalExamCard: {
          backgroundColor: "#fff",
          marginHorizontal: 16,
          borderRadius: 12,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderLeftWidth: 4,
          borderLeftColor: "#e74c3c",
          position: "relative",
     },
     finalExamHeader: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
     },
     examIcon: {
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#fff2e6",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
     },
     examIconText: {
          fontSize: 24,
     },
     examInfo: {
          flex: 1,
     },
     examTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: 6,
     },
     examMeta: {
          flexDirection: "row",
          alignItems: "center",
     },
     examStatusSection: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
     },
     finalScoreContainer: {
          flexDirection: "row",
          alignItems: "center",
     },
     finalScoreLabel: {
          fontSize: 14,
          color: "#7f8c8d",
          marginRight: 8,
     },
     finalScoreText: {
          fontSize: 18,
          fontWeight: "bold",
     },
     examStatusTag: {
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 12,
     },
     examStatusText: {
          color: "#fff",
          fontSize: 12,
          fontWeight: "bold",
          textTransform: "uppercase",
     },
     examCompletedBanner: {
          position: "absolute",
          top: 12,
          right: 12,
          backgroundColor: "rgba(39, 174, 96, 0.1)",
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 8,
     },
     examCompletedText: {
          fontSize: 12,
          color: "#27ae60",
          fontWeight: "600",
     },
     lockedBanner: {
          marginTop: 12,
          backgroundColor: "#f8f9fa",
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e9ecef",
     },
     lockedBannerText: {
          fontSize: 12,
          color: "#6c757d",
          textAlign: "center",
          fontStyle: "italic",
     },
});

export default TestSection; 