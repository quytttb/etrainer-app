// Practice Type 1 - Image Description
// TODO: Import from legacy components and enhance with modern state management

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JourneyNewQuestion } from '../../types';

interface PracticeType1Props {
     questions: JourneyNewQuestion[];
     onSubmit: () => void;
     onBack: () => void;
     toggleExplanation?: (data?: any) => void;
     answerContext?: any;
}

const PracticeType1: React.FC<PracticeType1Props> = ({
     questions,
     onSubmit,
     onBack,
     toggleExplanation,
     answerContext,
}) => {
     return (
          <View style={styles.container}>
               <Text style={styles.placeholder}>
                    PracticeType1 - Image Description
               </Text>
               <Text style={styles.info}>
                    {questions.length} questions
               </Text>
               <Text style={styles.todo}>
                    TODO: Import and enhance legacy PracticeType1 component
               </Text>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
     },
     placeholder: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 8,
     },
     info: {
          fontSize: 14,
          color: '#666',
          marginBottom: 16,
     },
     todo: {
          fontSize: 12,
          color: '#999',
          textAlign: 'center',
     },
});

export default PracticeType1; 