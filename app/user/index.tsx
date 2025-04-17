import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';  // Import expo-image-picker

export default function EditProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("Nam");
  const [avatarUri, setAvatarUri] = useState(""); // State để lưu uri của avatar

  useEffect(() => {
    // Lấy thông tin người dùng từ AsyncStorage sau khi đăng ký
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setName(parsedData.name);
          setEmail(parsedData.email);
          setPhone(parsedData.phone);
          setDob(parsedData.dob ? new Date(parsedData.dob) : new Date());
          setGender(parsedData.gender || "Nam");
          setAvatarUri(parsedData.avatar || ""); // Set avatar nếu có
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUserData();
  }, []); // Chạy một lần khi màn hình được tải

  const handleSaveChanges = async () => {
    try {
      const userData = {
        name,
        email,
        phone,
        dob: dob.toISOString(),
        gender,
        avatar: avatarUri, // Lưu avatar
      };
      await AsyncStorage.setItem('user', JSON.stringify(userData)); // Lưu lại thông tin người dùng
      alert("Thông tin đã được lưu!");
      router.push("/profile"); // Điều hướng về trang profile
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
    }
  };

  // Chức năng hủy
  const handleCancel = () => {
    router.push("/profile"); // Điều hướng về trang profile nếu hủy
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  // Chức năng chọn avatar từ thư viện
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
        setAvatarUri(result.assets[0].uri); // Lưu đường dẫn của ảnh đã chọn
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
          style: "cancel"
        },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              // Xóa thông tin người dùng khỏi AsyncStorage
              await AsyncStorage.removeItem('user');
              alert("Tài khoản của bạn đã bị xóa!");
              router.push("/auth/login"); // Điều hướng về màn hình đăng nhập
            } catch (error) {
              console.error("Lỗi khi xóa tài khoản:", error);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handleChooseAvatar}>
          <Image
            source={avatarUri ? { uri: avatarUri } : require('../../assets/images/default_avatar.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.changeAvatarText}>Thay đổi ảnh đại diện</Text>
      </View>

      {/* Họ tên */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Họ tên</Text>
        <TextInput 
          style={styles.input} 
          value={name} 
          onChangeText={setName} 
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail} 
        />
      </View>

      {/* Số điện thoại */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput 
          style={styles.input} 
          value={phone} 
          onChangeText={setPhone} 
        />
      </View>

      {/* Ngày sinh */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ngày sinh</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput 
            style={styles.input} 
            value={dob.toLocaleDateString('vi-VN')}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Giới tính */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Giới tính</Text>
        <RadioButton.Group onValueChange={value => setGender(value)} value={gender}>
          <View style={styles.radioContainer}>
            <RadioButton value="Nam" />
            <Text style={styles.radioLabel}>Nam</Text>

            <RadioButton value="Nữ" />
            <Text style={styles.radioLabel}>Nữ</Text>

            <RadioButton value="Khác" />
            <Text style={styles.radioLabel}>Khác</Text>
          </View>
        </RadioButton.Group>
      </View>

      {/* Các nút Lưu và Hủy */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
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
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeAvatarText: {
    fontSize: 14,
    color: '#007BFF',
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#00BFAE',
    paddingVertical: 12,
    borderRadius: 5,
    width: '48%',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#fff',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    marginRight: 20,
    fontSize: 16,
    color: '#333',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  linkText: {
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
