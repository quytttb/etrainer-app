import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import SimpleTimer from './SimpleTimer';

interface TestHeaderProps {
     timeRemaining: number;
     isPaused: boolean;
     onPause: () => void;
     onShowNavigation: () => void;
     onExit: () => void;
     currentQuestionIndex: number;
     totalQuestions: number;
}

const TestHeader: React.FC<TestHeaderProps> = ({
     timeRemaining,
     isPaused,
     onPause,
     onShowNavigation,
     onExit,
     currentQuestionIndex,
     totalQuestions
}) => {
     const isLowTime = timeRemaining <= 300; // 5 minutes warning

     return (
          <View style={styles.header}>
               <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.headerButton} onPress={onExit}>
                         <FontAwesome5 name="times" size={20} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton} onPress={onPause}>
                         <FontAwesome5
                              name={isPaused ? "play" : "pause"}
                              size={18}
                              color="#666"
                         />
                    </TouchableOpacity>
               </View>

               <View style={styles.headerCenter}>
                    <SimpleTimer
                         timeRemaining={timeRemaining}
                         isLowTime={isLowTime}
                    />
               </View>

               <View style={styles.headerRight}>
                    <TouchableOpacity
                         style={styles.headerButton}
                         onPress={onShowNavigation}
                    >
                         <Text style={styles.questionCounter}>
                              {currentQuestionIndex + 1}/{totalQuestions}
                         </Text>
                    </TouchableOpacity>
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: {
               width: 0,
               height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 2,
     },
     headerLeft: {
          flexDirection: 'row',
          flex: 1,
     },
     headerCenter: {
          flex: 1,
          alignItems: 'center',
     },
     headerRight: {
          flex: 1,
          alignItems: 'flex-end',
     },
     headerButton: {
          padding: 8,
          marginHorizontal: 4,
     },
     questionCounter: {
          fontSize: 16,
          fontWeight: '600',
          color: '#333',
     },
});

export default TestHeader; 