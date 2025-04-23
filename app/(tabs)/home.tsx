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
import { LESSON_TYPE, LESSON_TYPE_MAPPING } from "@/constants/lesson-types";
import { LinearGradient } from "expo-linear-gradient";
import HistorySection from "@/components/Home/HistorySection";

export default function HomeScreen() {
  const { profile } = useProfile();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["NOTIFICATION"],
    queryFn: getNotificationService,
  });

  console.log("Notification count", data?.length);

  const handlePress = (lessonType: LESSON_TYPE) => {
    switch (lessonType) {
      case LESSON_TYPE.VOCABULARY: {
        router.push("/vocabulary");
        break;
      }

      case LESSON_TYPE.GRAMMAR: {
        router.push("/grammar");
        break;
      }

      default: {
        router.push({
          pathname: "/practice",
          params: { lessonType },
        });
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
          <TouchableOpacity
            style={styles.notificationIcon}
            onPress={() => router.push("/notifis")}
          >
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
        <LinearGradient
          colors={["#7BD5F5", "#1CA7EC"]}
          style={styles.gradientBackground}
        >
          <Text style={styles.studyTime}>Let's study with Etrainer!</Text>
          <Text style={styles.studyTime}>45 minutes</Text>
          <Image
            source={require("../../assets/images/diary.png")}
            style={styles.boxImage}
          />
        </LinearGradient>
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
                    : LESSON_TYPE_MAPPING[lesson.type]}
                </Text>

                {lesson.partNumber && (
                  <Text style={styles.lessonText2}>
                    {LESSON_TYPE_MAPPING[lesson.type]}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <HistorySection />

      {/* Ôn tập Section */}
      <View style={styles.notebookSection}>
        <Text style={styles.sectionTitle}>Ôn tập</Text>
        <View style={styles.notebookList}>
          <TouchableOpacity
            style={styles.notebookCard}
            onPress={() => router.push("/saveQuestion")}
          >
            <Image
              source={require("../../assets/images/books.png")}
              style={styles.notebookIcon}
            />
            <Text style={styles.notebookButton}>Ôn tập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Giữ lại các styles liên quan đến các phần khác của HomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    padding: 20,
    marginBottom: 30,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  headerLeft: {
    flexDirection: "column",
    flex: 1,
    marginTop: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  greenBox: {
    marginTop: 10,
    marginBottom: -30,
    padding: 0,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  gradientBackground: {
    padding: 50,
    borderRadius: 20,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    marginTop: 10,
    fontSize: 40,
    color: "#0099CC",
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
    fontSize: 18,
    color: "#000",
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
  notebookSection: {
    marginTop: -60,
    marginBottom: 100,
  },
  notebookList: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 15,
  },
  notebookCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "40%",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  notebookIcon: {
    width: 40,
    height: 40,
  },
  notebookButton: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#0099CC",
  },
});
