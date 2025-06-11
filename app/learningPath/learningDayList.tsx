import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

type DayItem = {
  dayNumber: number;
  tasks: string[];
  locked: boolean;
};

const daysData: DayItem[] = [
  {
    dayNumber: 1,
    locked: false,
    tasks: [
      'Từ vựng',
      'Tìm hiểu sâu về Giới từ: Tổng quan',
      'Giới từ In, On, At',
      'Một số giới từ khác',
      'Bài tập',
      'Kiến thức cần nhớ',
    ],
  },
  {
    dayNumber: 2,
    locked: true,
    tasks: [
      'Từ vựng chủ đề giao thông',
      'Cụm động từ & Giới từ: Tổng quan',
      'Bảng cụm động từ và giới từ',
      'Bài tập',
      'Kiến thức cần nhớ',
    ],
  },
  {
    dayNumber: 3,
    locked: true,
    tasks: [
      'Từ vựng chủ đề mua sắm',
      'Câu điều kiện loại 1',
      'Câu điều kiện loại 2',
      'Bài tập',
      'Kiến thức cần nhớ',
    ],
  },
];

export default function LearningPathScreen() {
  const router = useRouter();
  const [days, setDays] = useState<DayItem[]>(daysData);

  // Sử dụng AppState để unlock ngày tiếp theo khi quay lại màn hình này
  React.useEffect(() => {
    const unsubscribe = () => { };
    const handleFocus = () => {
      setDays(prev => {
        const newDays = [...prev];
        for (let i = 0; i < newDays.length - 1; i++) {
          if (!newDays[i].locked && newDays[i + 1].locked) {
            newDays[i + 1].locked = false;
            break;
          }
        }
        return newDays;
      });
    };

    // Expo Router không có addListener, dùng event listener của window (web) hoặc AppState (native)
    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("focus", handleFocus);
      return () => window.removeEventListener("focus", handleFocus);
    }
    // Nếu muốn dùng AppState cho native:
    // import { AppState } from 'react-native';
    // const subscription = AppState.addEventListener('change', state => {
    //   if (state === 'active') handleFocus();
    // });
    // return () => subscription.remove();
    return unsubscribe;
  }, []);

  const onPressDay = (day: DayItem) => {
    if (day.locked) {
      Alert.alert('Thông báo', 'Bạn chưa mở khóa ngày học này.');
      return;
    }
    // Chuyển sang trang chi tiết ngày học và truyền dữ liệu bài học
    router.push({
      pathname: '/learningPath/dayDetailScreen',
      params: {
        dayNumber: day.dayNumber,
        tasks: JSON.stringify(day.tasks),
      },
    });
  };

  // Test function for new exam component
  const handleTestNewExam = () => {
    router.push('/learningPath/exam/0'); // Test with stage index 0
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lộ trình học Toeic của bạn</Text>

      {/* TEST BUTTON - Remove this after testing */}
      <TouchableOpacity style={styles.testButton} onPress={handleTestNewExam}>
        <Text style={styles.testButtonText}>🧪 TEST - Bài Test Mới (Giai đoạn 1)</Text>
      </TouchableOpacity>

      {/* Thống kê */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statPercent}>0%</Text>
          <Text style={styles.statLabel}>Completion</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statPercent}>--%</Text>
          <Text style={styles.statLabel}>Average score</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statPercent}>00h : 00'</Text>
          <Text style={styles.statLabel}>Time on task</Text>
        </View>
      </View>

      {/* Danh sách ngày học */}
      <FlatList
        data={days}
        keyExtractor={(item) => item.dayNumber.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPressDay(item)}
            style={[styles.dayContainer, item.locked && styles.dayLocked]}
          >
            <Text style={[styles.dayTitle, item.locked && styles.dayTitleLocked]}>
              Day {item.dayNumber}
            </Text>
            {item.tasks.map((task, idx) => (
              <View key={idx} style={styles.taskRow}>
                <Text style={[styles.taskText, item.locked && styles.taskTextLocked]}>{`\u2022 ${task}`}</Text>
              </View>
            ))}
            {!item.locked && (
              <View style={styles.arrowRight}>
                <Text style={{ fontSize: 18, color: '#2ecc71' }}>→</Text>
              </View>
            )}
            {item.locked && (
              <View style={styles.lockIcon}>
                <Text style={{ fontSize: 18, color: '#aaa' }}>🔒</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  testButton: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  statItem: { alignItems: 'center' },
  statPercent: { fontSize: 18, fontWeight: '600' },
  statLabel: { fontSize: 12, color: '#666' },
  dayContainer: {
    borderWidth: 1,
    borderColor: '#2ecc71',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
  },
  dayLocked: { backgroundColor: '#f9f9f9', borderColor: '#ddd' },
  dayTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  dayTitleLocked: { color: '#999' },
  taskRow: { paddingVertical: 2 },
  taskText: { fontSize: 14, color: '#333' },
  taskTextLocked: { color: '#bbb' },
  arrowRight: { position: 'absolute', right: 12, top: '50%', marginTop: -9 },
  lockIcon: { position: 'absolute', right: 12, top: '50%', marginTop: -9 },
});
