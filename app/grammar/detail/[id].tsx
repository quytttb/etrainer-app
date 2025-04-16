import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';  // Import AntDesign icon library
import { useLocalSearchParams } from 'expo-router';
import Header from '../../../components/Header';

export default function GrammarDetailScreen() {
  const { id } = useLocalSearchParams();  // Lấy id của bài học từ URL
  const parsedId = Number(id);  // Chuyển đổi id từ string sang number
  const [modalVisible, setModalVisible] = useState(false); // Trạng thái modal
  const [modalContent, setModalContent] = useState(""); // Dữ liệu nội dung của modal
  const [modalText, setModalText] = useState(""); // Nội dung chi tiết bài học
  const [relatedGrammar, setRelatedGrammar] = useState<string[]>([]); // Ngữ pháp liên quan
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null); // Lưu ID của bài học đã được chọn
  const [learnedLessons, setLearnedLessons] = useState<Set<number>>(new Set()); // Lưu các bài học đã học

  // Dữ liệu mô phỏng cho các bài học
  const grammarData: { [key: number]: { subject: string, content: string, relatedGrammar: string[] }[] } = {
    1: [
      { 
        subject: "Cấu trúc chung của một câu trong tiếng anh", 
        content: "Trong tiếng Anh, cấu trúc của một câu thường có dạng Subject + Verb + Object. Điều này giúp cho câu trở nên rõ ràng và dễ hiểu.",
        relatedGrammar: [
          "Cấu trúc câu đơn giản",
          "Sự hòa hợp giữa chủ ngữ và động từ",
          "Danh từ đếm được và không đếm được"
        ]
      },
      { 
        subject: "Subject (Chủ ngữ)", 
        content: "Chủ ngữ là người hoặc vật thực hiện hành động hoặc là đối tượng của hành động trong câu.",
        relatedGrammar: [
          "Danh từ và đại từ làm chủ ngữ",
          "Cách sử dụng mạo từ"
        ]
      },
    ],
    2: [
      { 
        subject: "Sự hòa hợp giữa chủ ngữ và động từ", 
        content: "Sự hòa hợp giữa chủ ngữ và động từ là khi chủ ngữ số ít đi với động từ số ít và chủ ngữ số nhiều đi với động từ số nhiều.",
        relatedGrammar: [
          "Cấu trúc câu đơn giản",
          "Cách sử dụng much và many"
        ]
      },
      { 
        subject: "Các trường hợp chủ ngữ đứng tách khỏi động từ", 
        content: "Trong một số trường hợp, chủ ngữ có thể đứng xa động từ trong câu, nhưng sự hòa hợp giữa chủ ngữ và động từ vẫn phải được giữ vững.",
        relatedGrammar: [
          "Danh từ đếm được và không đếm được",
          "Cấu trúc either...or"
        ]
      },
    ],
  };

  const lessonData = grammarData[parsedId];  // Lấy dữ liệu bài học theo id

  // Hàm mở modal và thay đổi nội dung modal
  const handleModalOpen = (lesson: string, content: string, relatedGrammar: string[], index: number) => {
    setModalContent(lesson); // Cập nhật tên bài học
    setModalText(content);   // Cập nhật nội dung bài học
    setRelatedGrammar(relatedGrammar); // Cập nhật ngữ pháp liên quan
    setSelectedLesson(index); // Cập nhật bài học đã được chọn
    setModalVisible(true); // Mở modal

    // Cập nhật bài học đã học
    setLearnedLessons(prev => new Set(prev).add(index));
  };

  // Hàm đóng modal
  const handleModalClose = () => {
    setModalVisible(false); // Đóng modal
    setSelectedLesson(null); // Reset bài học đã chọn
  };

  return (
    <View style={styles.container}>
      {/* Header không cuộn */}
      <Header title={`Ngữ pháp ${id}`} />

      {/* Nội dung chính cuộn xuống */}
      <ScrollView style={styles.content}>
        {/* Nội dung bài học */}
        {lessonData ? (
          <View style={styles.grammarList}>
            {lessonData.map((item, index) => {
              const lessonId = index + 1;

              return (
                <View key={index} style={styles.subjectItemContainer}>
                  <Text style={styles.grammarItem}>{item.subject}</Text>
                  {/* Nhấn vào bài học để mở modal */}
                  <TouchableOpacity onPress={() => handleModalOpen(item.subject, item.content, item.relatedGrammar, index)}>
                    <Text style={styles.openModalText}>Xem chi tiết</Text>
                  </TouchableOpacity>
                  {/* Hiển thị dấu tích xanh nếu bài học đã được chọn và học */}
                  {learnedLessons.has(index) && (
                    <AntDesign name="checkcircle" size={20} color="green" style={styles.checkIcon} />
                  )}
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
              <Text style={styles.modalTitle}>{modalContent}</Text>
            </View>

            {/* Nội dung chi tiết bài học (cuộn được) */}
            <ScrollView style={styles.modalTextContainer}>
              <Text style={styles.modalText}>{modalText}</Text>

              {/* Ngữ pháp liên quan */}
              <View style={styles.relatedGrammarContainer}>
                <Text style={styles.relatedGrammarTitle}>Ngữ pháp liên quan:</Text>
                {relatedGrammar.map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => handleModalOpen(item, "", [], index)}>
                    <Text style={styles.relatedGrammarText}>- {item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Biểu tượng "X" để đóng modal */}
            <TouchableOpacity onPress={handleModalClose} style={styles.closeButton}>
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
    backgroundColor: '#F9F9F9',
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
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative',
  },
  grammarItem: {
    fontSize: 15,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 20,
  },
  noDataText: {
    fontSize: 15,
    color: '#f00',
    textAlign: 'center',
    marginTop: 20,
  },
  openModalText: {
    color: '#00BFAE',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',  // Đảm bảo modal xuất hiện từ dưới lên
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Làm mờ nền
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: '100%', // Chiếm toàn bộ chiều rộng
    height: '91%',  // Chiếm nửa màn hình
    alignItems: 'center',
    position: 'relative', // Để giữ "X" ở góc trên bên phải
  },
  modalTitleContainer: {
    backgroundColor: '#00BFAE',  // Nền màu xanh cho title
    width: '100%',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    flexWrap: 'wrap',  // Cho phép xuống dòng khi tiêu đề dài
    width: '100%',  // Đảm bảo toàn bộ chiều rộng được sử dụng
  },
  relatedGrammarContainer: {
    backgroundColor: '#E8F5E9',  // Nền màu xanh nhạt cho phần Ngữ pháp liên quan
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative',
  },
  relatedGrammarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  relatedGrammarText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  modalTextContainer: {
    flex: 1,
    padding: 10,
    marginTop: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 10,
  },
  checkIcon: {
    position: 'absolute',
    left: 10, // Đổi từ right sang left để hiển thị ở bên trái
    top: 20,
  },
});
