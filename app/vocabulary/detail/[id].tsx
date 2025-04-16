import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams } from 'expo-router';
import Header from '../../../components/Header';

export default function VocabularyDetailScreen() {
  const { id } = useLocalSearchParams();  // Lấy id của bài học từ URL (id sẽ được truyền khi nhấn vào bài học trong màn hình trước)
  const parsedId = Number(id);  // Chuyển đổi id từ string sang number

  // Dữ liệu mô phỏng cho các bài học
  const vocabularyData: { [key: number]: { word: string; pronunciation: string; meaning: string; }[] } = {
    1: [
      { word: "New", pronunciation: "/ˈnjuː/", meaning: "Mới" },
      { word: "Company", pronunciation: "/ˈkʌmpəni/", meaning: "Công ty" },
      { word: "Mr.", pronunciation: "/ˈmɪstər/", meaning: "Ông" },
      { word: "Year", pronunciation: "/jɪər/", meaning: "Năm" },
      { word: "Service", pronunciation: "/ˈsɜːvɪs/", meaning: "Dịch vụ" },
      { word: "Travel", pronunciation: "/ˈtrævl/", meaning: "Du lịch" },
      { word: "Flight", pronunciation: "/flaɪt/", meaning: "Chuyến bay" },
      { word: "Airport", pronunciation: "/ˈɛəpɔːt/", meaning: "Sân bay" },
      { word: "Hotel", pronunciation: "/həʊˈtɛl/", meaning: "Khách sạn" },
      { word: "Tourist", pronunciation: "/ˈtʊərɪst/", meaning: "Du khách" },
    ],
    2: [
      { word: "Travel", pronunciation: "/ˈtrævl/", meaning: "Du lịch" },
      { word: "Flight", pronunciation: "/flaɪt/", meaning: "Chuyến bay" },
      { word: "Airport", pronunciation: "/ˈɛəpɔːt/", meaning: "Sân bay" },
      { word: "Hotel", pronunciation: "/həʊˈtɛl/", meaning: "Khách sạn" },
      { word: "Tourist", pronunciation: "/ˈtʊərɪst/", meaning: "Du khách" },
    ],
  };

  const lessonData = vocabularyData[parsedId];  // Dựa vào id bài học lấy dữ liệu từ vựng

  const handleCheckPress = () => {
    console.log('Check button pressed');
  };

  // Hàm xử lý khi nhấn vào một box (nút)
  const handleBoxPress = (boxName: string) => {
    console.log(`${boxName} clicked`);
    // Thêm hành động cần thiết khi nhấn vào các box này
  };

  return (
    <View style={styles.container}>
      {/* Header không cuộn */}
      <Header title={`Từ vựng ${id}`} />

      {/* Nội dung chính cuộn xuống */}
      <ScrollView style={styles.content}>
        {/* Các hộp "Ghép từ", "Chọn từ", và "Flatcase" */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.box}
            onPress={() => handleBoxPress("Ghép từ")}
          >
            <Text style={styles.boxText}>Ghép từ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box}
            onPress={() => handleBoxPress("Chọn từ")}
          >
            <Text style={styles.boxText}>Chọn từ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box}
            onPress={() => handleBoxPress("FlashCard")}
          >
            <Text style={styles.boxText}>FlashCard</Text>
          </TouchableOpacity>
        </View>

        {/* Nội dung từ vựng */}
        {lessonData ? (
          <View style={styles.vocabularyList}>
            {lessonData.map((item, index) => (
              <View key={index} style={styles.wordItemContainer}>
                {/* Biểu tượng loa bên trái */}
                <FontAwesome name="volume-up" size={20} color="#fff" style={styles.iconLeft} />
                
                {/* Từ vựng */}
                <Text style={styles.vocabularyItem}>{item.word}</Text>

                {/* Phát âm dưới từ vựng */}
                <Text style={styles.pronunciation}>{item.pronunciation}</Text>

                {/* Biểu tượng sao ở góc trên bên phải */}
                <AntDesign name="staro" size={20} color="#FFD700" style={styles.iconRight} />

                {/* Nghĩa của từ */}
                <Text style={styles.meaning}>{item.meaning}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>Không có dữ liệu bài học này.</Text>
        )}

        {/* Nút "Kiểm tra" */}
        <TouchableOpacity style={styles.checkButton} onPress={handleCheckPress}>
          <Text style={styles.checkButtonText}>Kiểm tra</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    flex: 1,
    paddingTop: 60, // Thêm khoảng cách cho phần cuộn xuống
  },
  vocabularyList: {
    marginTop: 20,
    padding: 20,
  },
  wordItemContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    position: 'relative',
  },
  vocabularyItem: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pronunciation: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  iconLeft: {
    position: 'absolute',
    left: 15,  
    top: 30,  
    backgroundColor: '#00BFAE',  
    borderRadius: 25,  
    padding: 8,  
  },
  iconRight: {
    position: 'absolute',
    right: 10,  
    top: 10, 
  },
  meaning: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
  },
  noDataText: {
    fontSize: 18,
    color: '#f00',
    textAlign: 'center',
    marginTop: 20,
  },
  checkButton: {
    backgroundColor: '#00BFAE',
    paddingVertical: 15,
    marginHorizontal: 50,
    borderRadius: 30,
    marginTop: 5,
    marginBottom: 100,
    alignItems: 'center',
  },
  checkButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20, 
    marginHorizontal: 20,
  },
  box: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#00BFAE',
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
  },
  boxText: {
    fontSize: 14,
    color: '#00BFAE',
    fontWeight: 'bold',
    width: '150%',
    textAlign: 'center',
  },
});
