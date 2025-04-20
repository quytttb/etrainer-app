import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

type TestItem = {
  id: number;
  title: string;
  duration: number;
  questions: number;
  locked: boolean;
};

const tests: TestItem[] = [
  { id: 1, title: 'Test 1 ETS 2024', duration: 120, questions: 200, locked: false },
  { id: 2, title: 'Test 2 ETS 2024', duration: 120, questions: 200, locked: false },
  { id: 3, title: 'Test 3 ETS 2024', duration: 120, questions: 200, locked: false },
  { id: 4, title: 'Test 4 ETS 2024', duration: 120, questions: 200, locked: false },
  { id: 5, title: 'Test 5 ETS 2024', duration: 120, questions: 200, locked: false },
  { id: 6, title: 'Test 6 ETS 2024', duration: 120, questions: 200, locked: true },
  { id: 7, title: 'Test 7 ETS 2024', duration: 120, questions: 200, locked: true },
  { id: 8, title: 'Test 8 ETS 2024', duration: 120, questions: 200, locked: true },
];

const FullTestList = () => {
  const router = useRouter();

  const renderItem = ({ item }: { item: TestItem }) => (
    <View style={[styles.testItem, item.locked && styles.lockedItem]}>
      <View style={styles.testInfo}>
        <Text style={styles.testTitle}>{item.title}</Text>
        <Text style={styles.testDetails}>
          Thời gian: {item.duration} phút | Câu hỏi: {item.questions}
        </Text>
      </View>
      {item.locked ? (
        <FontAwesome name="lock" size={24} color="#888" />
      ) : (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push(`exam/prepare/${item.id}` as any)}
        >
          <Text style={styles.startButtonText}>Bắt đầu</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.screen}>
      <Header
        title="TOIEC Listening & Reading Full Test"
        onBackPress={() => router.push('/mock-test' as any)}
      />
      <Text style={styles.header}>Danh sách bài kiểm tra</Text>
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    marginBottom: 30,
    color: '#333',
  },
  container: {
    padding: 16,
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  lockedItem: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
  },
  testInfo: {
    flex: 1,
    marginRight: 12,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  testDetails: {
    fontSize: 14,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#0099CC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default FullTestList;
