import React from 'react';
import {
     View,
     Text,
     StyleSheet,
     TouchableOpacity,
     Modal,
     Animated,
     Dimensions,
     ScrollView
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface ExplanationModalProps {
     visible: boolean;
     onClose: () => void;
     subtitle: string;
     explanation: string;
     activeTab: string;
     onTabChange: (tab: string) => void;
     translateYAnim: Animated.Value;
}

const { height: screenHeight } = Dimensions.get('window');

const ExplanationModal: React.FC<ExplanationModalProps> = ({
     visible,
     onClose,
     subtitle,
     explanation,
     activeTab,
     onTabChange,
     translateYAnim,
}) => {
     return (
          <Modal
               visible={visible}
               transparent={true}
               animationType="none"
               onRequestClose={onClose}
          >
               <View style={styles.modalOverlay}>
                    <TouchableOpacity
                         style={styles.backdrop}
                         activeOpacity={1}
                         onPress={onClose}
                    />

                    <Animated.View
                         style={[
                              styles.modalContainer,
                              {
                                   transform: [{ translateY: translateYAnim }]
                              }
                         ]}
                    >
                         {/* Header */}
                         <View style={styles.modalHeader}>
                              <View style={styles.dragHandle} />
                              <View style={styles.headerContent}>
                                   <Text style={styles.modalTitle}>Giải thích</Text>
                                   <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                        <FontAwesome5 name="times" size={20} color="#666" />
                                   </TouchableOpacity>
                              </View>
                         </View>

                         {/* Tabs */}
                         <View style={styles.tabContainer}>
                              <TouchableOpacity
                                   style={[
                                        styles.tab,
                                        activeTab === "explanation" && styles.activeTab
                                   ]}
                                   onPress={() => onTabChange("explanation")}
                              >
                                   <FontAwesome5
                                        name="lightbulb"
                                        size={16}
                                        color={activeTab === "explanation" ? "#007AFF" : "#666"}
                                   />
                                   <Text
                                        style={[
                                             styles.tabText,
                                             activeTab === "explanation" && styles.activeTabText
                                        ]}
                                   >
                                        Giải thích
                                   </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                   style={[
                                        styles.tab,
                                        activeTab === "transcript" && styles.activeTab
                                   ]}
                                   onPress={() => onTabChange("transcript")}
                              >
                                   <FontAwesome5
                                        name="file-alt"
                                        size={16}
                                        color={activeTab === "transcript" ? "#007AFF" : "#666"}
                                   />
                                   <Text
                                        style={[
                                             styles.tabText,
                                             activeTab === "transcript" && styles.activeTabText
                                        ]}
                                   >
                                        Phụ đề
                                   </Text>
                              </TouchableOpacity>
                         </View>

                         {/* Content */}
                         <ScrollView
                              style={styles.modalContent}
                              showsVerticalScrollIndicator={false}
                         >
                              {activeTab === "explanation" ? (
                                   <View style={styles.explanationContent}>
                                        <Text style={styles.explanationText}>
                                             {explanation || "Không có giải thích cho câu hỏi này."}
                                        </Text>
                                   </View>
                              ) : (
                                   <View style={styles.transcriptContent}>
                                        <Text style={styles.transcriptText}>
                                             {subtitle || "Không có phụ đề cho câu hỏi này."}
                                        </Text>
                                   </View>
                              )}
                         </ScrollView>
                    </Animated.View>
               </View>
          </Modal>
     );
};

const styles = StyleSheet.create({
     modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
     },
     backdrop: {
          flex: 1,
     },
     modalContainer: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: screenHeight * 0.7,
          minHeight: 300,
     },
     modalHeader: {
          paddingTop: 12,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
     },
     dragHandle: {
          width: 40,
          height: 4,
          backgroundColor: '#ddd',
          borderRadius: 2,
          alignSelf: 'center',
          marginBottom: 12,
     },
     headerContent: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
     },
     modalTitle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#333',
     },
     closeButton: {
          padding: 4,
     },
     tabContainer: {
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingTop: 16,
          gap: 8,
     },
     tab: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 20,
          backgroundColor: '#f5f5f5',
          gap: 6,
     },
     activeTab: {
          backgroundColor: '#e3f2fd',
     },
     tabText: {
          fontSize: 14,
          color: '#666',
          fontWeight: '500',
     },
     activeTabText: {
          color: '#007AFF',
     },
     modalContent: {
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
     },
     explanationContent: {
          paddingBottom: 40,
     },
     explanationText: {
          fontSize: 16,
          lineHeight: 24,
          color: '#333',
     },
     transcriptContent: {
          paddingBottom: 40,
     },
     transcriptText: {
          fontSize: 14,
          lineHeight: 22,
          color: '#555',
          fontFamily: 'monospace',
          backgroundColor: '#f8f9fa',
          padding: 16,
          borderRadius: 8,
     },
});

export default ExplanationModal; 