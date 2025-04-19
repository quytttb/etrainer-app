import React, { useState } from "react";
import { Button, Alert, View, TextInput, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { registerService } from "./service";

const RegisterScreen = () => {
  const router = useRouter();

  // States để lưu thông tin đăng ký
  const [name, setName] = useState<string | undefined>("");
  const [email, setEmail] = useState<string | undefined>(""); // Email
  const [phone, setPhone] = useState<string | undefined>(""); // Số điện thoại
  const [password, setPassword] = useState<string | undefined>(""); // Mật khẩu
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>(""); // Xác nhận mật khẩu

  const registerMutation = useMutation({
    mutationFn: registerService,
    onSuccess: () => {
      Alert.alert("Thành công", "Đăng ký thành công");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      console.error("Lỗi khi đăng ký:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      Alert.alert("Lỗi", errorMessage);
    },
  });

  // Hàm xử lý khi người dùng đăng ký
  const handleRegister = async () => {
    // Kiểm tra tất cả các trường có được nhập đúng hay không
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    registerMutation.mutate({
      name,
      email,
      phone,
      password,
    });
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
          onPress={() => router.push("/auth/login")}
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
    justifyContent: "center",
  },
  LogoImage: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputIcon: {
    marginRight: 10,
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
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
