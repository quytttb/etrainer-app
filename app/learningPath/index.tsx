import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 

const LearningPath = () => {
  const [completedDays, setCompletedDays] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [evaluationScores, setEvaluationScores] = useState([
    { day: 1, correct: 3, total: 6 },
    { day: 2, correct: 0, total: 0 },
    { day: 3, correct: 0, total: 0 },
  ]); // Track evaluation scores for each day
  const router = useRouter(); 

  const isDayDisabled = (day: number) => completedDays < day - 1;

  return (
    <View style={styles.container}>
      {/* Header Box */}
      <View style={styles.headerBox}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.pointsCircle}
            onPress={() => setIsModalVisible(true)} // Show modal on press
          >
            <Text style={styles.points}>700</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Lộ trình</Text>
          <TouchableOpacity onPress={() => router.push('/study-schedule/detail/1')}> 
            <Image
              source={require('../../assets/images/map.png')}
              style={styles.mapImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for changing learning path */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)} // Close modal on request
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bạn muốn đổi lộ trình?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setIsModalVisible(false);
                  router.push('/plan-study'); // Navigate to the plan-study page
                }}
              >
                <Text style={styles.modalButtonText}>Đồng ý</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressBarContainer}>
          <Text style={styles.dayText}>Ngày 1</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.dayText}>3</Text>
        </View>
        <Text style={styles.evaluationText}>Đánh giá</Text>
        <Text style={styles.evaluationScore}>0/0</Text>
      </View>

      {/* Content Section */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Dạng 1: Mô Tả Hình Ảnh</Text>

        {/* Ngày 1 */}
        <View style={styles.cardDayBox}>
          <Text style={styles.cardDay}>Ngày 1</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Luyện tập</Text>
          <View style={styles.horizontalContainer}>
            <Text style={styles.cardSubtitle}>30 câu hỏi</Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => router.push('learningPath/introduce')} // Navigate to the introduce page
            >
              <Text style={styles.startButtonText}>Bắt đầu</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.evaluationCard}>
          <TouchableOpacity
            style={styles.evaluationCardTouchable}
            onPress={() => router.push('/learningPath/examEvaluate/[id]')} // Ensure correct navigation path
          >
            <Image source={require('../../assets/images/books.png')} style={styles.evaluationImage} />
            <View style={styles.evaluationTextContainer}>
              <Text style={styles.evaluationText}>Đánh giá</Text>
              <Text style={styles.evaluationScore}>
                {evaluationScores[0].correct}/{evaluationScores[0].total} Trả lời đúng
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Ngày 2 */}
        <View
          style={[
            styles.cardDayBox,
            isDayDisabled(2) && styles.disabledCardDayBox,
          ]}
        >
          <Text
            style={[
              styles.cardDay,
              isDayDisabled(2) && styles.disabledCardDay,
            ]}
          >
            Ngày 2
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Luyện tập</Text>
          <View style={styles.horizontalContainer}>
            <Text style={styles.cardSubtitle}>30 câu hỏi</Text>
            <TouchableOpacity
              style={[
                styles.startButton,
                isDayDisabled(2) && styles.disabledButton,
              ]}
              disabled={isDayDisabled(2)}
            >
              <Text
                style={[
                  styles.startButtonText,
                  isDayDisabled(2) && styles.disabledButtonText,
                ]}
              >
                Bắt đầu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.evaluationCard}>
          <TouchableOpacity
            style={styles.evaluationCardTouchable}
            disabled={isDayDisabled(2)}
          >
            <Image source={require('../../assets/images/books.png')} style={styles.evaluationImage} />
            <View style={styles.evaluationTextContainer}>
              <Text style={styles.evaluationText}>Đánh giá</Text>
              <Text style={styles.evaluationScore}>
                {evaluationScores[1].correct}/{evaluationScores[1].total} Trả lời đúng
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Ngày 3 */}
        <View
          style={[
            styles.cardDayBox,
            isDayDisabled(3) && styles.disabledCardDayBox,
          ]}
        >
          <Text
            style={[
              styles.cardDay,
              isDayDisabled(3) && styles.disabledCardDay,
            ]}
          >
            Ngày 3
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Luyện tập</Text>
          <View style={styles.horizontalContainer}>
            <Text style={styles.cardSubtitle}>30 câu hỏi</Text>
            <TouchableOpacity
              style={[
                styles.startButton,
                isDayDisabled(3) && styles.disabledButton,
              ]}
              disabled={isDayDisabled(3)}
            >
              <Text
                style={[
                  styles.startButtonText,
                  isDayDisabled(3) && styles.disabledButtonText,
                ]}
              >
                Bắt đầu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.evaluationCard}>
          <TouchableOpacity
            style={styles.evaluationCardTouchable}
            disabled={isDayDisabled(3)}
          >
            <Image source={require('../../assets/images/books.png')} style={styles.evaluationImage} />
            <View style={styles.evaluationTextContainer}>
              <Text style={styles.evaluationText}>Đánh giá</Text>
              <Text style={styles.evaluationScore}>
                {evaluationScores[2].correct}/{evaluationScores[2].total} Trả lời đúng
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#ffff' 
  },
  headerBox: { 
    backgroundColor: '#0099CC', 
    padding: 14, 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
  },
  pointsCircle: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  points: { 
    fontSize: 18, 
    color: '#0099CC', 
    fontWeight: 'bold' 
  },
  title: { 
    fontSize: 25, 
    fontWeight: 'bold', 
    color: '#FFFFFF',
  },
  mapImage: {
    width: 30,
    height: 30,
    marginLeft: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  progressSection: { 
    padding: 16, 
    backgroundColor: '#FFFFFF', 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
  },
  progressBarContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  dayText: { 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  progressBar: { 
    flex: 1, 
    height: 8, 
    backgroundColor: '#E0E0E0', 
    marginHorizontal: 8, 
    borderRadius: 4 },
  progressFill: { 
    width: '33%', 
    height: '100%', 
    backgroundColor: '#00C853', 
    borderRadius: 4 
  },
  evaluationText: { 
    marginTop: 8, 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  evaluationScore: { 
    fontSize: 14, 
    color: '#757575' 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 16 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginVertical: 8 
  },
  card: { 
    backgroundColor: '#E0F7FA', 
    padding: 16, borderRadius: 8, 
    marginBottom: 16, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
  },
  cardDayBox: {
    backgroundColor: '#0099CC',
    padding: 8,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  cardDay: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#FFFF' 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginVertical: 4 
  },
  cardSubtitle: { 
    fontSize: 14, 
    color: '#757575' 
  },
  startButton: { 
    backgroundColor: '#0099CC', 
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20, 
    marginTop: 8 
  },
  startButtonText: { 
    color: '#FFFFFF', 
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 14,
  },
  evaluationCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    padding: 18, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 8, 
    marginBottom: 16, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
  },
  evaluationCardTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  evaluationTextContainer: {
    flex: 1,
  },
  evaluationImage: {
    width: 40,
    height: 40,
    marginLeft: -2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  clockIcon: {
    marginRight: 4,
  },
  evaluationTime: {
    fontSize: 14,
    color: '#757575',
  },
  additionalDay: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginTop: 8
  },
  additionalTask: { 
    fontSize: 14, 
    color: '#757575', 
    marginLeft: 16 
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  disabledCardDayBox: {
    backgroundColor: '#E0E0E0',
  },
  disabledCardDay: {
    color: '#A0A0A0',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  disabledButtonText: {
    color: '#A0A0A0',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#0099CC',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default LearningPath;
