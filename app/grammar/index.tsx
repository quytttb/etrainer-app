import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import Header from '../../components/Header';  
import { useRouter } from 'expo-router';  

export default function GrammarListScreen() {
  const router = useRouter();

  // Danh sách mô tả bài học
  const lessonDescriptions: string[] = [
    "Ngữ pháp 1",
    "Ngữ pháp 2",
    "Ngữ pháp 3",
    "Ngữ pháp 4",
  ];

  // Hàm điều hướng đến trang chi tiết bài học
  const handleGrammarPress = (lessonId: number) => {
    router.push(`/grammar/detail/${lessonId}`);  // Điều hướng tới trang chi tiết của bài học
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Header title="Ngữ pháp TOIEC" onBackPress={() => router.back()} />

      {/* Nội dung của trang */}
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/vocabulary.png')} style={styles.headerImage} />
        <Text style={styles.headerText}>Ngữ pháp TOIEC</Text>
      </View>

      {/* Danh sách bài học */}
      <View style={styles.lessonGrid}>
        {[...Array(4)].map((_, index) => {
          const lessonId = index + 1;
          return (
            <TouchableOpacity
              key={lessonId}
              style={styles.lessonCard}
              onPress={() => handleGrammarPress(lessonId)}  // Gọi hàm và truyền lessonId
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
    marginBottom: 25,
    marginLeft: 80,
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
    marginStart: 11,
    borderRadius: 10,
    alignItems: 'center',
    width: '21%',
    marginBottom: 20,
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