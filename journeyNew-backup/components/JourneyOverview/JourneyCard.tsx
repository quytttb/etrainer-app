import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface JourneyCardProps {
     title: string;
     description?: string;
     progress: number;
     currentStage: number;
     totalStages: number;
     status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
     // ✅ ADDED: Fields for Journey cũ compatibility
     completedDays?: number;
     totalDays?: number;
     onPress: () => void;
}

const JourneyCard: React.FC<JourneyCardProps> = ({
     title,
     description,
     progress,
     currentStage,
     totalStages,
     status,
     completedDays = 0,
     totalDays = 0,
     onPress,
}) => {
     const getStatusColor = () => {
          switch (status) {
               case "COMPLETED":
                    return "#27ae60";
               case "IN_PROGRESS":
                    return "#3498db";
               case "SKIPPED":
                    return "#e67e22";
               case "NOT_STARTED":
               default:
                    return "#95a5a6";
          }
     };

     const getStatusText = () => {
          switch (status) {
               case "COMPLETED":
                    return "Hoàn thành";
               case "IN_PROGRESS":
                    return "Đang học";
               case "SKIPPED":
                    return "Đã bỏ qua";
               case "NOT_STARTED":
               default:
                    return "Chưa bắt đầu";
          }
     };

     return (
          <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
               <View style={styles.cardHeader}>
                    <View style={styles.titleContainer}>
                         <Text style={styles.cardTitle}>{title}</Text>
                         {description && (
                              <Text style={styles.cardDescription}>{description}</Text>
                         )}
                    </View>
                    <View style={styles.progressContainer}>
                         <Text style={styles.cardProgress}>{progress}%</Text>
                         {status && (
                              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                                   {getStatusText()}
                              </Text>
                         )}
                    </View>
               </View>

               <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                         <View
                              style={[
                                   styles.progressFill,
                                   {
                                        width: `${progress}%`,
                                        backgroundColor: getStatusColor()
                                   }
                              ]}
                         />
                    </View>
               </View>

               {/* ✅ FIXED: Show days progress like Journey cũ when completed */}
               {status === "COMPLETED" && totalDays > 0 ? (
                    <View style={styles.completedFooter}>
                         <View style={styles.statsContainer}>
                              <View style={styles.statItem}>
                                   <Text style={styles.statValue}>{completedDays}/{totalDays}</Text>
                                   <Text style={styles.statLabel}>Số ngày đã hoàn thành</Text>
                              </View>
                              <View style={styles.statItem}>
                                   <Text style={styles.statValue}>{totalStages}/{totalStages}</Text>
                                   <Text style={styles.statLabel}>Giai đoạn hiện tại</Text>
                              </View>
                         </View>
                    </View>
               ) : (
                    <View style={styles.cardFooter}>
                         <Text style={styles.stageText}>
                              Giai đoạn {currentStage}/{totalStages}
                         </Text>
                         <Text style={[styles.continueText, { color: getStatusColor() }]}>
                              {status === "COMPLETED" ? "Xem chi tiết →" : "Tiếp tục học →"}
                         </Text>
                    </View>
               )}
          </TouchableOpacity>
     );
};

const styles = StyleSheet.create({
     card: {
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
     cardHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
     },
     titleContainer: {
          flex: 1,
          marginRight: 12,
     },
     cardTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: 4,
     },
     cardDescription: {
          fontSize: 14,
          color: "#7f8c8d",
          lineHeight: 20,
     },
     progressContainer: {
          alignItems: "flex-end",
     },
     cardProgress: {
          fontSize: 16,
          fontWeight: "600",
          color: "#3498db",
          marginBottom: 2,
     },
     statusText: {
          fontSize: 12,
          fontWeight: "500",
     },
     progressBarContainer: {
          marginBottom: 16,
     },
     progressBar: {
          height: 8,
          backgroundColor: "#ecf0f1",
          borderRadius: 4,
          overflow: "hidden",
     },
     progressFill: {
          height: "100%",
          borderRadius: 4,
     },
     cardFooter: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
     },
     stageText: {
          fontSize: 14,
          color: "#7f8c8d",
     },
     continueText: {
          fontSize: 14,
          fontWeight: "600",
     },
     // ✅ ADDED: Styles for completed journey display
     completedFooter: {
          marginTop: 4,
     },
     statsContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 8,
     },
     statItem: {
          alignItems: "center",
          flex: 1,
     },
     statValue: {
          fontSize: 16,
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: 2,
     },
     statLabel: {
          fontSize: 12,
          color: "#7f8c8d",
          textAlign: "center",
     },
});

export default JourneyCard; 