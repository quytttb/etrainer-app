import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const lessons = [
  {
    type: "Voca",
    title: "Từ vựng",
    target: "100%",
    practice: null,
  },
  {
    type: "Intro",
    title: "Tìm hiểu sâu về Giới từ: Tổng quan",
    target: "100%",
    practice: null,
  },
  {
    type: "Gramma",
    title: "Giới từ In, On, At",
    target: "100%",
    practice: 5,
  },
  {
    type: "Gramma",
    title: "Một số giới từ khác",
    target: "100%",
    practice: 5,
  },
  {
    type: "Gramma",
    title: "Bài tập",
    target: "100%",
    practice: 15,
  },
  {
    type: "Intro",
    title: "Kiến thức cần nhớ",
    target: "100%",
    practice: null,
  },
];

export default function DayDetailScreen() {
  const router = useRouter();
  const { dayNumber } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Day {dayNumber || 1}</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressRow}>
        <View style={styles.progressDotActive} />
        <View style={styles.progressLine} />
        <View style={styles.progressDot} />
        <View style={styles.progressLine} />
        <View style={styles.progressDot} />
      </View>

      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.desc}>
          Danh sách các bài học chi tiết cần hoàn thành trong Day {dayNumber || 1}, hãy so sánh điểm của bạn và điểm mục tiêu để biết bạn có đạt hay không nhé
        </Text>

        {lessons.map((lesson, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.lessonBox}
            onPress={() =>
              router.push({
                pathname: `/learningPath/lesson-detail/${idx}`,
                params: {
                  dayNumber: dayNumber || 1,
                  lessonTitle: lesson.title,
                  lessonType: lesson.type,
                  lessonTarget: lesson.target,
                  lessonPractice: lesson.practice,
                },
              })
            }
          >
            <View style={styles.lessonHeader}>
              <Text style={[styles.lessonType, { color: "#22C993" }]}>{lesson.type}</Text>
              <Text style={styles.lessonTarget}>Mục tiêu {lesson.target}</Text>
            </View>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            {lesson.practice !== null && (
              <Text style={styles.practiceText}>
                Bài tập thực hành: <Text style={{ color: "#FF4D4F" }}>{lesson.practice}</Text>
              </Text>
            )}
            <Ionicons name="chevron-forward" size={22} color="#22C993" style={styles.arrowRight} />
          </TouchableOpacity>
        ))}

        {/* Status */}
        <View style={styles.statusBox}>
          <View style={styles.statusRow}>
            <Ionicons name="checkmark-circle" size={20} color="#22C993" />
            <Text style={styles.statusText}>Bạn đã học bài này rồi</Text>
          </View>
          <View style={styles.statusRow}>
            <View style={styles.percentBox}>
              <Text style={styles.percentText}>80%</Text>
            </View>
            <Text style={styles.statusText}>Bạn đã học và thực hành với điểm số 80%</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22C993",
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  progressDotActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#22C993",
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
  },
  progressLine: {
    width: 40,
    height: 3,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 2,
  },
  desc: {
    fontSize: 15,
    color: "#222",
    marginHorizontal: 16,
    marginBottom: 16,
    textAlign: "left",
  },
  lessonBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  lessonType: {
    fontWeight: "bold",
    marginRight: 12,
    fontSize: 15,
  },
  lessonTarget: {
    color: "#22C993",
    fontSize: 13,
    fontWeight: "500",
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  practiceText: {
    fontSize: 14,
    color: "#222",
    marginBottom: 2,
  },
  arrowRight: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -12,
  },
  statusBox: {
    backgroundColor: "#E6FFF6",
    borderRadius: 10,
    margin: 16,
    padding: 16,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusText: {
    fontSize: 15,
    color: "#22C993",
    marginLeft: 8,
  },
  percentBox: {
    backgroundColor: "#E6FFF6",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#22C993",
    marginRight: 8,
  },
  percentText: {
    color: "#22C993",
    fontWeight: "bold",
    fontSize: 15,
  },
});
