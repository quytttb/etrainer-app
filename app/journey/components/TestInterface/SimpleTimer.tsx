import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '../../utils/timeUtils';

interface SimpleTimerProps {
     timeRemaining: number;
     isLowTime?: boolean;
}

const SimpleTimer: React.FC<SimpleTimerProps> = ({
     timeRemaining,
     isLowTime = false
}) => {
     return (
          <View style={styles.container}>
               <Text style={[
                    styles.timerText,
                    isLowTime && styles.lowTimeText
               ]}>
                    {formatTime(timeRemaining)}
               </Text>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: '#f5f5f5',
          borderRadius: 16,
     },
     timerText: {
          fontSize: 16,
          fontWeight: '600',
          color: '#333',
     },
     lowTimeText: {
          color: '#f44336',
     },
});

export default SimpleTimer; 