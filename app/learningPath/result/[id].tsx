import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const LearningPathResultScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract result data from params
  const score = parseFloat(params.score as string) || 0;
  const correctAnswers = parseInt(params.correctAnswers as string) || 0;
  const totalQuestions = parseInt(params.totalQuestions as string) || 0;
  const passed = params.passed === 'true';
  const stageIndex = parseInt(params.id as string) || 0;

  const handleContinuePress = () => {
    // Navigate back to the journey study screen instead of learningDayList
    router.back();
  };

  const handleRetryPress = () => {
    // Navigate back to test
    router.push(`/learningPath/exam/${stageIndex}`);
  };

  const getScoreColor = () => {
    if (score >= 80) return '#4CAF50'; // Green for excellent
    if (score >= 60) return '#FF9800'; // Orange for good
    return '#f44336'; // Red for needs improvement
  };

  const getScoreMessage = () => {
    if (passed) {
      if (score >= 90) return 'Xuất sắc! Bạn đã hoàn thành giai đoạn này với kết quả tuyệt vời!';
      if (score >= 80) return 'Tốt lắm! Bạn đã vượt qua giai đoạn này thành công!';
      return 'Chúc mừng! Bạn đã đạt yêu cầu để tiếp tục giai đoạn tiếp theo.';
    } else {
      return 'Bạn chưa đạt điểm tối thiểu. Hãy ôn tập thêm và thử lại!';
    }
  };

  const getResultIcon = () => {
    if (passed) {
      return score >= 90 ? '🏆' : score >= 80 ? '🎉' : '✅';
    }
    return '📚';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kết quả bài test</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Result Content */}
      <View style={styles.content}>
        {/* Result Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.resultIcon}>{getResultIcon()}</Text>
        </View>

        {/* Stage Title */}
        <Text style={styles.stageTitle}>
          Bài Test Tổng Kết Giai Đoạn {stageIndex + 1}
        </Text>

        {/* Score Display */}
        <View style={[styles.scoreContainer, { borderColor: getScoreColor() }]}>
          <Text style={[styles.scoreText, { color: getScoreColor() }]}>
            {score.toFixed(1)}%
          </Text>
          <Text style={styles.scoreLabel}>Điểm số</Text>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{correctAnswers}</Text>
            <Text style={styles.statLabel}>Câu đúng</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalQuestions - correctAnswers}</Text>
            <Text style={styles.statLabel}>Câu sai</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalQuestions}</Text>
            <Text style={styles.statLabel}>Tổng câu</Text>
          </View>
        </View>

        {/* Result Message */}
        <View style={[styles.messageContainer, { backgroundColor: passed ? '#e8f5e8' : '#fff3e0' }]}>
          <Text style={[styles.messageText, { color: passed ? '#2e7d2e' : '#f57c00' }]}>
            {getScoreMessage()}
          </Text>
        </View>

        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: passed ? '#4CAF50' : '#FF9800' }]}>
          <Text style={styles.statusText}>
            {passed ? '✓ ĐẠT YÊU CẦU' : '⚠ CHƯA ĐẠT'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {!passed && (
          <TouchableOpacity style={styles.retryButton} onPress={handleRetryPress}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Làm lại</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.continueButton, !passed && styles.secondaryButton]}
          onPress={handleContinuePress}
        >
          <Text style={[styles.continueButtonText, !passed && styles.secondaryButtonText]}>
            {passed ? 'Tiếp tục học tập' : 'Quay lại lộ trình'}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={passed ? "#fff" : "#0099CC"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  resultIcon: {
    fontSize: 64,
    textAlign: 'center',
  },
  stageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  scoreContainer: {
    borderWidth: 3,
    borderRadius: 100,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  messageContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionContainer: {
    padding: 20,
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    gap: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#0099CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0099CC',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#0099CC',
  },
});

export default LearningPathResultScreen;
