import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const GoalScreen = () => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleSelectGoal = (goal: string) => {
    setSelectedGoal(goal);
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lộ trình</Text>
      </View>

      {/* Subtitle Section */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Đặt mục tiêu hoàn thành</Text>
      </View>

      {/* Options Section */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, selectedGoal === '30 ngày' && styles.selectedOption]}
          onPress={() => handleSelectGoal('30 ngày')}
        >
          <Text style={styles.optionText}>30 ngày</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, selectedGoal === '90 ngày' && styles.selectedOption]}
          onPress={() => handleSelectGoal('90 ngày')}
        >
          <Text style={styles.optionText}>90 ngày</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, selectedGoal === '180 ngày' && styles.selectedOption]}
          onPress={() => handleSelectGoal('180 ngày')}
        >
          <Text style={styles.optionText}>180 ngày</Text>
        </TouchableOpacity>
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Tiếp theo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#00C4B4',
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
  subtitleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsContainer: {
    marginBottom: 30,
    paddingHorizontal: 50,
  },
  optionButton: {
    backgroundColor: '#FFFF',
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  selectedOption: {
    backgroundColor: '#00C4B4',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#00C4B4',
    paddingVertical: 15,
    marginHorizontal: 50,
    marginTop: 200,
    borderRadius: 30,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default GoalScreen;
