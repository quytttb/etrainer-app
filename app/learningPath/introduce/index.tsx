import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter

const Part1Introduce = () => {
  const [selectedQuestions, setSelectedQuestions] = useState(10);
  const [testMode, setTestMode] = useState(false);
  const router = useRouter(); // Initialize router

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBox}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.push('learningPath')}>
          <FontAwesome name="chevron-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mô Tả Hình Ảnh</Text>
        </View>
      </View>

      {/* Question Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Câu hỏi</Text>
        <Text style={styles.descriptionText}>
          For each question, you will see a picture and you will hear four short statements. The statements will be spoken just one time. They will not be printed in your test book so you must listen carefully to understand what the speaker says. When you hear the four statements, look at the picture and choose the statement that best describes what you see in the picture. Choose the best answer A, B, C or D.
        </Text>
      </View>

      {/* Upgrade Section */}
      {/* <View style={styles.upgradeContainer}> */}
        {/* <Text style={styles.upgradeText}> */}
          {/* <Text style={styles.upgradeBold}>Nâng cấp</Text> để tải toàn bộ bài tập về máy, tải dữ liệu nhanh hơn, ổn định hơn */}
        {/* </Text> */}
      {/* </View> */}

      {/* Question Selection */}
      <View style={styles.selectionContainer}>
        <Text style={styles.selectionLabel}>Số câu hỏi:</Text>
        <TouchableOpacity 
          style={styles.adjustButton} 
          onPress={() => setSelectedQuestions((prev) => Math.max(1, prev - 1))}
        >
          <Text style={styles.adjustButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.selectionValue}>{selectedQuestions}</Text>
        <TouchableOpacity 
          style={styles.adjustButton} 
          onPress={() => setSelectedQuestions((prev) => prev + 1)}
        >
          <Text style={styles.adjustButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Test Mode */}
      {/* <View style={styles.testModeContainer}> */}
        {/* <Text style={styles.testModeLabel}>Chế độ kiểm tra:</Text> */}
        {/* <Switch */}
          {/* value={testMode} */}
          {/* onValueChange={(value) => setTestMode(value)} */}
          {/* thumbColor={testMode ? '#0099CC' : '#E0E0E0'} */}
        {/* /> */}
      {/* </View> */}

      {/* Start Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push('learningPath/exam/1')} 
      >
        <Text style={styles.startButtonText}>Bắt đầu nào</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#0099CC', 
    padding: 20,
  },
  backIcon: {
    marginRight: 8,
  },
  backIconText: {
    fontSize: 18,
    color: '#FFFFFF', 
  },
  header: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', 
  },
  descriptionContainer: {
    marginBottom: 16,
    padding: 16, 
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ffff', 
    borderRadius: 8, 
    backgroundColor: '#F9F9F9', 
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#757575',
  },
  upgradeContainer: {
    marginBottom: 16,
  },
  upgradeText: {
    fontSize: 14,
    color: '#757575',
  },
  upgradeBold: {
    fontWeight: 'bold',
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 20,
    justifyContent: 'center',
  },
  selectionLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  selectionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  adjustButton: {
    backgroundColor: '#0099CC',
    padding: 8,
    borderRadius: 4,
  },
  adjustButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  testModeLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  startButton: {
    backgroundColor: '#0099CC',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 50,
    marginRight: 50,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Part1Introduce;
