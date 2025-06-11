import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Question } from '../../../types';
import AudioPlayer, { AudioPlayerRef } from '../../AudioPlayer';

interface ShortTalkProps {
     question: Question;
     onAnswer: (answers: Record<string, string>) => void;
     userAnswer?: Record<string, string>;
     isReview?: boolean;
}

const ShortTalk: React.FC<ShortTalkProps> = ({
     question,
     onAnswer,
     userAnswer = {},
     isReview = false
}) => {
     const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => userAnswer || {});
     const audioPlayerRef = useRef<AudioPlayerRef>(null);

     // ✅ FIX: Only update when userAnswer prop actually changes to avoid infinite loops
     const prevUserAnswerRef = React.useRef<Record<string, string>>();

     useEffect(() => {
          if (userAnswer && JSON.stringify(userAnswer) !== JSON.stringify(prevUserAnswerRef.current)) {
               setSelectedAnswers(userAnswer);
               prevUserAnswerRef.current = userAnswer;
          }
     }, [userAnswer]);

     // ✅ FIX: Stop audio when component unmounts or question changes
     useEffect(() => {
          return () => {
               // Stop audio when component unmounts
               if (audioPlayerRef.current) {
                    audioPlayerRef.current.stop();
               }
          };
     }, [question.id]); // Re-run when question changes

     const handleAnswer = (subQuestionId: string, answerIndex: number) => {
          if (isReview) return;

          const answerLetter = String.fromCharCode(65 + answerIndex); // Convert to A, B, C, D
          const newAnswers = {
               ...selectedAnswers,
               [subQuestionId]: answerLetter
          };
          setSelectedAnswers(newAnswers);

          console.log(`💾 ShortTalk answer saved: subQuestionId=${subQuestionId}, answerLetter=${answerLetter}`);
          console.log(`📊 Total answers: ${Object.keys(newAnswers).length}/${question.questions?.length || 0}`);

          onAnswer(newAnswers);
     };

     return (
          <ScrollView style={styles.container}>
               {/* Audio */}
               {question.audio && question.audio.url && question.audio.url.trim() !== '' && (
                    <AudioPlayer
                         ref={audioPlayerRef}
                         audioUrl={question.audio.url}
                         title={question.question}
                         autoStopOnChange={true}
                    />
               )}

               {/* Main Question/Instruction */}
               {question.question && (
                    <View style={styles.instructionContainer}>
                         <Text style={styles.instructionText}>📢 {question.question}</Text>
                    </View>
               )}

               {/* Subtitle/Transcript */}
               {question.subtitle && (
                    <View style={styles.transcriptContainer}>
                         <Text style={styles.transcriptTitle}>📝 Transcript:</Text>
                         <Text style={styles.transcriptText}>{question.subtitle}</Text>
                    </View>
               )}

               {/* ✅ FIX: Render multiple questions instead of single answers */}
               {question.questions?.map((subQuestion, index) => (
                    <View key={subQuestion._id} style={styles.subQuestionContainer}>
                         <Text style={styles.subQuestionNumber}>Question {index + 1}</Text>
                         <Text style={styles.subQuestionText}>{subQuestion.question}</Text>

                         <View style={styles.answersContainer}>
                              {subQuestion.answers?.map((answer, answerIndex) => {
                                   const answerLabel = String.fromCharCode(65 + answerIndex); // A, B, C, D
                                   const isSelected = selectedAnswers[subQuestion._id] === answerLabel;
                                   const isCorrectAnswer = answer.isCorrect;
                                   const isWrongSelection = isReview && isSelected && !isCorrectAnswer;

                                   return (
                                        <TouchableOpacity
                                             key={answer._id}
                                             style={[
                                                  styles.answerButton,
                                                  isSelected && styles.selectedAnswer,
                                                  isReview && isCorrectAnswer && styles.correctAnswer,
                                                  isReview && isWrongSelection && styles.incorrectAnswer
                                             ]}
                                             onPress={() => handleAnswer(subQuestion._id, answerIndex)}
                                             disabled={isReview}
                                        >
                                             <Text style={[
                                                  styles.answerText,
                                                  isSelected && styles.selectedAnswerText,
                                                  isReview && isCorrectAnswer && styles.correctAnswerText,
                                                  isReview && isWrongSelection && styles.incorrectAnswerText
                                             ]}>
                                                  ({answerLabel}) {answer.answer}
                                             </Text>
                                             {isReview && isCorrectAnswer && (
                                                  <Text style={styles.correctIcon}>✓</Text>
                                             )}
                                             {isReview && isWrongSelection && (
                                                  <Text style={styles.incorrectIcon}>✗</Text>
                                             )}
                                        </TouchableOpacity>
                                   );
                              })}
                         </View>
                    </View>
               ))}

               {/* Explanation (in review mode) */}
               {isReview && question.explanation && (
                    <View style={styles.explanationContainer}>
                         <Text style={styles.explanationTitle}>💡 Explanation:</Text>
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
     instructionContainer: {
          marginBottom: 16,
          padding: 16,
          backgroundColor: '#e3f2fd',
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: '#2196f3',
     },
     instructionText: {
          fontSize: 16,
          fontWeight: '600',
          color: '#1976d2',
          lineHeight: 22,
     },
     transcriptContainer: {
          marginBottom: 24,
          padding: 16,
          backgroundColor: '#f5f5f5',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ddd',
     },
     transcriptTitle: {
          fontSize: 14,
          fontWeight: '600',
          color: '#333',
          marginBottom: 8,
     },
     transcriptText: {
          fontSize: 14,
          color: '#666',
          lineHeight: 20,
          fontStyle: 'italic',
     },
     subQuestionContainer: {
          marginBottom: 24,
          padding: 16,
          backgroundColor: '#ffffff',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e0e0e0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
     },
     subQuestionNumber: {
          fontSize: 12,
          fontWeight: '600',
          color: '#2196f3',
          marginBottom: 4,
          textTransform: 'uppercase',
     },
     subQuestionText: {
          fontSize: 16,
          fontWeight: '500',
          color: '#333',
          marginBottom: 12,
          lineHeight: 22,
     },
     answersContainer: {
          gap: 8,
     },
     answerButton: {
          padding: 12,
          borderRadius: 6,
          backgroundColor: '#f9f9f9',
          borderWidth: 1,
          borderColor: '#ddd',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
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
          flex: 1,
     },
     selectedAnswerText: {
          color: '#2196f3',
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
     correctIcon: {
          fontSize: 16,
          color: '#4caf50',
          fontWeight: 'bold',
     },
     incorrectIcon: {
          fontSize: 16,
          color: '#f44336',
          fontWeight: 'bold',
     },
     explanationContainer: {
          marginTop: 24,
          padding: 16,
          backgroundColor: '#fff3e0',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ffcc02',
     },
     explanationTitle: {
          fontSize: 16,
          fontWeight: '600',
          color: '#e65100',
          marginBottom: 8,
     },
     explanationText: {
          fontSize: 14,
          color: '#bf360c',
          lineHeight: 20,
     },
});

export default ShortTalk; 