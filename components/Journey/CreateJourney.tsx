import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface CreateJourneyProps {
  onJourneyCreated: () => void;
}

export const CreateJourney: React.FC<CreateJourneyProps> = ({
  onJourneyCreated,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>Trình độ hiện tại của bạn</Text>
      <Text style={styles.sectionSubtitle}>
        Chọn một mức điểm phù hợp với trình độ của bạn
      </Text>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[styles.levelCard, selectedLevel === 0 && styles.selectedCard]}
          onPress={() => setSelectedLevel(0)}
        >
          <View style={styles.levelBadge}>
            <FontAwesome5 name="seedling" size={24} color="#fff" />
          </View>
          <Text style={styles.levelRange}>{"0 -> 150"}</Text>
          <Text style={styles.levelTitle}>Mất gốc</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.levelCard,
            selectedLevel === 300 && styles.selectedCard,
          ]}
          onPress={() => setSelectedLevel(300)}
        >
          <View style={[styles.levelBadge, { backgroundColor: "#FFB347" }]}>
            <FontAwesome5 name="book" size={24} color="#fff" />
          </View>
          <Text style={styles.levelRange}>{"300 -> 450"}</Text>
          <Text style={styles.levelTitle}>Trung cấp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.levelCard,
            selectedLevel === 600 && styles.selectedCard,
          ]}
          onPress={() => setSelectedLevel(600)}
        >
          <View style={[styles.levelBadge, { backgroundColor: "#4285F4" }]}>
            <FontAwesome5 name="graduation-cap" size={24} color="#fff" />
          </View>
          <Text style={styles.levelRange}>{"600 -> 700"}</Text>
          <Text style={styles.levelTitle}>Cao cấp</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Mục tiêu của bạn</Text>
      <Text style={styles.sectionSubtitle}>
        Chọn mức điểm bạn muốn đạt được
      </Text>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[
            styles.targetCard,
            selectedTarget === 300 && styles.selectedCard,
          ]}
          onPress={() => setSelectedTarget(300)}
        >
          <View style={[styles.targetBadge, { backgroundColor: "#8BC34A" }]}>
            <Text style={styles.targetScore}>300</Text>
          </View>
          <Text style={styles.targetTitle}>Cơ bản</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.targetCard,
            selectedTarget === 650 && styles.selectedCard,
          ]}
          onPress={() => setSelectedTarget(650)}
        >
          <View style={[styles.targetBadge, { backgroundColor: "#42A5F5" }]}>
            <Text style={styles.targetScore}>650</Text>
          </View>
          <Text style={styles.targetTitle}>Khá</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.targetCard,
            selectedTarget === 900 && styles.selectedCard,
          ]}
          onPress={() => setSelectedTarget(900)}
        >
          <View style={[styles.targetBadge, { backgroundColor: "#FFA000" }]}>
            <Text style={styles.targetScore}>900</Text>
          </View>
          <Text style={styles.targetTitle}>Xuất sắc</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.buildButton,
          (selectedLevel === null || selectedTarget === null) &&
            styles.disabledButton,
        ]}
        onPress={() => {
          if (selectedLevel !== null && selectedTarget !== null) {
            console.log("Selected Level:", selectedLevel);
            console.log("Selected Target:", selectedTarget);
          }
        }}
        disabled={selectedLevel === null || selectedTarget === null}
      >
        <Text style={styles.buildButtonText}>Xây dựng lộ trình TOEIC</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 25,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  levelCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    width: "31%",
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  selectedCard: {
    borderColor: "#0099CC",
    borderWidth: 2,
    backgroundColor: "#F0F9FF",
  },
  levelBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  levelTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  levelRange: {
    fontSize: 16,
    color: "#0099CC",
    fontWeight: "bold",
    marginBottom: 5,
  },
  targetCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    width: "31%",
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  targetBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  targetScore: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  targetTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  buildButton: {
    backgroundColor: "#0099CC",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 100,
    width: "100%",
    alignItems: "center",
  },
  buildButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
});
