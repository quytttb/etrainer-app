import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Header from "../../../components/Header";
import { useQuery } from "@tanstack/react-query";
import { getVocabularyByIdService } from "../service";
import PlaySoundButton from "./PlaySoundButton";

export default function VocabularyDetailScreen() {
  const { id } = useLocalSearchParams();

  const { data } = useQuery({
    queryKey: ["VOCABULARY", id],
    queryFn: () => getVocabularyByIdService(id as string),
    enabled: !!id,
  });

  return (
    <View style={styles.container}>
      <Header title={`Từ vựng ${data?.topicName ?? "-"}`} />

      <ScrollView style={styles.content}>
        {/* Nội dung từ vựng */}
        {data?.words ? (
          <View style={styles.vocabularyList}>
            {data.words.map((item, index) => (
              <View key={index} style={styles.wordItemContainer}>
                {/* Biểu tượng loa bên trái */}
                <PlaySoundButton audioUrl={item.audio.url} />

                {/* Từ vựng */}
                <Text style={styles.vocabularyItem}>{item.word}</Text>

                {/* Phát âm dưới từ vựng */}
                <Text style={styles.pronunciation}>/{item.pronunciation}/</Text>

                {/* Biểu tượng sao ở góc trên bên phải */}
                {/* <AntDesign
                  name="staro"
                  size={20}
                  color="#FFD700"
                  style={styles.iconRight}
                /> */}

                {/* Nghĩa của từ */}
                <Text style={styles.meaning}>{item.meaning}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>Không có dữ liệu bài học này.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  vocabularyList: {
    marginTop: 20,
    padding: 20,
  },
  wordItemContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
    position: "relative",
  },
  vocabularyItem: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
  pronunciation: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  iconRight: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  meaning: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 5,
  },
  noDataText: {
    fontSize: 18,
    color: "#f00",
    textAlign: "center",
    marginVertical: 100,
  },
  checkButton: {
    backgroundColor: "#00BFAE",
    paddingVertical: 15,
    marginHorizontal: 50,
    borderRadius: 30,
    marginTop: 5,
    marginBottom: 100,
    alignItems: "center",
  },
  checkButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 20,
  },
  box: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: "#00BFAE",
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
  },
  boxText: {
    fontSize: 14,
    color: "#00BFAE",
    fontWeight: "bold",
    width: "150%",
    textAlign: "center",
  },
});
