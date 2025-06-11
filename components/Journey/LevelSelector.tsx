import React, { useState } from "react";
import {
     View,
     Text,
     StyleSheet,
     TouchableOpacity,
     ScrollView,
     ActivityIndicator,
     Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import request from "@/api/request";
import { useMutation } from "@tanstack/react-query";

interface LevelSelectorProps {
     onJourneyCreated: () => void;
     onCancel?: () => void;
}

interface LevelOption {
     minScore: number;
     targetScore: number;
     title: string;
     description: string;
     icon: string;
     color: string;
     difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

const LEVEL_OPTIONS: LevelOption[] = [
     {
          minScore: 0,
          targetScore: 300,
          title: "Mất gốc",
          description: "Bắt đầu từ những kiến thức cơ bản nhất",
          icon: "seedling",
          color: "#4CAF50",
          difficulty: "BEGINNER"
     },
     {
          minScore: 0,
          targetScore: 450,
          title: "Cơ bản",
          description: "Xây dựng nền tảng vững chắc cho TOEIC",
          icon: "book",
          color: "#FFB347",
          difficulty: "BEGINNER"
     },
     {
          minScore: 300,
          targetScore: 650,
          title: "Trung cấp",
          description: "Nâng cao kỹ năng và đạt mục tiêu 650+",
          icon: "chart-line",
          color: "#42A5F5",
          difficulty: "INTERMEDIATE"
     },
     {
          minScore: 600,
          targetScore: 850,
          title: "Cao cấp",
          description: "Chinh phục điểm số cao và thành thạo TOEIC",
          icon: "graduation-cap",
          color: "#9C27B0",
          difficulty: "ADVANCED"
     },
     {
          minScore: 700,
          targetScore: 990,
          title: "Chuyên gia",
          description: "Đạt trình độ gần như bản xứ",
          icon: "trophy",
          color: "#FF5722",
          difficulty: "ADVANCED"
     }
];

export const LevelSelector: React.FC<LevelSelectorProps> = ({
     onJourneyCreated,
     onCancel
}) => {
     const [selectedLevel, setSelectedLevel] = useState<LevelOption | null>(null);
     const [showConfirmation, setShowConfirmation] = useState(false);

     const { mutate: createJourneyWithLevel, isPending: isCreating } = useMutation({
          mutationFn: async (levelOption: LevelOption) => {
               // Fetch stages based on selected level
               const stagesResponse = await request.get("/stages", {
                    params: {
                         minScore: levelOption.minScore,
                         maxScore: levelOption.targetScore,
                    },
               });

               const stages = Array.isArray(stagesResponse) ? stagesResponse : [];

               if (stages.length === 0) {
                    throw new Error("Không có giai đoạn nào phù hợp với level này");
               }

               // Create journey with selected stages
               await request.post("/journeys", {
                    stageIds: stages.map((stage) => stage._id),
               });

               return { stages, levelOption };
          },
          onSuccess: (data) => {
               Alert.alert(
                    "🎉 Thành công!",
                    `Đã tạo lộ trình học "${data.levelOption.title}" với ${data.stages.length} giai đoạn.`,
                    [
                         {
                              text: "Bắt đầu học",
                              onPress: () => {
                                   onJourneyCreated();
                              }
                         }
                    ]
               );
          },
          onError: (error) => {
               console.error("Error creating journey:", error);
               Alert.alert(
                    "❌ Lỗi",
                    "Không thể tạo lộ trình học. Vui lòng thử lại sau."
               );
          },
     });

     const handleLevelSelect = (level: LevelOption) => {
          setSelectedLevel(level);
          setShowConfirmation(true);
     };

     const handleConfirmLevel = () => {
          if (!selectedLevel) return;
          createJourneyWithLevel(selectedLevel);
          setShowConfirmation(false);
     };

     const handleBack = () => {
          if (showConfirmation) {
               setShowConfirmation(false);
          } else {
               onCancel?.();
          }
     };

     if (showConfirmation && selectedLevel) {
          return (
               <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.confirmationContainer}>
                         <View style={styles.confirmationHeader}>
                              <TouchableOpacity
                                   style={styles.backButton}
                                   onPress={handleBack}
                              >
                                   <FontAwesome5 name="arrow-left" size={20} color="#666" />
                              </TouchableOpacity>
                              <Text style={styles.confirmationTitle}>Xác nhận lựa chọn</Text>
                         </View>

                         <View style={[styles.selectedLevelCard, { borderColor: selectedLevel.color }]}>
                              <View style={[styles.selectedLevelBadge, { backgroundColor: selectedLevel.color }]}>
                                   <FontAwesome5 name={selectedLevel.icon} size={32} color="#fff" />
                              </View>
                              <Text style={styles.selectedLevelTitle}>{selectedLevel.title}</Text>
                              <Text style={styles.selectedLevelRange}>
                                   {selectedLevel.minScore} → {selectedLevel.targetScore} điểm
                              </Text>
                              <Text style={styles.selectedLevelDescription}>
                                   {selectedLevel.description}
                              </Text>
                         </View>

                         <View style={styles.levelDetailsContainer}>
                              <Text style={styles.levelDetailsTitle}>Bạn sẽ được:</Text>
                              <View style={styles.levelDetailsList}>
                                   <View style={styles.levelDetailItem}>
                                        <FontAwesome5 name="check-circle" size={16} color="#4CAF50" />
                                        <Text style={styles.levelDetailText}>
                                             Lộ trình học phù hợp với trình độ hiện tại
                                        </Text>
                                   </View>
                                   <View style={styles.levelDetailItem}>
                                        <FontAwesome5 name="check-circle" size={16} color="#4CAF50" />
                                        <Text style={styles.levelDetailText}>
                                             Bài tập và câu hỏi được cá nhân hóa
                                        </Text>
                                   </View>
                                   <View style={styles.levelDetailItem}>
                                        <FontAwesome5 name="check-circle" size={16} color="#4CAF50" />
                                        <Text style={styles.levelDetailText}>
                                             Theo dõi tiến trình học tập chi tiết
                                        </Text>
                                   </View>
                                   <View style={styles.levelDetailItem}>
                                        <FontAwesome5 name="check-circle" size={16} color="#4CAF50" />
                                        <Text style={styles.levelDetailText}>
                                             Kiểm tra đánh giá cuối mỗi giai đoạn
                                        </Text>
                                   </View>
                              </View>
                         </View>

                         <TouchableOpacity
                              style={[styles.confirmButton, { backgroundColor: selectedLevel.color }]}
                              onPress={handleConfirmLevel}
                              disabled={isCreating}
                         >
                              {isCreating ? (
                                   <ActivityIndicator color="#fff" />
                              ) : (
                                   <>
                                        <Text style={styles.confirmButtonText}>
                                             Tạo lộ trình "{selectedLevel.title}"
                                        </Text>
                                        <FontAwesome5 name="arrow-right" size={16} color="#fff" style={{ marginLeft: 8 }} />
                                   </>
                              )}
                         </TouchableOpacity>
                    </View>
               </ScrollView>
          );
     }

     return (
          <ScrollView
               style={styles.container}
               contentContainerStyle={styles.contentContainer}
               showsVerticalScrollIndicator={false}
          >
               <View style={styles.header}>
                    {onCancel && (
                         <TouchableOpacity
                              style={styles.backButton}
                              onPress={onCancel}
                         >
                              <FontAwesome5 name="times" size={20} color="#666" />
                         </TouchableOpacity>
                    )}
                    <Text style={styles.title}>Chọn trình độ của bạn</Text>
                    <Text style={styles.subtitle}>
                         Chúng tôi sẽ tạo lộ trình học phù hợp với level hiện tại của bạn
                    </Text>
               </View>

               <View style={styles.levelsContainer}>
                    {LEVEL_OPTIONS.map((level, index) => (
                         <TouchableOpacity
                              key={index}
                              style={[
                                   styles.levelCard,
                                   selectedLevel?.title === level.title && styles.selectedCard
                              ]}
                              onPress={() => handleLevelSelect(level)}
                              activeOpacity={0.7}
                         >
                              <View style={styles.levelCardContent}>
                                   <View style={[styles.levelBadge, { backgroundColor: level.color }]}>
                                        <FontAwesome5 name={level.icon} size={24} color="#fff" />
                                   </View>

                                   <View style={styles.levelInfo}>
                                        <Text style={styles.levelTitle}>{level.title}</Text>
                                        <Text style={styles.levelRange}>
                                             {level.minScore} → {level.targetScore} điểm
                                        </Text>
                                        <Text style={styles.levelDescription}>
                                             {level.description}
                                        </Text>
                                   </View>

                                   <View style={styles.levelArrow}>
                                        <FontAwesome5 name="chevron-right" size={16} color="#999" />
                                   </View>
                              </View>

                              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(level.difficulty) }]}>
                                   <Text style={styles.difficultyText}>
                                        {getDifficultyText(level.difficulty)}
                                   </Text>
                              </View>
                         </TouchableOpacity>
                    ))}
               </View>

               <View style={styles.footer}>
                    <View style={styles.footerInfo}>
                         <FontAwesome5 name="info-circle" size={16} color="#666" />
                         <Text style={styles.footerText}>
                              Bạn có thể thay đổi lộ trình bất cứ lúc nào sau này
                         </Text>
                    </View>
               </View>
          </ScrollView>
     );
};

const getDifficultyColor = (difficulty: string) => {
     switch (difficulty) {
          case "BEGINNER": return "#4CAF50";
          case "INTERMEDIATE": return "#FF9800";
          case "ADVANCED": return "#F44336";
          default: return "#666";
     }
};

const getDifficultyText = (difficulty: string) => {
     switch (difficulty) {
          case "BEGINNER": return "Người mới";
          case "INTERMEDIATE": return "Trung cấp";
          case "ADVANCED": return "Nâng cao";
          default: return "";
     }
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#fff",
     },
     contentContainer: {
          paddingHorizontal: 20,
          paddingBottom: 100,
     },
     header: {
          alignItems: "center",
          paddingVertical: 30,
          paddingBottom: 20,
     },
     backButton: {
          position: "absolute",
          top: 10,
          right: 0,
          padding: 8,
          borderRadius: 20,
          backgroundColor: "#f0f0f0",
     },
     title: {
          fontSize: 28,
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
          marginBottom: 8,
     },
     subtitle: {
          fontSize: 16,
          color: "#666",
          textAlign: "center",
          lineHeight: 22,
     },
     levelsContainer: {
          flex: 1,
     },
     levelCard: {
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 2,
          borderColor: "#f0f0f0",
     },
     selectedCard: {
          borderColor: "#0099CC",
          backgroundColor: "#F0F9FF",
     },
     levelCardContent: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
     },
     levelBadge: {
          width: 50,
          height: 50,
          borderRadius: 25,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 15,
     },
     levelInfo: {
          flex: 1,
     },
     levelTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
          marginBottom: 4,
     },
     levelRange: {
          fontSize: 14,
          color: "#0099CC",
          fontWeight: "600",
          marginBottom: 4,
     },
     levelDescription: {
          fontSize: 14,
          color: "#666",
          lineHeight: 18,
     },
     levelArrow: {
          marginLeft: 10,
     },
     difficultyBadge: {
          alignSelf: "flex-start",
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 12,
     },
     difficultyText: {
          color: "#fff",
          fontSize: 12,
          fontWeight: "bold",
     },
     footer: {
          paddingTop: 20,
          alignItems: "center",
     },
     footerInfo: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 20,
     },
     footerText: {
          marginLeft: 8,
          fontSize: 14,
          color: "#666",
     },
     // Confirmation styles
     confirmationContainer: {
          flex: 1,
          paddingTop: 20,
     },
     confirmationHeader: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 30,
     },
     confirmationTitle: {
          fontSize: 24,
          fontWeight: "bold",
          color: "#333",
          marginLeft: 15,
     },
     selectedLevelCard: {
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 30,
          alignItems: "center",
          marginBottom: 30,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
          borderWidth: 3,
     },
     selectedLevelBadge: {
          width: 80,
          height: 80,
          borderRadius: 40,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
     },
     selectedLevelTitle: {
          fontSize: 24,
          fontWeight: "bold",
          color: "#333",
          marginBottom: 8,
     },
     selectedLevelRange: {
          fontSize: 18,
          color: "#0099CC",
          fontWeight: "600",
          marginBottom: 12,
     },
     selectedLevelDescription: {
          fontSize: 16,
          color: "#666",
          textAlign: "center",
          lineHeight: 22,
     },
     levelDetailsContainer: {
          backgroundColor: "#f8f9fa",
          borderRadius: 16,
          padding: 20,
          marginBottom: 30,
     },
     levelDetailsTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
          marginBottom: 16,
     },
     levelDetailsList: {
          gap: 12,
     },
     levelDetailItem: {
          flexDirection: "row",
          alignItems: "center",
     },
     levelDetailText: {
          marginLeft: 12,
          fontSize: 16,
          color: "#666",
          lineHeight: 20,
     },
     confirmButton: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 25,
          marginTop: 10,
     },
     confirmButtonText: {
          color: "#fff",
          fontSize: 18,
          fontWeight: "bold",
     },
}); 