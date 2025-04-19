import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import useAuth from "@/hooks/useAuth";
import useProfile from "@/hooks/useProfile";

export default function SettingsScreen() {
  const { onLogout } = useAuth();
  const { profile } = useProfile();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");
  const router = useRouter();

  // Chức năng thay đổi avatar
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri); // Lưu avatar mới
      // Cập nhật avatar vào AsyncStorage
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedData = JSON.parse(userData);
        parsedData.avatar = result.assets[0].uri;
        await AsyncStorage.setItem("user", JSON.stringify(parsedData)); // Lưu avatar vào AsyncStorage
      }
    }
  };

  const handleReminderToggle = () => {
    setIsReminderEnabled(!isReminderEnabled); // Bật/tắt nhắc nhở
  };

  const handleSaveReminder = () => {
    if (isReminderEnabled) {
      Alert.alert(
        "Nhắc nhở đã được lưu!",
        `Thời gian nhắc nhở: ${reminderTime.toLocaleString()}`
      );
    } else {
      Alert.alert("Nhắc nhở đã bị tắt");
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDateTimePicker(false);
    if (selectedDate) {
      setReminderTime(selectedDate); // Lưu thời gian nhắc nhở
    }
  };

  const handleEditProfile = () => {
    router.push("/user");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profile?.avatarUrl
                ? { uri: profile?.avatarUrl }
                : require("../../assets/images/default_avatar.png")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.username}>{profile?.name}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsList}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleEditProfile}
        >
          <FontAwesome
            name="pencil"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.settingText}>Chỉnh sửa tài khoản</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome
            name="book"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.settingText}>
            Bí quyết sử dụng ứng dụng hiệu quả
          </Text>
        </TouchableOpacity>

        <View style={styles.settingItem}>
          <AntDesign name="earth" size={24} color="black" style={styles.icon} />
          <Text style={styles.settingText}>Ngôn ngữ</Text>
          <Text style={styles.languageText}>English</Text>
        </View>

        <View style={[styles.settingItem, styles.settingItemWithSwitch]}>
          <FontAwesome
            name="moon-o"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.settingText}>Giao diện tối</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            style={styles.switch}
          />
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome
            name="th-large"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.settingText}>Giao diện đáp án</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome
            name="facebook-square"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.settingText}>Facebook Page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome
            name="share-alt"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.settingText}>Chia sẻ ứng dụng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome
            name="download"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.settingText}>Quản lý tải xuống</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setShowDateTimePicker(true)}
        >
          <MaterialIcons
            name="timer"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.settingText}>Nhắc nhở học tập</Text>
        </TouchableOpacity>
      </View>

      {isReminderEnabled && (
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>
            Chọn thời gian nhắc nhở học tập
          </Text>
          <TouchableOpacity onPress={() => setShowDateTimePicker(true)}>
            <Text style={styles.buttonText}>Chọn thời gian</Text>
          </TouchableOpacity>
        </View>
      )}

      {showDateTimePicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          is24Hour={true}
          onChange={handleDateChange}
        />
      )}

      {isReminderEnabled && (
        <View style={styles.saveButtonContainer}>
          <Button title="Lưu nhắc nhở" onPress={handleSaveReminder} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  logoutButton: {
    paddingHorizontal: 10,
  },
  logoutText: {
    color: "#FF0000",
    fontWeight: "bold",
  },
  settingsList: {
    marginTop: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  settingText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  languageText: {
    fontSize: 16,
    color: "#4CAF50",
    marginLeft: "auto",
  },
  icon: {
    marginRight: 10,
  },
  switch: {
    marginLeft: "auto",
  },
  settingItemWithSwitch: {
    justifyContent: "space-between",
  },
  saveButtonContainer: {
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});
