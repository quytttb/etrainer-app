import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

interface Lesson {
     id: string;
     title: string;
     type: string;
     duration: number;
     questions: number;
     completed: boolean;
     score?: number;
     unlocked: boolean;
}

interface LessonListProps {
     stageId: string;
     onSelectLesson?: (lessonId: string, lessonTitle?: string) => void;
}

const LessonList: React.FC<LessonListProps> = ({ stageId, onSelectLesson }) => {
     // ✅ TODO: Replace with real API call to get lessons for this stage
     // For now, show empty list since we're removing mock data
     const lessons: Lesson[] = [];

     const getTypeIcon = (type: string) => {
          switch (type) {
               case "VOCABULARY":
                    return "📝";
               case "GRAMMAR":
                    return "📘";
               case "LISTENING":
                    return "🎧";
               case "READING":
                    return "📖";
               case "PRACTICE":
                    return "💪";
               default:
                    return "📚";
          }
     };

     const getTypeColor = (type: string) => {
          switch (type) {
               case "VOCABULARY":
                    return "#e74c3c";
               case "GRAMMAR":
                    return "#3498db";
               case "LISTENING":
                    return "#9b59b6";
               case "READING":
                    return "#27ae60";
               case "PRACTICE":
                    return "#f39c12";
               default:
                    return "#95a5a6";
          }
     };

     const getStatusColor = (lesson: Lesson) => {
          if (lesson.completed) return "#27ae60";
          if (!lesson.unlocked) return "#95a5a6";
          return "#3498db";
     };

     const renderLessonItem = ({ item }: { item: Lesson }) => (
          <TouchableOpacity
               style={[
                    styles.lessonCard,
                    !item.unlocked && styles.lockedCard,
               ]}
               onPress={() => onSelectLesson?.(item.id, item.title)}
               disabled={!item.unlocked}
               activeOpacity={0.8}
          >
               <View style={styles.lessonHeader}>
                    <View style={styles.lessonInfo}>
                         <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
                         <View style={styles.lessonText}>
                              <Text style={styles.lessonTitle}>{item.title}</Text>
                              <View style={styles.lessonMeta}>
                                   <Text style={[styles.typeLabel, { color: getTypeColor(item.type) }]}>
                                        {item.type}
                                   </Text>
                                   <Text style={styles.metaSeparator}>•</Text>
                                   <Text style={styles.duration}>{item.duration} phút</Text>
                                   <Text style={styles.metaSeparator}>•</Text>
                                   <Text style={styles.questions}>{item.questions} câu hỏi</Text>
                              </View>
                         </View>
                    </View>

                    <View style={styles.statusSection}>
                         {item.completed && item.score && (
                              <View style={styles.scoreContainer}>
                                   <Text style={styles.scoreText}>{item.score}%</Text>
                              </View>
                         )}
                         <View style={[styles.statusDot, { backgroundColor: getStatusColor(item) }]} />
                    </View>
               </View>

               {item.completed && (
                    <View style={styles.completedBanner}>
                         <Text style={styles.completedText}>✅ Hoàn thành</Text>
                    </View>
               )}

               {!item.unlocked && (
                    <View style={styles.lockedOverlay}>
                         <Text style={styles.lockedText}>🔒 Chưa mở khóa</Text>
                    </View>
               )}
          </TouchableOpacity>
     );

     return (
          <View style={styles.container}>
               <Text style={styles.sectionTitle}>Danh Sách Bài Học</Text>
               <FlatList
                    data={lessons}
                    renderItem={renderLessonItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
               />
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          marginTop: 20,
     },
     sectionTitle: {
          fontSize: 20,
          fontWeight: "bold",
          color: "#2c3e50",
          marginHorizontal: 16,
          marginBottom: 16,
     },
     lessonCard: {
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
     lessonHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
     },
     lessonInfo: {
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
     },
     typeIcon: {
          fontSize: 24,
          marginRight: 12,
     },
     lessonText: {
          flex: 1,
     },
     lessonTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: "#2c3e50",
          marginBottom: 6,
     },
     lessonMeta: {
          flexDirection: "row",
          alignItems: "center",
     },
     typeLabel: {
          fontSize: 12,
          fontWeight: "600",
          textTransform: "uppercase",
     },
     metaSeparator: {
          fontSize: 12,
          color: "#bdc3c7",
          marginHorizontal: 6,
     },
     duration: {
          fontSize: 12,
          color: "#7f8c8d",
     },
     questions: {
          fontSize: 12,
          color: "#7f8c8d",
     },
     statusSection: {
          alignItems: "flex-end",
     },
     scoreContainer: {
          backgroundColor: "#27ae60",
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 10,
          marginBottom: 6,
     },
     scoreText: {
          color: "#fff",
          fontSize: 12,
          fontWeight: "bold",
     },
     statusDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
     },
     completedBanner: {
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "rgba(39, 174, 96, 0.1)",
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 6,
     },
     completedText: {
          fontSize: 10,
          color: "#27ae60",
          fontWeight: "600",
     },
     lockedOverlay: {
          position: "absolute",
          bottom: 8,
          right: 8,
          backgroundColor: "rgba(149, 165, 166, 0.1)",
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 6,
     },
     lockedText: {
          fontSize: 10,
          color: "#95a5a6",
          fontWeight: "600",
     },
});

export default LessonList;
