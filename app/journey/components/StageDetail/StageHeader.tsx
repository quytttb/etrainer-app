import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StageHeaderProps {
     title: string;
     description: string;
     progress: number;
     minScore: number;
     targetScore: number;
     status: string;
}

const StageHeader: React.FC<StageHeaderProps> = ({
     title,
     description,
     progress,
     minScore,
     targetScore,
     status,
}) => {
     const getStatusColor = (status: string) => {
          switch (status) {
               case "COMPLETED":
                    return "#27ae60";
               case "IN_PROGRESS":
                    return "#3498db";
               case "LOCKED":
                    return "#95a5a6";
               default:
                    return "#f39c12";
          }
     };

     const getStatusText = (status: string) => {
          switch (status) {
               case "COMPLETED":
                    return "Hoàn thành";
               case "IN_PROGRESS":
                    return "Đang học";
               case "LOCKED":
                    return "Chưa mở khóa";
               default:
                    return "Có thể học";
          }
     };

     return (
          <View style={styles.container}>
               {/* Header Info */}
               <View style={styles.header}>
                    <View style={styles.titleSection}>
                         <Text style={styles.title}>{title}</Text>
                         <Text style={styles.description}>{description}</Text>
                    </View>

                    <View style={styles.statusSection}>
                         <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                              {getStatusText(status)}
                         </Text>
                    </View>
               </View>

               {/* Progress Section */}
               <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                         <Text style={styles.progressLabel}>Tiến độ giai đoạn</Text>
                         <Text style={styles.progressPercentage}>{progress}%</Text>
                    </View>

                    <View style={styles.progressBar}>
                         <View
                              style={[
                                   styles.progressFill,
                                   {
                                        width: `${progress}%`,
                                        backgroundColor: getStatusColor(status)
                                   }
                              ]}
                         />
                    </View>
               </View>

               {/* Score Range */}
               <View style={styles.scoreSection}>
                    <View style={styles.scoreRange}>
                         <View style={styles.scoreItem}>
                              <Text style={styles.scoreLabel}>Điểm đầu vào</Text>
                              <Text style={styles.scoreValue}>{minScore}</Text>
                         </View>

                         <View style={styles.scoreDivider} />

                         <View style={styles.scoreItem}>
                              <Text style={styles.scoreLabel}>Mục tiêu</Text>
                              <Text style={styles.scoreValue}>{targetScore}</Text>
                         </View>
                    </View>
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          backgroundColor: "#fff",
          marginHorizontal: 16,
          marginTop: 16,
          borderRadius: 12,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
     },
     titleSection: {
          flex: 1,
          marginRight: 12,
     },
     title: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: 6,
     },
     description: {
          fontSize: 14,
          color: "#7f8c8d",
          lineHeight: 20,
     },
     statusSection: {
          alignItems: "flex-end",
     },
     statusText: {
          fontSize: 14,
          fontWeight: "600",
     },
     progressSection: {
          marginBottom: 20,
     },
     progressHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
     },
     progressLabel: {
          fontSize: 16,
          fontWeight: "600",
          color: "#2c3e50",
     },
     progressPercentage: {
          fontSize: 16,
          fontWeight: "bold",
          color: "#3498db",
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
     scoreSection: {
          borderTopWidth: 1,
          borderTopColor: "#ecf0f1",
          paddingTop: 16,
     },
     scoreRange: {
          flexDirection: "row",
          alignItems: "center",
     },
     scoreItem: {
          flex: 1,
          alignItems: "center",
     },
     scoreLabel: {
          fontSize: 12,
          color: "#7f8c8d",
          marginBottom: 4,
     },
     scoreValue: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#2c3e50",
     },
     scoreDivider: {
          width: 1,
          height: 40,
          backgroundColor: "#ecf0f1",
          marginHorizontal: 20,
     },
});

export default StageHeader; 