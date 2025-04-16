import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { ChevronLeft, Clock, Settings, Menu } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface HeaderCardProps {
  onMenuPress: () => void;
  onBackPress: () => void;
}

const HeaderCard: React.FC<HeaderCardProps> = ({ onMenuPress }) => {
  const router = useRouter();
  const { partId } = useLocalSearchParams(); // Lấy tham số 'partId' từ URL
  const [timeLeft, setTimeLeft] = useState(0); // Bắt đầu từ 0 giây
  const [timerRunning, setTimerRunning] = useState(true); // Điều khiển việc đếm ngược
  const [isModalVisible, setIsModalVisible] = useState(false); // Quản lý trạng thái modal

  // Thực hiện đếm ngược thời gian
  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime + 1); // Tăng thời gian mỗi giây
    }, 1000); // 1000 ms = 1 giây

    return () => clearInterval(interval); // Dọn dẹp khi component bị unmount hoặc khi timerRunning thay đổi
  }, [timerRunning]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60); // Phút
    const seconds = timeInSeconds % 60; // Giây
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Xử lý quay lại trang partId với modal xác nhận
  const handleBackPress = () => {
    setIsModalVisible(true); // Mở modal xác nhận khi nhấn "Back"
  };

  const handleConfirmExit = () => {
    setIsModalVisible(false); // Đóng modal
    if (partId) {
      router.push(`/exam/detail/${partId}`); // Điều hướng đến trang partId (sử dụng tham số partId trong URL)
    } else {
      router.back(); // Quay lại trang trước nếu không có partId
    }
  };

  const handleCancelExit = () => {
    setIsModalVisible(false); // Đóng modal và không làm gì thêm
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.questionTitle}>Question</Text>
      </View>

      <View style={styles.timerContainer}>
        <Clock size={20} color="red" />
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>

        <TouchableOpacity style={styles.iconButton}>
          <Settings size={20} color="black" />
        </TouchableOpacity>

        {/* Biểu tượng ba gạch để mở Modal */}
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Menu size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Modal xác nhận khi bấm Back, xuất hiện từ bên trái */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide" onRequestClose={handleCancelExit}>
        <View style={styles.modalBackground}>
          <View style={[styles.modalContent, { transform: [{ translateX: isModalVisible ? 0 : -400 }] }]}>
            <Text style={styles.modalTitle}>Bạn có muốn thoát?</Text>
            <Text style={styles.modalMessage}>
              Tiến độ của bài học sẽ bị mất nếu bạn thoát bây giờ.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleConfirmExit} style={styles.button}>
                <Text style={styles.buttonText}>Thoát</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelExit} style={styles.button}>
                <Text style={styles.buttonText}>Bỏ qua</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    marginLeft: 4,
    color: 'red',
  },
  iconButton: {
    marginLeft: 12,
    padding: 4,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ cho modal
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute', // Giúp modal có thể di chuyển
    left: 40,
    top: '35%',
    transform: [{ translateX: -400 }], // Modal sẽ bắt đầu ở ngoài màn hình
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default HeaderCard;
