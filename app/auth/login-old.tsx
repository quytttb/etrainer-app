import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons'; 

const LoginScreen = () => {
  const { setAccessToken } = useAuth();

  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const fakeUser = {
    email: 'test@gmail.com',
    password: '123456',
    token: 'fake-jwt-token-12345',
    name: 'Anna Doe',
  };

  const handleLogin = async () => {
    if (email === fakeUser.email && password === fakeUser.password) {
      await AsyncStorage.setItem('token', fakeUser.token);
      await AsyncStorage.setItem('name', fakeUser.name);
      Alert.alert('Đăng nhập thành công!');
      router.push('/(tabs)/home');
    } else {
      Alert.alert('Lỗi', 'Thông tin đăng nhập không hợp lệ');
      }
    };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/Etrainer_LOGO.png')} style={styles.robotImage} />
      <Text style={styles.title}>Login</Text>

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
        <FontAwesome name="lock" size={20} color="#333" style={styles.inputIcon} />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkContainer}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        <Text style={styles.separator}> | </Text>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={styles.createAccountText}>Create Account</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <View style={styles.socialLoginContainer}>
        <TouchableOpacity>
          <Image source={require('../../assets/images/facebook.png')} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../../assets/images/google.png')} style={styles.socialIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  robotImage: {
    width: 250,
    height: 250,
    marginTop: -100,
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
  loginButton: {
    backgroundColor: '#0099CC',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 90,
    marginTop: 40,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#333',
    fontSize: 14,
  },
  separator: {
    color: '#333',
    fontSize: 14,
    marginHorizontal: 5,
  },
  createAccountText: {
    color: '#1abc9c',
    fontSize: 14,
    fontWeight: 'bold',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 15,
  },
});

function useAuth(): { setAccessToken: (token: string) => void } {
  const setAccessToken = async (token: string) => {
    await AsyncStorage.setItem('accessToken', token);
  };

  return { setAccessToken };
}

export default LoginScreen;
