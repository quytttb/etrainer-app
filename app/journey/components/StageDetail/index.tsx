import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import StageHeader from "./StageHeader";
import DayCard from "./DayCard";
import LessonList from "./LessonList";
import TestSection from "./TestSection";

interface StageDetailProps {
     stageData?: any;
     onSelectDay?: (dayId: string) => void;
     onSelectLesson?: (lessonId: string) => void;
     onSelectTest?: (testId: string) => void;
     onStartFinalExam?: () => void;
}

const StageDetail: React.FC<StageDetailProps> = ({
     stageData,
     onSelectDay,
     onSelectLesson,
     onSelectTest,
     onStartFinalExam,
}) => {
     // ✅ USE REAL DATA: Transform database schema to UI format
     const transformedStageData = stageData ? {
          id: stageData.id,
          title: stageData.title,
          description: stageData.description,
          progress: stageData.progress || 0,
          minScore: stageData.minScore,
          targetScore: stageData.targetScore,
          status: stageData.status,
          // ✅ Transform days from database schema to UI format
          days: (stageData.days || []).map((day: any, index: number) => {
               // ✅ FIXED: Calculate real progress based on actual score, not just completion status
               const totalQuestions = (day.questions || []).length;
               let dayProgress = 0;
               let dayPassed = false;

               if (day.completed) {
                    // Use actual score if available, otherwise default to 100%
                    if (day.score !== undefined && day.score !== null) {
                         const scorePercentage = typeof day.score === 'number' ? day.score : 0;
                         dayProgress = Math.max(0, Math.min(100, scorePercentage)); // Clamp between 0-100
                         dayPassed = scorePercentage >= 60; // Pass threshold
                    } else {
                         // Fallback for old data without score
                         dayProgress = 100;
                         dayPassed = true;
                    }
               } else {
                    // Not completed yet
                    dayProgress = 0;
                    dayPassed = false;
               }

               console.log(`📅 Day ${day.dayNumber} progress calculation:`, {
                    dayId: day._id,
                    started: day.started,
                    completed: day.completed,
                    score: day.score,
                    totalQuestions,
                    calculatedProgress: dayProgress,
                    dayPassed: dayPassed
               });

               return {
                    id: day._id || `day_${index + 1}`,
                    dayNumber: day.dayNumber || (index + 1),
                    title: `Ngày ${day.dayNumber || (index + 1)}: Học tập`,
                    lessons: totalQuestions,
                    completed: day.completed || false,
                    progress: dayProgress,
                    passed: dayPassed, // ✅ ADD: Pass status for UI display
                    unlocked: day.started || day.completed || index === 0, // First day always unlocked
                    questions: day.questions || [], // ✅ ADD: Keep questions data for navigation
                    score: day.score, // ✅ ADD: Keep original score for display
               };
          }),
          // ✅ Transform tests (empty array for now since not in current schema)
          tests: [],
          // ✅ Transform finalTest to finalExam format with real question count
          finalExam: stageData.finalTest ? {
               id: `final_exam_${stageData.id}`,
               title: `Thi cuối giai đoạn ${stageData.stageNumber || ''}`,
               questions: stageData.finalTestData?.finalTestInfo?.questions?.length || 0,
               duration: stageData.finalTestData?.finalTestInfo?.duration || 60,
               minScore: stageData.minScore || 70,
               unlocked: stageData.finalTest.unlocked || false,
               completed: stageData.finalTest.completed || false,
               score: stageData.finalTest.score || null,
          } : {
               id: `final_exam_${stageData.id}`,
               title: `Thi cuối giai đoạn ${stageData.stageNumber || ''}`,
               questions: stageData.finalTestData?.finalTestInfo?.questions?.length || 0,
               duration: stageData.finalTestData?.finalTestInfo?.duration || 60,
               minScore: stageData.minScore || 70,
               unlocked: false,
               completed: false,
               score: null,
          },
     } : {
          // ✅ Fallback data only if no real data provided
          id: "fallback",
          title: "Đang tải...",
          description: "Đang tải thông tin giai đoạn",
          progress: 0,
          minScore: 0,
          targetScore: 300,
          status: "LOADING",
          days: [],
          tests: [],
          finalExam: {
               id: "fallback_exam",
               title: "Đang tải...",
               questions: 0,
               duration: 0,
               minScore: 0,
               unlocked: false,
               completed: false,
               score: null,
          },
     };

     return (
          <ScrollView
               style={styles.container}
               contentContainerStyle={styles.contentContainer}
               showsVerticalScrollIndicator={false}
          >
               {/* Stage Header với thông tin tổng quan */}
               <StageHeader
                    title={transformedStageData.title}
                    description={transformedStageData.description}
                    progress={transformedStageData.progress}
                    minScore={transformedStageData.minScore}
                    targetScore={transformedStageData.targetScore}
                    status={transformedStageData.status}
               />

               {/* Danh sách các ngày học */}
               <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Lịch Học Hàng Ngày</Text>
                    {transformedStageData.days.map((day: any) => (
                         <DayCard
                              key={day.id}
                              dayData={day}
                              onPress={() => onSelectDay?.(day.id)}
                         />
                    ))}
               </View>

               {/* Removed LessonList component - not needed since we have day-based learning */}

               {/* Phần bài test */}
               <TestSection
                    tests={transformedStageData.tests}
                    finalExam={transformedStageData.finalExam}
                    onSelectTest={onSelectTest}
                    onStartFinalExam={onStartFinalExam}
               />
          </ScrollView>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#f8f9fa",
     },
     contentContainer: {
          paddingBottom: 100, // Space for bottom navigation
     },
     section: {
          marginTop: 20,
     },
     sectionTitle: {
          fontSize: 20,
          fontWeight: "bold",
          color: "#2c3e50",
          marginHorizontal: 16,
          marginBottom: 16,
     },
});

export default StageDetail; 