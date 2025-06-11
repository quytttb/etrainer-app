import React from 'react';
import {
     View,
     Text,
     TouchableOpacity,
     StyleSheet,
     Modal,
     ScrollView,
     Dimensions
} from 'react-native';
import { QuestionOverviewProps } from '../types';

// Get screen dimensions for responsive layout
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * QuestionOverview Component
 * Modal hiển thị grid trạng thái các câu hỏi (test mode only)
 * Cho phép jump navigation đến bất kỳ câu hỏi nào
 */
const QuestionOverview: React.FC<QuestionOverviewProps> = ({
     questions,
     currentIndex,
     questionStatuses,
     onQuestionSelect,
     onClose
}) => {
     // ============================================================================
     // COMPUTED VALUES
     // ============================================================================

     // Calculate statistics
     const stats = React.useMemo(() => {
          const total = questions.length;
          const answered = questionStatuses.filter(status => status === 'answered').length;
          const remaining = total - answered;
          const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

          return { total, answered, remaining, percentage };
     }, [questions.length, questionStatuses]);

     // Calculate grid layout
     const gridColumns = 6; // 6 questions per row
     const gridRows = Math.ceil(questions.length / gridColumns);

     // ============================================================================
     // HELPERS
     // ============================================================================

     // Get status color
     const getStatusColor = (status: string, isCurrent: boolean): string => {
          if (isCurrent) return '#007AFF';

          switch (status) {
               case 'answered': return '#28a745';
               case 'unanswered': return '#6c757d';
               default: return '#6c757d';
          }
     };

     // Get status icon
     const getStatusIcon = (status: string, isCurrent: boolean): string => {
          if (isCurrent) return '●';

          switch (status) {
               case 'answered': return '✓';
               case 'unanswered': return '○';
               default: return '○';
          }
     };

     // ============================================================================
     // EVENT HANDLERS
     // ============================================================================

     const handleQuestionPress = (index: number) => {
          onQuestionSelect(index);
     };

     // ============================================================================
     // RENDER HELPERS
     // ============================================================================

     // Render statistics header
     const renderStats = () => {
          return (
               <View style={styles.statsContainer}>
                    <Text style={styles.modalTitle}>Tổng quan câu hỏi</Text>

                    <View style={styles.statsRow}>
                         <View style={styles.statItem}>
                              <Text style={styles.statNumber}>{stats.answered}</Text>
                              <Text style={styles.statLabel}>Đã trả lời</Text>
                         </View>

                         <View style={styles.statItem}>
                              <Text style={styles.statNumber}>{stats.remaining}</Text>
                              <Text style={styles.statLabel}>Còn lại</Text>
                         </View>

                         <View style={styles.statItem}>
                              <Text style={styles.statNumber}>{stats.percentage}%</Text>
                              <Text style={styles.statLabel}>Hoàn thành</Text>
                         </View>
                    </View>
               </View>
          );
     };

     // Render legend
     const renderLegend = () => {
          return (
               <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                         <View style={[styles.legendIcon, { backgroundColor: '#28a745' }]}>
                              <Text style={styles.legendIconText}>✓</Text>
                         </View>
                         <Text style={styles.legendText}>Đã trả lời</Text>
                    </View>

                    <View style={styles.legendItem}>
                         <View style={[styles.legendIcon, { backgroundColor: '#007AFF' }]}>
                              <Text style={styles.legendIconText}>●</Text>
                         </View>
                         <Text style={styles.legendText}>Hiện tại</Text>
                    </View>

                    <View style={styles.legendItem}>
                         <View style={[styles.legendIcon, { backgroundColor: '#6c757d' }]}>
                              <Text style={styles.legendIconText}>○</Text>
                         </View>
                         <Text style={styles.legendText}>Chưa trả lời</Text>
                    </View>
               </View>
          );
     };

     // Render question grid
     const renderQuestionGrid = () => {
          return (
               <View style={styles.gridContainer}>
                    {Array.from({ length: gridRows }, (_, rowIndex) => (
                         <View key={rowIndex} style={styles.gridRow}>
                              {Array.from({ length: gridColumns }, (_, colIndex) => {
                                   const questionIndex = rowIndex * gridColumns + colIndex;

                                   // Skip if question doesn't exist
                                   if (questionIndex >= questions.length) {
                                        return <View key={colIndex} style={styles.gridItemSpacer} />;
                                   }

                                   const isCurrent = questionIndex === currentIndex;
                                   const status = questionStatuses[questionIndex] || 'unanswered';
                                   const question = questions[questionIndex];

                                   return (
                                        <TouchableOpacity
                                             key={colIndex}
                                             style={[
                                                  styles.gridItem,
                                                  {
                                                       backgroundColor: getStatusColor(status, isCurrent),
                                                       borderColor: isCurrent ? '#0056b3' : 'transparent',
                                                       borderWidth: isCurrent ? 3 : 1,
                                                  }
                                             ]}
                                             onPress={() => handleQuestionPress(questionIndex)}
                                        >
                                             <Text style={styles.gridItemNumber}>
                                                  {questionIndex + 1}
                                             </Text>

                                             <Text style={styles.gridItemIcon}>
                                                  {getStatusIcon(status, isCurrent)}
                                             </Text>

                                             {/* Question type indicator */}
                                             <Text style={styles.gridItemType}>
                                                  {question.type.replace(/_/g, ' ').substr(0, 8)}
                                             </Text>
                                        </TouchableOpacity>
                                   );
                              })}
                         </View>
                    ))}
               </View>
          );
     };

     // ============================================================================
     // MAIN RENDER
     // ============================================================================

     return (
          <Modal
               visible={true}
               animationType="slide"
               presentationStyle="pageSheet"
               onRequestClose={onClose}
          >
               <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                         {renderStats()}

                         <TouchableOpacity
                              style={styles.closeButton}
                              onPress={onClose}
                         >
                              <Text style={styles.closeButtonText}>✕</Text>
                         </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView
                         style={styles.scrollContainer}
                         contentContainerStyle={styles.scrollContent}
                         showsVerticalScrollIndicator={false}
                    >
                         {/* Legend */}
                         {renderLegend()}

                         {/* Question Grid */}
                         {renderQuestionGrid()}
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                         <TouchableOpacity
                              style={styles.doneButton}
                              onPress={onClose}
                         >
                              <Text style={styles.doneButtonText}>Đóng</Text>
                         </TouchableOpacity>
                    </View>
               </View>
          </Modal>
     );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
     modalContainer: {
          flex: 1,
          backgroundColor: '#ffffff',
     },

     header: {
          paddingTop: 20,
          paddingHorizontal: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
     },

     closeButton: {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: '#f8f9fa',
          justifyContent: 'center',
          alignItems: 'center',
     },

     closeButtonText: {
          fontSize: 18,
          fontWeight: '600',
          color: '#666',
     },

     statsContainer: {
          flex: 1,
     },

     modalTitle: {
          fontSize: 24,
          fontWeight: '700',
          color: '#333',
          marginBottom: 16,
     },

     statsRow: {
          flexDirection: 'row',
          justifyContent: 'space-around',
     },

     statItem: {
          alignItems: 'center',
     },

     statNumber: {
          fontSize: 28,
          fontWeight: '700',
          color: '#007AFF',
     },

     statLabel: {
          fontSize: 14,
          color: '#666',
          marginTop: 4,
     },

     scrollContainer: {
          flex: 1,
     },

     scrollContent: {
          padding: 20,
     },

     legendContainer: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: 24,
          paddingHorizontal: 16,
     },

     legendItem: {
          alignItems: 'center',
     },

     legendIcon: {
          width: 24,
          height: 24,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 4,
     },

     legendIconText: {
          fontSize: 12,
          color: 'white',
          fontWeight: '600',
     },

     legendText: {
          fontSize: 12,
          color: '#666',
          textAlign: 'center',
     },

     gridContainer: {
          alignItems: 'center',
     },

     gridRow: {
          flexDirection: 'row',
          marginBottom: 12,
     },

     gridItem: {
          width: 48,
          height: 60,
          borderRadius: 8,
          marginHorizontal: 4,
          padding: 4,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: '#dee2e6',
     },

     gridItemSpacer: {
          width: 48,
          height: 60,
          marginHorizontal: 4,
     },

     gridItemNumber: {
          fontSize: 14,
          fontWeight: '700',
          color: 'white',
     },

     gridItemIcon: {
          fontSize: 12,
          color: 'white',
     },

     gridItemType: {
          fontSize: 8,
          color: 'white',
          textAlign: 'center',
          opacity: 0.8,
     },

     footer: {
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
     },

     doneButton: {
          backgroundColor: '#007AFF',
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
     },

     doneButtonText: {
          fontSize: 18,
          fontWeight: '700',
          color: 'white',
     },
});

export default QuestionOverview; 