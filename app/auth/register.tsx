import React, { useState } from "react";
import {
  Alert,
  View,
  TextInput,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { registerService } from "./service";
import { FontAwesome } from "@expo/vector-icons";

const RegisterScreen = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: registerService,
    onSuccess: () => {
      Alert.alert("Thành công", "Đăng ký thành công");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      console.error("Lỗi khi đăng ký:", error);

      let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Lỗi", errorMessage);
    },
  });

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

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
      <Image
        source={require("../../assets/images/Etrainer_LOGO.png")}
        style={styles.LogoImage}
      />
      <Text style={styles.title}>Register</Text>

      {/* Họ và tên */}
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#333" style={styles.inputIcon} />
        <TextInput
          placeholder="Họ và tên"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>

      {/* Email */}
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

      {/* Số điện thoại */}
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

      {/* Mật khẩu */}
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

      {/* Xác nhận mật khẩu */}
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

      {/* Đường dẫn đến đăng nhập */}
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
    width: 250,
    height: 250,
    alignSelf: "center",
    marginBottom: -30,
  },
  inputIcon: {
    marginRight: 10,
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
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  regisButton: {
    backgroundColor: "#0099CC",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 90,
    marginTop: 40,
    marginBottom: 20,
  },
  regisButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
