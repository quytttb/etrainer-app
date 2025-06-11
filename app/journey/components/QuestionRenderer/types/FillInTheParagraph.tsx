import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Question } from '../../../types';
import AudioPlayer from '../../AudioPlayer';

interface FillInTheParagraphProps {
     question: Question;
     onAnswer: (answers: Record<string, string>) => void;
     userAnswer?: Record<string, string>;
     isReview?: boolean;
}

const FillInTheParagraph: React.FC<FillInTheParagraphProps> = ({
     question,
     onAnswer,
     userAnswer = {},
     isReview = false
}) => {
     const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => userAnswer || {});

     // ✅ FIX: Only update selectedAnswers when userAnswer prop actually changes
     // Use a ref to track the previous userAnswer to avoid infinite loops
     const prevUserAnswerRef = useRef<Record<string, string>>();

     useEffect(() => {
          // Only update if userAnswer is different from previous value
          if (userAnswer && JSON.stringify(userAnswer) !== JSON.stringify(prevUserAnswerRef.current)) {
               setSelectedAnswers(userAnswer);
               prevUserAnswerRef.current = userAnswer;
          }
     }, [userAnswer]);

     const handleAnswerSelect = (subQuestionId: string, answerIndex: number) => {
          if (isReview) return;

          const answerLetter = String.fromCharCode(65 + answerIndex); // Convert to A, B, C, D
          const newAnswers = {
               ...selectedAnswers,
               [subQuestionId]: answerLetter
          };

          setSelectedAnswers(newAnswers);
          onAnswer(newAnswers);
     };

     const getSelectedAnswerForSubQuestion = (subQuestion: any) => {
          const selectedAnswerId = selectedAnswers[subQuestion._id];
          return subQuestion.answers?.find((ans: any) => ans._id === selectedAnswerId);
     };

     const getCorrectAnswerForSubQuestion = (subQuestion: any) => {
          return subQuestion.answers?.find((ans: any) => ans.isCorrect);
     };

     const isSubQuestionCorrect = (subQuestion: any) => {
          const selectedAnswer = getSelectedAnswerForSubQuestion(subQuestion);
          return selectedAnswer?.isCorrect || false;
     };

     // Render paragraph with highlighted blanks
     const renderParagraphWithBlanks = () => {
          if (!question.question) return null;

          // Replace placeholders like ....(41)..., ....(42)... with styled blank indicators
          const parts = question.question.split(/(\.{4}\(\d+\)\.{4})/g);

          return (
               <View style={styles.paragraphContainer}>
                    <Text style={styles.paragraphText}>
                         {parts.map((part, index) => {
                              const blankMatch = part.match(/\.{4}\((\d+)\)\.{4}/);
                              if (blankMatch) {
                                   const blankNumber = blankMatch[1];
                                   const subQuestion = question.questions?.find(q =>
                                        q.question.includes(`(${blankNumber})`)
                                   );

                                   const selectedAnswer = subQuestion ? getSelectedAnswerForSubQuestion(subQuestion) : null;
                                   const isCorrect = subQuestion ? isSubQuestionCorrect(subQuestion) : false;

                                   return (
                                        <Text
                                             key={index}
                                             style={[
                                                  styles.blankText,
                                                  selectedAnswer && styles.filledBlank,
                                                  isReview && isCorrect && styles.correctBlank,
                                                  isReview && selectedAnswer && !isCorrect && styles.incorrectBlank,
                                             ]}
                                        >
                                             {selectedAnswer ? selectedAnswer.answer : `______(${blankNumber})______`}
                                        </Text>
                                   );
                              }
                              return part;
                         })}
                    </Text>
               </View>
          );
     };

     // Render individual sub-questions
     const renderSubQuestions = () => {
          if (!question.questions || question.questions.length === 0) return null;

          return (
               <View style={styles.subQuestionsContainer}>
                    <Text style={styles.subQuestionsTitle}>Choose the best option for each blank:</Text>
                    {question.questions.map((subQuestion, subIndex) => {
                         const selectedAnswerId = selectedAnswers[subQuestion._id];

                         return (
                              <View key={subQuestion._id} style={styles.subQuestionBlock}>
                                   <Text style={styles.subQuestionText}>
                                        {subQuestion.question}
                                   </Text>

                                   <View style={styles.answersContainer}>
                                        {subQuestion.answers.map((answer, answerIndex) => {
                                             const answerLabel = String.fromCharCode(65 + answerIndex); // A, B, C, D
                                             const isSelected = selectedAnswers[subQuestion._id] === answerLabel;
                                             return (
                                                  <TouchableOpacity
                                                       key={answer._id}
                                                       style={[
                                                            styles.answerButton,
                                                            isSelected && styles.selectedAnswer,
                                                            isReview && answer.isCorrect && styles.correctAnswer,
                                                            isReview && isSelected && !answer.isCorrect && styles.incorrectAnswer
                                                       ]}
                                                       onPress={() => handleAnswerSelect(subQuestion._id, answerIndex)}
                                                       disabled={isReview}
                                                  >
                                                       <Text style={[
                                                            styles.answerText,
                                                            isSelected && styles.selectedAnswerText,
                                                            isReview && answer.isCorrect && styles.correctAnswerText
                                                       ]}>
                                                            ({answerLabel}) {answer.answer}
                                                       </Text>
                                                  </TouchableOpacity>
                                             );
                                        })}
                                   </View>
                              </View>
                         );
                    })}
               </View>
          );
     };

     const answeredQuestionsCount = Object.keys(selectedAnswers).length;
     const totalQuestionsCount = question.questions?.length || 0;

     return (
          <ScrollView style={styles.container}>
               {/* Audio */}
               {question.audio && question.audio.url && question.audio.url.trim() !== '' && (
                    <AudioPlayer
                         audioUrl={question.audio.url}
                         title="Fill in the paragraph"
                    />
               )}

               {/* Subtitle */}
               {question.subtitle && (
                    <Text style={styles.subtitle}>{question.subtitle}</Text>
               )}

               {/* Paragraph with highlighted blanks */}
               {renderParagraphWithBlanks()}

               {/* Progress indicator */}
               {!isReview && (
                    <View style={styles.progressContainer}>
                         <Text style={styles.progressText}>
                              Progress: {answeredQuestionsCount}/{totalQuestionsCount} blanks filled
                         </Text>
                    </View>
               )}

               {/* Sub-questions for each blank */}
               {renderSubQuestions()}

               {/* Explanation (in review mode) */}
               {isReview && question.explanation && (
                    <View style={styles.explanationContainer}>
                         <Text style={styles.explanationTitle}>Explanation:</Text>
                         <Text style={styles.explanationText}>{question.explanation}</Text>
                    </View>
               )}
          </ScrollView>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
     },
     subtitle: {
          fontSize: 14,
          color: '#666',
          marginBottom: 16,
          fontStyle: 'italic',
          lineHeight: 20,
     },
     paragraphContainer: {
          backgroundColor: '#f8f9fa',
          padding: 16,
          borderRadius: 8,
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: '#007AFF',
     },
     paragraphText: {
          fontSize: 16,
          color: '#333',
          lineHeight: 24,
     },
     blankText: {
          backgroundColor: '#fff',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#ddd',
          fontWeight: '500',
     },
     filledBlank: {
          backgroundColor: '#e3f2fd',
          borderColor: '#2196f3',
          color: '#1565c0',
     },
     correctBlank: {
          backgroundColor: '#e8f5e9',
          borderColor: '#4caf50',
          color: '#2e7d32',
     },
     incorrectBlank: {
          backgroundColor: '#ffebee',
          borderColor: '#f44336',
          color: '#c62828',
     },
     progressContainer: {
          backgroundColor: '#e3f2fd',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
          alignItems: 'center',
     },
     progressText: {
          fontSize: 14,
          color: '#1565c0',
          fontWeight: '500',
     },
     subQuestionsContainer: {
          marginTop: 8,
     },
     subQuestionsTitle: {
          fontSize: 16,
          fontWeight: '600',
          color: '#333',
          marginBottom: 16,
          textAlign: 'center',
     },
     subQuestionBlock: {
          marginBottom: 24,
          padding: 16,
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: '#ff9800',
     },
     subQuestionText: {
          fontSize: 15,
          fontWeight: '600',
          color: '#333',
          marginBottom: 12,
     },
     answersContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
     },
     answerButton: {
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          marginRight: 8,
          backgroundColor: '#fff',
     },
     selectedAnswer: {
          borderColor: '#007AFF',
          backgroundColor: '#f0f8ff',
     },
     correctAnswer: {
          borderColor: '#4caf50',
          backgroundColor: '#e8f5e9',
     },
     incorrectAnswer: {
          borderColor: '#f44336',
          backgroundColor: '#ffebee',
     },
     answerText: {
          fontSize: 14,
          color: '#333',
          lineHeight: 20,
     },
     selectedAnswerText: {
          color: '#007AFF',
          fontWeight: '500',
     },
     correctAnswerText: {
          color: '#4caf50',
          fontWeight: '500',
     },
     explanationContainer: {
          marginTop: 24,
          padding: 16,
          backgroundColor: '#f5f5f5',
          borderRadius: 8,
     },
     explanationTitle: {
          fontSize: 16,
          fontWeight: '600',
          color: '#333',
          marginBottom: 8,
     },
     explanationText: {
          fontSize: 14,
          color: '#666',
          lineHeight: 20,
     },
});

export default FillInTheParagraph;