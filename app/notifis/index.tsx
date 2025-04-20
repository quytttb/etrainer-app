import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

const NotificationScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header
            title="Thông báo"
            onBackPress={() => router.push('/home' as any)}
        />
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://img.icons8.com/ios/50/000000/folder-invoices--v1.png' }}
          style={styles.icon}
        />
        <Text style={styles.message}>Chưa có dữ liệu!</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.reload()}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
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
});

export default NotificationScreen;
