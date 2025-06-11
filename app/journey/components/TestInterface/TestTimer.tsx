import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { formatTime } from "../../utils/timeUtils";

interface TestTimerProps {
     timeRemaining: number;
     totalTime: number;
     isPaused: boolean;
     onPause: () => void;
     testType: "practice" | "final";
     questionsAnswered: number;
     totalQuestions: number;
     onShowNavigation: () => void;
     onSubmit: () => void;
}

const TestTimer: React.FC<TestTimerProps> = ({
     timeRemaining,
     totalTime,
     isPaused,
     onPause,
     testType,
     questionsAnswered,
     totalQuestions,
     onShowNavigation,
     onSubmit,
}) => {
     const progress = (timeRemaining / totalTime) * 100;
     const isLowTime = timeRemaining <= 300; // 5 minutes warning

     return (
          <View style={styles.container}>
               {/* Timer Bar */}
               <View style={styles.timerBar}>
                    <View
                         style={[
                              styles.timerProgress,
                              { width: `${progress}%` },
                              isLowTime && styles.lowTimeProgress
                         ]}
                    />
               </View>

               {/* Timer Content */}
               <View style={styles.content}>
                    {/* Left Section - Timer */}
                    <View style={styles.timerSection}>
                         <FontAwesome
                              name={isPaused ? "play" : "pause"}
                              size={20}
                              color="#666"
                              onPress={onPause}
                         />
                         <Text style={[
                              styles.timerText,
                              isLowTime && styles.lowTimeText
                         ]}>
                              {formatTime(timeRemaining)}
                         </Text>
                    </View>

                    {/* Center Section - Progress */}
                    <TouchableOpacity
                         style={styles.progressSection}
                         onPress={onShowNavigation}
                    >
                         <Text style={styles.progressText}>
                              {questionsAnswered}/{totalQuestions} câu
                         </Text>
                         <FontAwesome name="list" size={16} color="#666" />
                    </TouchableOpacity>

                    {/* Right Section - Submit */}
                    <TouchableOpacity
                         style={styles.submitButton}
                         onPress={onSubmit}
                    >
                         <Text style={styles.submitText}>Nộp bài</Text>
                    </TouchableOpacity>
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#e0e0e0",
     },
     timerBar: {
          height: 4,
          backgroundColor: "#f0f0f0",
     },
     timerProgress: {
          height: "100%",
          backgroundColor: "#4CAF50",
     },
     lowTimeProgress: {
          backgroundColor: "#f44336",
     },
     content: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
     },
     timerSection: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
     },
     timerText: {
          fontSize: 16,
          fontWeight: "600",
          color: "#333",
     },
     lowTimeText: {
          color: "#f44336",
     },
     progressSection: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: "#f5f5f5",
          borderRadius: 16,
     },
     progressText: {
          fontSize: 14,
          color: "#666",
     },
     submitButton: {
          backgroundColor: "#4CAF50",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 8,
     },
     submitText: {
          color: "#fff",
          fontWeight: "600",
     },
});

export default TestTimer; 