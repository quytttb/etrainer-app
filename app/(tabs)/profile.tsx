import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false); // State cho giao diện tối
  // Hàm điều hướng đến trang chỉnh sửa tài khoản
  const router = useRouter(); // Khởi tạo router để điều hướng
  const handleEditProfile = () => {
    router.push('/user'); // Ensure this matches the correct route
  };

  return (
    <ScrollView style={styles.container}>
      {/* Tiêu đề trang */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/default_avatar.png')} style={styles.avatar} />
        <Text style={styles.username}>Ayano Nana</Text>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Mục cài đặt */}
      <View style={styles.settingsList}>
        <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
          <FontAwesome name="pencil" size={24} color="black" style={styles.icon} />
          <Text style={styles.settingText}>Chỉnh sửa tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome name="book" size={24} color="black" style={styles.icon} />
          <Text style={styles.settingText}>Bí quyết sử dụng ứng dụng hiệu quả</Text>
        </TouchableOpacity>
        <View style={styles.settingItem}>
          <AntDesign name="earth" size={24} color="black" style={styles.icon} />
          <Text style={styles.settingText}>Ngôn ngữ</Text>
          <Text style={styles.languageText}>English</Text>
        </View>
        <View style={[styles.settingItem, styles.settingItemWithSwitch]}>
          <FontAwesome name="moon-o" size={24} color="black" style={styles.icon} />
          <Text style={styles.settingText}>Giao diện tối</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            style={styles.switch}
          />
        </View>
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome name="th-large" size={24} color="black" style={styles.icon} />
          <Text style={styles.settingText}>Giao diện đáp án</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome name="facebook-square" size={24} color="black" style={styles.icon} />
          <Text style={styles.settingText}>Facebook Page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome name="share-alt" size={24} color="black" style={styles.icon} />
          <Text style={styles.settingText}>Chia sẻ ứng dụng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome name="download" size={24} color="black" style={styles.icon} />
          <Text style={styles.settingText}>Quản lý tải xuống</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="timer" size={24} color="black" style={styles.icon} />
          <Text style={styles.settingText}>Nhắc nhở học tập</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  logoutButton: {
    paddingHorizontal: 10,
  },
  logoutText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  settingsList: {
    marginTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,  
  },
  languageText: {
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 'auto', 
  },
  icon: {
    marginRight: 10, 
  },
  switch: {
    marginLeft: 'auto',
  },
  settingItemWithSwitch: {
    justifyContent: 'space-between', 
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 16,
    color: '#4CAF50',
  },
});
