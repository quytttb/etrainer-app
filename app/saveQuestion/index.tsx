import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFavoriteQuestionsService, IFavoriteQuestion } from "../(tabs)/service";

export default function SaveQuestionScreen() {
  const router = useRouter();
  const [savedQuestions, setSavedQuestions] = useState<IFavoriteQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedQuestions = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          setSavedQuestions([]);
          setLoading(false);
          return;
        }
        const data = await getFavoriteQuestionsService(userId);
        setSavedQuestions(data);
      } catch (error) {
        console.error("Lỗi lấy câu hỏi yêu thích:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedQuestions();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#0099CC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Câu hỏi đã lưu</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* List câu hỏi */}
      <ScrollView style={styles.questionList}>
        {savedQuestions.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Bạn chưa lưu câu hỏi nào.</Text>
        ) : (
          savedQuestions.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.questionCard}
              onPress={() =>
                router.push(`/saveQuestion/favorite-detail?questionId=${item.questionId}`)
              }
            >
              <View style={styles.questionContent}>
                <Text style={styles.questionText}>{item.question}</Text>
                <Text style={styles.answerText}>Đáp án: {item.answer}</Text>
              </View>
              <View style={styles.questionFooter}>
                <View style={styles.categoryButton}>
                  <Image
                    source={require("../../assets/images/image_icon.png")}
                    style={styles.categoryIcon}
                  />
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.favoriteIcon}>❤️</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
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
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    flex: 1,
  },
  questionList: { marginTop: 20, paddingHorizontal: 20 },
  questionCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  questionContent: { marginBottom: 10 },
  questionText: { fontSize: 16, fontWeight: "bold", color: "#333333" },
  answerText: { fontSize: 14, color: "#666666", marginTop: 5 },
  questionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryButton: { flexDirection: "row", alignItems: "center" },
  categoryIcon: { width: 20, height: 20, marginRight: 5 },
  categoryText: { fontSize: 14, color: "#00C4CC" },
  favoriteIcon: { fontSize: 18, color: "#FF6666" },
});
