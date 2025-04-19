import React, { useState } from "react";
import { useRouter } from "expo-router";
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
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useMutation } from "@tanstack/react-query";
import { loginService } from "./service";
import useAuth from "@/hooks/useAuth";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const { setAccessToken } = useAuth();

  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: async (r) => {
      await setAccessToken(r.token);
      router.push("../(tabs)/home");
    },
    onError: (error: any) => {
      Alert.alert(
        "Lỗi",
        error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
    },
  });

  const loginButtonText = {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  };

  const [_, __, promptAsync] = Google.useAuthRequest({
    // androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    scopes: ["profile", "email"],
    redirectUri: process.env.EXPO_PUBLIC_REDIRECT_URI,
    selectAccount: true,
    responseType: "token",
  });

  // States để lưu thông tin đăng nhập
  // Removed duplicate password state declaration

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const createAccountText = {
      color: "#1abc9c",
      fontWeight: "bold",
      fontSize: 16,
      marginVertical: 10,
    };

    loginMutation.mutate({ email, password });
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
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* Nút Đăng nhập */}
      <Button title="Đăng nhập" onPress={handleLogin} color="#1abc9c" />

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
        <Button
          title="Đăng nhập bằng Google"
          onPress={() => promptAsync()}
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
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  loginButton: {
    backgroundColor: "#1abc9c",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: "#000",
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
    color: "#333",
  },
  icon: {
    marginRight: 10,
    color: "#7f8c8d",
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
