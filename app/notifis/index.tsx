import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

const NotificationScreen = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([
    { id: 1, avatar: 'https://randomuser.me/api/portraits/women/1.jpg', title: 'Tố Uyên!', description: '🌻🎯😔☁️ Thời gian trôi qua nhanh quá! Quay lại ngay để tiếp tục hành trình học tập nhé! 🌈📚', time: '1 ngày trước' },
    { id: 2, avatar: 'https://randomuser.me/api/portraits/men/2.jpg', title: 'Tố Uyên!', description: '😭😭😭🌈💥 Chúng tôi rất nhớ bạn! Quay lại học tập ngay nhé! 🎉', time: '2 ngày trước' },
    { id: 3, avatar: 'https://randomuser.me/api/portraits/women/3.jpg', title: 'Tố Uyên!', description: '😭😭😭⏰ Đã 2 ngày không học! Hãy quay lại ngay để tiếp tục nhé! 💪🚀', time: '1 tuần trước' },
    { id: 4, avatar: 'https://randomuser.me/api/portraits/men/4.jpg', title: 'Tố Uyên!', description: '🌻🎯😔🏃‍♀️ Ba ngày không học, chúng tôi rất nhớ bạn! Quay lại ngay để không bỏ lỡ cơ hội phát triển! 🌟📚', time: '2 tuần trước' },
    { id: 5, avatar: 'https://randomuser.me/api/portraits/women/5.jpg', title: 'Tố Uyên!', description: '😭😭😭⏰ Thời gian không đợi ai! Quay lại ngay để học tiếp! 🌈🎉', time: '2 tuần trước' },
  ]);

  return (
    <View style={styles.container}>
      <Header
        title="Thông báo"
        onBackPress={() => router.push('/home' as any)}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <View key={notif.id} style={styles.notificationItem}>
                <Image source={{ uri: notif.avatar }} style={styles.avatar} />
                <View style={styles.notificationTextContainer}>
                  <Text style={styles.notificationTitle}>{notif.title}</Text>
                  <Text style={styles.notificationDescription}>{notif.description}</Text>
                  <Text style={styles.notificationTime}>{notif.time}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Image
                source={{ uri: 'https://img.icons8.com/ios/50/000000/folder-invoices--v1.png' }}
                style={styles.icon}
              />
              <Text style={styles.message}>Chưa có dữ liệu!</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => router.reload()}>
                <Text style={styles.retryButtonText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flexGrow: 1, 
    alignItems: 'center',
    paddingBottom: 20, 
    paddingTop: 60,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0099CC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '90%',
    alignSelf: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 10,
    marginRight: 10,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  scrollContent: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 20,
  },
});

export default NotificationScreen;
