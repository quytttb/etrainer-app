import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NavigationProps } from '../types';
import AudioManager from '../../../utils/AudioManager';

/**
 * Navigation Component
 * Handles question navigation với support cho jump navigation (test mode)
 */
const Navigation: React.FC<NavigationProps> = ({
     currentIndex,
     totalQuestions,
     allowJumpNavigation,
     showQuestionOverview,
     questionStatuses,
     canGoPrevious,
     canGoNext,
     onPrevious,
     onNext,
     onJumpTo,
     onShowOverview
}) => {
     // ============================================================================
     // HELPERS
     // ============================================================================

     // Get status color for question status
     const getStatusColor = (status: string): string => {
          switch (status) {
               case 'answered': return '#28a745';
               case 'current': return '#007AFF';
               case 'unanswered': return '#6c757d';
               default: return '#6c757d';
          }
     };

     // Get status icon
     const getStatusIcon = (status: string): string => {
          switch (status) {
               case 'answered': return '✓';
               case 'current': return '●';
               case 'unanswered': return '○';
               default: return '○';
          }
     };

     // ============================================================================
     // RENDER HELPERS
     // ============================================================================

     // Render jump navigation (test mode only)
     const renderJumpNavigation = () => {
          if (!allowJumpNavigation) return null;

          return (
               <View style={styles.jumpContainer}>
                    <ScrollView
                         horizontal
                         showsHorizontalScrollIndicator={false}
                         contentContainerStyle={styles.jumpScrollContent}
                    >
                         {Array.from({ length: totalQuestions }, (_, index) => {
                              const status = questionStatuses[index] || 'unanswered';
                              const isCurrent = index === currentIndex;

                              return (
                                   <TouchableOpacity
                                        key={index}
                                        style={[
                                             styles.jumpButton,
                                             {
                                                  backgroundColor: isCurrent ? '#007AFF' : getStatusColor(status),
                                                  opacity: isCurrent ? 1 : 0.8
                                             }
                                        ]}
                                        onPress={async () => {
                                             // ✅ FIX: Pause audio khi chuyển câu hỏi trong exam theo đề xuất của user
                                             try {
                                                  await AudioManager.pauseAllAudio();
                                                  console.log('🎵 Audio paused when jumping to question', index + 1);
                                             } catch (error) {
                                                  console.error('❌ Error pausing audio:', error);
                                             }
                                             onJumpTo(index);
                                        }}
                                   >
                                        <Text style={[
                                             styles.jumpButtonText,
                                             { color: isCurrent || status === 'answered' ? 'white' : '#666' }
                                        ]}>
                                             {index + 1}
                                        </Text>

                                        {status === 'answered' && !isCurrent && (
                                             <Text style={styles.checkmark}>✓</Text>
                                        )}
                                   </TouchableOpacity>
                              );
                         })}
                    </ScrollView>

                    {/* Overview button */}
                    {showQuestionOverview && (
                         <TouchableOpacity
                              style={styles.overviewButton}
                              onPress={onShowOverview}
                         >
                              <Text style={styles.overviewButtonText}>📋</Text>
                         </TouchableOpacity>
                    )}
               </View>
          );
     };

     // Render main navigation controls
     const renderMainControls = () => {
          return (
               <View style={styles.controlsRow}>
                    {/* Previous button */}
                    <TouchableOpacity
                         style={[
                              styles.navButton,
                              styles.previousButton,
                              !canGoPrevious && styles.disabledButton
                         ]}
                         onPress={async () => {
                              // ✅ FIX: Pause audio khi bấm nút Trước theo đề xuất của user
                              try {
                                   await AudioManager.pauseAllAudio();
                                   console.log('🎵 Audio paused when going to previous question');
                              } catch (error) {
                                   console.error('❌ Error pausing audio:', error);
                              }
                              onPrevious();
                         }}
                         disabled={!canGoPrevious}
                    >
                         <Text style={[
                              styles.navButtonText,
                              !canGoPrevious && styles.disabledButtonText
                         ]}>
                              ← Trước
                         </Text>
                    </TouchableOpacity>

                    {/* Question indicator */}
                    <View style={styles.questionIndicator}>
                         <Text style={styles.questionNumber}>
                              {currentIndex + 1}
                         </Text>
                         <Text style={styles.questionTotal}>
                              / {totalQuestions}
                         </Text>
                    </View>

                    {/* Next button */}
                    <TouchableOpacity
                         style={[
                              styles.navButton,
                              styles.nextButton,
                              !canGoNext && styles.disabledButton
                         ]}
                         onPress={async () => {
                              // ✅ FIX: Pause audio khi bấm nút Tiếp theo theo đề xuất của user
                              try {
                                   await AudioManager.pauseAllAudio();
                                   console.log('🎵 Audio paused when going to next question');
                              } catch (error) {
                                   console.error('❌ Error pausing audio:', error);
                              }
                              onNext();
                         }}
                         disabled={!canGoNext}
                    >
                         <Text style={[
                              styles.navButtonText,
                              !canGoNext && styles.disabledButtonText
                         ]}>
                              Tiếp →
                         </Text>
                    </TouchableOpacity>
               </View>
          );
     };

     // ============================================================================
     // MAIN RENDER
     // ============================================================================

     return (
          <View style={styles.container}>
               {/* Jump navigation for test mode */}
               {renderJumpNavigation()}

               {/* Main navigation controls */}
               {renderMainControls()}
          </View>
     );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
     container: {
          backgroundColor: '#f8f9fa',
     },

     // Jump Navigation Styles
     jumpContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
     },

     jumpScrollContent: {
          paddingRight: 16,
     },

     jumpButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
          borderWidth: 1,
          borderColor: '#dee2e6',
          position: 'relative',
     },

     jumpButtonText: {
          fontSize: 14,
          fontWeight: '600',
     },

     checkmark: {
          position: 'absolute',
          top: -4,
          right: -4,
          fontSize: 12,
          color: '#28a745',
          backgroundColor: 'white',
          borderRadius: 6,
          width: 12,
          height: 12,
          textAlign: 'center',
          lineHeight: 12,
     },

     overviewButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: '#6c757d',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 8,
     },

     overviewButtonText: {
          fontSize: 16,
     },

     // Main Controls Styles
     controlsRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 12,
          paddingHorizontal: 16,
     },

     navButton: {
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 8,
          minWidth: 80,
          alignItems: 'center',
     },

     previousButton: {
          backgroundColor: '#6c757d',
     },

     nextButton: {
          backgroundColor: '#007AFF',
     },

     disabledButton: {
          backgroundColor: '#e9ecef',
          opacity: 0.6,
     },

     navButtonText: {
          fontSize: 16,
          fontWeight: '600',
          color: 'white',
     },

     disabledButtonText: {
          color: '#adb5bd',
     },

     questionIndicator: {
          alignItems: 'center',
          paddingHorizontal: 16,
     },

     questionNumber: {
          fontSize: 24,
          fontWeight: '700',
          color: '#333',
     },

     questionTotal: {
          fontSize: 14,
          color: '#666',
          marginTop: -2,
     },
});

export default Navigation; 