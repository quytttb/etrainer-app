import React, { useEffect, useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import { setStudyReminderService } from "./service";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next"; // Import useTranslation từ react-i18next

export default function SettingsScreen() {
  const { onLogout } = useAuth();
  const { profile, refresh } = useProfile();
  const { t, i18n } = useTranslation(); // Khai báo hook dịch

  const setReminderMutation = useMutation({
    mutationFn: setStudyReminderService,
    onSuccess: refresh,
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState<Date>(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (profile?.reminder) {
      setReminderTime(
        dayjs()
          .hour(profile.reminder.hour)
          .minute(profile.reminder.minute)
          .toDate()
      );
    } else {
      setReminderTime(new Date());
    }
  }, [profile?.reminder]);

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
        await AsyncStorage.setItem("user", JSON.stringify(parsedData));
      }
    }
  };

  const handleReminderToggle = () => {
    setIsReminderEnabled(!isReminderEnabled);
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
      setReminderMutation.mutate({
        hour: selectedDate.getHours(),
        minute: selectedDate.getMinutes(),
      });
    }
  };

  const handleEditProfile = () => {
    router.push("/user");
  };

  // Hàm thay đổi ngôn ngữ
  const handleLanguageChange = () => {
    Alert.alert(
      "Chọn Ngôn Ngữ",
      "",
      [
        {
          text: "Tiếng Việt",
          onPress: () => {
            i18n.changeLanguage("vi");
            AsyncStorage.setItem("appLanguage", "vi");
          },
        },
        {
          text: "English",
          onPress: () => {
            i18n.changeLanguage("en");
            AsyncStorage.setItem("appLanguage", "en");
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.accountTitle}>Tài khoản</Text>
      <View style={styles.accountBox}>
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
      </View>

      <Text style={styles.accountTitle}>Giao diện</Text>
      <View style={styles.interfaceBox}>
        {/* Thay đổi phần Ngôn ngữ */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleLanguageChange}
        >
          <AntDesign name="earth" size={24} color="black" style={styles.icon} />
          <Text style={styles.settingText}>
            {t("settings.languageSettings")}
          </Text>
          <Text style={styles.languageText}>
            {i18n.language === "en" ? "English" : "Tiếng Việt"}
          </Text>
        </TouchableOpacity>

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
      </View>

      <Text style={styles.accountTitle}>Thông báo</Text>
      <View style={styles.interfaceBox}>
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
          <View style={{ flexDirection: "column", marginLeft: 10 }}>
            <Text style={styles.settingText}>Nhắc nhở học tập</Text>
            <Text style={styles.reminderTimeText}>
              {reminderTime
                ? `${reminderTime.getHours()
                  .toString()
                  .padStart(2, "0")}:${reminderTime
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`
                : "--:--"}
            </Text>
          </View>
        </TouchableOpacity>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
  },
  accountBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 0,
    marginTop: 20,
    marginBottom: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  accountTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    color: "#222",
    marginLeft: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
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
  interfaceBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 0,
    marginBottom: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
  reminderTimeText: {
    marginLeft: 10,
    marginTop: 10,
    color: "#0099CC",
    fontWeight: "bold",
    fontSize: 16,
  },
});
