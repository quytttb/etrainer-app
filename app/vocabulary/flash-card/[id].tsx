import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import FlipCard from 'react-native-flip-card'; // Import FlipCard

const FlashCardScreen = () => {
  const { id } = useLocalSearchParams(); // Lấy id của chủ đề từ URL
  const parsedId = Number(id); // Chuyển đổi id thành số
  const [currentIndex, setCurrentIndex] = useState(0); // Lưu chỉ số của từ vựng hiện tại
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null); // Lưu hướng quẹt
  const [showAnswer, setShowAnswer] = useState(false); // Kiểm tra xem có hiện nghĩa từ hay không
  const [rightSwipeCount, setRightSwipeCount] = useState(0); // Số lượng quẹt phải (Đã hiểu)
  const [leftSwipeCount, setLeftSwipeCount] = useState(0); // Số lượng quẹt trái (Cần học thêm)
  const [isFlipped, setIsFlipped] = useState(false); // State to track flip state
  const [remainingWords, setRemainingWords] = useState<number[]>([]); // Track words marked as "Cần học thêm"

  // Dữ liệu từ vựng giả lập cho các chủ đề
  const vocabularyData: { [key: number]: { word: string; pronunciation: string; meaning: string; }[] } = {
    1: [
      { word: 'New', pronunciation: '/nju:/', meaning: 'Mới' },
      { word: 'Company', pronunciation: '/ˈkʌmpəni/', meaning: 'Công ty' },
      { word: 'Mr.', pronunciation: '/ˈmɪstər/', meaning: 'Ông' },
      { word: 'Year', pronunciation: '/jɪər/', meaning: 'Năm' },
      { word: 'Service', pronunciation: '/ˈsɜːvɪs/', meaning: 'Dịch vụ' },
    ],
    2: [
      { word: 'Travel', pronunciation: '/ˈtrævl/', meaning: 'Du lịch' },
      { word: 'Flight', pronunciation: '/flaɪt/', meaning: 'Chuyến bay' },
      { word: 'Airport', pronunciation: '/ˈɛəpɔːt/', meaning: 'Sân bay' },
      { word: 'Hotel', pronunciation: '/həʊˈtɛl/', meaning: 'Khách sạn' },
      { word: 'Tourist', pronunciation: '/ˈtʊərɪst/', meaning: 'Du khách' },
    ],
  };

  const currentCard = vocabularyData[parsedId] && vocabularyData[parsedId][currentIndex];
  const progress = (currentIndex + 1) / (vocabularyData[parsedId]?.length || 1); // Calculate progress

  const handleReset = () => {
    setCurrentIndex(0); // Reset to the first word
    setRightSwipeCount(0); // Reset "Đã hiểu" count
    setLeftSwipeCount(0); // Reset "Cần học thêm" count
    setRemainingWords([]); // Clear remaining words
  };

  const handleContinue = () => {
    if (remainingWords.length > 0) {
      const filteredVocabulary = remainingWords.map((index) => vocabularyData[parsedId][index]);
      vocabularyData[parsedId] = filteredVocabulary; // Update vocabulary data to only include remaining words
      setCurrentIndex(0); // Start from the first remaining word
      setRightSwipeCount(0); // Reset "Đã hiểu" count
      setLeftSwipeCount(0); // Reset "Cần học thêm" count
      setRemainingWords([]); // Clear remaining words
    }
  };

  // Hàm xử lý quẹt thẻ
  const scaleAnim = new Animated.Value(1);
  const handleSwipe = (direction: string) => {
    if (!vocabularyData[parsedId]) return;

    if (currentIndex >= vocabularyData[parsedId].length - 1) {
      setRemainingWords(
        vocabularyData[parsedId]
          .map((_, index) => index)
          .filter((index) => !remainingWords.includes(index) && leftSwipeCount > 0)
      ); // Track words marked as "Cần học thêm"
      setCurrentIndex(vocabularyData[parsedId].length); // Show final card
      return;
    }

    Animated.timing(scaleAnim, {
      toValue: 1.1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      if (direction === 'right') {
        setSwipeDirection('right');
        setRightSwipeCount(rightSwipeCount + 1);
        setCurrentIndex(currentIndex + 1);
      } else if (direction === 'left') {
        setSwipeDirection('left');
        setLeftSwipeCount(leftSwipeCount + 1);
        setRemainingWords([...remainingWords, currentIndex]); // Add to remaining words
        setCurrentIndex(currentIndex + 1);
      }
    });
  };

  // Tạo động tác quẹt với PanResponder
  const swipeAnim = new Animated.Value(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [null, { dx: swipeAnim }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx > 150) {
        handleSwipe('right'); // Quẹt phải
      } else if (gestureState.dx < -150) {
        handleSwipe('left'); // Quẹt trái
      } else {
        Animated.spring(swipeAnim, { toValue: 0, useNativeDriver: false }).start(); // Quay lại vị trí ban đầu
      }
    },
  });

  // Hàm quay lại trang trước
  const router = useRouter();
  const handleBackPress = () => {
    router.back(); // Quay lại trang trước khi bạn nhấn Flash Card
  };

   // Play pronunciation
   const playPronunciation = async () => {
    if (currentCard?.word) {
      try {
        const sound = new Audio.Sound();
        await sound.loadAsync({ uri: `https://api.dictionaryapi.dev/media/pronunciations/en/${currentCard.word}.mp3` });
        await sound.playAsync();
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  };

  // Hiển thị thẻ cuối khi học xong
  if (currentIndex >= vocabularyData[parsedId]?.length) {
    if (leftSwipeCount === 0) {
      // Show congratulatory card if all words are marked as "Đã hiểu"
      return (
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <FontAwesome name="chevron-left" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.flashCardContainer}>
            <View style={styles.flashCard}>
              <Text style={styles.word}>Bạn làm tốt lắm!</Text>
            </View>
            <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF5722', width: '60%' }]}
              onPress={handleReset} 
            >
              <Text style={styles.buttonText}>Làm mới</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <FontAwesome name="chevron-left" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.flashCardContainer}>
          <View style={styles.flashCard}>
            <Text style={styles.word}>Bạn vừa học {rightSwipeCount} từ vựng.</Text>
            <Text style={styles.meaning}>
              Hãy tiếp tục luyện tập để thành thạo {leftSwipeCount} từ vựng còn lại nhé!
            </Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
            onPress={handleContinue}           >
            <Text style={styles.buttonText}>Tiếp tục</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FF5722' }]}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>Làm mới</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Flashcard */}
      <View style={styles.flashCardContainer}>
        <FlipCard
          {...panResponder.panHandlers} 
          flip={isFlipped}
          friction={6}
          perspective={1000}
          flipHorizontal={true}
          flipVertical={false}
          clickable={true}
          onFlipEnd={() => setShowAnswer(!showAnswer)}
        >
          {/* Front Side */}
          <TouchableOpacity
            style={styles.flashCard} 
            onPress={() => setIsFlipped(!isFlipped)} 
          >
            <Text style={styles.word}>{currentCard?.word}</Text>
            <Text style={styles.pronunciation}>{currentCard?.pronunciation}</Text>
            <TouchableOpacity
              style={styles.speakerButton}
              onPress={playPronunciation}
            >
              <FontAwesome name="volume-up" size={20} color="#00BFAE" />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Back Side */}
          <TouchableOpacity
            style={styles.flashCard} 
            onPress={() => setIsFlipped(!isFlipped)} 
          >
            <Text style={styles.meaning}>{currentCard?.meaning}</Text>
          </TouchableOpacity>
        </FlipCard>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttons}>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FF5722' }]}
            onPress={() => handleSwipe('left')}
          >
            <Text style={styles.buttonText}>Cần học thêm ({leftSwipeCount})</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => handleSwipe('right')}
          >
            <Text style={styles.buttonText}>Đã hiểu ({rightSwipeCount})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 20,
  },
  backButton: {
    padding: 10,
  },
  flashCardContainer: {
    flex: 1, 
    width: '100%',
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    
  },
  flashCard: {
    width: '100%',
    height: 500, 
    borderRadius: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding:80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  flashCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  word: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center', 
    flexShrink: 1, 
    flexGrow: 0, 
  },
  pronunciation: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center', 
    marginTop: 10,
    flexShrink: 1, 
    flexGrow: 0, 
  },
  meaning: {
    fontSize: 16,
    color: '#555',
    marginTop: 20,
    textAlign: 'center', 
    flexShrink: 1, 
    flexGrow: 0, 
  },
  toggleButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  speakerButton: {
    position: 'absolute',
    top: 15,
    right: 20,
  },
  progressBarContainer: {
    height: 5,
    width: '90%',
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 20,
  },
  actionButtonContainer: {
    width: '45%',
  },
  actionButton: {
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default FlashCardScreen;