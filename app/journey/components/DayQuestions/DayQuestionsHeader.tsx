import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface DayQuestionsHeaderProps {
     dayNumber: number;
     currentType: string | null;
     questionsByType: Record<string, any[]>;
     completedTypes: Record<string, boolean>;
     onTypeSelect: (type: string) => void;
}

const LESSON_TYPE_MAPPING: Record<string, string> = {
     IMAGE_DESCRIPTION: "Mô tả hình ảnh",
     ASK_AND_ANSWER: "Hỏi và đáp",
     CONVERSATION_PIECE: "Đoạn hội thoại",
     SHORT_TALK: "Bài nói ngắn",
     FILL_IN_THE_BLANK_QUESTION: "Điền vào chỗ trống",
     FILL_IN_THE_PARAGRAPH: "Điền vào đoạn văn",
     READ_AND_UNDERSTAND: "Đọc hiểu",
     STAGE_FINAL_TEST: "Kiểm tra cuối",
};

const DayQuestionsHeader: React.FC<DayQuestionsHeaderProps> = ({
     dayNumber,
     currentType,
     questionsByType,
     completedTypes,
     onTypeSelect,
}) => {
     const getTypeIcon = (type: string): string => {
          switch (type) {
               case 'IMAGE_DESCRIPTION': return 'image';
               case 'ASK_AND_ANSWER': return 'question-circle';
               case 'CONVERSATION_PIECE': return 'comments';
               case 'SHORT_TALK': return 'microphone';
               case 'FILL_IN_THE_BLANK_QUESTION': return 'edit';
               case 'FILL_IN_THE_PARAGRAPH': return 'align-left';
               case 'READ_AND_UNDERSTAND': return 'book-open';
               case 'STAGE_FINAL_TEST': return 'graduation-cap';
               default: return 'circle';
          }
     };

     const getTotalProgress = (): number => {
          const totalTypes = Object.keys(questionsByType).length;
          const completedCount = Object.values(completedTypes).filter(Boolean).length;
          return totalTypes > 0 ? (completedCount / totalTypes) * 100 : 0;
     };

     return (
          <View style={styles.container}>
               <View style={styles.header}>
                    <Text style={styles.title}>Ngày {dayNumber}</Text>
                    <View style={styles.progressContainer}>
                         <Text style={styles.progressText}>
                              {Object.values(completedTypes).filter(Boolean).length}/
                              {Object.keys(questionsByType).length}
                         </Text>
                    </View>
               </View>

               <View style={styles.progressBar}>
                    <View
                         style={[styles.progressFill, { width: `${getTotalProgress()}%` }]}
                    />
               </View>

               <View style={styles.typesContainer}>
                    {Object.keys(questionsByType).map((type) => {
                         const isActive = currentType === type;
                         const isCompleted = completedTypes[type];
                         const questionCount = questionsByType[type]?.length || 0;

                         return (
                              <TouchableOpacity
                                   key={type}
                                   style={[
                                        styles.typeButton,
                                        isActive && styles.activeTypeButton,
                                        isCompleted && styles.completedTypeButton,
                                   ]}
                                   onPress={() => onTypeSelect(type)}
                              >
                                   <FontAwesome5
                                        name={getTypeIcon(type)}
                                        size={16}
                                        color={
                                             isCompleted ? '#fff' :
                                                  isActive ? '#007AFF' : '#666'
                                        }
                                   />
                                   <Text
                                        style={[
                                             styles.typeText,
                                             isActive && styles.activeTypeText,
                                             isCompleted && styles.completedTypeText,
                                        ]}
                                   >
                                        {LESSON_TYPE_MAPPING[type] || type}
                                   </Text>
                                   <Text
                                        style={[
                                             styles.typeCount,
                                             isActive && styles.activeTypeCount,
                                             isCompleted && styles.completedTypeCount,
                                        ]}
                                   >
                                        {questionCount}
                                   </Text>
                                   {isCompleted && (
                                        <FontAwesome5
                                             name="check"
                                             size={12}
                                             color="#fff"
                                             style={styles.checkIcon}
                                        />
                                   )}
                              </TouchableOpacity>
                         );
                    })}
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          backgroundColor: '#fff',
          paddingTop: 16,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
     },
     header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
     },
     title: {
          fontSize: 20,
          fontWeight: '600',
          color: '#333',
     },
     progressContainer: {
          backgroundColor: '#f5f5f5',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
     },
     progressText: {
          fontSize: 12,
          color: '#666',
          fontWeight: '500',
     },
     progressBar: {
          height: 4,
          backgroundColor: '#f0f0f0',
          borderRadius: 2,
          marginBottom: 16,
     },
     progressFill: {
          height: '100%',
          backgroundColor: '#4CAF50',
          borderRadius: 2,
     },
     typesContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          paddingBottom: 16,
     },
     typeButton: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: '#f5f5f5',
          borderWidth: 1,
          borderColor: '#e0e0e0',
          gap: 6,
     },
     activeTypeButton: {
          backgroundColor: '#e3f2fd',
          borderColor: '#007AFF',
     },
     completedTypeButton: {
          backgroundColor: '#4CAF50',
          borderColor: '#4CAF50',
     },
     typeText: {
          fontSize: 12,
          color: '#666',
          fontWeight: '500',
     },
     activeTypeText: {
          color: '#007AFF',
     },
     completedTypeText: {
          color: '#fff',
     },
     typeCount: {
          fontSize: 10,
          color: '#999',
          fontWeight: '600',
          backgroundColor: '#e0e0e0',
          paddingHorizontal: 4,
          paddingVertical: 1,
          borderRadius: 8,
          minWidth: 16,
          textAlign: 'center',
     },
     activeTypeCount: {
          backgroundColor: '#007AFF',
          color: '#fff',
     },
     completedTypeCount: {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          color: '#fff',
     },
     checkIcon: {
          marginLeft: 2,
     },
});

export default DayQuestionsHeader; 