import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SubmitButtonProps } from '../types';

/**
 * SubmitButton Component
 * Smart submit button cho cả lesson và test modes
 * Handles different behaviors dựa trên mode và state
 */
const SubmitButton: React.FC<SubmitButtonProps> = ({
     mode,
     requireConfirmation,
     isLastQuestion,
     hasAnswered,
     isSubmitting,
     onSubmit,
     onNext
}) => {
     // ============================================================================
     // COMPUTED VALUES
     // ============================================================================

     // Determine button behavior based on mode and state
     const getButtonBehavior = () => {
          // Lesson mode: Chỉ hiển thị submit button, không có next
          if (mode === 'LESSON') {
               return {
                    action: 'submit',
                    text: isLastQuestion ? 'Hoàn thành bài học' : 'Hoàn thành bài học',
                    icon: '✓',
                    color: '#28a745',
                    disabled: !hasAnswered || isSubmitting
               };
          }

          // Test mode: Always submit when ready
          if (mode === 'FINAL_TEST') {
               return {
                    action: 'submit',
                    text: 'Nộp bài thi', // Đồng bộ tên nút cho tất cả câu
                    icon: '📝',
                    color: '#dc3545',
                    disabled: isSubmitting
               };
          }

          // Fallback
          return {
               action: 'submit',
               text: 'Hoàn thành',
               icon: '✓',
               color: '#28a745',
               disabled: !hasAnswered || isSubmitting
          };
     };

     const buttonBehavior = getButtonBehavior();

     // ============================================================================
     // EVENT HANDLERS
     // ============================================================================

     const handlePress = () => {
          if (buttonBehavior.disabled) return;

          if (buttonBehavior.action === 'next') {
               onNext();
          } else {
               onSubmit();
          }
     };

     // ============================================================================
     // RENDER HELPERS
     // ============================================================================

     // Render button content
     const renderButtonContent = () => {
          if (isSubmitting) {
               return (
                    <View style={styles.buttonContent}>
                         <ActivityIndicator size="small" color="white" />
                         <Text style={styles.submittingText}>
                              {mode === 'LESSON' ? 'Đang lưu...' : 'Đang nộp bài...'}
                         </Text>
                    </View>
               );
          }

          return (
               <View style={styles.buttonContent}>
                    <Text style={styles.buttonIcon}>{buttonBehavior.icon}</Text>
                    <Text style={styles.buttonText}>{buttonBehavior.text}</Text>
               </View>
          );
     };

     // Render progress hint for lesson mode
     const renderProgressHint = () => {
          if (mode !== 'LESSON' || !hasAnswered) return null;

          return (
               <Text style={styles.progressHint}>
                    {isLastQuestion
                         ? 'Hoàn thành bài học để xem kết quả'
                         : 'Chọn đáp án để tiếp tục'
                    }
               </Text>
          );
     };

     // Render warning for test mode
     const renderTestWarning = () => {
          if (mode !== 'FINAL_TEST' || !requireConfirmation) return null;

          return (
               <Text style={styles.testWarning}>
                    ⚠️ Sau khi nộp bài sẽ không thể thay đổi đáp án
               </Text>
          );
     };

     // ============================================================================
     // MAIN RENDER
     // ============================================================================

     return (
          <View style={styles.container}>
               {/* Progress hint for lesson */}
               {renderProgressHint()}

               {/* Warning for test */}
               {renderTestWarning()}

               {/* Main submit button */}
               <TouchableOpacity
                    style={[
                         styles.submitButton,
                         {
                              backgroundColor: buttonBehavior.disabled
                                   ? '#e9ecef'
                                   : buttonBehavior.color
                         },
                         buttonBehavior.disabled && styles.disabledButton
                    ]}
                    onPress={handlePress}
                    disabled={buttonBehavior.disabled}
               >
                    {renderButtonContent()}
               </TouchableOpacity>

               {/* Additional info */}
               {mode === 'LESSON' && !hasAnswered && (
                    <Text style={styles.answerHint}>
                         Vui lòng chọn đáp án trước khi tiếp tục
                    </Text>
               )}
          </View>
     );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
     container: {
          paddingTop: 16,
          alignItems: 'center',
     },

     progressHint: {
          fontSize: 14,
          color: '#28a745',
          fontWeight: '500',
          marginBottom: 8,
          textAlign: 'center',
     },

     testWarning: {
          fontSize: 12,
          color: '#dc3545',
          fontWeight: '500',
          marginBottom: 12,
          textAlign: 'center',
          paddingHorizontal: 16,
     },

     submitButton: {
          paddingHorizontal: 32,
          paddingVertical: 16,
          borderRadius: 12,
          minWidth: 200,
          alignItems: 'center',
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
     },

     disabledButton: {
          elevation: 0,
          shadowOpacity: 0,
          opacity: 0.6,
     },

     buttonContent: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
     },

     buttonIcon: {
          fontSize: 18,
          marginRight: 8,
     },

     buttonText: {
          fontSize: 18,
          fontWeight: '700',
          color: 'white',
     },

     submittingText: {
          fontSize: 16,
          fontWeight: '600',
          color: 'white',
          marginLeft: 8,
     },

     answerHint: {
          fontSize: 12,
          color: '#6c757d',
          fontStyle: 'italic',
          marginTop: 8,
          textAlign: 'center',
     },
});

export default SubmitButton; 