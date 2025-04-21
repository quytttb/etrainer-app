import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams } from "expo-router";
import Header from "../../../components/Header";
import { useQuery } from "@tanstack/react-query";
import { getGrammarByIdService, IGrammarLesson } from "../service";

export default function GrammarDetailScreen() {
  const { id } = useLocalSearchParams();
  const [selectedLesson, setSelectedLesson] = useState<IGrammarLesson>();
  const [modalVisible, setModalVisible] = useState(false);

  const { data } = useQuery({
    queryKey: ["GRAMMAR_DETAIL", id],
    queryFn: () => getGrammarByIdService(id as string),
    enabled: !!id,
  });

  const relatedGrammars = useMemo(() => {
    const relatedGrammars = data?.grammars?.filter(
      (item) => item._id !== selectedLesson?._id
    );

    return relatedGrammars ?? [];
  }, [data, selectedLesson]);

  const handleModalOpen = (grammar: IGrammarLesson) => {
    setSelectedLesson(grammar);
    setModalVisible(true);
  };

  // Hàm đóng modal
  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header không cuộn */}
      <Header title={`Ngữ pháp ${data?.topic ?? "-"}`} />

      {/* Nội dung chính cuộn xuống */}
      <ScrollView style={styles.content}>
        {/* Nội dung bài học */}
        {data ? (
          <View style={styles.grammarList}>
            {data.grammars.map((item, index) => {
              return (
                <View key={index} style={styles.subjectItemContainer}>
                  <Text style={styles.grammarItem}>{item.title}</Text>
                  {/* Nhấn vào bài học để mở modal */}
                  <TouchableOpacity onPress={() => handleModalOpen(item)}>
                    <Text style={styles.openModalText}>Xem chi tiết</Text>
                  </TouchableOpacity>
                  {/* Hiển thị dấu tích xanh nếu bài học đã được chọn và học */}
                  {/* {learnedLessons.has(index) && (
                    <AntDesign
                      name="checkcircle"
                      size={20}
                      color="green"
                      style={styles.checkIcon}
                    />
                  )} */}
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.noDataText}>Không có dữ liệu bài học này.</Text>
        )}
      </ScrollView>

      {/* Modal hiển thị chi tiết bài học */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Tiêu đề modal là tên của bài học đã chọn */}
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>{selectedLesson?.title}</Text>
            </View>

            {/* Nội dung chi tiết bài học (cuộn được) */}
            <ScrollView style={styles.modalTextContainer}>
              <Text style={styles.modalText}>{selectedLesson?.content}</Text>

              <View style={{ marginTop: 10 }}>
                <Text
                  style={{
                    fontWeight: 600,
                    textDecorationLine: "underline",
                    marginBottom: 5,
                  }}
                >
                  Ví dụ:
                </Text>

                {selectedLesson?.examples.map((example, index) => (
                  <Text key={index} style={styles.exampleTxt}>
                    {index + 1}. {example}
                  </Text>
                ))}
              </View>

              {/* Ngữ pháp liên quan */}
              {relatedGrammars?.length > 0 && (
                <View style={styles.relatedGrammarContainer}>
                  <Text style={styles.relatedGrammarTitle}>
                    Ngữ pháp liên quan:
                  </Text>

                  {relatedGrammars.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleModalOpen(item)}
                    >
                      <Text style={styles.relatedGrammarText}>
                        - {item.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* Biểu tượng "X" để đóng modal */}
            <TouchableOpacity
              onPress={handleModalClose}
              style={styles.closeButton}
            >
              <AntDesign name="closecircle" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  grammarList: {
    marginTop: 20,
    marginBottom: 50,
    padding: 20,
  },
  subjectItemContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
  },
  grammarItem: {
    fontSize: 15,
    color: "#333",
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 20,
  },
  openModalText: {
    color: "#00BFAE",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end", // Đảm bảo modal xuất hiện từ dưới lên
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Làm mờ nền
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    width: "100%", // Chiếm toàn bộ chiều rộng
    height: "91%", // Chiếm nửa màn hình
    alignItems: "center",
    position: "relative", // Để giữ "X" ở góc trên bên phải
  },
  modalTitleContainer: {
    backgroundColor: "#00BFAE", // Nền màu xanh cho title
    width: "100%",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    flexWrap: "wrap", // Cho phép xuống dòng khi tiêu đề dài
    width: "100%", // Đảm bảo toàn bộ chiều rộng được sử dụng
  },
  relatedGrammarContainer: {
    backgroundColor: "#E8F5E9", // Nền màu xanh nhạt cho phần Ngữ pháp liên quan
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
  },
  relatedGrammarTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  relatedGrammarText: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  modalTextContainer: {
    flex: 1,
    padding: 10,
    marginTop: 10,
    width: "100%",
  },
  modalText: {
    fontSize: 16,
    color: "#555",
    textAlign: "left",
    fontWeight: "600",
  },
  exampleTxt: {},
  closeButton: {
    position: "absolute",
    top: 15,
    right: 10,
  },
  checkIcon: {
    position: "absolute",
    left: 10,
    top: 20,
  },
});
