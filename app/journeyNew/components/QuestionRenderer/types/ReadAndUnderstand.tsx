import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Question } from '../../../types/question';
import AudioPlayer from '../../AudioPlayer';

interface ReadAndUnderstandProps {
     question: Question;
     onAnswer: (answers: Record<string, string>) => void;
     userAnswer?: Record<string, string>;
     isReview?: boolean;
}

const ReadAndUnderstand: React.FC<ReadAndUnderstandProps> = ({
     question,
     onAnswer,
     userAnswer = {},
     isReview = false
}) => {
     const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => userAnswer || {});

     // ✅ FIX: Only update when userAnswer prop actually changes to avoid infinite loops
     const prevUserAnswerRef = React.useRef<Record<string, string>>();

     useEffect(() => {
          if (userAnswer && JSON.stringify(userAnswer) !== JSON.stringify(prevUserAnswerRef.current)) {
               setSelectedAnswers(userAnswer);
               prevUserAnswerRef.current = userAnswer;
          }
     }, [userAnswer]);

     const handleAnswer = (subQuestionId: string, answerIndex: number) => {
          if (isReview) return;

          const answerLetter = String.fromCharCode(65 + answerIndex); // Convert to A, B, C, D
          const newAnswers = {
               ...selectedAnswers,
               [subQuestionId]: answerLetter
          };
          setSelectedAnswers(newAnswers);

          console.log(`💾 ReadAndUnderstand answer saved: subQuestionId=${subQuestionId}, answerLetter=${answerLetter}`);
          console.log(`📊 Total answers: ${Object.keys(newAnswers).length}/${question.questions?.length || 0}`);

          onAnswer(newAnswers);
     };

     return (
          <View style={styles.container}>
               {/* Audio */}
               {question.audio && question.audio.url && question.audio.url.trim() !== '' && (
                    <AudioPlayer
                         audioUrl={question.audio.url}
                         title={question.question}
                    />
               )}

               {/* Reading Text */}
               {question.question && (
                    <View style={styles.readingContainer}>
                         <Text style={styles.readingText}>{question.question}</Text>
                    </View>
               )}

               {/* Subtitle */}
               {question.subtitle && (
                    <Text style={styles.subtitle}>{question.subtitle}</Text>
               )}

               {/* Questions */}
               <View style={styles.questionsContainer}>
                    {question.questions?.map((subQuestion, index) => (
                         <View key={subQuestion._id} style={styles.questionContainer}>
                              <Text style={styles.questionText}>
                                   {index + 1}. {subQuestion.question}
                              </Text>

                              <View style={styles.answersContainer}>
                                   {subQuestion.answers.map((answer, answerIndex) => {
                                        const answerLetter = String.fromCharCode(65 + answerIndex);
                                        const isSelected = selectedAnswers[subQuestion._id] === answerLetter;
                                        return (
                                             <TouchableOpacity
                                                  key={answer._id}
                                                  style={[
                                                       styles.answerButton,
                                                       isSelected && styles.selectedAnswer,
                                                       isReview && answer.isCorrect && styles.correctAnswer,
                                                       isReview && isSelected && !answer.isCorrect && styles.incorrectAnswer
                                                  ]}
                                                  onPress={() => handleAnswer(subQuestion._id, answerIndex)}
                                                  disabled={isReview}
                                             >
                                                  <Text style={[
                                                       styles.answerText,
                                                       isSelected && styles.selectedAnswerText,
                                                       isReview && answer.isCorrect && styles.correctAnswerText
                                                  ]}>
                                                       {answerLetter}. {answer.answer}
                                                  </Text>
                                             </TouchableOpacity>
                                        );
                                   })}
                              </View>
                         </View>
                    ))}
               </View>

               {/* Explanation (in review mode) */}
               {isReview && question.explanation && (
                    <View style={styles.explanationContainer}>
                         <Text style={styles.explanationTitle}>Explanation:</Text>
                         <Text style={styles.explanationText}>{question.explanation}</Text>
                    </View>
               )}
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          paddingBottom: 16, // Add padding for better scroll experience
     },
     readingContainer: {
          backgroundColor: '#f5f5f5',
          padding: 16,
          borderRadius: 8,
          marginBottom: 16,
     },
     readingText: {
          fontSize: 16,
          color: '#333',
          lineHeight: 24,
     },
     subtitle: {
          fontSize: 14,
          color: '#666',
          marginBottom: 16,
          fontStyle: 'italic',
     },
     questionsContainer: {
          gap: 24,
     },
     questionContainer: {
          gap: 12,
     },
     questionText: {
          fontSize: 16,
          fontWeight: '600',
          color: '#333',
     },
     answersContainer: {
          gap: 8,
     },
     answerButton: {
          padding: 12,
          borderRadius: 8,
          backgroundColor: '#f5f5f5',
          borderWidth: 1,
          borderColor: '#ddd',
     },
     selectedAnswer: {
          backgroundColor: '#e3f2fd',
          borderColor: '#2196f3',
     },
     correctAnswer: {
          backgroundColor: '#e8f5e9',
          borderColor: '#4caf50',
     },
     incorrectAnswer: {
          backgroundColor: '#ffebee',
          borderColor: '#f44336',
     },
     answerText: {
          fontSize: 14,
          color: '#333',
     },
     selectedAnswerText: {
          color: '#2196f3',
          fontWeight: '600',
     },
     correctAnswerText: {
          color: '#4caf50',
          fontWeight: '600',
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

export default ReadAndUnderstand; 