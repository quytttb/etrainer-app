import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Question } from '../../../types';
import AudioPlayer, { AudioPlayerRef } from '../../AudioPlayer';

interface AskAndAnswerProps {
     question: Question;
     onAnswer: (answer: string) => void;
     userAnswer?: string;
     isReview?: boolean;
}

const AskAndAnswer: React.FC<AskAndAnswerProps> = ({
     question,
     onAnswer,
     userAnswer,
     isReview = false
}) => {
     const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(userAnswer);
     const audioPlayerRef = useRef<AudioPlayerRef>(null);

     // ✅ Reset selected answer when question changes
     useEffect(() => {
          setSelectedAnswer(userAnswer);
     }, [question.id, userAnswer]);

     // ✅ FIX: Stop audio when component unmounts or question changes
     useEffect(() => {
          return () => {
               // Stop audio when component unmounts
               if (audioPlayerRef.current) {
                    audioPlayerRef.current.stop();
               }
          };
     }, [question.id]); // Re-run when question changes

     const handleAnswer = (answerIndex: number) => {
          if (isReview) return;
          const answerLetter = String.fromCharCode(65 + answerIndex); // Convert to A, B, C, D
          setSelectedAnswer(answerLetter);
          onAnswer(answerLetter);
     };

     return (
          <View style={styles.container}>
               {/* Audio */}
               {question.audio && question.audio.url && question.audio.url.trim() !== '' && (
                    <AudioPlayer
                         ref={audioPlayerRef}
                         audioUrl={question.audio.url}
                         title={question.question}
                         autoStopOnChange={true}
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

               {/* Answers */}
               <View style={styles.answersContainer}>
                    {question.answers?.map((answer, index) => {
                         const answerLetter = String.fromCharCode(65 + index);
                         const isSelected = selectedAnswer === answerLetter;
                         return (
                              <TouchableOpacity
                                   key={answer._id}
                                   style={[
                                        styles.answerButton,
                                        isSelected && styles.selectedAnswer,
                                        isReview && answer.isCorrect && styles.correctAnswer,
                                        isReview && isSelected && !answer.isCorrect && styles.incorrectAnswer
                                   ]}
                                   onPress={() => handleAnswer(index)}
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
          paddingVertical: 16,
     },
     question: {
          fontSize: 18,
          fontWeight: '600',
          color: '#333',
          marginBottom: 8,
     },
     subtitle: {
          fontSize: 14,
          color: '#666',
          marginBottom: 16,
          fontStyle: 'italic',
     },
     answersContainer: {
          gap: 12,
     },
     answerButton: {
          padding: 16,
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
          fontSize: 16,
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

export default AskAndAnswer; 