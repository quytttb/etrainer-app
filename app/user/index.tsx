import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';

export default function EditProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("Nam");

  useEffect(() => {
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
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const userData = {
        name,
        email,
        phone,
        dob: dob.toISOString(),
        gender
      };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      alert("Thông tin đã được lưu!");
      router.push("/profile");
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Chỉnh sửa tài khoản</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Họ tên</Text>
        <TextInput 
          style={styles.input} 
          value={name} 
          onChangeText={setName} 
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail} 
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput 
          style={styles.input} 
          value={phone} 
          onChangeText={setPhone} 
        />
      </View>

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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={[styles.buttonText, styles.cancelButtonText]}>Hủy</Text>
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
});
