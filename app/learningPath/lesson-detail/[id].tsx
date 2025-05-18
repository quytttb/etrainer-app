import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function LessonDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { type } = params;

  // Giả sử bạn có thể lấy chi tiết bài học từ type hoặc gọi API
  // Ở đây tạm tạo dữ liệu giả
  const lessonDetails = {
    voca: {
      title: "Từ vựng",
      content: "Nội dung chi tiết về từ vựng...",
      practice: "Bài tập từ vựng bao gồm...",
    },
    intro: {
      title: "Giới thiệu",
      content: "Tìm hiểu sâu về giới từ: Tổng quan...",
      practice: null,
    },
    gramma: {
      title: "Ngữ pháp",
      content: "Chi tiết về giới từ In, On, At...",
      practice: "Có 5 bài tập liên quan...",
    },
  };

  type LessonType = keyof typeof lessonDetails;

  // Đảm bảo type là string và hợp lệ
  const typeStr = Array.isArray(type) ? type[0] : type;
  const key = typeStr?.toLowerCase() as LessonType | undefined;
  const detail =
    (key && lessonDetails[key]) || {
      title: "Không tìm thấy bài học",
      content: "",
      practice: null,
    };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{detail.title}</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.contentText}>{detail.content}</Text>
        {detail.practice && (
          <>
            <Text style={styles.practiceTitle}>Bài tập thực hành:</Text>
            <Text style={styles.practiceText}>{detail.practice}</Text>
          </>
        )}
      </View>
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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    padding: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#222",
  },
  practiceTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#22C993",
  },
  practiceText: {
    marginTop: 8,
    fontSize: 16,
    color: "#444",
  },
});
