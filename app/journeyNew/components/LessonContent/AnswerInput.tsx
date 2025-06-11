import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";

interface Answer {
     answer: string;
     isCorrect: boolean;
     _id: string;
}

interface SubQuestion {
     question: string;
     answers: Answer[];
     _id: string;
}

interface Question {
     id: string;
     questionNumber: number;
     type: string;
     question?: string;
     answers?: Answer[];
     questions?: SubQuestion[];
     explanation?: string;
}

interface AnswerInputProps {
     question: Question;
     userAnswer?: any;
     onAnswerChange: (answer: any) => void;
     onNext: () => void;
     onPrevious: () => void;
     showPrevious?: boolean;
     nextButtonText?: string;
}

const AnswerInput: React.FC<AnswerInputProps> = ({
     question,
     userAnswer,
     onAnswerChange,
     onNext,
     onPrevious,
     showPrevious = false,
     nextButtonText = "Tiếp theo",
}) => {
     const [textInputValue, setTextInputValue] = useState(userAnswer?.text || "");

     const handleSingleChoice = (answerIndex: number) => {
          const answerLetter = String.fromCharCode(65 + answerIndex); // Convert to A, B, C, D
          onAnswerChange({ type: "single", answer: answerLetter });
     };

     const handleMultipleChoice = (subQuestionId: string, answerIndex: number) => {
          const answerLetter = String.fromCharCode(65 + answerIndex); // Convert to A, B, C, D
          // ✅ FIX: Use subQuestion._id as key directly
          const newAnswer = {
               ...(userAnswer || {}),
               [subQuestionId]: answerLetter
          };

          console.log(`💾 Multi-choice answer updated: subQuestionId=${subQuestionId}, answerLetter=${answerLetter}`);
          console.log(`📊 Current answers:`, newAnswer);

          onAnswerChange(newAnswer);
     };

     const handleTextInput = (text: string) => {
          setTextInputValue(text);
          onAnswerChange({ type: "text", text });
     };

     const renderSingleChoiceAnswers = () => {
          if (!question.answers) return null;

          return (
               <View style={styles.answersContainer}>
                    <Text style={styles.answersLabel}>Chọn đáp án:</Text>
                    {question.answers.map((answer, index) => {
                         const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
                         const isSelected = userAnswer?.answer === optionLabel;

                         return (
                              <TouchableOpacity
                                   key={answer._id}
                                   style={[
                                        styles.answerOption,
                                        isSelected && styles.answerOptionSelected,
                                   ]}
                                   onPress={() => handleSingleChoice(index)}
                              >
                                   <View style={[
                                        styles.optionCircle,
                                        isSelected && styles.optionCircleSelected,
                                   ]}>
                                        <Text style={[
                                             styles.optionLabel,
                                             isSelected && styles.optionLabelSelected,
                                        ]}>
                                             {optionLabel}
                                        </Text>
                                   </View>
                                   <Text style={[
                                        styles.answerText,
                                        isSelected && styles.answerTextSelected,
                                   ]}>
                                        {answer.answer}
                                   </Text>
                              </TouchableOpacity>
                         );
                    })}
               </View>
          );
     };

     const renderMultipleChoiceAnswers = () => {
          if (!question.questions || question.questions.length === 0) {
               return <Text style={styles.statusText}>Không có câu hỏi phụ</Text>;
          }

          return (
               <View style={styles.answersContainer}>
                    <Text style={styles.answersLabel}>Trả lời các câu hỏi:</Text>
                    {question.questions.map((subQuestion, subIndex) => (
                         <View key={subQuestion._id} style={styles.subQuestionAnswers}>
                              <Text style={styles.subQuestionTitle}>
                                   {subIndex + 1}. {subQuestion.question}
                              </Text>
                              {subQuestion.answers.map((answer, answerIndex) => {
                                   // ✅ FIX: Use subQuestion._id as key
                                   const answerLabel = String.fromCharCode(65 + answerIndex);
                                   const isSelected = userAnswer && userAnswer[subQuestion._id] === answerLabel;
                                   return (
                                        <TouchableOpacity
                                             key={answer._id}
                                             style={[
                                                  styles.answerOption,
                                                  styles.subAnswerOption,
                                                  isSelected && styles.answerOptionSelected,
                                             ]}
                                             onPress={() => handleMultipleChoice(subQuestion._id, answerIndex)}
                                        >
                                             <View style={[
                                                  styles.optionCircle,
                                                  styles.subOptionCircle,
                                                  isSelected && styles.optionCircleSelected,
                                             ]}>
                                                  <Text style={[
                                                       styles.optionLabel,
                                                       isSelected && styles.optionLabelSelected,
                                                  ]}>
                                                       {String.fromCharCode(65 + answerIndex)}
                                                  </Text>
                                             </View>
                                             <Text style={[
                                                  styles.answerText,
                                                  styles.subAnswerText,
                                                  isSelected && styles.answerTextSelected,
                                             ]}>
                                                  {answer.answer}
                                             </Text>
                                        </TouchableOpacity>
                                   );
                              })}
                         </View>
                    ))}
               </View>
          );
     };

     const renderTextInput = () => {
          return (
               <View style={styles.textInputContainer}>
                    <Text style={styles.textInputLabel}>Nhập câu trả lời của bạn:</Text>
                    <TextInput
                         style={styles.textInput}
                         value={textInputValue}
                         onChangeText={handleTextInput}
                         placeholder="Gõ câu trả lời tại đây..."
                         multiline
                         numberOfLines={4}
                         textAlignVertical="top"
                    />
                    <Text style={styles.textInputHint}>
                         💡 Hãy viết câu trả lời hoàn chỉnh và rõ ràng
                    </Text>
               </View>
          );
     };

     const getAnswerComponent = () => {
          switch (question.type) {
               case "ASK_AND_ANSWER":
               case "IMAGE_DESCRIPTION":
               case "FILL_IN_THE_BLANK_QUESTION":
                    return renderSingleChoiceAnswers();

               case "SHORT_TALK":
               case "CONVERSATION_PIECE":
               case "FILL_IN_THE_PARAGRAPH":
                    return renderMultipleChoiceAnswers();

               case "READ_AND_UNDERSTAND":
                    return question.questions ? renderMultipleChoiceAnswers() : renderSingleChoiceAnswers();

               default:
                    return renderSingleChoiceAnswers();
          }
     };

     const isAnswerComplete = () => {
          if (!userAnswer) return false;

          switch (question.type) {
               case "ASK_AND_ANSWER":
               case "IMAGE_DESCRIPTION":
               case "FILL_IN_THE_BLANK_QUESTION":
                    return !!userAnswer.answer;

               case "SHORT_TALK":
               case "CONVERSATION_PIECE":
               case "FILL_IN_THE_PARAGRAPH":
                    if (!question.questions || question.questions.length === 0) return false;
                    // ✅ FIX: Check that all sub-questions have answers using subQuestion._id
                    const answeredQuestions = question.questions.filter(subQ =>
                         userAnswer && userAnswer[subQ._id]
                    ).length;
                    const requiredQuestions = question.questions.length;
                    console.log(`🔍 CONVERSATION_PIECE/FILL_PARAGRAPH validation: required=${requiredQuestions}, answered=${answeredQuestions}, userAnswer=`, userAnswer);
                    return answeredQuestions === requiredQuestions;

               case "READ_AND_UNDERSTAND":
                    if (question.questions && question.questions.length > 0) {
                         // ✅ FIX: Check that all sub-questions have answers using subQuestion._id
                         const answeredQuestions = question.questions.filter(subQ =>
                              userAnswer && userAnswer[subQ._id]
                         ).length;
                         const requiredQuestions = question.questions.length;
                         console.log(`🔍 READ_AND_UNDERSTAND validation: required=${requiredQuestions}, answered=${answeredQuestions}, userAnswer=`, userAnswer);
                         return answeredQuestions === requiredQuestions;
                    }
                    return !!userAnswer.answer;

               default:
                    return !!userAnswer.answer;
          }
     };

     return (
          <View style={styles.container}>
               {/* Answer Input Section */}
               {getAnswerComponent()}

               {/* Navigation Buttons */}
               <View style={styles.navigationContainer}>
                    {showPrevious && (
                         <TouchableOpacity
                              style={[styles.navButton, styles.previousButton]}
                              onPress={onPrevious}
                         >
                              <Text style={styles.navButtonText}>← Quay lại</Text>
                         </TouchableOpacity>
                    )}

                    <TouchableOpacity
                         style={[
                              styles.navButton,
                              styles.nextButton,
                              !isAnswerComplete() && styles.nextButtonDisabled,
                              !showPrevious && styles.nextButtonFull,
                         ]}
                         onPress={onNext}
                         disabled={!isAnswerComplete()}
                    >
                         <Text style={[
                              styles.navButtonText,
                              styles.nextButtonText,
                              !isAnswerComplete() && styles.nextButtonTextDisabled,
                         ]}>
                              {nextButtonText} →
                         </Text>
                    </TouchableOpacity>
               </View>

               {/* Answer Status */}
               <View style={styles.statusContainer}>
                    {isAnswerComplete() ? (
                         <View style={styles.statusComplete}>
                              <Text style={styles.statusIcon}>✅</Text>
                              <Text style={styles.statusText}>Đã trả lời xong</Text>
                         </View>
                    ) : (
                         <View style={styles.statusIncomplete}>
                              <Text style={styles.statusIcon}>⏳</Text>
                              <Text style={styles.statusText}>Hãy chọn đáp án để tiếp tục</Text>
                         </View>
                    )}
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          backgroundColor: "#fff",
          marginHorizontal: 16,
          marginVertical: 8,
          borderRadius: 12,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     answersContainer: {
          marginBottom: 24,
     },
     answersLabel: {
          fontSize: 16,
          fontWeight: "600",
          color: "#2c3e50",
          marginBottom: 16,
     },
     answerOption: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
          padding: 16,
          borderRadius: 8,
          marginBottom: 12,
          borderWidth: 2,
          borderColor: "transparent",
     },
     answerOptionSelected: {
          backgroundColor: "#e3f2fd",
          borderColor: "#2196f3",
     },
     subAnswerOption: {
          marginLeft: 16,
          marginBottom: 8,
     },
     optionCircle: {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "#6c757d",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
     },
     optionCircleSelected: {
          backgroundColor: "#2196f3",
     },
     subOptionCircle: {
          width: 28,
          height: 28,
          borderRadius: 14,
     },
     optionLabel: {
          color: "#fff",
          fontWeight: "bold",
          fontSize: 14,
     },
     optionLabelSelected: {
          color: "#fff",
     },
     answerText: {
          flex: 1,
          fontSize: 15,
          color: "#495057",
          lineHeight: 20,
     },
     answerTextSelected: {
          color: "#1565c0",
          fontWeight: "500",
     },
     subAnswerText: {
          fontSize: 14,
     },
     subQuestionAnswers: {
          marginBottom: 20,
          padding: 16,
          backgroundColor: "#f8f9fa",
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: "#17a2b8",
     },
     subQuestionTitle: {
          fontSize: 15,
          fontWeight: "600",
          color: "#2c3e50",
          marginBottom: 12,
     },
     textInputContainer: {
          marginBottom: 24,
     },
     textInputLabel: {
          fontSize: 16,
          fontWeight: "600",
          color: "#2c3e50",
          marginBottom: 12,
     },
     textInput: {
          borderWidth: 2,
          borderColor: "#e9ecef",
          borderRadius: 8,
          padding: 16,
          fontSize: 15,
          minHeight: 100,
          backgroundColor: "#fff",
     },
     textInputHint: {
          fontSize: 12,
          color: "#6c757d",
          marginTop: 8,
          fontStyle: "italic",
     },
     navigationContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 16,
     },
     navButton: {
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 8,
          minWidth: 120,
          alignItems: "center",
     },
     previousButton: {
          backgroundColor: "#6c757d",
     },
     nextButton: {
          backgroundColor: "#28a745",
     },
     nextButtonDisabled: {
          backgroundColor: "#ced4da",
     },
     nextButtonFull: {
          flex: 1,
     },
     navButtonText: {
          fontSize: 16,
          fontWeight: "600",
          color: "#fff",
     },
     nextButtonText: {
          color: "#fff",
     },
     nextButtonTextDisabled: {
          color: "#adb5bd",
     },
     statusContainer: {
          alignItems: "center",
     },
     statusComplete: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#d4edda",
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 20,
     },
     statusIncomplete: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff3cd",
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 20,
     },
     statusIcon: {
          fontSize: 16,
          marginRight: 8,
     },
     statusText: {
          fontSize: 14,
          fontWeight: "500",
          color: "#495057",
     },
});

export default AnswerInput; 