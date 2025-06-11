import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { JourneyNewStage } from "../../types";

interface StageListProps {
     stages: JourneyNewStage[];
     onSelectStage?: (stageId: string) => void;
}

const StageList: React.FC<StageListProps> = ({ stages, onSelectStage }) => {

     const getStatusColor = (status: string) => {
          switch (status) {
               case "COMPLETED":
                    return "#27ae60";
               case "IN_PROGRESS":
                    return "#3498db";
               case "UNLOCKED":
                    return "#f39c12";
               case "LOCKED":
               default:
                    return "#95a5a6";
          }
     };

     const getStatusText = (status: string) => {
          switch (status) {
               case "COMPLETED":
                    return "Hoàn thành";
               case "IN_PROGRESS":
                    return "Đang học";
               case "UNLOCKED":
                    return "Có thể học";
               case "LOCKED":
               default:
                    return "Chưa mở khóa";
          }
     };

     const renderStageItem = ({ item }: { item: JourneyNewStage }) => {
          const lessonsCount = item.lessons?.length || 0;
          const testsCount = item.tests?.length || 0;
          const hasFinalExam = item.finalExam ? 1 : 0;

          // ✅ SAFETY CHECK: Ensure required properties exist
          const safeItem = {
               ...item,
               title: item.title || 'Stage',
               status: item.status || 'LOCKED',
               progress: item.progress || 0,
               description: item.description || '',
               minScore: item.minScore || 0,
               targetScore: item.targetScore || 0,
          };

          return (
               <TouchableOpacity
                    style={styles.stageCard}
                    onPress={() => onSelectStage?.(safeItem.id)}
                    disabled={safeItem.status === "LOCKED"}
                    activeOpacity={0.8}
               >
                    <View style={styles.stageHeader}>
                         <Text style={styles.stageTitle}>{safeItem.title}</Text>
                         <Text style={[styles.statusText, { color: getStatusColor(safeItem.status) }]}>
                              {getStatusText(safeItem.status)}
                         </Text>
                    </View>

                    {safeItem.description ? (
                         <Text style={styles.stageDescription}>{safeItem.description}</Text>
                    ) : null}

                    <View style={styles.progressContainer}>
                         <View style={styles.progressBar}>
                              <View
                                   style={[
                                        styles.progressFill,
                                        {
                                             width: `${safeItem.progress}%`,
                                             backgroundColor: getStatusColor(safeItem.status)
                                        },
                                   ]}
                              />
                         </View>
                         <Text style={styles.progressText}>{safeItem.progress}%</Text>
                    </View>

                    <View style={styles.stageFooter}>
                         <Text style={styles.lessonText}>
                              {lessonsCount} bài học
                         </Text>
                         <Text style={styles.testText}>
                              {testsCount + hasFinalExam} bài test
                         </Text>
                    </View>

                    {safeItem.minScore > 0 && safeItem.targetScore > 0 && (
                         <View style={styles.scoreContainer}>
                              <Text style={styles.scoreText}>
                                   Điểm tối thiểu: {safeItem.minScore} • Mục tiêu: {safeItem.targetScore}
                              </Text>
                         </View>
                    )}
               </TouchableOpacity>
          );
     };

     return (
          <View style={styles.container}>
               <Text style={styles.sectionTitle}>Các Giai Đoạn</Text>
               <FlatList
                    data={stages || []}
                    renderItem={renderStageItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
               />
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          marginHorizontal: 16,
          marginBottom: 40,
     },
     sectionTitle: {
          fontSize: 20,
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: 16,
          marginLeft: 4,
     },
     stageCard: {
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     stageHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
     },
     stageTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: "#2c3e50",
          flex: 1,
          marginRight: 8,
     },
     stageDescription: {
          fontSize: 14,
          color: "#7f8c8d",
          marginBottom: 12,
          lineHeight: 20,
     },
     statusText: {
          fontSize: 14,
          fontWeight: "600",
     },
     progressContainer: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
     },
     progressBar: {
          flex: 1,
          height: 6,
          backgroundColor: "#ecf0f1",
          borderRadius: 3,
          marginRight: 8,
          overflow: "hidden",
     },
     progressFill: {
          height: "100%",
          borderRadius: 3,
     },
     progressText: {
          fontSize: 12,
          color: "#7f8c8d",
          minWidth: 30,
     },
     stageFooter: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
     },
     lessonText: {
          fontSize: 14,
          color: "#7f8c8d",
     },
     testText: {
          fontSize: 14,
          color: "#7f8c8d",
     },
     scoreContainer: {
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "#ecf0f1",
          marginTop: 4,
     },
     scoreText: {
          fontSize: 12,
          color: "#95a5a6",
          textAlign: "center",
     },
});

export default StageList; 