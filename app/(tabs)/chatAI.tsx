import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, ScrollView } from 'react-native';
import Voice from '@react-native-community/voice'; // Import thư viện Voice

const ChatScreen = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Khi nhận diện giọng nói và trả về kết quả
  const onSpeechResults = (e: any) => {
    const text = e.value[0]; // Lấy văn bản nhận diện từ giọng nói
    setMessage(text); // Cập nhật nội dung tin nhắn
  };

  // Bắt đầu ghi âm giọng nói
  const handleStartListening = () => {
    Voice.start('en-US'); // Ngôn ngữ tiếng Anh
    setIsListening(true);
  };

  // Dừng ghi âm
  const handleStopListening = () => {
    Voice.stop();
    setIsListening(false);
  };

  // Cài đặt `useEffect` để lắng nghe các sự kiện từ Voice
  useEffect(() => {
    // Đăng ký sự kiện
    Voice.onSpeechResults = onSpeechResults;

    // Dọn dẹp các listener khi component bị unmount
    return () => {
      Voice.removeAllListeners();  // Đây là cách dọn dẹp đúng
    };
  }, []);

  // Hàm gửi tin nhắn
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      console.log("Gửi tin nhắn:", message);
      setMessage(""); // Xóa tin nhắn sau khi gửi
      setIsKeyboardVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>MOEWW AI</Text>
        </View>

        {/* Chatbot intro */}
        <View style={styles.introBox}>
          <Text style={styles.introText}>Hi! Welcome to MEWW AI.</Text>
        </View>
      </ScrollView>

      {/* Footer with icons and input */}
      <View style={[styles.footer, isKeyboardVisible && styles.hiddenFooter]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => setIsKeyboardVisible(true)}>
          <Text style={styles.iconText}>Start Listening</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.speechButton}
          onPress={isListening ? handleStopListening : handleStartListening}
        >
          <Text style={styles.iconText}>{isListening ? "Stop" : "Microphone"}</Text>
        </TouchableOpacity>

        {/* Biểu tượng gửi tin nhắn */}
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.iconText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị TextInput khi bàn phím được kích hoạt */}
      {isKeyboardVisible && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
            autoFocus={true}
            onBlur={() => setIsKeyboardVisible(false)} // Khi mất focus thì ẩn bàn phím
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  iconText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  introBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  introText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  hiddenFooter: {
    display: 'none', // Ẩn footer khi bàn phím xuất hiện
  },
  iconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speechButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    color: '#fff',
    fontSize: 16,
    height: 40,
    flex: 1,
  },
});

export default ChatScreen;
