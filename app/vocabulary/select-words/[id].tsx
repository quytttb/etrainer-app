import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams for dynamic routing

const SelectWordsScreen = () => {
  const router = useRouter(); // Initialize router for navigation
  const { id, words } = useLocalSearchParams(); // Get the topic ID and words from the route parameters
  const [currentQuestion, setCurrentQuestion] = useState(0); // Start from the first question
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false); // Track if correct answer should be shown
  const [isPaused, setIsPaused] = useState(false); // Track if the game is paused

  // If words data is available, create dynamic questions, otherwise use default questions
  const questions =
    words && typeof words === 'string'
      ? (() => {
          try {
            const arr = JSON.parse(words);
            return Array.isArray(arr)
              ? arr.map((item: any, idx: number) => {
                  // Lấy các từ khác làm đáp án nhiễu
                  const distractors = arr
                    .filter((other: any, i: number) => i !== idx)
                    .map((other: any) => other.word)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);
                  // Trộn đáp án đúng vào vị trí ngẫu nhiên
                  const options = [...distractors, item.word].sort(() => Math.random() - 0.5);
                  const correctAnswer = options.indexOf(item.word);
                  return {
                    text: item.meaning,
                    options,
                    correctAnswer,
                  };
                })
              : [];
          } catch {
            return [];
          }
        })()
      : [
          {
            text: 'đề nghị (v)',
            options: ['offer', 'advertisement', 'reserve', 'finance'],
            correctAnswer: 0,
          },
          {
            text: 'khách hàng (n)',
            options: ['customer', 'manager', 'employee', 'supplier'],
            correctAnswer: 0,
          },
          {
            text: 'dịch vụ (n)',
            options: ['service', 'product', 'price', 'quality'],
            correctAnswer: 0,
          },
          {
            text: 'giảm giá (n-v)',
            options: ['discount', 'increase', 'promotion', 'sale'],
            correctAnswer: 0,
          },
          {
            text: 'sản phẩm (n)',
            options: ['product', 'service', 'delivery', 'price'],
            correctAnswer: 0,
          },
        ];

  const totalQuestions = questions.length;

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowCorrectAnswer(true); // Show correct and incorrect answers
  };

  const handleContinue = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null); // Reset selected answer
      setShowCorrectAnswer(false); // Reset correct answer visibility
    } else {
      router.push(`/vocabulary/detail/${id}`); // Navigate back to the vocabulary topic detail page
    }
  };

  const handlePause = () => {
    setIsPaused(true); // Show the pause popup
  };

  const handleResume = () => {
    setIsPaused(false); // Close the pause popup
  };

  return (
    <View style={styles.container}>
      {/* Pause Popup */}
      <Modal visible={isPaused} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={require('../../../assets/images/headphones.png')} // Replace with your image path
              style={styles.modalImage}
            />
            <Text style={styles.modalText}>Bạn có muốn tiếp tục?</Text>
            <TouchableOpacity style={styles.continueButton} onPress={handleResume}>
              <Text style={styles.continueButtonText}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconContainer} onPress={handlePause}>
          <FontAwesome name="pause" size={20} color="#000" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentQuestion + 1}/{totalQuestions}
          </Text>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBar,
                { width: `${((currentQuestion + 1) / totalQuestions) * 100}%` },
              ]}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => router.push(`/vocabulary/detail/${id}`)} // Navigate back to the vocabulary topic detail page
        >
          <FontAwesome name="close" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Question */}
      <Text style={styles.questionTitle}>Chọn đáp án đúng</Text>
      <Text style={styles.questionText}>{questions[currentQuestion].text}</Text>

      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        {questions[currentQuestion].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedAnswer === index && showCorrectAnswer && index === questions[currentQuestion].correctAnswer && styles.correctOption, // Highlight correct answer
              selectedAnswer === index && showCorrectAnswer && index !== questions[currentQuestion].correctAnswer && styles.incorrectOption, // Highlight incorrect answer
              showCorrectAnswer && index === questions[currentQuestion].correctAnswer && styles.correctOption, // Always highlight correct answer
            ]}
            onPress={() => handleAnswerSelect(index)}
            disabled={showCorrectAnswer} // Disable options after selecting an answer
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedAnswer !== null && styles.nextButtonActive,
        ]}
        onPress={selectedAnswer !== null ? handleContinue : undefined}
      >
        <Text style={styles.nextButtonText}>
          {currentQuestion === totalQuestions - 1 ? 'Hoàn thành' : 'Tiếp tục'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically in the center
    justifyContent: 'space-between', // Distribute space evenly
    marginBottom: 20,
  },
  iconContainer: {
    width: 30, // Ensure consistent width for icons
    alignItems: 'center', // Center the icon horizontally
  },
  progressContainer: {
    flex: 1, // Take up remaining space between icons
    marginHorizontal: 10,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
  progressBarBackground: {
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedOption: {
    backgroundColor: '#E0E0E0',
  },
  correctOption: {
    backgroundColor: '#c1f3da',
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#FF6A6A',
  },
  optionText: {
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#B0B0B0',
    marginLeft: 40,
    width: '80%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 280,
  },
  nextButtonActive: {
    backgroundColor: '#00BFAE',
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: 70,
    height: 70,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#00BFAE',
    paddingVertical: 10,
    paddingHorizontal: 90,
    borderRadius: 20,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SelectWordsScreen;
