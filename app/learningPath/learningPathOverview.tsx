import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import { RouteProp, useRoute } from '@react-navigation/native';

type RouteParams = {
  LearningPath: {
    currentLevel: string;
    targetLevel: string;
  };
};

const stageDetails = [
  [
    // Giai đoạn 1
    {
      day: 1,
      title: "Day 1",
      items: [
        { text: "Giới thiệu" },
        { text: "Tìm hiểu về đề thi Toeic và một số lưu ý" }
      ]
    },
    {
      day: 2,
      title: "Day 2",
      items: [
        { text: "Học từ vựng cơ bản" },
        { text: "Bài tập điền từ vào chỗ trống", sub: "5 bài tập" },
        { text: "Bài tập trắc nghiệm", sub: "5 bài tập" },
        { text: "Từ loại Danh từ: Định nghĩa, Chức năng" },
      ]
    }
  ],
  [
    // Giai đoạn 2
    {
      day: 1,
      title: "Day 1",
      items: [
        { text: "Ôn tập kiến thức trung cấp" },
        { text: "Bài tập đọc hiểu", sub: "10 bài tập" },
        { text: "Bài tập nghe", sub: "10 bài tập" },
      ]
    },
    {
      day: 2,
      title: "Day 2",
      items: [
        { text: "Từ vựng nâng cao" },
        { text: "Bài tập điền từ nâng cao", sub: "8 bài tập" },
        { text: "Bài tập trắc nghiệm nâng cao", sub: "8 bài tập" },
      ]
    }
  ],
  [
    // Giai đoạn 3
    {
      day: 1,
      title: "Day 1",
      items: [
        { text: "Luyện đề Toeic thực tế" },
        { text: "Đề số 1", sub: "200 câu" },
      ]
    },
    {
      day: 2,
      title: "Day 2",
      items: [
        { text: "Luyện đề Toeic thực tế" },
        { text: "Đề số 2", sub: "200 câu" },
      ]
    }
  ]
];

const LearningPathScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'LearningPath'>>();
  const { currentLevel, targetLevel } = route.params;
  const [showDetail, setShowDetail] = useState<number | false>(false);

  // Determine number of stages based on currentLevel and targetLevel
  let stages = [
    {
      title: "Giai đoạn 1",
      info: [
        `• Điểm đầu vào: ${currentLevel}`,
        `• Mục tiêu đạt: ~${targetLevel} điểm`,
        "• Danh sách bài học: 45 bài",
        "• Số lượng bài tập: 1912 bài",
      ],
    },
    {
      title: "Giai đoạn 2",
      info: [
        `• Điểm đầu vào: ${targetLevel}`,
        "• Mục tiêu đạt: ~800 điểm",
        "• Danh sách bài học: 30 bài",
        "• Số lượng bài tập: 1200 bài",
      ],
    },
    {
      title: "Giai đoạn 3",
      info: [
        "• Điểm đầu vào: 800",
        "• Mục tiêu đạt: ~900 điểm",
        "• Danh sách bài học: 20 bài",
        "• Số lượng bài tập: 800 bài",
      ],
    },
  ];

  let stageCount = 3;
  if (currentLevel === '0-150' && targetLevel === '300') {
    stageCount = 1;
  } else if (currentLevel === '0-150' && targetLevel === '650+') {
    stageCount = 2;
  } else if (currentLevel === '300-450' && targetLevel === '650+') {
    stageCount = 1;
    stages = [stages[1]];
  } else if (currentLevel === '300-450' && targetLevel === '900') {
    stageCount = 2;
    stages = [stages[1], stages[2]];
  } else if (currentLevel === '600-700' && targetLevel === '900') {
    stageCount = 1;
    stages = [stages[2]];
  }

  const levelLabel = (level: string) => {
    switch (level) {
      case '0': return 'Mất gốc';
      case '300': return 'Trung cấp';
      case '600': return 'Cao cấp';
      case '650': return 'Khá';
      case '900': return 'Xuất sắc';
      default: return '';
    }
  };

  const handleStartLearning = () => {
    // Chuyển sang trang learningDayList
    // Nếu muốn truyền params, thêm params vào push
    // router.push({ pathname: '/learningPath/learningDayList', params: { ... } });
    // Nếu không cần params:
    // @ts-ignore
    if (typeof window !== "undefined" && window.location) {
      window.location.href = '/learningPath/learningDayList';
    } else if (typeof require !== "undefined") {
      // Native Expo Router
      // @ts-ignore
      const { useRouter } = require('expo-router');
      const router = useRouter();
      router.push('/learningPath/learningDayList');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Lộ trình học được xây dựng cho bạn</Text>

      <View style={styles.resultBox}>
        <Text>🎯 Điểm đầu vào: {currentLevel} ({levelLabel(currentLevel)})</Text>
        <Text>📈 Mục tiêu: {targetLevel} ({levelLabel(targetLevel)})</Text>
      </View>

      {/* Render stages based on logic */}
      {stages.slice(0, stageCount).map((stage, idx) => (
        <View style={styles.stageBox} key={stage.title}>
          <Text style={styles.stageTitle}>{stage.title}</Text>
          {stage.info.map((line, i) => (
            <Text key={i}>{line}</Text>
          ))}
          <TouchableOpacity onPress={() => setShowDetail(idx)}>
            <Text style={styles.detailLink}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Modal hiển thị chi tiết lộ trình */}
      <Modal visible={showDetail !== false} animationType="slide" onRequestClose={() => setShowDetail(false)}>
        <View style={styles.detailModalContainer}>
          <View style={styles.detailHeader}>
            <TouchableOpacity onPress={() => setShowDetail(false)}>
              <Text style={styles.closeButton}>←</Text>
            </TouchableOpacity>
            <Text style={styles.detailTitle}>Lộ trình học tập</Text>
            <View style={{ width: 30 }} />
          </View>
          <ScrollView style={styles.detailScroll}>
            {(showDetail !== false ? stageDetails[showDetail] : []).map((day, idx) => (
              <View key={day.day} style={styles.dayBlock}>
                <View style={styles.dayRow}>
                  <Text style={styles.dayNumber}>{idx + 1}.</Text>
                  <Text style={styles.dayTitle}>{day.title}</Text>
                </View>
                {day.items.map((item, i) => (
                  <View key={i} style={styles.detailItemRow}>
                    <Text style={styles.detailBullet}>○</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.detailItemText}>{item.text}</Text>
                      {item.sub && (
                        <Text style={styles.detailSubText}>{item.sub}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <View style={styles.buttonRow}>
        <Button mode="contained" onPress={handleStartLearning} style={styles.buttonGreen}>
          Học theo lộ trình này
        </Button>
      </View>
    </ScrollView>
  );
};

export default LearningPathScreen;

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  resultBox: {
    backgroundColor: '#FFF9E5',
    borderLeftColor: '#FFD700',
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  stageBox: {
    backgroundColor: '#E0F8E9',
    padding: 14,
    borderRadius: 6,
  },
  stageTitle: { fontWeight: 'bold', color: '#008A44', marginBottom: 8 },
  detailLink: { marginTop: 8, color: '#007AFF', textDecorationLine: 'underline' },
  buttonRow: { marginTop: 24 },
  buttonGreen: { backgroundColor: '#00B383' },
  detailModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#22C993',
  },
  closeButton: {
    fontSize: 24,
    color: '#fff',
    width: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  detailTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  detailScroll: {
    padding: 16,
    backgroundColor: '#fff',
  },
  dayBlock: {
    marginBottom: 18,
    borderLeftWidth: 2,
    borderLeftColor: '#22C993',
    paddingLeft: 16,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 6,
    color: '#222',
  },
  dayTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  detailItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
    marginLeft: 8,
  },
  detailBullet: {
    fontSize: 16,
    color: '#888',
    marginRight: 8,
    marginTop: 2,
  },
  detailItemText: {
    fontSize: 15,
    color: '#333',
  },
  detailSubText: {
    fontSize: 13,
    color: '#888',
    marginLeft: 2,
    marginTop: 1,
  },
});
