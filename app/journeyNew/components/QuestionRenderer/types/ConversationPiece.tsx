import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Question } from '../../../types/question';
import AudioPlayer from '../../AudioPlayer';

interface ConversationPieceProps {
     question: Question;
     onAnswer: (answers: Record<string, string>) => void;
     userAnswer?: Record<string, string>;
     isReview?: boolean;
}

const ConversationPiece: React.FC<ConversationPieceProps> = ({
     question,
     onAnswer,
     userAnswer = {},
     isReview = false
}) => {
     const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => userAnswer || {});

     // ✅ Reset selected answers when question changes
     useEffect(() => {
          setSelectedAnswers(userAnswer || {});
     }, [question._id, userAnswer]);

     const handleAnswer = (subQuestionId: string, answerIndex: number) => {
          if (isReview) return;

          const answerLetter = String.fromCharCode(65 + answerIndex); // Convert to A, B, C, D
          const newAnswers = {
               ...selectedAnswers,
               [subQuestionId]: answerLetter
          };
          setSelectedAnswers(newAnswers);
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

               {/* Question */}
               {question.question && (
                    <Text style={styles.question}>{question.question}</Text>
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
     question: {
          fontSize: 16,
          color: '#333',
          marginBottom: 16,
          fontWeight: '500',
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

export default ConversationPiece; 