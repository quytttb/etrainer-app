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

export default function HomeScreen() {
  const { profile } = useProfile();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("practice");
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  const { data } = useQuery({
    queryKey: ["NOTIFICATION"],
    queryFn: getNotificationService,
  });

  console.log("Notification count", data?.length);

  function handleTabChange(tab: string) {
    setActiveTab(tab);
  }

  const handleModalToggle = () => {
    setIsModalVisible(!isModalVisible); // Toggle modal visibility
  };

  const handleTestResultPress = (testId: string): void => {
    router.push(`/exam/result/${testId}`);
  };

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
            // onPress={() => router.push('/notifis')}
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

      {/* Lịch sử Section */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Lịch sử</Text>

        {/* Tab buttons for switching between "Luyện tập" and "Thi" */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "practice" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("practice")}
          >
            <Text style={styles.tabText}>Luyện tập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "exam" && styles.activeTab]}
            onPress={() => setActiveTab("exam")}
          >
            <Text style={styles.tabText}>Thi</Text>
          </TouchableOpacity>
        </View>

        {/* Content for each tab */}
        {activeTab === "practice" && (
          <View style={styles.historyCard}>
            <View style={styles.historyColumn}>
              <Text style={styles.historySubTitle}>Luyện tập</Text>
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Mô tả hình ảnh</Text>
                <Text style={styles.historyProgress}>0/990</Text>
              </View>
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Hỏi và Đáp</Text>
                <Text style={styles.historyProgress}>0/990</Text>
              </View>
              <TouchableOpacity
                style={styles.historyItem}
                onPress={() => router.push("/reviewResults")}
              >
                <Text style={styles.historyText}>Bài đánh giá</Text>
                <Text style={styles.historyProgress}>100/990</Text>
              </TouchableOpacity>
            </View>
            {/* "Xem thêm" Text Link for Luyện tập */}
            <TouchableOpacity onPress={handleModalToggle}>
              <Text style={styles.viewMoreText}>Xem thêm</Text>
            </TouchableOpacity>
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
            {/* "Xem thêm" Text Link for Thi */}
            <TouchableOpacity onPress={handleModalToggle}>
              <Text style={styles.viewMoreText}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal for History Details */}
      {isModalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header Box */}
            <View style={styles.modalHeaderBox}>
              <Text style={styles.modalTitle}>
                {activeTab === "practice" ? "Lịch sử luyện tập" : "Lịch sử thi"}
              </Text>
              <TouchableOpacity onPress={handleModalToggle}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {activeTab === "practice" && (
                <>
                  <View style={styles.modalItem}>
                    <Text style={styles.modalItemTitle}>Mô Tả Hình Ảnh</Text>
                    <Text style={styles.modalItemDetails}>Số câu hỏi: 10</Text>
                    <Text style={styles.modalItemDetails}>30%</Text>
                  </View>
                  <View style={styles.modalItem}>
                    <Text style={styles.modalItemTitle}>
                      Bài đánh giá ngày 1
                    </Text>
                    <Text style={styles.modalItemDetails}>Số câu hỏi: 6</Text>
                    <Text style={styles.modalItemDetails}>50%</Text>
                  </View>
                </>
              )}
              {activeTab === "exam" && (
                <>
                  <TouchableOpacity
                    onPress={() => handleTestResultPress("test1")}
                    style={styles.modalItem}
                  >
                    <Text style={styles.modalItemTitle}>Test 1</Text>
                    <Text style={styles.modalItemDetails}>Số câu hỏi: 20</Text>
                    <Text style={styles.modalItemDetails}>40%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleTestResultPress("test2")}
                    style={styles.modalItem}
                  >
                    <Text style={styles.modalItemTitle}>Test 2</Text>
                    <Text style={styles.modalItemDetails}>Số câu hỏi: 15</Text>
                    <Text style={styles.modalItemDetails}>60%</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      )}

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
    borderColor: "#0099CC",
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
    color: "#0099CC",
  },
  viewMoreText: {
    fontSize: 16,
    color: "#0099CC",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginStart: -20,
    marginEnd: -20,
    height: "40%",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  modalContent: {
    width: "100%", // Ensure the modal content spans the full width
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "100%",
    zIndex: 11, // Ensure modal content appears above other elements
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalHeaderBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0099CC", // Green background for the header box
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF", // White text for contrast
  },
  modalClose: {
    fontSize: 18,
    color: "#FFF", // White close button
    fontWeight: "bold",
  },
  modalItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 10,
  },
  modalItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  modalItemIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  modalItemDetails: {
    flex: 1,
  },
  modalItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  modalItemSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  modalItemPercentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0099CC",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#EEE",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#0099CC",
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
