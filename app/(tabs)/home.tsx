import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Header from '../../components/Home/Header'; 

export default function HomeScreen() {
  const router = useRouter();
  const [username, setUsername] = useState<string>(''); // Tên người dùng
  const [lessons, setLessons] = useState<any[]>([]);  // Danh sách bài luyện nghe và luyện đọc
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [activeTab, setActiveTab] = useState('practice'); // Tab trạng thái mặc định

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Kiểm tra token trong AsyncStorage
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          // Nếu không có token, điều hướng về trang đăng nhập
          router.replace('/auth/login');
          return;
        }
        setIsLoggedIn(true); // Nếu có token, người dùng đã đăng nhập

        // Lấy tên người dùng từ AsyncStorage
        const storedName = await AsyncStorage.getItem('name');
        setUsername(storedName || 'Guest');  // Nếu không có tên, đặt là 'Guest'

        // Gọi API để lấy dữ liệu bài luyện nghe và luyện đọc
        const response = await axios.get<any[]>('http://197.187.3.101:8080/api/lessons');
        setLessons(response.data);  // Lưu dữ liệu bài học vào state
      } catch (error) {
        console.error('Error checking login status or fetching lessons:', error);
      }
    };

    checkLoginStatus();
  }, []);

  // Kiểm tra điều hướng nếu chưa đăng nhập
  if (!isLoggedIn) {
    return null; // Không hiển thị gì nếu chưa đăng nhập
  }

  const handlePartPress = (partId: string): void => {
    router.push(`/exam/list/${partId}`);
  };

  const handleVocaPress = (Id: string): void => {
    router.push(`/vocabulary`);
  };

  const handleGramPress = (Id: string): void => {
    router.push(`/grammar`);
  };

  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, không hiển thị nội dung
    return null;
  }

  function handleTabChange(tab: string) {
    setActiveTab(tab);
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Header />
      
      {/* Luyện nghe Section */}
      <View style={styles.lessonSection}>
        <Text style={styles.sectionTitle}>Luyện nghe</Text>
      </View>
      <View style={styles.lessonList}>
        <TouchableOpacity style={styles.lessonCard} onPress={() => handlePartPress('part1')}>
          <Image source={require('../../assets/images/image_icon.png')} style={styles.lessonIcon} />
          <Text style={styles.lessonText}>Part 1</Text>
          <Text style={styles.lessonText2}>Mô tả hình ảnh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.lessonCard} onPress={() => handlePartPress('part2')}>
          <Image source={require('../../assets/images/qa.png')} style={styles.lessonIcon} />
          <Text style={styles.lessonText}>Part 2</Text>
          <Text style={styles.lessonText2}>Hỏi và đáp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.lessonCard} onPress={() => handlePartPress('part3')}>
          <Image source={require('../../assets/images/chat.png')} style={styles.lessonIcon} />
          <Text style={styles.lessonText}>Part 3</Text>
          <Text style={styles.lessonText2}>Đoạn hội thoại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.lessonCard} onPress={() => handlePartPress('part4')}>
          <Image source={require('../../assets/images/headphones.png')} style={styles.lessonIcon} />
          <Text style={styles.lessonText}>Part 4</Text>
          <Text style={styles.lessonText2}>Bài nói chuyện ngắn</Text>
        </TouchableOpacity>
      </View>

      {/* Luyện đọc Section */}
      <View style={styles.lessonSection}>
        <Text style={styles.sectionTitle}>Luyện đọc</Text>
      </View>
      <View style={styles.lessonList}>
        <TouchableOpacity style={styles.lessonCard} onPress={() => handlePartPress('part5')}>
          <Image source={require('../../assets/images/vocabulary.png')} style={styles.lessonIcon} />
          <Text style={styles.lessonText}>Part 5</Text>
          <Text style={styles.lessonText2}>Điền vào câu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.lessonCard} onPress={() => handlePartPress('part6')}>
          <Image source={require('../../assets/images/form.png')} style={styles.lessonIcon} />
          <Text style={styles.lessonText}>Part 6</Text>
          <Text style={styles.lessonText2}>Điền vào đoạn văn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.lessonCard} onPress={() => handlePartPress('part7')}>
          <Image source={require('../../assets/images/voca_icon.png')} style={styles.lessonIcon} />
          <Text style={styles.lessonText}>Part 7</Text>
          <Text style={styles.lessonText2}>Đọc hiểu đoạn văn</Text>
        </TouchableOpacity>
      </View>

      {/* Lý thuyết Section */}
      <View style={styles.lessonSection}>
        <Text style={styles.sectionTitle}>Lý thuyết</Text>
      </View>
      <View style={styles.lessonList}>
        <TouchableOpacity style={styles.lessonCard} onPress={() => handleVocaPress('Từ vựng')}>
          <Image source={require('../../assets/images/vocabulary.png')} style={styles.lessonIcon} />
          <Text style={styles.lessonText}>Từ vựng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.lessonCard} onPress={() => handleGramPress('Ngữ pháp')}>
          <Image source={require('../../assets/images/form.png')} style={styles.lessonIcon} />
          <Text style={styles.lessonText}>Ngữ pháp</Text>
        </TouchableOpacity>
      </View>
      
      {/* History Section */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Lịch sử</Text>
        
        {/* Tab buttons for switching between "Luyện tập" and "Thi" */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => handleTabChange('practice')}>
            <Text style={styles.tabText}>Luyện tập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabChange('exam')}>
            <Text style={styles.tabText}>Thi</Text>
          </TouchableOpacity>
        </View>

        {/* Content for each tab */}
        {activeTab === 'practice' ? (
          <View style={styles.historyCard}>
            <View style={styles.historyColumn}>
              <Text style={styles.historySubTitle}>Luyện tập</Text>
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Test 1</Text>
                <Text style={styles.historyProgress}>0/990</Text>
              </View>
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Test 2</Text>
                <Text style={styles.historyProgress}>0/990</Text>
              </View>
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Test 3</Text>
                <Text style={styles.historyProgress}>100/990</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.historyCard}>
            <View style={styles.historyColumn}>
              <Text style={styles.historySubTitle}>Thi</Text>
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Test 1</Text>
                <Text style={styles.historyProgress}>20/990</Text>
              </View>
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Test 2</Text>
                <Text style={styles.historyProgress}>40/990</Text>
              </View>
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Test 3</Text>
                <Text style={styles.historyProgress}>10/990</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
  },
  lessonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 70,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  lessonList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 15,
  },
  lessonCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '20%',
    marginBottom: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative',
  },
  lessonIcon: {
    width: 40,
    height: 40,
    zIndex: 1,  
  },
  lessonText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',
    width: '150%',
    top: 80,
    left: '150%',
    transform: [{ translateX: -50 }], 
    color: '#000000',
  },
  lessonText2: {
    marginTop: 5,
    fontSize: 14,
    position: 'absolute',
    width: '150%',
    top: 100,
    left: '150%',
    transform: [{ translateX: -50 }], 
    color: '#000000',
  },
  historySection: {
    marginTop: 60,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tabButton: {
    padding: 10,
    width: '50%',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#ccc',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  historyCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  historyColumn: {
    width: '100%',
  },
  historySubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  historyItem: {
    marginBottom: 10,
  },
  historyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  historyProgress: {
    fontSize: 14,
    color: '#4CAF50',
  },
});
