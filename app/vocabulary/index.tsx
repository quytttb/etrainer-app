import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import Header from '../../components/Header';  // Import Header
import { useRouter } from 'expo-router';  // Để điều hướng

export default function VocabularyListScreen() {
  const router = useRouter();

  // Danh sách mô tả bài học
  const lessonDescriptions = [
    "Chủ đề 1",
    "Chủ đề 2",
    "Chủ đề 3",
    "Chủ đề 4",
    "Chủ đề 5",
    "Chủ đề 6",
    "Chủ đề 7",
    "Chủ đề 8",
    "Chủ đề 9",
    "Chủ đề 10",
    "Chủ đề 11",
    "Chủ đề 12",
    "Chủ đề 13",
    "Chủ đề 14",
    "Chủ đề 15",
    "Chủ đề 16",
    "Chủ đề 17",
    "Chủ đề 18",
    "Chủ đề 19",
    "Chủ đề 20",
    "Chủ đề 21",
    "Chủ đề 22",
    "Chủ đề 23",
    "Chủ đề 24",
    "Chủ đề 25",
    "Chủ đề 26",
    "Chủ đề 27",
    "Chủ đề 28",
    "Chủ đề 29",
    "Chủ đề 30",
    "Chủ đề 31",
    "Chủ đề 32",
  ];

  // Hàm điều hướng đến trang chi tiết bài học
  const handleVocabularyPress = (lessonId: number) => {
    router.push(`/vocabulary/detail/${lessonId}`);  // Điều hướng tới trang chi tiết của bài học
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

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
    
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 19,
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
    paddingHorizontal: 20,
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