import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import FlipCard from 'react-native-flip-card';
import PlaySoundButton from '../detail/PlaySoundButton';

const FlashCardScreen = () => {
  const router = useRouter();
  const { id, words } = useLocalSearchParams();
  // Parse vocabulary from params or use default
  const vocabulary =
    words && typeof words === 'string'
      ? (() => {
          try {
            const arr = JSON.parse(words);
            return Array.isArray(arr)
              ? arr.map((item: any) => ({
                  word: item.word,
                  pronunciation: item.pronunciation || '',
                  meaning: item.meaning,
                  audio: item.audio || undefined, // Add audio property if exists
                }))
              : [];
          } catch {
            return [];
          }
        })()
      : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rightSwipeCount, setRightSwipeCount] = useState(0);
  const [leftSwipeCount, setLeftSwipeCount] = useState(0);
  const [remainingWords, setRemainingWords] = useState<number[]>([]);

  const currentCard = vocabulary[currentIndex];
  const progress = (currentIndex + 1) / (vocabulary.length || 1);

  // Swipe logic
  const handleSwipe = (direction: string) => {
    if (!vocabulary) return;
    if (currentIndex >= vocabulary.length - 1) {
      setRemainingWords(
        vocabulary
          .map((_, index) => index)
          .filter((index) => !remainingWords.includes(index) && leftSwipeCount > 0)
      );
      setCurrentIndex(vocabulary.length);
      return;
    }
    if (direction === 'right') {
      setRightSwipeCount(rightSwipeCount + 1);
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'left') {
      setLeftSwipeCount(leftSwipeCount + 1);
      setRemainingWords([...remainingWords, currentIndex]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  // PanResponder for swipe
  const swipeAnim = new Animated.Value(0);
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [null, { dx: swipeAnim }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx > 150) {
        handleSwipe('right');
      } else if (gestureState.dx < -150) {
        handleSwipe('left');
      } else {
        Animated.spring(swipeAnim, { toValue: 0, useNativeDriver: false }).start();
      }
    },
  });

  // Back
  const handleBackPress = () => {
    router.back();
  };

  // Reset
  const handleReset = () => {
    setCurrentIndex(0);
    setRightSwipeCount(0);
    setLeftSwipeCount(0);
    setRemainingWords([]);
  };

  // Continue with remaining words
  const handleContinue = () => {
    if (remainingWords.length > 0) {
      setCurrentIndex(0);
      setRightSwipeCount(0);
      setLeftSwipeCount(0);
      setRemainingWords([]);
    }
  };

  // End of cards
  if (currentIndex >= vocabulary.length) {
    if (leftSwipeCount === 0) {
      return (
        <View style={styles.container}>
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
            onPress={handleContinue}
          >
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
  }

  // Nếu không có từ vựng, hiển thị thông báo
  if (!currentCard) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={router.back} style={styles.backButton}>
            <FontAwesome name="chevron-left" size={30} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.flashCardContainer}>
          <Text style={styles.word}>Không có dữ liệu từ vựng.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.flashCardContainer}>
        <FlipCard
          {...panResponder.panHandlers}
          flip={isFlipped}
          friction={6}
          perspective={1000}
          flipHorizontal={true}
          flipVertical={false}
          clickable={true}
          onFlipEnd={() => {}}
        >
          {/* Front Side */}
          <TouchableOpacity
            style={styles.flashCard}
            onPress={() => setIsFlipped((prev) => !prev)}
            activeOpacity={1}
          >
            <View style={{ alignItems: 'center', width: '100%' }}>
              <Text style={styles.word}>{currentCard.word}</Text>
              <Text style={styles.pronunciation}>{currentCard.pronunciation}</Text>
              <View style={{ marginTop: 16 }}>
                <PlaySoundButton
                  audioUrl={
                    currentCard.word
                      ? (
                        currentCard.audio?.url // Nếu có url audio từ API thì ưu tiên dùng
                          ? currentCard.audio.url
                          : `https://api.dictionaryapi.dev/media/pronunciations/en/${currentCard.word.toLowerCase().replace(/[^a-z]/g, '')}.mp3`
                        )
                      : ''
                  }
                />
              </View>
            </View>
          </TouchableOpacity>
          {/* Back Side */}
          <TouchableOpacity
            style={styles.flashCard}
            onPress={() => setIsFlipped((prev) => !prev)}
            activeOpacity={1}
          >
            <Text style={styles.meaning}>{currentCard.meaning}</Text>
          </TouchableOpacity>
        </FlipCard>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
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
    padding: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
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