import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header'; // Adjusted the path to locate the Header component

const QuestionScreen = () => {
  const router = useRouter();

  // Mock data for questions
  const questions = [
    { id: 1, question: 'Câu 1', selected: 'B', correct: 'C' },
    { id: 2, question: 'Câu 2', selected: 'B', correct: 'C' },
    { id: 3, question: 'Câu 3', selected: 'C', correct: 'C' },
    { id: 4, question: 'Câu 4', selected: 'B', correct: 'B' },
    { id: 5, question: 'Câu 5', selected: 'B', correct: 'C' },
    { id: 6, question: 'Câu 6', selected: 'B', correct: 'C' },
    { id: 7, question: 'Câu 7', selected: 'B', correct: 'B' },
    { id: 8, question: 'Câu 8', selected: 'A', correct: 'C' },
    { id: 9, question: 'Câu 9', selected: 'C', correct: 'C' },
    { id: 10, question: 'Câu 10', selected: 'B', correct: 'C' },
  ];

  const [filter, setFilter] = useState('all'); // Filter state: 'all', 'incorrect', 'correct'

  const filteredQuestions = questions.filter((q) => {
    if (filter === 'incorrect') return q.selected !== q.correct;
    if (filter === 'correct') return q.selected === q.correct;
    return true; // 'all'
  });

  const handleContinuePress = () => {
    router.push('/next-screen'); // Navigate to the next screen (replace '/next-screen' with your desired route)
  };

  return (
    <View style={styles.container}>
      {/* Use the existing Header component */}
      <Header title="Hiển thị đáp án" onBackPress={() => router.push('/Result' as any)} />

      {/* Filters */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={styles.filterText}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'incorrect' && styles.activeFilter]}
          onPress={() => setFilter('incorrect')}
        >
          <Text style={styles.filterText}>Chọn sai</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'correct' && styles.activeFilter]}
          onPress={() => setFilter('correct')}
        >
          <Text style={styles.filterText}>Chọn đúng</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Question List */}
      <ScrollView style={styles.scrollView}>
        {filteredQuestions.map((q, index) => (
          <View key={q.id} style={styles.questionItem}>
            <View style={styles.questionHeader}>
              <Text style={q.selected === q.correct ? styles.correctIcon : styles.incorrectIcon}>
                {q.selected === q.correct ? '✔' : '✘'}
              </Text>
              <Text style={styles.questionText}>{q.question}</Text>
            </View>
            <View style={styles.optionsContainer}>
              {['A', 'B', 'C', 'D'].map((option) => (
                <View
                  key={option}
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        option === q.correct
                          ? '#4CAF50'
                          : option === q.selected
                          ? '#FF6F6F'
                          : '#FFF',
                      borderColor:
                        option === q.correct || option === q.selected
                          ? option === q.correct
                            ? '#4CAF50'
                            : '#FF6F6F'
                          : '#CCC',
                    },
                  ]}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinuePress}>
        <Text style={styles.continueButtonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    marginTop: 70,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  activeFilter: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    color: '#000',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  questionItem: {
    backgroundColor: '#FFF',
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  correctIcon: {
    color: '#4CAF50',
    fontSize: 18,
    marginRight: 10,
  },
  incorrectIcon: {
    color: '#FF6F6F',
    fontSize: 18,
    marginRight: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#0099CC',
    paddingVertical: 15,
    marginHorizontal: 50,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default QuestionScreen;
