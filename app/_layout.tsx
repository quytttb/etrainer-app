import React from 'react';
import { AuthProvider } from '../context/AuthContext';  
import { Slot } from 'expo-router';  

export default function Layout() {
  return (
    <AuthProvider>
      <Slot />  
    </AuthProvider>
  );
}
