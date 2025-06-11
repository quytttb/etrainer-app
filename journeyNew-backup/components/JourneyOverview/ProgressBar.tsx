import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ProgressBarProps {
     progress: number; // 0-100
     label?: string;
     color?: string;
     showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
     progress,
     label = "Tiến độ",
     color = "#3498db",
     showPercentage = true,
}) => {
     return (
          <View style={styles.container}>
               <View style={styles.header}>
                    <Text style={styles.label}>{label}</Text>
                    {showPercentage && (
                         <Text style={[styles.percentage, { color }]}>
                              {Math.round(progress)}%
                         </Text>
                    )}
               </View>

               <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                         <View
                              style={[
                                   styles.progressFill,
                                   { width: `${Math.min(progress, 100)}%`, backgroundColor: color },
                              ]}
                         />
                    </View>
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
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
     header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
     },
     label: {
          fontSize: 16,
          fontWeight: "600",
          color: "#2c3e50",
     },
     percentage: {
          fontSize: 16,
          fontWeight: "bold",
     },
     progressContainer: {
          width: "100%",
     },
     progressBar: {
          height: 10,
          backgroundColor: "#ecf0f1",
          borderRadius: 5,
          overflow: "hidden",
     },
     progressFill: {
          height: "100%",
          borderRadius: 5,
          minWidth: 2, // Ensure some visual feedback even at 0%
     },
});

export default ProgressBar; 