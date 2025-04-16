
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router'; 

export default function Layout() {
  return (
    <View style={styles.container}>
      {/* Slot sẽ render các trang con */}
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
