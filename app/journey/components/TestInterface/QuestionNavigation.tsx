import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface QuestionNavigationProps {
     visible: boolean;
     onClose: () => void;
     questions: any[];
     currentQuestionIndex: number;
     userAnswers: Record<string, any[]>;
     onQuestionSelect: (index: number) => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
     visible,
     onClose,
     questions,
     currentQuestionIndex,
     userAnswers,
     onQuestionSelect
}) => {
     const getQuestionStatus = (index: number): "answered" | "current" | "unanswered" => {
          if (index === currentQuestionIndex) return "current";
          const question = questions[index];
          if (question && userAnswers[question._id] && userAnswers[question._id].length > 0) {
               return "answered";
          }
          return "unanswered";
     };

     const getStatusColor = (status: string) => {
          switch (status) {
               case "answered": return "#4CAF50";
               case "current": return "#2196F3";
               case "unanswered": return "#ddd";
               default: return "#ddd";
          }
     };

     const getStatusIcon = (status: string) => {
          switch (status) {
               case "answered": return "check";
               case "current": return "arrow-right";
               case "unanswered": return "circle";
               default: return "circle";
          }
     };

     const getAnsweredCount = (): number => {
          return questions.filter((question, index) =>
               index !== currentQuestionIndex &&
               userAnswers[question._id] &&
               userAnswers[question._id].length > 0
          ).length;
     };

     return (
          <Modal
               visible={visible}
               animationType="slide"
               transparent={true}
               onRequestClose={onClose}
          >
               <View style={styles.overlay}>
                    <View style={styles.container}>
                         <View style={styles.header}>
                              <Text style={styles.title}>Danh sách câu hỏi</Text>
                              <TouchableOpacity onPress={onClose}>
                                   <FontAwesome5 name="times" size={20} color="#666" />
                              </TouchableOpacity>
                         </View>

                         <View style={styles.stats}>
                              <Text style={styles.statsText}>
                                   Đã trả lời: {getAnsweredCount()}/{questions.length} câu
                              </Text>
                         </View>

                         <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                              <View style={styles.grid}>
                                   {questions.map((question, index) => {
                                        const status = getQuestionStatus(index);
                                        const color = getStatusColor(status);
                                        const icon = getStatusIcon(status);

                                        return (
                                             <TouchableOpacity
                                                  key={index}
                                                  style={[
                                                       styles.questionItem,
                                                       { borderColor: color }
                                                  ]}
                                                  onPress={() => {
                                                       onQuestionSelect(index);
                                                       onClose();
                                                  }}
                                             >
                                                  <Text style={[styles.questionNumber, { color }]}>
                                                       {index + 1}
                                                  </Text>
                                                  <FontAwesome5
                                                       name={icon}
                                                       size={12}
                                                       color={color}
                                                       style={styles.questionIcon}
                                                  />
                                             </TouchableOpacity>
                                        );
                                   })}
                              </View>
                         </ScrollView>

                         <View style={styles.legend}>
                              <View style={styles.legendItem}>
                                   <FontAwesome5 name="check" size={12} color="#4CAF50" />
                                   <Text style={styles.legendText}>Đã trả lời</Text>
                              </View>
                              <View style={styles.legendItem}>
                                   <FontAwesome5 name="arrow-right" size={12} color="#2196F3" />
                                   <Text style={styles.legendText}>Hiện tại</Text>
                              </View>
                              <View style={styles.legendItem}>
                                   <FontAwesome5 name="circle" size={12} color="#ddd" />
                                   <Text style={styles.legendText}>Chưa trả lời</Text>
                              </View>
                         </View>
                    </View>
               </View>
          </Modal>
     );
};

const styles = StyleSheet.create({
     overlay: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
     },
     container: {
          width: '90%',
          maxHeight: '80%',
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 20,
     },
     header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
     },
     title: {
          fontSize: 18,
          fontWeight: '600',
          color: '#333',
     },
     stats: {
          backgroundColor: '#f5f5f5',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
     },
     statsText: {
          fontSize: 14,
          color: '#666',
          textAlign: 'center',
     },
     scrollView: {
          flex: 1,
     },
     grid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
     },
     questionItem: {
          width: '18%',
          aspectRatio: 1,
          borderWidth: 2,
          borderRadius: 8,
          marginBottom: 12,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
     },
     questionNumber: {
          fontSize: 16,
          fontWeight: '600',
     },
     questionIcon: {
          position: 'absolute',
          top: 2,
          right: 2,
     },
     legend: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 16,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
     },
     legendItem: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
     },
     legendText: {
          fontSize: 12,
          color: '#666',
     },
});

export default QuestionNavigation; 