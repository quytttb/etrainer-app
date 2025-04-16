
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import PropTypes from 'prop-types';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const router = useRouter();

  // Hàm quay lại trang trước
  const handleBackPress = () => {
    router.back();  // Điều hướng quay lại trang trước
  };

  return (
    <View style={styles.headerContainer}>
      {/* Nút quay lại */}
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Text style={styles.backText}>{"<"}</Text> {/* Dấu "<" quay lại */}
      </TouchableOpacity>

      {/* Tiêu đề */}
      <Text style={styles.title}>{title}</Text> {/* Tiêu đề động */}

      {/* Biểu tượng thông tin (i) */}
      <TouchableOpacity style={styles.infoButton}>
        <Text style={styles.infoText}>i</Text> {/* Biểu tượng thông tin */}
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
    width: '112%',  
    position: 'absolute', 
    top: 0, 
    zIndex: 1000, 
  },
  backButton: {
    padding: 5,
  },
  backText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,  // Tiêu đề sẽ chiếm phần còn lại nếu có
    textAlign: 'center', // Căn giữa tiêu đề
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
  title: PropTypes.string.isRequired, // Tiêu đề của header
};

export default Header;
