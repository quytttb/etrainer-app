import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import { BookKey, Heart, PenLine, ChevronLeft, ChevronRight } from 'lucide-react-native'; // Import icons for navigation

interface NavigationButtonsProps {
  currentQuestionIndex: number; 
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  isLastQuestion: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentQuestionIndex, 
  totalQuestions,
  onPrevious,
  onNext,
  isPrevDisabled,
  isNextDisabled,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Quản lý trạng thái hiển thị modal
  const [activeTab, setActiveTab] = useState('subtitles'); // Quản lý tab đang được chọn (phụ đề hoặc lời dịch)

  const openModal = () => setIsModalVisible(true); // Mở modal
  const closeModal = () => setIsModalVisible(false); // Đóng modal
  const switchTab = (tab: 'subtitles' | 'translation') => setActiveTab(tab); // Chuyển tab giữa phụ đề và lời dịch

  return (
    <View style={styles.footer}>
      {/* Previous button with icon */}
      <TouchableOpacity onPress={onPrevious} disabled={isPrevDisabled}>
        <ChevronLeft size={24} color={isPrevDisabled ? '#d3d3d3' : '#2196F3'} />
      </TouchableOpacity>

      {/* Icons in the center */}
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Heart size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <PenLine size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={openModal}>
          <BookKey size={20} color="black" /> {/* Nút BookKey để mở modal */}
        </TouchableOpacity>
      </View>

      {/* Next button with icon */}
      <TouchableOpacity onPress={onNext} disabled={isNextDisabled}>
        <ChevronRight size={24} color={isNextDisabled ? '#d3d3d3' : '#2196F3'} />
      </TouchableOpacity>

      {/* Modal cho BookKey click */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {/* Tab navigation for subtitles and translation */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'subtitles' && styles.activeTab]}
                onPress={() => switchTab('subtitles')}
              >
                <Text style={styles.tabText}>Phụ đề</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'translation' && styles.activeTab]}
                onPress={() => switchTab('translation')}
              >
                <Text style={styles.tabText}>Lời dịch</Text>
              </TouchableOpacity>
            </View>

            {/* Nội dung dựa trên tab đã chọn */}
            {activeTab === 'subtitles' ? (
              <Text style={styles.modalText}>Phụ đề: Lời giải thích cho câu trả lời của bạn.</Text>
            ) : (
              <Text style={styles.modalText}>Lời dịch: Câu trả lời đã được dịch sang tiếng Việt.</Text>
            )}

            {/* Nút đóng modal */}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10, 
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  iconButton: {
    padding: 8,
  },
  navigationText: {
    fontSize: 24,
    color: '#2196F3',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end', 
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    width: '100%',
    height: Dimensions.get('window').height * 0.33, // Modal chiếm 1/3 chiều cao màn hình
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tabButton: {
    padding: 10,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#4CAF50', 
  },
  tabText: {
    fontSize: 18,
    color: '#000',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NavigationButtons;