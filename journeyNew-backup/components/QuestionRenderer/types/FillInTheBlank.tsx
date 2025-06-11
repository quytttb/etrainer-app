import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Question } from '../../../types';
import AudioPlayer from '../../AudioPlayer';

interface FillInTheBlankProps {
     question: Question;
     onAnswer: (answer: string) => void;
     userAnswer?: string;
     isReview?: boolean;
}

const FillInTheBlank: React.FC<FillInTheBlankProps> = ({
     question,
     onAnswer,
     userAnswer,
     isReview = false
}) => {
     const [selectedAnswer, setSelectedAnswer] = useState<string>(userAnswer || '');

     useEffect(() => {
          setSelectedAnswer(userAnswer || '');
     }, [userAnswer]);

     const handleAnswerSelect = (answerIndex: number) => {
          if (isReview) return;
          const answerLetter = String.fromCharCode(65 + answerIndex); // Convert to A, B, C, D
          setSelectedAnswer(answerLetter);
          onAnswer(answerLetter);
     };

     const getSelectedAnswer = () => {
          return question.answers?.find(answer => answer._id === selectedAnswer);
     };

     const getCorrectAnswer = () => {
          return question.answers?.find(answer => answer.isCorrect);
     };

     const isCorrect = isReview && selectedAnswer && getSelectedAnswer()?.isCorrect;

     return (
          <ScrollView style={styles.container}>
               {/* Audio */}
               {question.audio && question.audio.url && question.audio.url.trim() !== '' && (
                    <AudioPlayer
                         audioUrl={question.audio.url}
                         title={question.question}
                    />
               )}

               {/* Question */}
               {question.question && (
                    <Text style={styles.question}>{question.question}</Text>
               )}

               {/* Subtitle */}
               {question.subtitle && (
                    <Text style={styles.subtitle}>{question.subtitle}</Text>
               )}

               {/* Multiple Choice Answers */}
               {question.answers && (
                    <View style={styles.answersContainer}>
                         {question.answers.map((answer, index) => {
                              const answerLabel = String.fromCharCode(65 + index); // A, B, C, D
                              const isSelected = selectedAnswer === answerLabel;
                              const isCorrectAnswer = answer.isCorrect;
                              const showCorrect = isReview && isCorrectAnswer;
                              const showIncorrect = isReview && isSelected && !isCorrectAnswer;

                              return (
                                   <TouchableOpacity
                                        key={answer._id}
                                        style={[
                                             styles.answerButton,
                                             isSelected && styles.selectedAnswer,
                                             showCorrect && styles.correctAnswer,
                                             showIncorrect && styles.incorrectAnswer,
                                        ]}
                                        onPress={() => handleAnswerSelect(index)}
                                        disabled={isReview}
                                   >
                                        <Text style={[
                                             styles.answerText,
                                             isSelected && styles.selectedAnswerText,
                                             showCorrect && styles.correctAnswerText,
                                             showIncorrect && styles.incorrectAnswerText
                                        ]}>
                                             ({answerLabel}) {answer.answer}
                                        </Text>

                                        {/* Review indicators */}
                                        {isReview && (
                                             <View style={styles.reviewIndicator}>
                                                  {isCorrectAnswer && (
                                                       <Text style={styles.correctIndicator}>✓</Text>
                                                  )}
                                                  {isSelected && !isCorrectAnswer && (
                                                       <Text style={styles.incorrectIndicator}>✗</Text>
                                                  )}
                                             </View>
                                        )}
                                   </TouchableOpacity>
                              );
                         })}
                    </View>
               )}

               {/* Selection hint */}
               {!isReview && !selectedAnswer && (
                    <Text style={styles.selectionHint}>
                         💡 Chọn một đáp án để điền vào chỗ trống
                    </Text>
               )}

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
     question: {
          fontSize: 18,
          fontWeight: '600',
          color: '#333',
          marginBottom: 8,
          lineHeight: 24,
     },
     subtitle: {
          fontSize: 14,
          color: '#666',
          marginBottom: 16,
          fontStyle: 'italic',
          lineHeight: 20,
     },
     answersContainer: {
          marginVertical: 16,
     },
     answerButton: {
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          marginBottom: 12,
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
          flex: 1,
          fontSize: 16,
          color: '#333',
          lineHeight: 22,
     },
     selectedAnswerText: {
          color: '#007AFF',
          fontWeight: '500',
     },
     correctAnswerText: {
          color: '#4caf50',
          fontWeight: '500',
     },
     incorrectAnswerText: {
          color: '#f44336',
          fontWeight: '500',
     },
     reviewIndicator: {
          position: 'absolute',
          top: 12,
          right: 12,
          width: 24,
          height: 24,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
     },
     correctIndicator: {
          color: '#4caf50',
          fontSize: 18,
          fontWeight: 'bold',
     },
     incorrectIndicator: {
          color: '#f44336',
          fontSize: 18,
          fontWeight: 'bold',
     },
     selectionHint: {
          fontSize: 12,
          color: '#6c757d',
          fontStyle: 'italic',
          marginBottom: 8,
          textAlign: 'center',
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

export default FillInTheBlank; 