import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Voice from '@react-native-community/voice'; 
import { Ionicons } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; 

const ChatScreen = () => {
  const router = useRouter(); 
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<string[]>([]); 

  const onSpeechResults = (e: any) => {
    const text = e.value[0];
    setMessage(text);
  };

  const handleStartListening = () => {
    Voice.start('en-US');
    setIsListening(true);
  };

  const handleStopListening = () => {
    Voice.stop();
    setIsListening(false);
  };

  useEffect(() => {
    if (Voice) {
      Voice.onSpeechResults = onSpeechResults;
    }
    return () => {
      if (Voice) {
        Voice.removeAllListeners();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setMessages((prev) => [...prev, message]); 
      setMessage("");
      setIsKeyboardVisible(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.push('/home')}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="person-circle" size={40} color="#fff" />
          <Text style={styles.headerText}>ChatAI</Text>
        </View>
      </View>

      {/* Chat container */}
      <ScrollView style={styles.chatContainer}>
        <View style={styles.introBox}>
          <Text style={styles.introText}>Hi! Welcome to ChatAI.</Text>
        </View>
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageBox}>
            <Text style={styles.messageText}>{msg}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, isKeyboardVisible && styles.hiddenFooter]}>
        <LinearGradient
          colors={['#4CAF50', '#81C784']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.voiceButton}
        >
          <TouchableOpacity
            onPress={isListening ? handleStopListening : handleStartListening}
          >
            <Ionicons
              name={isListening ? "stop-circle-outline" : "mic-outline"}
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
        </LinearGradient>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
          onFocus={() => setIsKeyboardVisible(true)}
          onBlur={() => setIsKeyboardVisible(false)}
        />

        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  closeButton: {
    padding: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 80,
  },
  introBox: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  introText: {
    color: '#000',
    fontSize: 16,
  },
  messageBox: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  hiddenFooter: {
    display: 'none',
  },
  voiceButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 40,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 10,
  },
});

export default ChatScreen;
