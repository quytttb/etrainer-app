import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Question, QuestionProps } from '../../types/question';
import ImageDescription from './types/ImageDescription';
import AskAndAnswer from './types/AskAndAnswer';
import ConversationPiece from './types/ConversationPiece';
import ShortTalk from './types/ShortTalk';
import FillInTheBlank from './types/FillInTheBlank';
import FillInTheParagraph from './types/FillInTheParagraph';
import ReadAndUnderstand from './types/ReadAndUnderstand';
import StageFinalTest from './types/StageFinalTest';

const QuestionRenderer: React.FC<QuestionProps> = ({
     question,
     onAnswer,
     userAnswer,
     isReview = false
}) => {
     const renderQuestionByType = () => {
          switch (question.type) {
               case 'IMAGE_DESCRIPTION':
                    return (
                         <ImageDescription
                              question={question}
                              onAnswer={onAnswer}
                              userAnswer={userAnswer as string}
                              isReview={isReview}
                         />
                    );

               case 'ASK_AND_ANSWER':
                    return (
                         <AskAndAnswer
                              question={question}
                              onAnswer={onAnswer}
                              userAnswer={userAnswer as string}
                              isReview={isReview}
                         />
                    );

               case 'CONVERSATION_PIECE':
                    return (
                         <ConversationPiece
                              question={question}
                              onAnswer={onAnswer}
                              userAnswer={userAnswer as Record<string, string>}
                              isReview={isReview}
                         />
                    );

               case 'SHORT_TALK':
                    return (
                         <ShortTalk
                              question={question}
                              onAnswer={onAnswer}
                              userAnswer={userAnswer as Record<string, string>}
                              isReview={isReview}
                         />
                    );

               case 'FILL_IN_THE_BLANK_QUESTION':
                    return (
                         <FillInTheBlank
                              question={question}
                              onAnswer={onAnswer}
                              userAnswer={userAnswer as string}
                              isReview={isReview}
                         />
                    );

               case 'FILL_IN_THE_PARAGRAPH':
                    return (
                         <FillInTheParagraph
                              question={question}
                              onAnswer={onAnswer}
                              userAnswer={userAnswer as Record<string, string>}
                              isReview={isReview}
                         />
                    );

               case 'READ_AND_UNDERSTAND':
                    return (
                         <ReadAndUnderstand
                              question={question}
                              onAnswer={onAnswer}
                              userAnswer={userAnswer as Record<string, string>}
                              isReview={isReview}
                         />
                    );

               case 'STAGE_FINAL_TEST':
                    return (
                         <StageFinalTest
                              question={question}
                              onAnswer={onAnswer}
                              userAnswer={userAnswer as string[]}
                              isReview={isReview}
                         />
                    );

               default:
                    console.warn(`⚠️ Unknown question type: ${question.type}`);
                    return null;
          }
     };

     return (
          <View style={styles.container}>
               {renderQuestionByType()}
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          padding: 16,
     },
});

export default QuestionRenderer; 