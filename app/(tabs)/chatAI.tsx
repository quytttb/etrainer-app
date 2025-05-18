import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import Voice, {
} from '@react-native-community/voice';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'expo-router';


// --- Định nghĩa kiểu ---
interface Message {
  id: string;
  sender: 'User' | 'ChatBot';
  text: string;
}

// Kiểu cho phản hồi từ API /features
interface FeaturesResponse {
  features: string[] | string; // Có thể là mảng các chuỗi hoặc một chuỗi đơn
}

interface CorrectEnglishResponse {
  result: string;
}

interface StudyPlanResponse {
  study_plan: string;
}

interface ApiErrorDetail {
  detail: string;
}

// --- Hằng số ---
// Sử dụng API_BASE_URL phù hợp cho web hoặc native (Expo Go web sẽ là localhost, còn production nên dùng biến môi trường)
const API_BASE_URL =
  typeof window !== "undefined" && window.location && window.location.hostname
    ? `http://${window.location.hostname}:8001`
    : "http://10.0.2.2:8001"; // Android emulator dùng 10.0.2.2

const ChatScreen: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const textInputRef = useRef<RNTextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // --- Effects ---
  useEffect(() => {
    const fetchUserName = async () => {
      setTimeout(() => {
        setUserName("Tố Uyên"); 
      }, 500);
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    if (userName) {
      setMessages([
        { id: 'initial-1', sender: 'ChatBot', text: `Hi ${userName}!` },
        { id: 'initial-2', sender: 'ChatBot', text: 'How can I help you? Try "/studyplan [topic]" or ask "chức năng".' },
      ]);
    } else {
      setMessages([
        { id: 'initial-loading', sender: 'ChatBot', text: 'Loading user information...' },
        { id: 'initial-2', sender: 'ChatBot', text: 'How can I help you? Try "/studyplan [topic]" or ask "chức năng".' },
      ]);
    }
  }, [userName]);

  useEffect(() => {
    // Gán các handlers cho Voice events
    // Sử dụng kiểu cụ thể nếu có, nếu không thì dùng 'any' nhưng nên tránh
    Voice.onSpeechStart = (e: any) => console.log("Speech started", e);
    Voice.onSpeechResults = (e: any) => {
      if (e.value && e.value.length > 0) {
        setCurrentMessage(e.value[0]);
      }
    };
    Voice.onSpeechError = (e: any) => {
      console.error("Speech recognition error", e.error);
      setIsListening(false);
    };
    // Voice.onSpeechEnd: Thư viện của bạn có thể không có sự kiện này hoặc tên khác.
    // Nếu cần, bạn phải xử lý việc kết thúc nhận dạng giọng nói dựa vào onSpeechResults không còn được gọi
    // hoặc onSpeechError. Việc này thường được xử lý ngầm khi setIsListening(false) ở onSpeechError
    // hoặc khi người dùng chủ động dừng (handleStopListening).

    return () => {
      // Kiểm tra kỹ trước khi gọi destroy để tránh lỗi null
      if (Voice && typeof Voice.destroy === 'function') {
        try {
          Voice.destroy();
        } catch (err) {
          console.error("Error destroying voice instance:", err);
        }
      }
    };
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // --- Xử lý giọng nói ---
  const handleStartListening = async (): Promise<void> => {
    if (isListening) return;
    try {
      if (Voice && typeof Voice.start === 'function') {
        await Voice.start('en-US'); // hoặc 'vi-VN'
        setIsListening(true);
      } else {
        Alert.alert("Không hỗ trợ", "Tính năng nhận diện giọng nói không sẵn sàng.");
        setIsListening(false);
      }
    } catch (error) {
      console.error("Error starting voice recognition:", error);
      Alert.alert("Lỗi", "Không thể khởi động nhận diện giọng nói.");
      setIsListening(false);
    }
  };

  const handleStopListening = async (): Promise<void> => {
    if (!isListening) return;
    try {
      await Voice.stop();
      // setIsListening(false); // Thường onSpeechEnd (nếu có) hoặc onSpeechResults dừng sẽ cập nhật
                              // Hoặc nếu không, bạn có thể cần đặt ở đây nếu Voice.stop() không trigger event.
                              // Tuy nhiên, nếu Voice.stop() trigger onSpeechError hoặc một event kết thúc, nó sẽ tự clear.
                              // Trong trường hợp này, để an toàn, ta có thể chủ động đặt:
      setIsListening(false);
    } catch (error) {
      console.error("Error stopping voice recognition:", error);
      setIsListening(false);
    }
  };

  // --- Xử lý gửi tin nhắn và gọi API ---
  const addMessageToList = (sender: 'User' | 'ChatBot', text: string): void => {
    // Đảm bảo text không phải là null hoặc undefined trước khi thêm
    const messageText = text ?? "No response or error."; // Hiển thị một thông báo mặc định nếu text là null/undefined
    console.log(`Adding message to UI: Sender=${sender}, Text="${messageText}"`); // DEBUG
    const newMessage: Message = {
      id: `${Date.now()}_${Math.random()}`.replace('.','_'), // Thay . bằng _ để id hợp lệ hơn
      sender,
      text: messageText,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleApiError = (error: any, context: string): void => {
    console.error(`Error in ${context}:`, JSON.stringify(error, null, 2)); // DEBUG
    let errorMessage = 'An unexpected error occurred while processing your request.';
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorDetail>;
      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail;
      } else if (axiosError.message) {
        errorMessage = `Network Error: ${axiosError.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    addMessageToList('ChatBot', `Error (${context}): ${errorMessage}`);
  };

  const processStudyPlanRequest = async (topic: string): Promise<void> => {
    setIsLoading(true);
    try {
      console.log(`Requesting study plan for topic: "${topic}"`); // DEBUG
      const response = await axios.post<StudyPlanResponse>(
        `${API_BASE_URL}/generate_study_plan`,
        { text: topic }
      );
      console.log("Study Plan API Response Data:", JSON.stringify(response.data, null, 2)); // DEBUG
      const planText = response.data.study_plan;
      if (planText && planText.trim() !== "") {
        addMessageToList('ChatBot', planText);
      } else {
        addMessageToList('ChatBot', "The study plan is empty or could not be generated.");
      }
    } catch (error) {
      handleApiError(error, "generating study plan");
    } finally {
      setIsLoading(false);
    }
  };

  const processTextCorrectionRequest = async (text: string): Promise<void> => {
    setIsLoading(true);
    try {
      console.log(`Requesting text correction for: "${text}"`); // DEBUG
      const response = await axios.post<CorrectEnglishResponse>(
        `${API_BASE_URL}/correct_english`,
        { text }
      );
      console.log("Text Correction API Response Data:", JSON.stringify(response.data, null, 2)); // DEBUG
      const correctedText = response.data.result;
       if (correctedText && correctedText.trim() !== "") {
        addMessageToList('ChatBot', correctedText);
      } else {
        addMessageToList('ChatBot', "No correction provided or the result is empty.");
      }
    } catch (error) {
      handleApiError(error, "correcting text");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (): Promise<void> => {
    const trimmedMessage = currentMessage.trim();
    if (trimmedMessage === "" || isLoading) return;

    addMessageToList('User', trimmedMessage);
    setCurrentMessage(""); 

    const lowerCaseMessage = trimmedMessage.toLowerCase();

    if (
      lowerCaseMessage.includes("chức năng") ||
      lowerCaseMessage.includes("tính năng") ||
      lowerCaseMessage.includes("có thể làm gì") ||
      lowerCaseMessage.includes("what can you do")
    ) {
      setIsLoading(true);
      try {
        console.log("Requesting features list..."); // DEBUG
        const res = await axios.get<FeaturesResponse>(`${API_BASE_URL}/features`);
        console.log("Features API Response Data:", JSON.stringify(res.data, null, 2)); // DEBUG
        let botResponseText = 'I can help you practice speaking, correct grammar, create study plans, and more!'; // Default
        
        if (res.data && res.data.features) {
          if (Array.isArray(res.data.features) && res.data.features.length > 0) {
              botResponseText = `Here are my functions:\n- ${res.data.features.join('\n- ')}`;
          } else if (typeof res.data.features === 'string' && res.data.features.trim() !== "") {
              botResponseText = res.data.features;
          }
        }
        addMessageToList('ChatBot', botResponseText);
      } catch (error) {
        handleApiError(error, "fetching features"); // Sử dụng handleApiError để nhất quán
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (lowerCaseMessage.startsWith("/studyplan ")) {
      const topic = trimmedMessage.substring("/studyplan ".length).trim();
      if (topic) {
        await processStudyPlanRequest(topic);
      } else {
        addMessageToList('ChatBot', "Please provide a topic for the study plan. Usage: /studyplan [your topic]");
      }
    } else {
      await processTextCorrectionRequest(trimmedMessage);
    }
  };

  // --- Xử lý giao diện ---
  const handleKeyboardButtonPress = (): void => {
    setIsKeyboardVisible(true);
    setTimeout(() => textInputRef.current?.focus(), 100);
  };

  const handleTextInputSubmit = (): void => {
    handleSendMessage();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <View style={styles.avatarCircle}>
            <Image
              source={require('../../assets/images/ai.png')}
              style={styles.avatarSmall}
            />
          </View>
          <Text style={styles.botName}>ChatBot AI</Text>
        </View>
      </View>

      {/* Chat Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatScroll}
        contentContainerStyle={styles.chatScrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.chatBubbleGroup}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBox,
                msg.sender === 'User' ? styles.userMessageBox : styles.botMessageBox,
              ]}
            >
              {msg.sender === 'ChatBot' && <View style={styles.bubbleArrowLeft} />}
              {msg.sender === 'User' && <View style={styles.bubbleArrowRight} />}
              <Text style={msg.sender === 'User' ? styles.userMessageText : styles.botMessageText}>
                {msg.text}
              </Text>
            </View>
          ))}
          {isLoading && messages.length > 0 && messages[messages.length -1]?.sender === 'User' && (
            <View style={[styles.messageBox, styles.botMessageBox, styles.typingIndicator]}>
              <View style={styles.bubbleArrowLeft} />
              <Text style={styles.botMessageText}>Bot is thinking...</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer / Input */}
      {!isKeyboardVisible && (
        <View style={styles.footerOverlay}>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.keyboardButton} onPress={handleKeyboardButtonPress}>
              <MaterialCommunityIcons name="keyboard-outline" size={24} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.micButton, isListening ? styles.micButtonListening : null]}
              onPress={isListening ? handleStopListening : handleStartListening}
              disabled={isLoading}
            >
              <Ionicons name={isListening ? "mic-off-outline" : "mic-outline"} size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.cancelButtonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => router.push('/home')}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {isKeyboardVisible && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'height' có thể tốt hơn
          style={styles.inputBoxContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputBox}>
            <RNTextInput
              style={styles.visibleInput}
              placeholder={userName ? `Ask ${userName}'s AI anything...` : "Type command or question..."}
              placeholderTextColor="#888"
              value={currentMessage}
              onChangeText={setCurrentMessage}
              ref={textInputRef}
              autoFocus
              onSubmitEditing={handleTextInputSubmit}
              editable={!isLoading}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, (isLoading || currentMessage.trim() === "") ? styles.sendButtonDisabled : null]}
              onPress={handleSendMessage}
              disabled={isLoading || currentMessage.trim() === ""}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send-outline" size={22} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D1D1D6',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  avatarSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  botName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1E21',
  },
  chatScroll: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  chatScrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  chatBubbleGroup: {},
  messageBox: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 8,
    maxWidth: '85%',
    position: 'relative',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  userMessageBox: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084FF',
    marginLeft: '15%',
  },
  botMessageBox: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E0E0E0',
    marginRight: '15%',
  },
  userMessageText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  botMessageText: {
    fontSize: 15,
    color: '#1C1E21',
    lineHeight: 20,
  },
  bubbleArrowLeft: {
    position: 'absolute',
    left: -6,
    bottom: 6,
    width: 0,
    height: 0,
    borderTopWidth: 7, borderTopColor: 'transparent',
    borderBottomWidth: 7, borderBottomColor: 'transparent',
    borderRightWidth: 7, borderRightColor: '#FFFFFF',
  },
  bubbleArrowRight: {
    position: 'absolute',
    right: -6,
    bottom: 6,
    width: 0,
    height: 0,
    borderTopWidth: 7, borderTopColor: 'transparent',
    borderBottomWidth: 7, borderBottomColor: 'transparent',
    borderLeftWidth: 7, borderLeftColor: '#0084FF',
  },
  typingIndicator: {},
  footerOverlay: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#BCC0C4',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '92%',
  },
  keyboardButton: {
    padding: 8,
    marginRight: 10,
  },
  micButton: {
    backgroundColor: '#0084FF',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonListening: {
    backgroundColor: '#FF5A5F',
  },
  cancelButtonContainer: {
    marginLeft: 10,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 15,
    color: '#0084FF',
    fontWeight: '500',
  },
  inputBoxContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#BCC0C4',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    minHeight: 50,
  },
  visibleInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderWidth: 1,
    borderColor: '#CCD0D5',
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F0F2F5',
    fontSize: 15,
    lineHeight: 19,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#0084FF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#BCC0C4',
  },
});

export default ChatScreen;