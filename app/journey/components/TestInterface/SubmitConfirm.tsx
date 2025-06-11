import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface SubmitConfirmProps {
     visible: boolean;
     onClose: () => void;
     onConfirm: () => void;
     answeredCount: number;
     totalQuestions: number;
     timeRemaining: number;
}

const SubmitConfirm: React.FC<SubmitConfirmProps> = ({
     visible,
     onClose,
     onConfirm,
     answeredCount,
     totalQuestions,
     timeRemaining
}) => {
     const formatTime = (seconds: number): string => {
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          const secs = seconds % 60;

          if (hours > 0) {
               return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          }
          return `${minutes}:${secs.toString().padStart(2, '0')}`;
     };

     const handleConfirm = () => {
          if (answeredCount < totalQuestions) {
               Alert.alert(
                    "Cảnh báo",
                    `Bạn chưa trả lời ${totalQuestions - answeredCount} câu hỏi. Bạn có chắc chắn muốn nộp bài không?`,
                    [
                         { text: "Hủy", style: "cancel" },
                         {
                              text: "Nộp bài",
                              style: "destructive",
                              onPress: onConfirm
                         }
                    ]
               );
          } else {
               onConfirm();
          }
     };

     const completionPercentage = (answeredCount / totalQuestions) * 100;

     return (
          <Modal
               visible={visible}
               animationType="fade"
               transparent={true}
               onRequestClose={onClose}
          >
               <View style={styles.overlay}>
                    <View style={styles.container}>
                         <View style={styles.header}>
                              <FontAwesome5 name="clipboard-check" size={24} color="#4CAF50" />
                              <Text style={styles.title}>Xác nhận nộp bài</Text>
                         </View>

                         <View style={styles.content}>
                              <View style={styles.statsSection}>
                                   <Text style={styles.sectionTitle}>Thống kê bài làm</Text>

                                   <View style={styles.statItem}>
                                        <FontAwesome5 name="check-circle" size={16} color="#4CAF50" />
                                        <Text style={styles.statText}>
                                             Đã trả lời: {answeredCount}/{totalQuestions} câu
                                        </Text>
                                   </View>

                                   <View style={styles.statItem}>
                                        <FontAwesome5 name="clock" size={16} color="#ff9800" />
                                        <Text style={styles.statText}>
                                             Thời gian còn lại: {formatTime(timeRemaining)}
                                        </Text>
                                   </View>

                                   <View style={styles.progressContainer}>
                                        <Text style={styles.progressText}>
                                             Hoàn thành: {completionPercentage.toFixed(0)}%
                                        </Text>
                                        <View style={styles.progressBar}>
                                             <View
                                                  style={[
                                                       styles.progressFill,
                                                       { width: `${completionPercentage}%` }
                                                  ]}
                                             />
                                        </View>
                                   </View>
                              </View>

                              {answeredCount < totalQuestions && (
                                   <View style={styles.warningSection}>
                                        <FontAwesome5 name="exclamation-triangle" size={16} color="#ff5722" />
                                        <Text style={styles.warningText}>
                                             Bạn chưa trả lời {totalQuestions - answeredCount} câu hỏi.
                                             Các câu chưa trả lời sẽ được tính là sai.
                                        </Text>
                                   </View>
                              )}
                         </View>

                         <View style={styles.actions}>
                              <TouchableOpacity
                                   style={styles.cancelButton}
                                   onPress={onClose}
                              >
                                   <Text style={styles.cancelText}>Hủy</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                   style={styles.confirmButton}
                                   onPress={handleConfirm}
                              >
                                   <Text style={styles.confirmText}>Nộp bài</Text>
                              </TouchableOpacity>
                         </View>
                    </View>
               </View>
          </Modal>
     );
};

const styles = StyleSheet.create({
     overlay: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'center',
          alignItems: 'center',
     },
     container: {
          width: '85%',
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 24,
          maxHeight: '70%',
     },
     header: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
          gap: 12,
     },
     title: {
          fontSize: 20,
          fontWeight: '600',
          color: '#333',
     },
     content: {
          marginBottom: 24,
     },
     statsSection: {
          marginBottom: 16,
     },
     sectionTitle: {
          fontSize: 16,
          fontWeight: '600',
          color: '#333',
          marginBottom: 12,
     },
     statItem: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
          gap: 8,
     },
     statText: {
          fontSize: 14,
          color: '#666',
     },
     progressContainer: {
          marginTop: 12,
     },
     progressText: {
          fontSize: 14,
          color: '#666',
          marginBottom: 6,
     },
     progressBar: {
          height: 8,
          backgroundColor: '#f0f0f0',
          borderRadius: 4,
          overflow: 'hidden',
     },
     progressFill: {
          height: '100%',
          backgroundColor: '#4CAF50',
     },
     warningSection: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          backgroundColor: '#fff3e0',
          padding: 12,
          borderRadius: 8,
          gap: 8,
     },
     warningText: {
          fontSize: 14,
          color: '#e65100',
          flex: 1,
          lineHeight: 20,
     },
     actions: {
          flexDirection: 'row',
          gap: 12,
     },
     cancelButton: {
          flex: 1,
          paddingVertical: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ddd',
          alignItems: 'center',
     },
     cancelText: {
          fontSize: 16,
          color: '#666',
          fontWeight: '500',
     },
     confirmButton: {
          flex: 1,
          paddingVertical: 12,
          borderRadius: 8,
          backgroundColor: '#4CAF50',
          alignItems: 'center',
     },
     confirmText: {
          fontSize: 16,
          color: '#fff',
          fontWeight: '600',
     },
});

export default SubmitConfirm; 