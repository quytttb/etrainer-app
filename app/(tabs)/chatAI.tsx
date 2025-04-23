import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Voice from '@react-native-community/voice'; 
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Add MaterialCommunityIcons import
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; 

const ChatScreen = () => {
  const router = useRouter(); 
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<string[]>([]); 
  const textInputRef = useRef<TextInput>(null); // Ref for the hidden TextInput

  const onSpeechResults = (e: any) => {
    const text = e.value[0];
    setMessage(text);
  };

  const handleStartListening = async () => {
    try {
      if (Voice) {
        await Voice.start('en-US');
        setIsListening(true);
      } else {
        console.warn("Voice module is not initialized.");
      }
    } catch (error) {
      console.error("Error starting voice recognition:", error);
    }
  };

  const handleStopListening = async () => {
    try {
      if (Voice) {
        await Voice.stop();
        setIsListening(false);
      } else {
        console.warn("Voice module is not initialized.");
      }
    } catch (error) {
      console.error("Error stopping voice recognition:", error);
    }
  };

  useEffect(() => {
    if (Voice) {
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechStart = () => console.log("Speech started");
    } else {
      console.warn("Voice module is not initialized.");
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

  const handleKeyboardButtonPress = () => {
    textInputRef.current?.focus(); 
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.push('/home')}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="person-circle" size={40} color="#000" />
          <View>
            <Text style={styles.headerText}>Chat AI</Text>
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Chat container */}
      <ScrollView style={styles.chatContainer}>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>Hi! Welcome to Chat AI.</Text>
        </View>

        {/* Role play options */}
        <View style={styles.optionsContainer}>
          {["Catch up with a friend", "Talk to a salesperson", "Asking for directions", "Interview", "My own scenario", "Surprise me"].map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionButton}>
              <Text style={styles.optionText}>{option}</Text> {/* Ensure text is wrapped in <Text> */}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      {!isKeyboardVisible && ( // Hide footer when the input box is visible
        <View style={styles.footer}>
          <TouchableOpacity style={styles.keyboardButton} onPress={handleKeyboardButtonPress}>
            <MaterialCommunityIcons name="keyboard-outline" size={24} color="#000" /> {/* Updated icon */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.micButton}>
            <Ionicons name="mic-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.lightButton}>
            <Ionicons name="bulb-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      )}

      {/* Visible Input Box */}
      {isKeyboardVisible && (
        <View style={styles.inputBox}>
          <TextInput
            style={styles.visibleInput}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
            ref={textInputRef}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Hidden TextInput */}
      <TextInput
        ref={textInputRef}
        style={{ height: 0, width: 0, opacity: 0 }} // Hidden TextInput
        onFocus={() => setIsKeyboardVisible(true)}
        onBlur={() => setIsKeyboardVisible(false)}
      />
    </View>
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
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    padding: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -10, 
  },
  headerText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageBox: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  keyboardButton: {
    padding: 10,
  },
  micButton: {
    backgroundColor: '#0099CC',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightButton: {
    padding: 10,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  visibleInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#0099CC',
    padding: 10,
    borderRadius: 20,
  },
});

export default ChatScreen;
