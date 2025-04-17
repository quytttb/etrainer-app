import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function UserLayout() {
  const router = useRouter(); 

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#00BFAE', // Màu nền của Header
        },
        headerTintColor: '#fff', // Màu chữ và nút trên Header
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <FontAwesome name="chevron-left" size={24} color="#fff" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Thông tin cá nhân',
        }}
      />
    </Stack>
  );
}
