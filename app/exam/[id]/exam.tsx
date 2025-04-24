import { IExam } from "@/app/(tabs)/service";
import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import PracticeType1_Exam from "@/components/Exam/PracticeType1_Exam";
import PracticeType2_Exam from "@/components/Exam/PracticeType2_Exam";
import PracticeType3_Exam from "@/components/Exam/PracticeType3_Exam";
import PracticeType4_Exam from "@/components/Exam/PracticeType4_Exam";
import PracticeType5_Exam from "@/components/Exam/PracticeType5_Exam";
import PracticeType6_Exam from "@/components/Exam/PracticeType6_Exam";

interface ExamProps {
  data: IExam;
}

const getPracticeComponent = (type: string) => {
  switch (type) {
    case "IMAGE_DESCRIPTION":
      return PracticeType1_Exam;
    case "ASK_AND_ANSWER":
      return PracticeType2_Exam;
    case "CONVERSATION_PIECE":
    case "SHORT_TALK":
      return PracticeType3_Exam;
    case "FILL_IN_THE_BLANK_QUESTION":
      return PracticeType4_Exam;
    case "FILL_IN_THE_PARAGRAPH":
      return PracticeType5_Exam;
    case "READ_AND_UNDERSTAND":
      return PracticeType6_Exam;
    default:
      return null;
  }
};

const Exam = (props: ExamProps) => {
  const { data } = props;
  const sections = data.sections;

  const [sectionIndex, setSectionIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const [questionIndex, setQuestionIndex] = useState(0);

  // State lưu kết quả từng section theo section type
  const [sectionResults, setSectionResults] = useState<{
    [type: string]: any[];
  }>({});
  console.log("🚀 TDS ~ Exam ~ sectionResults:", sectionResults);

  const handleNext = () => {
    setShowIntro(false);
    setQuestionIndex(0);
  };

  const handleBack = () => {
    // Quay lại màn intro của section hiện tại
    setShowIntro(true);
    // Reset lại questionIndex nếu muốn bắt đầu từ câu đầu tiên khi quay lại
    setQuestionIndex(0);
  };

  const handleSectionSubmit = (questionAnswers: any[]) => {
    const section = sections[sectionIndex];
    const sectionType = section.type;

    // Lưu kết quả theo section type
    setSectionResults((prev) => ({
      ...prev,
      [sectionType]: questionAnswers,
    }));

    if (sectionIndex < sections.length - 1) {
      setSectionIndex(sectionIndex + 1);
      setShowIntro(true);
      setQuestionIndex(0);
    } else {
      // Đã hết section, log toàn bộ kết quả
      console.log("Tất cả kết quả:", {
        ...sectionResults,
        [sectionType]: questionAnswers,
      });
    }
  };

  const handleBackFromIntro = () => {
    // Chỉ xử lý back khi không phải section đầu tiên
    if (sectionIndex > 0) {
      // Quay lại section trước
      const prevSectionIndex = sectionIndex - 1;
      setSectionIndex(prevSectionIndex);

      // Hiển thị câu hỏi (không hiển thị intro)
      setShowIntro(false);

      // Đặt vị trí tại câu hỏi cuối cùng của section trước
      const prevSectionQuestions = sections[prevSectionIndex].questions;
      const lastQuestionIndex = prevSectionQuestions.length - 1;
      setQuestionIndex(lastQuestionIndex);
    } else {
      console.log("Đang ở section đầu tiên, không thể quay lại.");
    }
    // Có thể bổ sung thêm xử lý nếu đang ở section 0 (ví dụ: thoát khỏi exam)
  };

  // Render header luôn luôn
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>
        {showIntro ? "Section giới thiệu" : `Câu x/x`}
      </Text>
    </View>
  );

  // Render nội dung
  let content = null;
  if (showIntro) {
    content = (
      <View style={styles.container}>
        {/* Thêm nút Back vào màn intro nếu không phải section đầu tiên */}
        {/* {sectionIndex > 0 && ( */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackFromIntro}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        {/* )} */}
        <Text style={styles.sectionTitle}>SECTION {sectionIndex + 1}</Text>
        <Text style={styles.sectionType}>{sections[sectionIndex].type}</Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    const section = sections[sectionIndex];
    const PracticeComponent = getPracticeComponent(section.type);

    content = PracticeComponent ? (
      <PracticeComponent
        questions={section.questions}
        onSubmit={handleSectionSubmit}
        initialQuestionIndex={questionIndex}
        onQuestionIndexChange={setQuestionIndex}
        onBack={handleBack} // Truyền callback để quay về intro
      />
    ) : (
      <View style={styles.container}>
        <Text>Không hỗ trợ type này: {section.type}</Text>
        <TouchableOpacity style={styles.button} onPress={handleSectionSubmit}>
          <Text style={styles.buttonText}>Section tiếp theo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {renderHeader()}
      <View style={{ flex: 1 }}>{content}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: "#22c993",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionType: {
    fontSize: 18,
    color: "#333",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#22c993",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#22c993",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default Exam;
