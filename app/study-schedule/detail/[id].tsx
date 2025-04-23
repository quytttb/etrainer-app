import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';  // Import to read the URL parameters and useRouter for navigation

const GoalScreen = () => {
  const { score } = useLocalSearchParams();  // Get the score parameter from URL
  const router = useRouter(); // Initialize router for navigation
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleSelectGoal = (goal: string) => {
    setSelectedGoal(goal);
  };

  return (
    <View style={styles.container}>
      {/* Left Side: Display Band Score */}
      <View style={styles.bandContainer}>
        <Text style={styles.bandText}>{score ? `${score}` : '500/700/900'}</Text>  {/* Ensure score is wrapped in <Text> */}
      </View>

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lộ trình</Text>
      </View>

      {/* Timeline Section */}
      <ScrollView contentContainerStyle={styles.timelineContainer}>
        {/* Row 1 */}
        <View style={styles.row}>
          <View style={styles.cardDay}>
            <Text style={styles.date}>Ngày 1 - 3</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mô Tả Hình Ảnh</Text>
            <Text style={styles.cardText}>Mục tiêu: 6 điểm</Text>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <View style={styles.cardDay}>
            <Text style={styles.date}>Ngày 4 - 14</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hỏi & Đáp</Text>
            <Text style={styles.cardText}>Mục tiêu: 20 điểm</Text>
          </View>
        </View>

        {/* Row 3 (with Test Box) */}
        <View style={styles.row}>
          <View style={styles.cardDay}>
            <Text style={styles.date}>Ngày 15</Text>
          </View>
          <View style={[styles.card, styles.testCard]}>
            <Text style={styles.cardTitle}>Bài thi thử số 1</Text>
          </View>
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          <View style={styles.cardDay}>
            <Text style={styles.date}>Ngày 16 - 28</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Điền Vào Câu</Text>
            <Text style={styles.cardText}>Mục tiêu: 24 điểm</Text>
          </View>
        </View>

        {/* Row 5 */}
        <View style={styles.row}>
          <View style={styles.cardDay}>
            <Text style={styles.date}>Ngày 29 - 44</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Đoạn Hội Thoại</Text>
            <Text style={styles.cardText}>Mục tiêu: 24 điểm</Text>
          </View>
        </View>
      </ScrollView>

      {/* Start Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => {
          try {
            router.push('/learningPath');
          } catch (error) {
            console.error('Navigation error occurred:', error);
          }
        }}
      >
        <Text style={styles.startButtonText}>Bắt đầu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bandContainer: {
    position: 'absolute',
    top: 40, 
    left: 20,
    padding: 10,
    backgroundColor: '#0099CC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, 
  },
  bandText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  header: {
    backgroundColor: '#0099CC',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  timelineContainer: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cardDay: {
    flex: 1,
    backgroundColor: '#FFFF',
    padding: 20,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    width: 100,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFF',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  testCard: {
    backgroundColor: '#FFA500', 
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  startButton: {
    backgroundColor: '#0099CC',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GoalScreen;
