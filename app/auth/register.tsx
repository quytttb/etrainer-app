import React, { useState } from "react";
import { Button, Alert, View, TextInput, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { registerService } from "./service";

const RegisterScreen = () => {
  const router = useRouter();

  // States để lưu thông tin đăng ký
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>(""); // Email
  const [phone, setPhone] = useState<string>(""); // Số điện thoại
  const [password, setPassword] = useState<string>(""); // Mật khẩu
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // Xác nhận mật khẩu

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
      <TextInput
        placeholder="Họ và tên"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Đăng ký" onPress={handleRegister} />

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
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
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
