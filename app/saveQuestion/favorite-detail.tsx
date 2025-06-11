import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getQuestionByIdService, IQuestionDetail } from "./service";

export default function FavoriteDetailScreen() {
  const router = useRouter();
  const { questionId } = useLocalSearchParams<{ questionId?: string }>();
  const [questionDetail, setQuestionDetail] = useState<IQuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!questionId) return;
      try {
        const res = await getQuestionByIdService(questionId);
        // Giả sử API trả về dữ liệu ở res.data
        setQuestionDetail(res.data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết câu hỏi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [questionId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#0099CC" />
      </View>
    );
  }

  if (!questionDetail) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20, color: "red" }}>
          Không tìm thấy câu hỏi.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết câu hỏi</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Nội dung chi tiết câu hỏi */}
      <View style={styles.content}>
        <Text style={styles.questionText}>{questionDetail.question}</Text>
        <Text style={styles.answerTitle}>Đáp án:</Text>
        <Text style={styles.answerText}>{questionDetail.answer}</Text>

        {/* Bạn có thể bổ sung thêm chi tiết khác nếu API trả về */}
        {/* Ví dụ: giải thích, ví dụ, phần loại câu hỏi,... */}
        {questionDetail.explanation && (
          <>
            <Text style={styles.explanationTitle}>Giải thích:</Text>
            <Text style={styles.explanationText}>{questionDetail.explanation}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0099CC",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  backText: { color: "#FFFFFF", fontSize: 16 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: { padding: 20 },
  questionText: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  answerTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  answerText: { fontSize: 16, marginBottom: 20 },
  explanationTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  explanationText: { fontSize: 15, fontStyle: "italic" },
});
