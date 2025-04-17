import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; 

import PropTypes from 'prop-types';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const router = useRouter();

  // Hàm quay lại trang trước
  const handleBackPress = () => {
    router.back();  
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <FontAwesome name="chevron-left" size={20} color="#FFFFFF" /> 
      </TouchableOpacity>

      {/* Tiêu đề */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text> 
      </View>

      {/* Biểu tượng thông tin (i) */}
      <TouchableOpacity style={styles.infoButton}>
        <Text style={styles.infoText}>i</Text> 
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#00BFAE',
    width: '100%',  
    position: 'absolute', 
    top: 0, 
    zIndex: 1000, 
  },
  backButton: {
    padding: 5,
  },
  titleContainer: {
    flex: 1,  
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center', 
  },
  infoButton: {
    padding: 10,
  },
  infoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

Header.propTypes = {
  title: PropTypes.string.isRequired, 
};

export default Header;
