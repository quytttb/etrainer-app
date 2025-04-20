import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

type MiniTestItem = {
  id: number;
  title: string;
  duration: number;
  questions: number;
  locked: boolean;
};

const miniTests: MiniTestItem[] = [
  { id: 1, title: 'Test 1', duration: 60, questions: 100, locked: false },
  { id: 2, title: 'Test 2', duration: 60, questions: 100, locked: false },
  { id: 3, title: 'Test 3', duration: 60, questions: 100, locked: false },
  { id: 4, title: 'Test 4', duration: 60, questions: 100, locked: false },
  { id: 5, title: 'Test 5', duration: 60, questions: 100, locked: true },
  { id: 6, title: 'Test 6', duration: 60, questions: 100, locked: true },
];

const MiniTestList = () => {
  const router = useRouter();

  const renderItem = ({ item }: { item: MiniTestItem }) => (
    <View style={styles.testItem}>
      <View style={styles.testInfo}>
        <Text style={styles.testTitle}>{item.title}</Text>
        <Text style={styles.testDetails}>
          Thời gian: {item.duration} phút | Câu hỏi: {item.questions}
        </Text>
      </View>
      {item.locked ? (
        <FontAwesome name="lock" size={24} color="gray" />
      ) : (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push(`/exam/prepare/${item.id}` as any)}
        >
          <Text style={styles.startButtonText}>Bắt đầu</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.screen}>
      <Header
        title="TOEIC Listening & Reading Minitest"
        onBackPress={() => router.push('/mock-test')}
      />
      <FlatList
        data={miniTests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        ListHeaderComponent={<View style={styles.headerSpacing} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 16,
    paddingTop: 70, 
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  testDetails: {
    fontSize: 14,
    color: '#555',
  },
  startButton: {
    backgroundColor: '#0099CC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerSpacing: {
    height: 20,
  },
});

export default MiniTestList;
