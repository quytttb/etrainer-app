import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const levels = [
  { label: '0 -> 150\nMất gốc', value: '0-150' },
  { label: '300 -> 450\nTrung cấp', value: '300-450' },
  { label: '600 -> 700\nCao cấp', value: '600-700' },
];

const goals = [
  { label: '300\nCơ bản', value: '300' },
  { label: '~ 650+\nKhá', value: '650+' },
  { label: '~ 900\nXuất sắc', value: '900' },
];

export default function SelectLevelScreen() {
  const [currentLevel, setCurrentLevel] = useState('');
  const [goal, setGoal] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!currentLevel || !goal) return alert('Vui lòng chọn đầy đủ thông tin');

    // Chuyển sang trang learningPathOverview và truyền params
    router.push({
      pathname: '/learningPath/learningPathOverview',
      params: { currentLevel, targetLevel: goal },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lộ trình học tập</Text>
      <Text style={styles.subtitle}>Điểm hiện tại của bạn:</Text>
      <View style={styles.row}>
        {levels.map(lvl => (
          <TouchableOpacity
            key={lvl.value}
            style={[
              styles.button,
              currentLevel === lvl.value && styles.buttonActive,
            ]}
            onPress={() => setCurrentLevel(lvl.value)}
          >
            <View style={styles.radioOuter}>
              {currentLevel === lvl.value && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.buttonText}>{lvl.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitle}>Mục tiêu của bạn:</Text>
      <View style={styles.row}>
        {goals.map(gl => {
          // Disable logic:
          // - Trung cấp (300-450) hoặc Cao cấp (600-700) không chọn được 300
          // - Cao cấp (600-700) không chọn được 650+
          const isDisabled =
            (currentLevel === '300-450' && gl.value === '300') ||
            (currentLevel === '600-700' && (gl.value === '300' || gl.value === '650+'));
          return (
            <TouchableOpacity
              key={gl.value}
              style={[
                styles.button,
                goal === gl.value && styles.buttonActive,
                isDisabled && styles.buttonDisabled,
              ]}
              onPress={() => !isDisabled && setGoal(gl.value)}
              disabled={isDisabled}
            >
              <View style={styles.radioOuter}>
                {goal === gl.value && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.buttonText, isDisabled && styles.buttonTextDisabled]}>
                {gl.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>Xây lộ trình học Toeic</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, marginVertical: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  button: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    padding: 16,
    margin: 5,
    width: '30%',
    alignItems: 'center',
    flexDirection: 'row', 
  },
  buttonActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  buttonText: { textAlign: 'center' },
  submit: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  submitText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  buttonDisabled: {
    backgroundColor: '#eee',
    borderColor: '#eee',
    opacity: 0.6,
  },
  buttonTextDisabled: {
    color: '#aaa',
  },
});
