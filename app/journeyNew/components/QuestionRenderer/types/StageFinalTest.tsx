import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Question } from '../../../../types/question';
import AudioPlayer from '../../AudioPlayer';

interface StageFinalTestProps {
     question: Question;
     onAnswer: (answers: string[]) => void;
     userAnswer?: string[];
     isReview?: boolean;
     timeRemaining?: number;
}

const StageFinalTest: React.FC<StageFinalTestProps> = ({
     question,
     onAnswer,
     userAnswer = [],
     isReview = false,
     timeRemaining
}) => {
     const [selectedAnswers, setSelectedAnswers] = useState<string[]>(userAnswer);

     const handleAnswer = (questionIndex: number, answerIndex: number) => {
          if (isReview) return;
          const answerLetter = String.fromCharCode(65 + answerIndex); // Convert to A, B, C, D
          const newAnswers = [...selectedAnswers];
          newAnswers[questionIndex] = answerLetter;
          setSelectedAnswers(newAnswers);
          onAnswer(newAnswers);
     };

     const formatTime = (seconds: number) => {
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;
          return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
     };

     return (
          <ScrollView style={styles.container}>
               {/* Timer */}
               {timeRemaining !== undefined && (
                    <View style={styles.timerContainer}>
                         <Text style={styles.timerText}>
                              Time Remaining: {formatTime(timeRemaining)}
                         </Text>
                    </View>
               )}

               {/* Audio */}
               {question.audio && question.audio.url && question.audio.url.trim() !== '' && (
                    <AudioPlayer
                         audioUrl={question.audio.url}
                         title={question.question}
                    />
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
                                        const isSelected = selectedAnswers[index] === answerLetter;
                                        return (
                                             <TouchableOpacity
                                                  key={answer._id}
                                                  style={[
                                                       styles.answerButton,
                                                       isSelected && styles.selectedAnswer,
                                                       isReview && answer.isCorrect && styles.correctAnswer,
                                                       isReview && isSelected && !answer.isCorrect && styles.incorrectAnswer
                                                  ]}
                                                  onPress={() => handleAnswer(index, answerIndex)}
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
          </ScrollView>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
     },
     timerContainer: {
          padding: 16,
          backgroundColor: '#f5f5f5',
          borderRadius: 8,
          marginBottom: 16,
          alignItems: 'center',
     },
     timerText: {
          fontSize: 18,
          fontWeight: '600',
          color: '#333',
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

export default StageFinalTest; 