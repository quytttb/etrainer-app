import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import useProfile from "@/hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { getNotificationService } from "./service";
import { HOME_CONFIG } from "./const";
import { LESSON_TYPE } from "@/constants/lesson-types";

export default function HomeScreen() {
  const { profile } = useProfile();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("practice");

  const { data } = useQuery({
    queryKey: ["NOTIFICATION"],
    queryFn: getNotificationService,
  });

  console.log("Notification count", data?.length);

  function handleTabChange(tab: string) {
    setActiveTab(tab);
  }

  const handlePress = (lessonType: LESSON_TYPE) => {
    switch (lessonType) {
      case LESSON_TYPE.IMAGE_DESCRIPTION: {
        router.push("/vocabulary");
        break;
      }

      case LESSON_TYPE.VOCABULARY: {
        router.push("/vocabulary");
        break;
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>ETRAINER</Text>
          <Text style={styles.headerSubtitle}>Hello! {profile?.name}</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationIcon}>
            <Text style={styles.notificationText}>🔔</Text>
          </TouchableOpacity>
          <Image
            source={
              profile?.avatarUrl
                ? { uri: profile?.avatarUrl }
                : require("../../assets/images/default_avatar.png")
            }
            style={styles.avatar}
          />
        </View>
      </View>

      <View style={styles.greenBox}>
        <Text style={styles.studyTime}>Let's study with Etrainer!</Text>
        <Text style={styles.studyTime}>45 minutes</Text>
        <Image
          source={require("../../assets/images/diary.png")}
          style={styles.boxImage}
        />
      </View>

      {/* Luyện nghe Section */}
      {HOME_CONFIG.map((section, index) => (
        <View key={index}>
          <View style={styles.lessonSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          <View style={styles.lessonList}>
            {section.data.map((lesson, idx) => (
              <TouchableOpacity
                style={styles.lessonCard}
                key={idx}
                onPress={() => handlePress(lesson.type)}
              >
                <Image source={lesson.icon} style={styles.lessonIcon} />
                <Text style={styles.lessonText}>
                  {lesson?.partNumber
                    ? `Part ${lesson.partNumber}`
                    : lesson.partName}
                </Text>

                {lesson.partNumber && (
                  <Text style={styles.lessonText2}>{lesson.partName}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Lịch sử Section */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Lịch sử</Text>

        {/* Tab buttons for switching between "Luyện tập" and "Thi" */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setActiveTab("practice")}>
            <Text style={styles.tabText}>Luyện tập</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("exam")}>
            <Text style={styles.tabText}>Thi</Text>
          </TouchableOpacity>
        </View>

        {/* Content for each tab */}
        {activeTab === "practice" && (
          <View style={styles.historyCard}>
            <View style={styles.historyColumn}>
              <Text style={styles.historySubTitle}>Luyện tập</Text>
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Test 1</Text>
                <Text style={styles.historyProgress}>0/990</Text>
              </View>
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Test 2</Text>
                <Text style={styles.historyProgress}>0/990</Text>
              </View>
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Test 3</Text>
                <Text style={styles.historyProgress}>100/990</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "exam" && (
          <View style={styles.historyCard}>
            <View style={styles.historyColumn}>
              <Text style={styles.historySubTitle}>Thi</Text>
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Test 1</Text>
                <Text style={styles.historyProgress}>20/990</Text>
              </View>
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Test 2</Text>
                <Text style={styles.historyProgress}>40/990</Text>
              </View>
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Test 3</Text>
                <Text style={styles.historyProgress}>10/990</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 15,
  },
  headerLeft: {
    flexDirection: "column",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  greenBox: {
    backgroundColor: "#E8F5E9",
    marginTop: 10,
    padding: 50,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  boxImage: {
    width: 200,
    height: 200,
    position: "absolute",
    marginLeft: 200,
    marginTop: -25,
  },
  notificationIcon: {
    marginLeft: 10,
    padding: 10,
  },
  notificationText: {
    fontSize: 20,
    color: "#333",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  headerSubtitle: {
    marginTop: 10,
    fontSize: 38,
    color: "#009999",
    fontWeight: "bold",
    marginBottom: 5,
  },
  lessonSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 70,
  },
  studyTime: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  lessonList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 15,
  },
  lessonCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "20%",
    marginBottom: 15,
    marginRight: 17,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
  },
  lessonIcon: {
    width: 40,
    height: 40,
    zIndex: 1,
  },
  lessonText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    position: "absolute",
    width: "150%",
    top: 80,
    left: "150%",
    transform: [{ translateX: -50 }],
    color: "#000000",
  },
  lessonText2: {
    marginTop: 5,
    fontSize: 14,
    position: "absolute",
    width: "150%",
    top: 100,
    left: "150%",
    transform: [{ translateX: -50 }],
    color: "#000000",
  },
  historySection: {
    marginTop: 60,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  tabButton: {
    padding: 10,
    width: "50%",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#ccc",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: "#4CAF50",
  },
  tabText: {
    fontSize: 16,
    color: "#333",
  },
  historyCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  historyColumn: {
    width: "100%",
  },
  historySubTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  historyItem: {
    marginBottom: 10,
  },
  historyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  historyProgress: {
    fontSize: 14,
    color: "#4CAF50",
  },
});
