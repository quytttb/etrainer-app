import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const router = useRouter();

  const [request, response, promS] = Google.useAuthRequest({
    // androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    scopes: ["profile", "email"],
    redirectUri: process.env.EXPO_PUBLIC_REDIRECT_URI,
    selectAccount: true,
    responseType: "token",
  });

  const params = useLocalSearchParams();
  console.log(request?.url);
  console.log("🚀 352 ~ LoginScreen ~ params:", params);

  // States để lưu thông tin đăng nhập
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Hàm xử lý đăng nhập
  /*const handleLogin = async () => {
    try {
      interface LoginResponse {
        token: string;
        name: string;
      }

      const response = await axios.post('http://197.187.3.101:8080/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, name } = response.data as LoginResponse;
        const userName = name || 'Guest';

        // Lưu token vào AsyncStorage
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('name', name);
        Alert.alert('Đăng nhập thành công!');

        const storedName = await AsyncStorage.getItem('name');
        console.log('Stored name after login:', storedName);*/

  // Điều hướng đến trang home sau khi đăng nhập thành công
  /*router.push('../(tabs)/home');  // Đảm bảo đường dẫn chính xác
      } else {
        Alert.alert('Lỗi', 'Thông tin đăng nhập không hợp lệ');
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };*/
  const fakeUser = {
    email: "test@gmail.com",
    password: "123456",
    token: "fake-jwt-token-12345",
    name: "Anna Doe",
  };

  // Hàm xử lý đăng nhập
  const handleLogin = async () => {
    // Kiểm tra dữ liệu đăng nhập ảo
    if (email === fakeUser.email && password === fakeUser.password) {
      // Lưu token vào AsyncStorage
      await AsyncStorage.setItem("token", fakeUser.token);
      await AsyncStorage.setItem("name", fakeUser.name);

      // Hiển thị thông báo và điều hướng đến trang Home
      Alert.alert("Đăng nhập thành công!");

      // Điều hướng đến trang Home sau khi đăng nhập thành công
      router.push("/(tabs)/home"); // Đảm bảo đường dẫn chính xác
    } else {
      Alert.alert("Lỗi", "Thông tin đăng nhập không hợp lệ");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>

      {/* Input cho Email */}
      <View style={styles.inputContainer}>
        <FontAwesome
          name="envelope"
          size={20}
          color="#7f8c8d"
          style={styles.icon}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
      </View>

      {/* Input cho Mật khẩu */}
      <View style={styles.inputContainer}>
        <FontAwesome
          name="lock"
          size={20}
          color="#7f8c8d"
          style={styles.icon}
        />
        <TextInput
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* Nút Đăng nhập */}
      <Button title="Đăng nhập" onPress={handleLogin} color="#1abc9c" />

      {/* Hoặc đăng nhập bằng Google và Facebook */}
      <Text style={styles.orText}>--- OR ---</Text>

      <View style={styles.socialLoginContainer}>
        <Button
          title="Đăng nhập bằng Google"
          onPress={() => promS()}
          color="#DB4437"
        />
        <Button
          title="Đăng nhập bằng Facebook"
          onPress={() => {
            /* Logic Facebook Login */
          }}
          color="#3b5998"
        />
      </View>

      {/* Quên mật khẩu và điều hướng tới đăng ký */}
      <View style={styles.linksContainer}>
        <TouchableOpacity
          onPress={() => {
            /* Logic Quên mật khẩu */
          }}
        >
          <Text style={styles.linkText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
        <Text style={styles.linkText}> | </Text>
        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={styles.linkText}>Tạo tài khoản</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
    paddingLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingLeft: 10,
  },
  orText: {
    textAlign: "center",
    marginVertical: 10,
    color: "#7f8c8d",
  },
  socialLoginContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  linkText: {
    color: "#1abc9c",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LoginScreen;
