import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Animated } from 'react-native'; // Import Animated for shake effect
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter for navigation

const GraftScreen = () => {
  const router = useRouter(); // Initialize router for navigation
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ id: number; word: string; meaning: string }[]>([]);
  const [shuffledMeanings, setShuffledMeanings] = useState<{ id: number; word: string; meaning: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current index of the vocabulary list
  const [currentSet, setCurrentSet] = useState(1); // Track the current set number
  const [isPaused, setIsPaused] = useState(false); // Track if the game is paused
  const [shakeAnimation] = useState(new Animated.Value(0)); // Shake animation value
  const [incorrectCards, setIncorrectCards] = useState<{ word: number | null; meaning: number | null }>({
    word: null,
    meaning: null,
  }); // Track incorrect matches

  const vocabulary = [
    { id: 1, word: 'local', meaning: 'địa phương (adj)' },
    { id: 2, word: 'sales', meaning: 'bán hàng (n)' },
    { id: 3, word: 'position', meaning: 'vị trí (n)' },
    { id: 4, word: 'discount', meaning: 'giảm giá (n-v)' },
    { id: 5, word: 'customer', meaning: 'khách hàng (n)' },
    { id: 6, word: 'service', meaning: 'dịch vụ (n)' },
    { id: 7, word: 'price', meaning: 'giá cả (n)' },
    { id: 8, word: 'quality', meaning: 'chất lượng (n)' },
    { id: 9, word: 'delivery', meaning: 'giao hàng (n)' },
    { id: 10, word: 'product', meaning: 'sản phẩm (n)' },
  ];

  const totalSets = Math.ceil(vocabulary.length / 5); // Calculate total sets

  const loadNextSet = () => {
    const nextIndex = currentIndex + 5;
    if (nextIndex < vocabulary.length) {
      const nextSet = vocabulary.slice(nextIndex, nextIndex + 5);
      setMatchedPairs([]);
      setShuffledMeanings([...nextSet].sort(() => Math.random() - 0.5));
      setCurrentIndex(nextIndex);
      setCurrentSet(currentSet + 1);
    } else {
      // Navigate back to the vocabulary page after completing all sets
      router.push('/vocabulary');
    }
  };

  useEffect(() => {
    const initialSet = vocabulary.slice(0, 5);
    setShuffledMeanings([...initialSet].sort(() => Math.random() - 0.5));
    setMatchedPairs([]); 
  }, []);

  // Dynamically calculate progress width
  const progressWidth = (matchedPairs.length / 5) * 100;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleWordSelect = (id: number) => {
    setSelectedWord(id);
    if (selectedMeaning !== null) {
      if (selectedMeaning === id) {
        const matchedItem = vocabulary.find((item) => item.id === id);
        if (matchedItem) {
          setMatchedPairs([...matchedPairs, matchedItem]);
          setShuffledMeanings(shuffledMeanings.filter((item) => item.id !== id));
        }
      } else {
        setIncorrectCards({ word: id, meaning: selectedMeaning }); 
        triggerShake(); // Trigger shake animation for incorrect match
        setTimeout(() => {
          setIncorrectCards({ word: null, meaning: null }); 
        }, 100);
      }
      setSelectedWord(null);
      setSelectedMeaning(null);
    }
  };

  const handleMeaningSelect = (id: number) => {
    setSelectedMeaning(id);
    if (selectedWord !== null) {
      if (selectedWord === id) {
        const matchedItem = vocabulary.find((item) => item.id === id);
        if (matchedItem) {
          setMatchedPairs([...matchedPairs, matchedItem]);
          setShuffledMeanings(shuffledMeanings.filter((item) => item.id !== id));
        }
      } else {
        setIncorrectCards({ word: selectedWord, meaning: id }); 
        triggerShake(); // Trigger shake animation for incorrect match
        setTimeout(() => {
          setIncorrectCards({ word: null, meaning: null });
        }, 1000);
      }
      setSelectedWord(null);
      setSelectedMeaning(null);
    }
  };

  const handlePause = () => {
    setIsPaused(true); // Show the pause popup
  };

  const handleContinue = () => {
    setIsPaused(false); // Close the pause popup
  };

  const handleClose = () => {
    router.push(`/vocabulary/detail/${currentIndex / 5 + 1}`); 
  };

  return (
    <View style={styles.container}>
      {/* Pause Popup */}
      <Modal visible={isPaused} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={require('../../../assets/images/headphones.png')} // Adjusted path to match the correct location
              style={styles.modalImage}
            />
            <Text style={styles.modalText}>Bạn có muốn tiếp tục?</Text>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.progress}>
          {currentSet}/{totalSets} {/* Update progress dynamically for the current set */}
        </Text>
        <View style={styles.row}>
          <TouchableOpacity onPress={handlePause}>
            <FontAwesome name="pause" size={20} color="#000" />
          </TouchableOpacity>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${progressWidth}%` }, // Use calculated progress width
              ]}
            />
          </View>
          <TouchableOpacity onPress={handleClose}>
            <FontAwesome name="close" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Ghép cặp từ - Định nghĩa</Text>

      {/* Matched Cards */}
      <View style={styles.matchedContainer}>
        {matchedPairs.map((pair) => (
          <View key={pair.id} style={styles.matchedCard}>
            <Text style={styles.matchedText}>{pair.word}: {pair.meaning}</Text>
          </View>
        ))}
      </View>

      {/* Words and Meanings */}
      <View style={styles.columnsContainer}>
        {/* Words Column */}
        <View style={styles.column}>
          {vocabulary
            .slice(currentIndex, currentIndex + 5)
            .filter((item) => !matchedPairs.some((pair) => pair.id === item.id))
            .map((item) => (
              <Animated.View
                key={item.id}
                style={[
                  styles.card,
                  selectedWord === item.id && styles.selectedCard,
                  incorrectCards.word === item.id && styles.incorrectCard, // Highlight incorrect card
                  { transform: [{ translateX: incorrectCards.word === item.id ? shakeAnimation : 0 }] }, // Apply shake animation
                ]}
              >
                <TouchableOpacity onPress={() => handleWordSelect(item.id)}>
                  <Text style={styles.cardText}>{item.word}</Text> {/* Ensure text is wrapped */}
                </TouchableOpacity>
              </Animated.View>
            ))}
        </View>

        {/* Meanings Column */}
        <View style={styles.column}>
          {shuffledMeanings.map((item) => (
            <Animated.View
              key={item.id}
              style={[
                styles.card,
                selectedMeaning === item.id && styles.selectedCard,
                incorrectCards.meaning === item.id && styles.incorrectCard, // Highlight incorrect card
                { transform: [{ translateX: incorrectCards.meaning === item.id ? shakeAnimation : 0 }] }, // Apply shake animation
              ]}
            >
              <TouchableOpacity onPress={() => handleMeaningSelect(item.id)}>
                <Text style={styles.cardText}>{item.meaning}</Text> {/* Ensure text is wrapped */}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Next Button */}
      <View style={styles.nextButtonContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            matchedPairs.length === 5 && styles.nextButtonActive, // Change color when all matched
          ]}
          onPress={matchedPairs.length === 5 ? loadNextSet : undefined} // Enable only when all matched
        >
          <Text style={styles.nextButtonText}>
            {currentSet === totalSets ? 'Hoàn thành' : 'Tiếp theo'} {/* Update button text */}
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progress: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10,
  },
  progressBar: {
    height: '80%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  matchedContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  matchedCard: {
    backgroundColor: '#D4EDDA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
  },
  matchedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    minHeight: 95, 
  },
  selectedCard: {
    backgroundColor: '#E0E0E0',
  },
  incorrectCard: {
    backgroundColor: '#E0E0E0', 
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
    flexWrap: 'wrap', 
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#B0B0B0', 
    paddingVertical: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
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

export default GraftScreen;
