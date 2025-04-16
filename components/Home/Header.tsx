import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {
  const [username, setUsername] = useState<string>('');  // state lưu tên người dùng

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        // Lấy tên người dùng từ AsyncStorage
        const storedName = await AsyncStorage.getItem('name');
        console.log('Stored name in Header:', storedName); // Kiểm tra xem dữ liệu có được lấy không

        if (storedName) {
          setUsername(storedName);  // Cập nhật tên người dùng trong state
        } else {
          setUsername('Guest');  // Nếu không có tên, đặt là 'Guest'
        }
      } catch (error) {
        console.error('Error fetching username from AsyncStorage:', error);
      }
    };

    fetchUserName();
  }, []);  // chỉ chạy một lần khi component được render

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>Etrainer</Text>
          <Text style={styles.username}>Hello! {username}</Text>
        </View>
        <View style={styles.headerRight}>
          <FontAwesome name="bell" size={20} color="black" />
          <Image source={require('../../assets/images/default_avatar.png')} style={styles.avatar} />
        </View>
      </View>

      {/* Course Card */}
      <View style={styles.courseCard}>
        <View>
          <Text style={styles.courseTitle}>Let's study with Etrainer!</Text>
          <Text style={styles.courseTime}>⏰ 45 minutes</Text>
        </View>
        <Image source={require('../../assets/images/books.png')} style={styles.courseImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 5,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2A44',
  },
  username: {
    fontSize: 30,
    color: '#4C65F5',
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 15,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#826CFF',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 10,
  },
  courseTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  courseTime: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  courseImage: {
    width: 100,
    height: 100,
  },
});

export default Header;
