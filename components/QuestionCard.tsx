import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import PropTypes from 'prop-types';

const QuestionCardPropTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedAnswer: PropTypes.string,
  onSelectAnswer: PropTypes.func.isRequired,
};

interface QuestionCardProps {
  question: string;
  options: string[];
  selectedAnswer?: string;
  onSelectAnswer: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, options, selectedAnswer, onSelectAnswer }) => {
  return (
    <View style={[styles.card, styles.sectionBorder]}>
      <Text style={styles.questionText}>{question}</Text>  {/* Hiển thị câu hỏi */}
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.option, selectedAnswer === option && styles.selectedOption]}
          onPress={() => onSelectAnswer(option)}
        >
          <View style={[styles.radioButton, selectedAnswer === option && styles.selectedRadioButton]}>
            {selectedAnswer === option && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  selectedRadioButton: {
    backgroundColor: '#4CAF50',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  sectionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 15,
  },
});
export default QuestionCard;