// app/user/_layout.tsx

import React from 'react';
import { Stack } from 'expo-router';

export default function UserLayout() {
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
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Chỉnh sửa tài khoản',
        }}
      />
    </Stack>
  );
}
