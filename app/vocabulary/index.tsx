import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import Header from '../../components/Header';  // Import Header
import { useRouter } from 'expo-router';  // Để điều hướng

export default function VocabularyListScreen() {
  const router = useRouter();

  // Danh sách mô tả bài học
  const lessonDescriptions = [
    "Mô tả bài học 1",
    "Mô tả bài học 2",
    "Mô tả bài học 3",
    "Mô tả bài học 4",
    "Mô tả bài học 5",
    "Mô tả bài học 6",
    "Mô tả bài học 7",
    "Mô tả bài học 8",
    "Mô tả bài học 9",
    "Mô tả bài học 10",
    "Mô tả bài học 11",
    "Mô tả bài học 12",
    "Mô tả bài học 13",
    "Mô tả bài học 14",
    "Mô tả bài học 15",
    "Mô tả bài học 16",
    "Mô tả bài học 17",
    "Mô tả bài học 18",
    "Mô tả bài học 19",
    "Mô tả bài học 20",
    "Mô tả bài học 21",
    "Mô tả bài học 22",
    "Mô tả bài học 23",
    "Mô tả bài học 24",
    "Mô tả bài học 25",
    "Mô tả bài học 26",
    "Mô tả bài học 27",
    "Mô tả bài học 28",
    "Mô tả bài học 29",
    "Mô tả bài học 30",
    "Mô tả bài học 31",
    "Mô tả bài học 32",
    "Mô tả bài học 33",
    "Mô tả bài học 34",
    "Mô tả bài học 35",
    "Mô tả bài học 36",
  ];

  // Hàm điều hướng đến trang chi tiết bài học
  const handleVocabularyPress = (lessonId: number) => {
    router.push(`/vocabulary/detail/${lessonId}`);  // Điều hướng tới trang chi tiết của bài học
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Truyền tiêu đề cho Header */}
      <Header title="Từ vựng TOIEC" />

      {/* Nội dung của trang */}
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/vocabulary.png')} style={styles.headerImage} />
        <Text style={styles.headerText}>Từ vựng TOIEC theo các chủ đề</Text>
      </View>

      {/* Danh sách bài học */}
      <View style={styles.lessonGrid}>
        {[...Array(36)].map((_, index) => {
          const lessonId = index + 1;
          return (
            <TouchableOpacity
              key={lessonId}
              style={styles.lessonCard}
              onPress={() => handleVocabularyPress(lessonId)}  // Gọi hàm và truyền lessonId
            >
              <Image source={require('../../assets/images/vocabulary.png')} style={styles.lessonIcon} />
              <Text style={styles.lessonText}>Bài {lessonId}</Text>
              <Text style={styles.lessonSubText}>{lessonDescriptions[lessonId - 1]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 80,  
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    padding: 20,
    backgroundColor: '#ffffff',  
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00BFAE',  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative',
  },
  headerImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  lessonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  lessonCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '21%',
    marginBottom: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative',
  },
  lessonIcon: {
    width: 30,
    height: 30,
  },
  lessonText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',
    width: '150%',
    top: 70,
    left: '220%',
    transform: [{ translateX: -50 }], 
    color: '#000000',
  },
  lessonSubText: {
    marginTop: 5,
    fontSize: 14,
    position: 'absolute',
    width: '200%',
    top: 90,
    left: '170%',
    transform: [{ translateX: -50 }], 
    color: '#000000',
    textAlign: 'center',
  },
});