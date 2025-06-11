import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface DayData {
     id: string;
     dayNumber: number;
     title: string;
     lessons: number;
     completed: boolean;
     progress: number;
     unlocked: boolean;
     passed?: boolean; // ✅ ADD: Pass status based on score
     score?: number;   // ✅ ADD: Actual score for display
}

interface DayCardProps {
     dayData: DayData;
     onPress: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ dayData, onPress }) => {
     const getStatusIcon = () => {
          if (!dayData.unlocked) return "🔒";
          if (dayData.completed && dayData.passed) return "✅";
          if (dayData.completed && !dayData.passed) return "❌";
          if (dayData.progress > 0) return "📚";
          return "📖";
     };

     const getStatusColor = () => {
          if (!dayData.unlocked) return "#95a5a6";
          if (dayData.completed && dayData.passed) return "#27ae60"; // Green for passed
          if (dayData.completed && !dayData.passed) return "#e74c3c"; // Red for failed
          if (dayData.progress > 0) return "#3498db";
          return "#f39c12";
     };

     const getStatusText = () => {
          if (!dayData.unlocked) return "Chưa mở khóa";
          if (dayData.completed && dayData.passed) return "Hoàn thành";
          if (dayData.completed && !dayData.passed) return "Chưa đạt";
          if (dayData.progress > 0) return "Đang học";
          return "Sẵn sàng";
     };

     return (
          <TouchableOpacity
               style={[
                    styles.container,
                    !dayData.unlocked && styles.lockedContainer,
               ]}
               onPress={onPress}
               disabled={!dayData.unlocked}
               activeOpacity={0.8}
          >
               <View style={styles.header}>
                    <View style={styles.dayInfo}>
                         <Text style={styles.dayIcon}>{getStatusIcon()}</Text>
                         <View style={styles.dayText}>
                              <Text style={styles.dayTitle}>{dayData.title}</Text>
                              <Text style={styles.lessonCount}>{dayData.lessons} bài học</Text>
                         </View>
                    </View>

                    <View style={styles.statusSection}>
                         <Text style={[styles.statusText, { color: getStatusColor() }]}>
                              {getStatusText()}
                         </Text>
                         <Text style={styles.progressText}>{dayData.progress}%</Text>
                    </View>
               </View>

               {/* Progress Bar */}
               {dayData.unlocked && (
                    <View style={styles.progressContainer}>
                         <View style={styles.progressBar}>
                              <View
                                   style={[
                                        styles.progressFill,
                                        {
                                             width: `${dayData.progress}%`,
                                             backgroundColor: getStatusColor(),
                                        },
                                   ]}
                              />
                         </View>
                    </View>
               )}

               {/* Day Number Badge */}
               <View style={[styles.dayBadge, { backgroundColor: getStatusColor() }]}>
                    <Text style={styles.dayNumber}>{dayData.dayNumber}</Text>
               </View>
          </TouchableOpacity>
     );
};

const styles = StyleSheet.create({
     container: {
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
     lockedContainer: {
          opacity: 0.6,
     },
     header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
     },
     dayInfo: {
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
     },
     dayIcon: {
          fontSize: 24,
          marginRight: 12,
     },
     dayText: {
          flex: 1,
     },
     dayTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: "#2c3e50",
          marginBottom: 2,
     },
     lessonCount: {
          fontSize: 14,
          color: "#7f8c8d",
     },
     statusSection: {
          alignItems: "flex-end",
     },
     statusText: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 2,
     },
     progressText: {
          fontSize: 12,
          color: "#7f8c8d",
     },
     progressContainer: {
          marginTop: 4,
     },
     progressBar: {
          height: 4,
          backgroundColor: "#ecf0f1",
          borderRadius: 2,
          overflow: "hidden",
     },
     progressFill: {
          height: "100%",
          borderRadius: 2,
     },
     dayBadge: {
          position: "absolute",
          top: -8,
          right: 16,
          width: 28,
          height: 28,
          borderRadius: 14,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 4,
     },
     dayNumber: {
          color: "#fff",
          fontSize: 12,
          fontWeight: "bold",
     },
});

export default DayCard; 