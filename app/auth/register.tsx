import React, { useState } from 'react';
import { Button, Alert, View, TextInput, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';

const RegisterScreen = () => {
  const router = useRouter();

  const [name, setName] = useState<string>('');  
  const [email, setEmail] = useState<string>('');       
  const [phone, setPhone] = useState<string>('');        
  const [password, setPassword] = useState<string>('');  
  const [confirmPassword, setConfirmPassword] = useState<string>('');  // Xác nhận mật khẩu

  // Hàm xử lý khi người dùng đăng ký
  const handleRegister = async () => {
    // Kiểm tra tất cả các trường có được nhập đúng hay không
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      const response = await axios.post('http://197.187.3.101:8080/api/register', {
        name,
        email,
        phone,
        password,
      });

      // Kiểm tra trạng thái phản hồi từ backend
      if (response.status === 201) {
        Alert.alert('Đăng ký thành công!');
        router.push('/auth/login'); // Điều hướng đến trang đăng nhập
      } else {
        Alert.alert('Lỗi', 'Thông tin đăng ký không hợp lệ');
      }
    } catch (error: any) {
      console.error('Lỗi khi đăng ký:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/Etrainer_LOGO.png')} style={styles.LogoImage} />
        <Text style={styles.title}>Register</Text>
    <View style={styles.inputContainer}>
      <FontAwesome name="user" size={20} color="#333" style={styles.inputIcon} />
      <TextInput
        placeholder="Họ và tên"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
    </View>
    <View style={styles.inputContainer}>
      <FontAwesome name="envelope" size={20} color="#333" style={styles.inputIcon} />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
    </View>
    <View style={styles.inputContainer}>
      <FontAwesome name="phone" size={20} color="#333" style={styles.inputIcon} />
      <TextInput
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />
    </View>
    <View style={styles.inputContainer}>
      <FontAwesome name="lock" size={20} color="#333" style={styles.inputIcon} />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
    </View>
    <View style={styles.inputContainer}>
      <FontAwesome name="lock" size={20} color="#333" style={styles.inputIcon} />
      <TextInput
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
    </View>

      {/* Nút đăng ký */}

      <TouchableOpacity onPress={handleRegister} style={styles.regisButton}>
              <Text style={styles.regisButtonText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <Text
          style={styles.linkText}
          onPress={() => router.push('/auth/login')}
        >
          Đã có tài khoản? Đăng nhập
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  LogoImage: {
    width: 250,
    height: 250,
    marginTop: -60,
    marginBottom: -30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  regisButton: {
    backgroundColor: '#0099CC',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 90,
    marginTop: 40,
    marginBottom: 20,
  },
  regisButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linksContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  linkText: {
    color: '#00BFAE',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
