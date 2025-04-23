import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function OnboardingScreen() {
  const handleContinue = () => {
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng đến với ETrainer!</Text>
      <Text style={styles.desc}>
        App luyện thi TOEIC cùng Trí tuệ nhân tạo giúp bạn đạt mục tiêu nhanh hơn.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Bắt đầu ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    flex: 1, 
    justifyContent: 'center' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' },
  desc: { 
    fontSize: 16, 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  button: {
    backgroundColor: '#0099CC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});