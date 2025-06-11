import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Audio } from 'expo-av';

interface QuestionCardProps {
     question: {
          _id: string;
          question?: string;
          imageUrl?: string;
          audio?: {
               name: string;
               url: string;
          };
          subtitle?: string;
          explanation?: string;
          answers?: Array<{
               answer: string;
               isCorrect: boolean;
               _id: string;
          }>;
          questions?: Array<{
               question: string;
               answers: Array<{
                    answer: string;
                    isCorrect: boolean;
                    _id: string;
               }>;
               _id: string;
          }>;
     };
     selectedAnswers?: { [key: string]: string };
     onSelectAnswer: (questionId: string, answer: string) => void;
     showExplanation?: boolean;
     isReview?: boolean;
}

const EnhancedQuestionCard: React.FC<QuestionCardProps> = ({
     question,
     selectedAnswers = {},
     onSelectAnswer,
     showExplanation = false,
     isReview = false
}) => {
     const [sound, setSound] = useState<Audio.Sound | null>(null);
     const [isPlaying, setIsPlaying] = useState(false);
     const [showSubtitle, setShowSubtitle] = useState(false);

     const playAudio = async () => {
          if (!question.audio?.url) return;

          try {
               if (sound) {
                    await sound.unloadAsync();
               }

               const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: question.audio.url },
                    { shouldPlay: true }
               );

               setSound(newSound);
               setIsPlaying(true);

               newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded && status.didJustFinish) {
                         setIsPlaying(false);
                    }
               });
          } catch (error) {
               console.error('Error playing audio:', error);
               setIsPlaying(false);
          }
     };

     const stopAudio = async () => {
          if (sound) {
               await sound.stopAsync();
               setIsPlaying(false);
          }
     };

     React.useEffect(() => {
          return sound
               ? () => {
                    sound.unloadAsync();
               }
               : undefined;
     }, [sound]);

     const renderAnswer = (answer: any, questionId: string, isSubQuestion = false) => {
          const isSelected = selectedAnswers[questionId] === answer.answer;
          const isCorrect = answer.isCorrect;
          const showCorrectness = isReview && showExplanation;

          return (
               <TouchableOpacity
                    key={answer._id}
                    style={[
                         styles.option,
                         isSelected && styles.selectedOption,
                         showCorrectness && isCorrect && styles.correctOption,
                         showCorrectness && isSelected && !isCorrect && styles.wrongOption,
                    ]}
                    onPress={() => !isReview && onSelectAnswer(questionId, answer.answer)}
                    disabled={isReview}
               >
                    <View style={[
                         styles.radioButton,
                         isSelected && styles.selectedRadioButton,
                         showCorrectness && isCorrect && styles.correctRadioButton,
                         showCorrectness && isSelected && !isCorrect && styles.wrongRadioButton,
                    ]}>
                         {isSelected && <View style={styles.radioInner} />}
                         {showCorrectness && isCorrect && (
                              <FontAwesome5 name="check" size={12} color="white" />
                         )}
                    </View>
                    <Text style={[
                         styles.optionText,
                         isSelected && styles.selectedOptionText,
                         showCorrectness && isCorrect && styles.correctOptionText,
                    ]}>
                         {answer.answer}
                    </Text>
               </TouchableOpacity>
          );
     };

     return (
          <View style={styles.card}>
               {/* Audio Section */}
               {question.audio?.url && (
                    <View style={styles.audioSection}>
                         <TouchableOpacity
                              style={styles.audioButton}
                              onPress={isPlaying ? stopAudio : playAudio}
                         >
                              <FontAwesome5
                                   name={isPlaying ? "stop" : "play"}
                                   size={16}
                                   color="#0099CC"
                              />
                              <Text style={styles.audioButtonText}>
                                   {isPlaying ? "Dừng" : "Phát"} Audio
                              </Text>
                         </TouchableOpacity>

                         {/* Subtitle Toggle */}
                         {question.subtitle && (
                              <TouchableOpacity
                                   style={styles.subtitleToggle}
                                   onPress={() => setShowSubtitle(!showSubtitle)}
                              >
                                   <FontAwesome5
                                        name={showSubtitle ? "eye-slash" : "eye"}
                                        size={14}
                                        color="#666"
                                   />
                                   <Text style={styles.subtitleToggleText}>
                                        {showSubtitle ? "Ẩn" : "Hiện"} phụ đề
                                   </Text>
                              </TouchableOpacity>
                         )}
                    </View>
               )}

               {/* Subtitle Display */}
               {question.subtitle && showSubtitle && (
                    <View style={styles.subtitleContainer}>
                         <Text style={styles.subtitleText}>{question.subtitle}</Text>
                    </View>
               )}

               {/* Image Section */}
               {question.imageUrl && (
                    <View style={styles.imageContainer}>
                         <Image source={{ uri: question.imageUrl }} style={styles.questionImage} />
                    </View>
               )}

               {/* Main Question */}
               {question.question && (
                    <View style={styles.questionContainer}>
                         <Text style={styles.questionText}>{question.question}</Text>
                    </View>
               )}

               {/* Single Question Answers */}
               {question.answers && question.answers.length > 0 && (
                    <View style={styles.answersContainer}>
                         {question.answers.map((answer) =>
                              renderAnswer(answer, question._id)
                         )}
                    </View>
               )}

               {/* Multiple Questions */}
               {question.questions && question.questions.length > 0 && (
                    <View style={styles.subQuestionsContainer}>
                         {question.questions.map((subQuestion, index) => (
                              <View key={subQuestion._id} style={styles.subQuestionContainer}>
                                   <Text style={styles.subQuestionText}>
                                        {index + 1}. {subQuestion.question}
                                   </Text>
                                   <View style={styles.subAnswersContainer}>
                                        {subQuestion.answers.map((answer) =>
                                             renderAnswer(answer, subQuestion._id, true)
                                        )}
                                   </View>
                              </View>
                         ))}
                    </View>
               )}

               {/* Explanation Section */}
               {question.explanation && showExplanation && (
                    <View style={styles.explanationContainer}>
                         <View style={styles.explanationHeader}>
                              <FontAwesome5 name="lightbulb" size={16} color="#FF9800" />
                              <Text style={styles.explanationTitle}>Giải thích:</Text>
                         </View>
                         <Text style={styles.explanationText}>{question.explanation}</Text>
                    </View>
               )}
          </View>
     );
};

const styles = StyleSheet.create({
     card: {
          marginVertical: 10,
          padding: 16,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     audioSection: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#E0E0E0',
     },
     audioButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#E3F2FD',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          marginRight: 12,
     },
     audioButtonText: {
          marginLeft: 8,
          color: '#0099CC',
          fontWeight: '600',
     },
     subtitleToggle: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 4,
     },
     subtitleToggleText: {
          marginLeft: 6,
          color: '#666',
          fontSize: 12,
     },
     subtitleContainer: {
          backgroundColor: '#F5F5F5',
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
          borderLeftWidth: 4,
          borderLeftColor: '#0099CC',
     },
     subtitleText: {
          color: '#333',
          fontStyle: 'italic',
          lineHeight: 20,
     },
     imageContainer: {
          marginBottom: 12,
          alignItems: 'center',
     },
     questionImage: {
          width: '100%',
          height: 200,
          borderRadius: 8,
          resizeMode: 'cover',
     },
     questionContainer: {
          marginBottom: 16,
     },
     questionText: {
          fontSize: 18,
          fontWeight: '600',
          color: '#333',
          lineHeight: 24,
     },
     answersContainer: {
          marginBottom: 12,
     },
     option: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          marginBottom: 8,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E0E0E0',
          backgroundColor: '#FAFAFA',
     },
     selectedOption: {
          backgroundColor: '#E3F2FD',
          borderColor: '#0099CC',
     },
     correctOption: {
          backgroundColor: '#E8F5E8',
          borderColor: '#4CAF50',
     },
     wrongOption: {
          backgroundColor: '#FFEBEE',
          borderColor: '#F44336',
     },
     radioButton: {
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: '#0099CC',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
     },
     selectedRadioButton: {
          backgroundColor: '#0099CC',
     },
     correctRadioButton: {
          backgroundColor: '#4CAF50',
          borderColor: '#4CAF50',
     },
     wrongRadioButton: {
          backgroundColor: '#F44336',
          borderColor: '#F44336',
     },
     radioInner: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: 'white',
     },
     optionText: {
          fontSize: 16,
          color: '#333',
          flex: 1,
     },
     selectedOptionText: {
          color: '#0099CC',
          fontWeight: '600',
     },
     correctOptionText: {
          color: '#4CAF50',
          fontWeight: '600',
     },
     subQuestionsContainer: {
          marginTop: 12,
     },
     subQuestionContainer: {
          marginBottom: 16,
          paddingLeft: 12,
          borderLeftWidth: 3,
          borderLeftColor: '#E0E0E0',
     },
     subQuestionText: {
          fontSize: 16,
          fontWeight: '500',
          color: '#333',
          marginBottom: 8,
     },
     subAnswersContainer: {
          marginLeft: 8,
     },
     explanationContainer: {
          marginTop: 16,
          padding: 12,
          backgroundColor: '#FFF8E1',
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: '#FF9800',
     },
     explanationHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
     },
     explanationTitle: {
          marginLeft: 8,
          fontSize: 16,
          fontWeight: '600',
          color: '#FF9800',
     },
     explanationText: {
          fontSize: 14,
          color: '#333',
          lineHeight: 20,
     },
});

export default EnhancedQuestionCard; 