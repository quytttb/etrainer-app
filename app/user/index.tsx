import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker"; // Import expo-image-picker
import useProfile from "@/hooks/useProfile";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { deleteAccountService, updateProfileService } from "./service";
import useAuth from "@/hooks/useAuth";

export default function EditProfileScreen() {
  const router = useRouter();

  const { onLogout } = useAuth();

  const { profile } = useProfile();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState<Date>(dayjs().toDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarUri, setAvatarUri] = useState<string>("");

  const avatar = useMemo(() => {
    if (avatarUrl) {
      return { uri: avatarUrl };
    } else if (avatarUri) {
      return { uri: avatarUri };
    }
    return require("../../assets/images/default_avatar.png");
  }, [avatarUrl, avatarUri]);

  console.log("🚀 352 ~ avatar ~ avatar:", avatar);

  const updateProfileMutation = useMutation({
    mutationFn: updateProfileService,
    onSuccess: () => {
      Alert.alert("Thành công", "Cập nhật thông tin cá nhân thành công!");
    },
    onError: () => {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật thông tin cá nhân.");
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccountService,
    onSuccess: async () => {
      await onLogout();
      Alert.alert("Thành công", "Xóa tài khoản thành công!");
      router.push("/auth/login");
    },
    onError: () => {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi xóa tài khoản.");
    },
  });

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.phone);

      if (profile.dateOfBirth) {
        setDob(new Date(profile.dateOfBirth));
      }

      setGender(profile.gender);
      setAvatarUrl(profile.avatarUrl);
    }
  }, [profile]);

  const handleSaveChanges = async () => {
    updateProfileMutation.mutate({
      name,
      phone,
      dateOfBirth: dayjs(dob).format("YYYY-MM-DD"),
      gender,
      avatarUri,
    });
  };

  // Chức năng hủy
  const handleCancel = () => {
    router.push("/profile");
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const handleChooseAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setAvatarUri(result.assets[0].uri);
      }
    } else {
      Alert.alert("Cần quyền truy cập thư viện ảnh");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Xác nhận xóa tài khoản",
      "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.",
      [
        {
          text: "Hủy",
          onPress: () => console.log("Hủy xóa tài khoản"),
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: () => deleteAccountMutation.mutate(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handleChooseAvatar}>
          <Image source={avatar} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.changeAvatarText}>Thay đổi ảnh đại diện</Text>
      </View>

      {/* Họ tên */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Họ tên</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          readOnly
        />
      </View>

      {/* Số điện thoại */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
      </View>

      {/* Ngày sinh */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ngày sinh</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            value={dob?.toLocaleDateString("vi-VN")}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dob ?? new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Giới tính */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Giới tính</Text>
        <RadioButton.Group
          onValueChange={(value) => setGender(value)}
          value={gender}
        >
          <View style={styles.radioContainer}>
            <RadioButton value="MALE" />
            <Text style={styles.radioLabel}>Nam</Text>

            <RadioButton value="FEMALE" />
            <Text style={styles.radioLabel}>Nữ</Text>

            <RadioButton value="OTHER" />
            <Text style={styles.radioLabel}>Khác</Text>
          </View>
        </RadioButton.Group>
      </View>

      {/* Các nút Lưu và Hủy */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>Hủy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={handleDeleteAccount}>
          <Text style={styles.linkText}>Xóa tài khoản</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeAvatarText: {
    fontSize: 14,
    color: "#007BFF",
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#00BFAE",
    paddingVertical: 12,
    borderRadius: 5,
    width: "48%",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  cancelButtonText: {
    color: "#fff",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    marginRight: 20,
    fontSize: 16,
    color: "#333",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  linkText: {
    color: "#007BFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
